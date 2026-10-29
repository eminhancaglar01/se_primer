describe('SE Primer — Onboarding ve Kişiselleştirme Testleri', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Onboarding ekranı yüklenmeli ve 3 zorunlu soru mevcut olmalı', () => {
    cy.contains('08:00 — Randevu Sistemi Çöktü').should('be.visible');
    cy.contains('Deneyim Seviyen').should('be.visible');
    cy.contains('Mühendislik Rolün').should('be.visible');
    cy.contains('Öğrenme Hedefin').should('be.visible');
    cy.get('[data-testid="start-simulation-btn"]').should('be.visible');
  });

  it('Başlangıç seviyesi seçildiğinde ipucu kartı görünmeli', () => {
    cy.get('[data-testid="experience-beginner"]').click();
    cy.get('[data-testid="role-backend"]').click();
    cy.get('[data-testid="goal-architecture"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();

    // Aşama 1 kriz ekranı doğrulaması
    cy.contains('Aşama 1: Mimari Karar').should('be.visible');
    cy.contains('Başlangıç Seviyesi İpucu:').should('be.visible');
    cy.get('[data-testid="decision-option-a"]').should('be.visible');
    cy.get('[data-testid="decision-option-b"]').should('be.visible');
  });

  it('Deneyimli seviye seçildiğinde 60s sayaç aktif olmalı ve ipucu gizlenmeli', () => {
    cy.get('[data-testid="experience-experienced"]').click();
    cy.get('[data-testid="role-devops"]').click();
    cy.get('[data-testid="goal-testing"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();

    cy.contains('Aşama 1: Mimari Karar').should('be.visible');
    cy.get('[data-testid="countdown-timer"]').should('be.visible');
    cy.contains('Başlangıç Seviyesi İpucu:').should('not.exist');
  });
});
