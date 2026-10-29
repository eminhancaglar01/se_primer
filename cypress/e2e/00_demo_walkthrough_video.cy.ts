describe('SE Primer — 60 Saniyelik Canlı Tanıtım Videosu Kaydı (Showcase Walkthrough)', () => {
  it('Uygulamanın tüm akışını storyboard senaryosuna göre 60 saniyede videoya kaydeder', () => {
    // 00:00 - 00:05: Giriş ve Onboarding Karşılama
    cy.viewport(390, 844);
    cy.visit('/');
    cy.contains('08:00 — Randevu Sistemi Çöktü').should('be.visible');
    cy.wait(3000);

    // 00:05 - 00:12: Onboarding Seçimleri
    cy.get('[data-testid="experience-experienced"]').click();
    cy.wait(1000);
    cy.get('[data-testid="role-devops"]').click();
    cy.wait(1000);
    cy.get('[data-testid="goal-architecture"]').click();
    cy.wait(1500);
    cy.get('[data-testid="start-simulation-btn"]').click();

    // 00:12 - 00:22: Aşama 1 - Mimari Karar & 60s Sayaç
    cy.contains('Aşama 1: Mimari Karar').should('be.visible');
    cy.get('[data-testid="countdown-timer"]').should('be.visible');
    cy.wait(3000);
    cy.get('[data-testid="decision-option-a"]').scrollIntoView().click({ force: true });

    // 00:22 - 00:30: Aşama 1 Teknik Sonuç Modalı
    cy.contains('Rollback (v2.3.9) Uygulandı').should('be.visible');
    cy.wait(3000);
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    // 00:30 - 00:42: Aşama 2 - Sokratik AI Eğitmen Etkileşimi
    cy.contains('Aşama 2: Test ve Doğrulama Kararı').should('be.visible');
    cy.wait(1500);
    cy.get('[data-testid="open-tutor-btn"]').click();
    cy.contains('Sokratik AI Eğitmen').should('be.visible');
    cy.wait(1500);
    cy.get('[data-testid="tutor-input"]').type('Rollback mi hotfix mi? Hangisini seçmeliyim, doğru cevap ne?');
    cy.wait(1000);
    cy.get('[data-testid="tutor-send-btn"]').click();
    cy.get('[data-testid="tutor-response-message"]').last().should('be.visible');
    cy.wait(4000);
    cy.get('[data-testid="close-tutor-btn"]').click();
    cy.wait(1500);

    // Aşama 2 Test Kararı: Duman Testi Seçimi
    cy.get('[data-testid="decision-option-a"]').scrollIntoView().click({ force: true });
    cy.contains('Kritik Yol ve Duman Testleri Başarıyla Tamamlandı').should('be.visible');
    cy.wait(3000);
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    // 00:42 - 00:50: Aşama 3 - KVKK & Gizlilik Kararı
    cy.contains('Aşama 3: KVKK ve Veri Gizliliği Kararı').should('be.visible');
    cy.wait(2500);
    cy.get('[data-testid="decision-option-a"]').scrollIntoView().click({ force: true });
    cy.contains('Hasta Verileri Maskelenerek Güvenle Paylaşıldı').should('be.visible');
    cy.wait(3000);
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    // 00:50 - 01:00: Bitiş Ekranı - Başarılı Kriz Çözümü (İyi Son)
    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Örnek Mühendislik Başarısı');
    cy.contains('MÜKEMMEL KRİZ YÖNETİMİ').should('be.visible');
    cy.contains('300 / 300').should('be.visible');
    cy.contains('08:25').should('be.visible');
    cy.wait(3000);
    // Sayfayı aşağı kaydırarak post-mortem ve dersleri göster
    cy.scrollTo('bottom', { duration: 3000 });
    cy.wait(4000);
  });
});
