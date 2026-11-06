import * as ort from 'onnxruntime-web';
import { DecisionStageId, ExperienceLevel, ModelPrediction } from '../types';
import { getExperienceCode } from './dataCollector';

// WebAssembly worker ve thread yollarını statik assetlere göre yapılandır
ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = true;

// Hugging Face Hub Commit-Pinned Model Sabitleri
export const HF_REPO_ID = 'fajeee1/se-primer-v2';
export const HF_COMMIT_HASH = 'de8912768971e5d12671b8ee5611433653e45ab8';
export const HF_PINNED_MODEL_URL = `https://huggingface.co/${HF_REPO_ID}/resolve/${HF_COMMIT_HASH}/model.onnx`;
export const HF_PINNED_CONFIG_URL = `https://huggingface.co/${HF_REPO_ID}/resolve/${HF_COMMIT_HASH}/config.json`;

const LOCAL_MODEL_PATH = '/model/model.onnx';
const LOCAL_CONFIG_PATH = '/model/config.json';
const DECISION_THRESHOLD = 0.50;

let inferenceSession: ort.InferenceSession | null = null;
let sessionLoadingPromise: Promise<ort.InferenceSession | null> | null = null;
let lastLoadError: string | null = null;
let activeModelSource: 'huggingface_pinned' | 'local_bundle' | 'fallback_rule' = 'fallback_rule';

export interface ModelConfig {
  model_version: string;
  algorithm: string;
  decision_threshold: number;
  feature_names: string[];
}

let loadedConfig: ModelConfig | null = null;

/**
  * Fetches the model config contract from Hugging Face pinned commit or local fallback
  */
export async function getModelConfig(): Promise<ModelConfig> {
  if (loadedConfig) return loadedConfig;
  try {
    const res = await fetch(HF_PINNED_CONFIG_URL, { cache: 'force-cache' });
    if (res.ok) {
      loadedConfig = await res.json();
      return loadedConfig!;
    }
  } catch (e) {
    console.warn('[ONNX Web] HF config çekilemedi, yerel deneniyor:', e);
  }

  try {
    const res = await fetch(LOCAL_CONFIG_PATH);
    if (res.ok) {
      loadedConfig = await res.json();
      return loadedConfig!;
    }
  } catch (e) {
    // Statik kural yedeği
  }

  return {
    model_version: 'v2.0',
    algorithm: 'DecisionTree',
    decision_threshold: DECISION_THRESHOLD,
    feature_names: [
      'seviye_kod',
      'sahne_no',
      'karar_suresi_sn',
      'karar_degistirme_sayisi',
      'onceki_yanlis_sayisi',
      'ipucu_sayisi'
    ],
  };
}

/**
 * Loads the ONNX model into memory (singleton session)
 * Tries commit-pinned Hugging Face URL first, falls back to local bundle if offline.
 */
export async function getInferenceSession(): Promise<ort.InferenceSession | null> {
  if (inferenceSession) return inferenceSession;
  if (sessionLoadingPromise) return sessionLoadingPromise;

  sessionLoadingPromise = (async () => {
    // 1. Öncelik: Hugging Face Hub Sabit Commit URL'si
    try {
      console.log('[ONNX Web] Hugging Face modelinden yükleniyor:', HF_PINNED_MODEL_URL);
      const hfResp = await fetch(HF_PINNED_MODEL_URL, { cache: 'force-cache' });
      if (!hfResp.ok) {
        throw new Error(`HF HTTP ${hfResp.status}: ${hfResp.statusText}`);
      }
      const modelBuffer = await hfResp.arrayBuffer();
      
      const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
      inferenceSession = session;
      lastLoadError = null;
      activeModelSource = 'huggingface_pinned';
      console.log('[ONNX Web] Model Hugging Face (commit: ' + HF_COMMIT_HASH.slice(0, 7) + ') üzerinden yüklendi.');
      return session;
    } catch (hfErr: any) {
      console.warn('[ONNX Web] Hugging Face yükleme uyarısı, yerel bundle deneniyor:', hfErr?.message || hfErr);

      // 2. Öncelik: Yerel Vite Statik Paketi (Çevrimdışı Dayanıklılık)
      try {
        const session = await ort.InferenceSession.create(LOCAL_MODEL_PATH, {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all',
        });
        inferenceSession = session;
        lastLoadError = null;
        activeModelSource = 'local_bundle';
        console.log('[ONNX Web] Model yerel statik dosya üzerinden yüklendi:', LOCAL_MODEL_PATH);
        return session;
      } catch (localErr: any) {
        console.error('[ONNX Web] Yerel model de yüklenemedi:', localErr);
        lastLoadError = localErr?.message || 'Model yüklenemedi';
        inferenceSession = null;
        activeModelSource = 'fallback_rule';
        return null;
      }
    } finally {
      sessionLoadingPromise = null;
    }
  })();

  return sessionLoadingPromise;
}

export function getModelLoadError(): string | null {
  return lastLoadError;
}

export function getActiveModelSource(): string {
  return activeModelSource;
}

