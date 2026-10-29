describe('SE Primer — 8 Karar Yolunun Tamamı ve Sonuç Doğrulamaları', () => {
  const startSimulation = () => {
    cy.visit('/');
    cy.get('[data-testid="experience-intermediate"]').click();
    cy.get('[data-testid="role-software"]').click();
    cy.get('[data-testid="goal-general"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();
    cy.contains('Aşama 1: Mimari Karar').should('be.visible');
  };

  const makeChoice = (choice: 'A' | 'B') => {
    const testId = choice === 'A' ? '[data-testid="decision-option-a"]' : '[data-testid="decision-option-b"]';
    cy.get(testId).click({ force: true });
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });
  };

  // YOL 1: A - A - A (İYİ SON)
  it('Yol 1 (A-A-A): Rollback + Duman Testi + Maskeleme -> İYİ SON', () => {
    startSimulation();
    makeChoice('A'); // Aşama 1: Rollback
    cy.contains('Aşama 2: Test ve Doğrulama Kararı').should('be.visible');
    makeChoice('A'); // Aşama 2: Duman Testi
    cy.contains('Aşama 3: KVKK ve Veri Gizliliği Kararı').should('be.visible');
    makeChoice('A'); // Aşama 3: Maskeleme

    // Bitiş Ekranı Doğrulaması
    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Örnek Mühendislik Başarısı');
    cy.contains('MÜKEMMEL KRİZ YÖNETİMİ: Randevular Açık, Veriler Güvende').should('be.visible');
    cy.contains('300 / 300').should('be.visible');
    cy.contains('08:25').should('be.visible');
    cy.get('[data-testid="restart-simulation-btn"]').should('be.visible');
  });

  // YOL 2: A - A - B (KÖTÜ SON - KVKK İhlali)
  it('Yol 2 (A-A-B): Rollback + Duman Testi + Ham Log -> KÖTÜ SON (KVKK İhlali)', () => {
    startSimulation();
    makeChoice('A');
    makeChoice('A');
    makeChoice('B');

    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Kritik Hata / Kriz Başarısızlığı');
    cy.contains('KRİTİK KVKK İHLALİ VE VERİ SIZINTISI FELAKETİ').should('be.visible');
    cy.contains('AĞIR İHLAL').should('be.visible');
  });

  // YOL 3: A - B - A (KÖTÜ SON - Test Atlandı, Şema Uyumsuzluğu)
  it('Yol 3 (A-B-A): Rollback + Anında Dağıt + Maskeleme -> KÖTÜ SON (Şema Hatası)', () => {
    startSimulation();
    makeChoice('A');
    makeChoice('B');
    makeChoice('A');

    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Kritik Hata / Kriz Başarısızlığı');
    cy.contains('ŞEMA UYUMSUZLUĞU VE VERİ TUTARSIZLIĞI').should('be.visible');
  });

  // YOL 4: A - B - B (KÖTÜ SON - Çifte Felaket)
  it('Yol 4 (A-B-B): Rollback + Anında Dağıt + Ham Log -> KÖTÜ SON (Çifte Felaket)', () => {
    startSimulation();
    makeChoice('A');
    makeChoice('B');
    makeChoice('B');

    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Kritik Hata / Kriz Başarısızlığı');
    cy.contains('KRİTİK KVKK İHLALİ').should('be.visible');
  });

  // YOL 5: B - A - A (İYİ SON - Hotfix Duman Testiyle Kurtarıldı)
  it('Yol 5 (B-A-A): Hotfix + Duman Testi + Maskeleme -> İYİ SON (Zorlu Kurtarış)', () => {
    startSimulation();
    makeChoice('B');
    makeChoice('A');
    makeChoice('A');

    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Örnek Mühendislik Başarısı');
    cy.contains('ZORLU KURTARIŞ: Canlı Yama Testlerle Güvenceye Alındı').should('be.visible');
  });

  // YOL 6: B - A - B (KÖTÜ SON - Hotfix Çalıştı Ama KVKK İhlali)
  it('Yol 6 (B-A-B): Hotfix + Duman Testi + Ham Log -> KÖTÜ SON (KVKK Cezası)', () => {
    startSimulation();
    makeChoice('B');
    makeChoice('A');
    makeChoice('B');

    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Kritik Hata / Kriz Başarısızlığı');
    cy.contains('KRİTİK KVKK İHLALİ').should('be.visible');
  });

  // YOL 7: B - B - A (KÖTÜ SON - Deadlock)
  it('Yol 7 (B-B-A): Hotfix + Anında Dağıt + Maskeleme -> KÖTÜ SON (Deadlock)', () => {
    startSimulation();
    makeChoice('B');
    makeChoice('B');
    makeChoice('A');

    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Kritik Hata / Kriz Başarısızlığı');
    cy.contains('ÜRETİM ORTAMI KİLİTLENMESİ (CASCADING DEADLOCK)').should('be.visible');
  });

  // YOL 8: B - B - B (KÖTÜ SON - Tam Çöküş & Veri İhlali)
  it('Yol 8 (B-B-B): Hotfix + Anında Dağıt + Ham Log -> KÖTÜ SON (Tam Çöküş)', () => {
    startSimulation();
    makeChoice('B');
    makeChoice('B');
    makeChoice('B');

    cy.get('[data-testid="ending-status-badge"]').should('contain', 'Kritik Hata / Kriz Başarısızlığı');
    cy.contains('KRİTİK KVKK İHLALİ').should('be.visible');
  });

  // Restart Doğrulaması
  it('Bitiş ekranında Yeniden Başlat tıklandığında Onboarding ekranına dönmeli', () => {
    startSimulation();
    makeChoice('A');
    makeChoice('A');
    makeChoice('A');

    cy.get('[data-testid="restart-simulation-btn"]').scrollIntoView().click({ force: true });
    cy.contains('08:00 — Randevu Sistemi Çöktü').should('be.visible');
    cy.get('[data-testid="start-simulation-btn"]').should('be.visible');
  });
});
