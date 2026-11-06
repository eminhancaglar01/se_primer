"""
The Primer v2 — Model Çıkarım Paritesi Referans Tüketicisi (tests/parite.py)
YZM301 Ödev 7 Kapsamında Geliştirilmiştir.

Görevi:
1. En az 5 farklı davranışsal test vektörünü model/model.onnx ile Python ONNX Runtime üzerinde çalıştırır.
2. Elde edilen referans olasılıkları tests/parite.json dosyasına kaydeder.
3. Cypress testleri (cypress/e2e/05_model_parity.cy.ts) bu referans çıktılar ile tarayıcı onnxruntime-web çıktılarını kıyaslar.
4. Mutlak tolerans: |p_python - p_browser| < 1e-4.
"""

import json
import os
import sys
import numpy as np
import onnxruntime as ort

MODEL_PATH = "model/model.onnx"
OUTPUT_JSON = "tests/parite.json"

# En az 5 anlamlı test girdisi:
# Sıra: [seviye_kod, sahne_no, karar_suresi_sn, karar_degistirme_sayisi, onceki_yanlis_sayisi, ipucu_sayisi]
TEST_CASES = [
    {
        "id": "CASE_1_BEGINNER_HIGH_SUPPORT",
        "description": "Beginner seviye, Aşama 2, uzun süre (52s), 3 karar değişikliği, 1 önceki hata, 2 ipucu -> Yüksek destek beklenir",
        "input_features": [0.0, 2.0, 52.0, 3.0, 1.0, 2.0],
    },
    {
        "id": "CASE_2_EXPERIENCED_AUTONOMOUS",
        "description": "Experienced seviye, Aşama 1, çok hızlı (8.5s), 0 değişiklik, 0 hata, 0 ipucu -> Düşük destek / otonom beklenir",
        "input_features": [2.0, 1.0, 8.5, 0.0, 0.0, 0.0],
    },
    {
        "id": "CASE_3_INTERMEDIATE_BORDERLINE",
        "description": "Intermediate seviye, Aşama 2, 28s süre, 1 değişiklik, 0 hata, 1 ipucu -> Sınırda / orta durum",
        "input_features": [1.0, 2.0, 28.0, 1.0, 0.0, 1.0],
    },
    {
        "id": "CASE_4_STAGE_3_ACCUMULATED_ERRORS",
        "description": "Intermediate seviye, Aşama 3 (KVKK), 42s süre, 2 değişiklik, 2 önceki hata, 1 ipucu -> Yüksek destek beklenir",
        "input_features": [1.0, 3.0, 42.0, 2.0, 2.0, 1.0],
    },
    {
        "id": "CASE_5_EXPERIENCED_UNDER_PRESSURE",
        "description": "Experienced seviye, Aşama 2, 58s (sayacın bitmesine yakın), 2 değişiklik, 1 hata, 0 ipucu -> Süre baskısında destek",
        "input_features": [2.0, 2.0, 58.0, 2.0, 1.0, 0.0],
    },
]


def run_parity_reference():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"ONNX modeli bulunamadı: {MODEL_PATH}")
        
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    
    sess = ort.InferenceSession(MODEL_PATH)
    input_name = sess.get_inputs()[0].name
    
    results = []
    
    print(f"Model Yüklendi: {MODEL_PATH}")
    print(f"Girdi Adı: {input_name}")
    print("-" * 70)
    
    for case in TEST_CASES:
        feat_array = np.array([case["input_features"]], dtype=np.float32)
        outputs = sess.run(None, {input_name: feat_array})
        
        # ZipMap=False olduğu için outputs[1] doğrudan [1, 2] tensörüdür
        if len(outputs) > 1 and hasattr(outputs[1], "shape"):
            prob_class_1 = float(outputs[1][0, 1])
        elif len(outputs) > 1 and isinstance(outputs[1], list):
            prob_dict = outputs[1][0]
            prob_class_1 = float(prob_dict.get(1, prob_dict.get("1", 0.0)))
        else:
            prob_class_1 = float(outputs[0][0])
            
        pred_label = 1 if prob_class_1 >= 0.50 else 0
        
        case_result = {
            "id": case["id"],
            "description": case["description"],
            "features": case["input_features"],
            "python_probability": round(prob_class_1, 6),
            "predicted_label": pred_label,
            "decision_threshold": 0.50,
        }
        results.append(case_result)
        
        print(f"[{case['id']}]")
        print(f"  Girdi: {case['input_features']}")
        print(f"  P(destek_gerekli=1): {prob_class_1:.6f} -> Tahmin: {pred_label}")
        
    output_payload = {
        "model_file": MODEL_PATH,
        "tolerance": 1e-4,
        "feature_names": [
            "seviye_kod", "sahne_no", "karar_suresi_sn",
            "karar_degistirme_sayisi", "onceki_yanlis_sayisi", "ipucu_sayisi"
        ],
        "test_cases": results
    }
    
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2, ensure_ascii=False)
        
    print("-" * 70)
    print(f"Başarıyla {len(results)} referans test vakası '{OUTPUT_JSON}' dosyasına kaydedildi.")


if __name__ == "__main__":
    run_parity_reference()
