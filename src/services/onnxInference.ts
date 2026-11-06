import * as ort from 'onnxruntime-web';
import { DecisionStageId, ExperienceLevel, ModelPrediction } from '../types';
import { getExperienceCode } from './dataCollector';

// WebAssembly worker ve thread yollarını statik assetlere göre yapılandır
ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = true;

let inferenceSession: ort.InferenceSession | null = null;
let sessionLoadingPromise: Promise<ort.InferenceSession | null> | null = null;
let lastLoadError: string | null = null;

const MODEL_PATH = '/model/model.onnx';
const DECISION_THRESHOLD = 0.50;

/**
 * Loads the ONNX model into memory (singleton session)
 */
export async function getInferenceSession(): Promise<ort.InferenceSession | null> {
  if (inferenceSession) return inferenceSession;
  if (sessionLoadingPromise) return sessionLoadingPromise;

  sessionLoadingPromise = (async () => {
    try {
      // Önce yerel Vite public yolunu dene
      const session = await ort.InferenceSession.create(MODEL_PATH, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
      inferenceSession = session;
      lastLoadError = null;
      console.log('[ONNX Web] Model başarıyla yüklendi:', MODEL_PATH);
      return session;
    } catch (err: any) {
      console.warn('[ONNX Web] Model yükleme hatası, fallback devreye girecek:', err?.message || err);
      lastLoadError = err?.message || 'Model yüklenemedi';
      inferenceSession = null;
      return null;
    } finally {
      sessionLoadingPromise = null;
    }
  })();

  return sessionLoadingPromise;
}

export function getModelLoadError(): string | null {
  return lastLoadError;
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

// Global window helper for Cypress Parity Tests
if (typeof window !== 'undefined') {
  (window as any).__predictML = predictWithRawFeatures;
  (window as any).__getInferenceSession = getInferenceSession;
}
