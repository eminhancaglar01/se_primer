describe('SE Primer — Deneyimli Seviye Sayaç ve Mobil Görünüm Testleri', () => {
  it('Mobil görünümde (iPhone-X 375x812) arayüz taşma yapmadan düzgün yüklenmeli', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.contains('08:00 — Randevu Sistemi Çöktü').should('be.visible');
    cy.get('[data-testid="start-simulation-btn"]').should('be.visible');
  });

  it('Deneyimli modda 60s sayaç aktif olmalı ve sürenin azaldığı gözlemlenmeli', () => {
    cy.viewport(390, 844);
    cy.visit('/');
    cy.get('[data-testid="experience-experienced"]').click();
    cy.get('[data-testid="role-devops"]').click();
    cy.get('[data-testid="goal-architecture"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();

    cy.get('[data-testid="countdown-timer"]').should('be.visible');
    cy.get('[data-testid="countdown-timer-text"]').should('contain', '00:');

    // 2 saniye bekle ve sayacın çalıştığını doğrula
    cy.wait(2000);
    cy.get('[data-testid="countdown-timer-text"]').invoke('text').then((timeStr) => {
      const seconds = parseInt(timeStr.replace('00:', ''), 10);
      expect(seconds).to.be.lessThan(60);
    });
  });
});
