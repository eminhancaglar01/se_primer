describe('SE Primer v2.0 — 40 Saniyelik Canlı Tanıtım Videosu Kaydı (Showcase Walkthrough)', () => {
  it('The Primer v2.0 akışını, ONNX ML adaptasyonunu ve telemetriyi 40 saniyede kaydeder', () => {
    // 00:00 - 00:06: Mobil Görünüm (iPhone 14/15 390x844) ve Onboarding
    cy.viewport(390, 844);
    cy.visit('/');
    cy.contains('08:00 — Randevu Sistemi Çöktü').should('be.visible');
    cy.wait(2000);

    // Seviye (Başlangıç), Rol (DevOps) ve Hedef Seçimi
    cy.get('[data-testid="experience-beginner"]').click();
    cy.wait(1000);
    cy.get('[data-testid="role-devops"]').click();
    cy.wait(1000);
    cy.get('[data-testid="goal-architecture"]').click();
    cy.wait(1000);
    cy.get('[data-testid="start-simulation-btn"]').click();

    // 00:06 - 00:20: Aşama 1 - Mimari Kriz, Sokratik AI Eğitmen Danışması
    cy.contains('Aşama 1: Mimari Karar').should('be.visible');
    cy.get('[data-cy="model-telemetry-card"]').should('be.visible');
    cy.wait(2000);

    // Oyuncu Sokratik AI Eğitmene danışır (Dr. Gemini)
    cy.get('[data-testid="open-tutor-btn"]').click();
    cy.contains('Sokratik AI Eğitmen').should('be.visible');
    cy.wait(1500);
    cy.get('[data-testid="tutor-input"]').type('Rollback mi hotfix mi? Hangisi daha güvenli?');
    cy.wait(1000);
    cy.get('[data-testid="tutor-send-btn"]').click();
    cy.get('[data-testid="tutor-response-message"]').last().should('be.visible');
    cy.wait(3500);
    cy.get('[data-testid="close-tutor-btn"]').click();
    cy.wait(1200);

    // 00:20 - 00:26: ONNX ML Adaptasyonu — Model Desteği Sezer ve Proaktif Banner Açar
    // (ipucu_sayisi >= 1 olduğu için ONNX modeli P = 1.0000 üretir)
    cy.get('[data-cy="proactive-tutor-banner"]').should('be.visible');
    cy.get('[data-cy="p"]').should('contain', '1.0000');
    cy.wait(3500);

    // Aşama 1 Kararı: Rollback (A)
    cy.get('[data-testid="decision-option-a"]').scrollIntoView().click({ force: true });
    cy.contains('Rollback (v2.3.9) Uygulandı').should('be.visible');
    cy.wait(2500);
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    // 00:26 - 00:31: Aşama 2 - Test ve Doğrulama Kararı (Duman Testi)
    cy.contains('Aşama 2: Test ve Doğrulama Kararı').should('be.visible');
    cy.wait(2000);
    cy.get('[data-testid="decision-option-a"]').scrollIntoView().click({ force: true });
    cy.contains('Kritik Yol ve Duman Testleri Başarıyla Tamamlandı').should('be.visible');
    cy.wait(2000);
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    // 00:31 - 00:35: Aşama 3 - KVKK ve Veri Gizliliği Kararı (Maskeleme)
    cy.contains('Aşama 3: KVKK ve Veri Gizliliği Kararı').should('be.visible');
    cy.wait(2000);
    cy.get('[data-testid="decision-option-a"]').scrollIntoView().click({ force: true });
    cy.contains('Hasta Verileri Maskelenerek Güvenle Paylaşıldı').should('be.visible');
    cy.wait(2000);
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    // 00:35 - 00:40: Bitiş Ekranı, ML Telemetri Özeti ve CSV İndirme
    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Örnek Mühendislik Başarısı');
    cy.contains('MÜKEMMEL KRİZ YÖNETİMİ').should('be.visible');
    cy.wait(2500);

    // CSV Dışa Aktar Butonu
    cy.get('[data-cy="export-csv-btn"]').scrollIntoView().should('be.visible');
    cy.wait(1500);
    cy.get('[data-cy="export-csv-btn"]').click();
    cy.wait(3000);
  });
});
