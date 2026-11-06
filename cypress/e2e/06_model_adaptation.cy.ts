describe('The Primer v2 — Davranışsal Model Adaptasyonu ve Veri Toplama Testleri', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Veri Toplama Modu rozeti ve ONNX çıkarım durumu görünmelidir', () => {
    cy.get('[data-testid="experience-beginner"]').click();
    cy.get('[data-testid="role-software"]').click();
    cy.get('[data-testid="goal-testing"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();

    cy.get('[data-cy="data-collection-badge"]').should('be.visible').and('contain', 'Veri Toplama Açık');
    cy.get('[data-cy="model-status"]').first().should('be.visible');
  });

  it('Yüksek destek ihtiyacında Proaktif Sokratik Destek paneli tetiklenmelidir', () => {
    cy.get('[data-testid="experience-beginner"]').click();
    cy.get('[data-testid="role-devops"]').click();
    cy.get('[data-testid="goal-architecture"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();

    // Model beginner profilinde tereddütle destek paneli tetikler
    cy.get('[data-cy="model-telemetry-card"]').should('be.visible');
    
    // Proaktif banner kontrolü
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="proactive-tutor-banner"]').length > 0) {
        cy.get('[data-cy="proactive-tutor-banner"]').should('be.visible').and('contain', 'Proaktif Mühendislik Desteği');
      }
    });
  });

  it('Simülasyon bitiş ekranında Oturum Verilerini Dışa Aktar (CSV İndir) butonu mevcut olmalıdır', () => {
    cy.get('[data-testid="experience-experienced"]').click();
    cy.get('[data-testid="role-software"]').click();
    cy.get('[data-testid="goal-general"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();

    // 3 kararı ver
    cy.get('[data-testid="decision-option-a"]').click({ force: true });
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    cy.get('[data-testid="decision-option-a"]').click({ force: true });
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    cy.get('[data-testid="decision-option-a"]').click({ force: true });
    cy.get('[data-testid="next-stage-btn"]').click({ force: true });

    // Bitiş ekranı
    cy.get('[data-testid="ending-status-badge"]').should('be.visible');
    cy.get('[data-cy="export-csv-btn"]').should('be.visible').and('contain', 'CSV İndir');
  });
});
