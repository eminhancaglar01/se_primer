describe('SE Primer — Sokratik AI Eğitmen ve Çevrimdışı Yedek Testleri', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="experience-intermediate"]').click();
    cy.get('[data-testid="role-backend"]').click();
    cy.get('[data-testid="goal-architecture"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();
  });

  it('AI Eğitmen modalı açılabilmeli ve karşılama mesajı görünmeli', () => {
    cy.get('[data-testid="open-tutor-btn"]').click();
    cy.contains('Sokratik AI Eğitmen').should('be.visible');
    cy.contains('Dr. Gemini').should('be.visible');
    cy.contains('Doğrudan cevap yok • Düşünmeye yönlendirir').should('be.visible');
    cy.get('[data-testid="close-tutor-btn"]').should('be.visible');
  });

  it('Öğrenci soru sorduğunda Sokratik yanıt üretilmeli ve cevap sızdırılmamalı', () => {
    cy.get('[data-testid="open-tutor-btn"]').click();

    // Soru sor
    cy.get('[data-testid="tutor-input"]').type('Rollback mi yapayım yoksa canlıda hotfix mi? Hangisi doğru?');
    cy.get('[data-testid="tutor-send-btn"]').click();

    // Sokratik yanıt kontrolü
    cy.get('[data-testid="tutor-response-message"]').last().should('be.visible').and(($el) => {
      const text = $el.text().toLowerCase();
      // Kesinlikle cevap sızdırmamalı
      expect(text).not.to.include('a şıkkını seç');
      expect(text).not.to.include('b şıkkını seç');
      expect(text).not.to.include('doğru cevap');
      // Sokratik soru sormalı
      expect(text).to.include('?');
    });

    // Modalı kapat
    cy.get('[data-testid="close-tutor-btn"]').click();
    cy.get('[data-testid="tutor-input"]').should('not.exist');
  });
});