/**
 * Executes ML inference on raw 6-feature array:
 * [seviye_kod, sahne_no, karar_suresi_sn, karar_degistirme_sayisi, onceki_yanlis_sayisi, ipucu_sayisi]
 */
export async function predictWithRawFeatures(features: number[]): Promise<ModelPrediction> {
  const t0 = performance.now();
  const session = await getInferenceSession();

  if (!session) {
    // Kural tabanlı yedekleme (Fallback)
    const fallbackPred = calculateFallbackPrediction(features);
    return {
      ...fallbackPred,
      isFallback: true,
      latencyMs: Math.round(performance.now() - t0),
      explanation: `ONNX modeli aktif değil (${lastLoadError || 'Ağ hatası'}). Kural tabanlı pedagojik yedek devrede.`,
    };
  }

  try {
    const inputTensor = new ort.Tensor('float32', new Float32Array(features), [1, 6]);
    const inputName = session.inputNames[0] || 'float_input';
    const feeds: Record<string, ort.Tensor> = {};
    feeds[inputName] = inputTensor;

    const results = await session.run(feeds);
    
    // ZipMap=False: output_probability [1, 2] şeklinde saf Float32Array tensörüdür
    let probClass1 = 0.5;
    
    if (results['output_probability']) {
      const probTensor = results['output_probability'];
      if (probTensor.data && probTensor.data.length >= 2) {
        probClass1 = Number(probTensor.data[1]);
      } else if (probTensor.data && probTensor.data.length === 1) {
        probClass1 = Number(probTensor.data[0]);
      }
    } else if (session.outputNames.length > 1) {
      const secondOutName = session.outputNames[1];
      const probTensor = results[secondOutName];
      if (probTensor && probTensor.data && probTensor.data.length >= 2) {
        probClass1 = Number(probTensor.data[1]);
      }
    } else {
      const firstOut = results[session.outputNames[0]];
      if (firstOut && firstOut.data) {
        probClass1 = Number(firstOut.data[0]);
      }
    }

    // Güvenlik sınırları
    probClass1 = Math.max(0.0, Math.min(1.0, probClass1));
    const needsSupport = probClass1 >= DECISION_THRESHOLD;
    const latency = Math.round(performance.now() - t0);

    return {
      probability: Math.round(probClass1 * 1000000) / 1000000,
      threshold: DECISION_THRESHOLD,
      needsSupport,
      isFallback: false,
      latencyMs: latency,
      explanation: needsSupport
        ? `Model Destek Tahmini: P(Destek)=%${(probClass1 * 100).toFixed(1)} >= %50. Oyuncunun karar süresi ve tereddüt telemetrisi proaktif rehberlik gerektiriyor.`
        : `Model Destek Tahmini: P(Destek)=%${(probClass1 * 100).toFixed(1)} < %50. Oyuncu stabil ve otonom ilerliyor.`,
    };
  } catch (inferErr: any) {
    console.error('[ONNX Web] Çıkarım hatası:', inferErr);
    const fallback = calculateFallbackPrediction(features);
    return {
      ...fallback,
      isFallback: true,
      latencyMs: Math.round(performance.now() - t0),
      explanation: `Çıkarım hatası: ${inferErr?.message}. Yedek davranış uygulandı.`,
    };
  }
}

/**
 * High-level inference for game scenes
 */
export async function evaluateSceneSupportNeed(
  level: ExperienceLevel,
  stageId: DecisionStageId,
  durationSec: number,
  switchCount: number,
  previousWrongCount: number,
  tutorQuestionsInStage: number
): Promise<ModelPrediction> {
  const levelCode = getExperienceCode(level);
  const features = [
    levelCode,
    stageId,
    Math.round(durationSec * 10) / 10,
    switchCount,
    previousWrongCount,
    tutorQuestionsInStage,
  ];

  return predictWithRawFeatures(features);
}

/**
 * Deterministic rule-based fallback when model is unavailable
 */
function calculateFallbackPrediction(features: number[]): { probability: number; threshold: number; needsSupport: boolean } {
  const [levelCode, stageNo, durationSec, switchCount, prevWrong, hints] = features;
  
  let score = 0;
  if (levelCode === 0) score += 30; // beginner
  if (durationSec > 35) score += 30;
  if (switchCount >= 2) score += 25;
  if (prevWrong > 0) score += 30;
  if (hints > 0) score += 30;

  const probability = Math.min(1.0, score / 100);
  return {
    probability: Math.round(probability * 100) / 100,
    threshold: DECISION_THRESHOLD,
    needsSupport: probability >= DECISION_THRESHOLD,
  };
}

// Global window helpers for Cypress Parity Tests and Debugging
if (typeof window !== 'undefined') {
  (window as any).__predictML = predictWithRawFeatures;
  (window as any).__getInferenceSession = getInferenceSession;
  (window as any).__HF_PINNED_MODEL_URL = HF_PINNED_MODEL_URL;
  (window as any).__HF_COMMIT_HASH = HF_COMMIT_HASH;
  (window as any).__getActiveModelSource = getActiveModelSource;
}
