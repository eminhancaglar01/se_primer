"""
The Primer v2 — Sentetik Oyun Oturumu Veri Üreteci
YZM301 Ödev 7 Kapsamında Geliştirme ve Test Doğrulaması İçin Hazırlanmıştır.

ÖNEMLİ KURAL:
Bu betik tarafından üretilen tüm kayıtlar 'kaynak' = 'sentetik' olarak işaretlenir.
Gerçek kullanıcı verileriyle ASLA karıştırılmaz.

Üretim Kuralları ve Prensipleri:
1. Sabit Random Seed (SEED = 42) ile tekrarlanabilir veri üretimi.
2. 3 Aşamalı Kriz Simülasyonu Mimarisi:
   - Aşama 1: Mimari (Rollback vs Hotfix)
   - Aşama 2: Test (Duman Testi vs Anında Dağıtım)
   - Aşama 3: KVKK (Maskeleme vs Ham Log)
3. Profil Dağılımları:
   - beginner: Daha yüksek karar süresi, yüksek ipucu kullanımı, daha yüksek tereddüt.
   - intermediate: Dengeli süre, orta ipucu, trade-off odaklı kararlar.
   - experienced: Hızlı karar (60s sayaç baskısı), düşük ipucu, süre aşımında riskli seçimler.
4. Ground Truth 'destek_gerekli' Atama Mantığı:
   - Hatalı/riskli seçim yapıldıysa (B şıkkı) VEYA
   - Karar öncesi ipucu/AI tutor desteği alındıysa VEYA
   - Süre ortalamanın 1.5 katını aşıp karar değiştirme sayısı >= 2 olduysa:
     destek_gerekli = 1
   - Aksi takdirde (hızlı/makul sürede, stabil seçim ve sıfır ipucu):
     destek_gerekli = 0
"""

import csv
import random
from datetime import datetime, timezone

SEED = 42
random.seed(SEED)

PROFILES = [
    {"seviye": "beginner", "seviye_kod": 0, "weight": 0.40},
    {"seviye": "intermediate", "seviye_kod": 1, "weight": 0.35},
    {"seviye": "experienced", "seviye_kod": 2, "weight": 0.25},
]

ROLES = ["backend", "frontend", "fullstack", "devops", "software", "student"]
GOALS = ["architecture", "testing", "privacy", "general"]


def generate_session(session_index: int):
    # Oturum ID
    session_id = f"synth_{session_index:04d}"
    
    # Profil seçimi
    prof_roll = random.random()
    cumulative = 0.0
    selected_prof = PROFILES[0]
    for p in PROFILES:
        cumulative += p["weight"]
        if prof_roll <= cumulative:
            selected_prof = p
            break
            
    level = selected_prof["seviye"]
    level_code = selected_prof["seviye_kod"]
    role = random.choice(ROLES)
    goal = random.choice(GOALS)
    
    records = []
    previous_wrong_count = 0
    total_tutor_asked = 0
    
    for stage_no in [1, 2, 3]:
        # Karar süresi ve davranış simülasyonu
        if level == "beginner":
            base_duration = random.gauss(38.0, 10.0)
            switch_count = random.choices([0, 1, 2, 3, 4], weights=[0.20, 0.30, 0.25, 0.15, 0.10])[0]
            stage_hints = random.choices([0, 1, 2], weights=[0.35, 0.45, 0.20])[0]
            # Yanlış yapma olasılığı
            wrong_prob = 0.45 if previous_wrong_count == 0 else 0.55
        elif level == "intermediate":
            base_duration = random.gauss(24.0, 7.0)
            switch_count = random.choices([0, 1, 2, 3], weights=[0.40, 0.35, 0.15, 0.10])[0]
            stage_hints = random.choices([0, 1, 2], weights=[0.60, 0.30, 0.10])[0]
            wrong_prob = 0.28 if previous_wrong_count == 0 else 0.35
        else: # experienced
            base_duration = random.gauss(14.0, 5.0)
            switch_count = random.choices([0, 1, 2], weights=[0.65, 0.25, 0.10])[0]
            stage_hints = random.choices([0, 1], weights=[0.85, 0.15])[0]
            wrong_prob = 0.18 if base_duration < 25.0 else 0.40  # süre baskısında hata artar
            
        duration_sec = round(max(3.5, min(120.0, base_duration)), 1)
        total_tutor_asked += stage_hints
        
        # Seçim simülasyonu: Doğru=A, Riskli=B
        is_wrong = random.random() < wrong_prob
        choice = "B" if is_wrong else "A"
        
        # Ground Truth hesaplama
        hesitation_threshold = 25.0 if level == "experienced" else (35.0 if level == "intermediate" else 45.0)
        has_hesitation = (duration_sec > hesitation_threshold) and (switch_count >= 2)
        
        if choice == "B" or stage_hints > 0 or has_hesitation:
            destek_gerekli = 1
        else:
            destek_gerekli = 0
            
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        
        record = {
            "oturum_id": session_id,
            "sahne_no": stage_no,
            "seviye": level,
            "seviye_kod": level_code,
            "rol": role,
            "hedef": goal,
            "karar_suresi_sn": duration_sec,
            "karar_degistirme_sayisi": switch_count,
            "onceki_yanlis_sayisi": previous_wrong_count,
            "ipucu_sayisi": stage_hints,
            "secilen_secenek": choice,
            "destek_gerekli": destek_gerekli,
            "kaynak": "sentetik",
            "zaman_damgasi": timestamp,
        }
        records.append(record)
        
        if is_wrong:
            previous_wrong_count += 1
            
    return records


def generate_synthetic_dataset(num_sessions: int = 60, output_path: str = "data/sentetik_oturumlar.csv"):
    all_records = []
    for i in range(1, num_sessions + 1):
        session_records = generate_session(i)
        all_records.extend(session_records)
        
    fields = [
        "oturum_id", "sahne_no", "seviye", "seviye_kod", "rol", "hedef",
        "karar_suresi_sn", "karar_degistirme_sayisi", "onceki_yanlis_sayisi",
        "ipucu_sayisi", "secilen_secenek", "destek_gerekli", "kaynak", "zaman_damgasi"
    ]
    
    with open(output_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(all_records)
        
    print(f"Başarıyla {num_sessions} sentetik oturum ({len(all_records)} karar satırı) '{output_path}' dosyasına kaydedildi.")
    
    # Sınıf dağılımını özetle
    ones = sum(r["destek_gerekli"] for r in all_records)
    zeros = len(all_records) - ones
    print(f"Sınıf Dağılımı -> destek_gerekli=1: {ones} (%{ones/len(all_records)*100:.1f}), destek_gerekli=0: {zeros} (%{zeros/len(all_records)*100:.1f})")


if __name__ == "__main__":
    generate_synthetic_dataset(num_sessions=60)

