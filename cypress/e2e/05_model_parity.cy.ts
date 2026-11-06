describe('The Primer v2 — Model Çıkarım Paritesi Testi (Inference Parity)', () => {
  let parityData: any;

  before(() => {
    cy.readFile('tests/parite.json').then((data) => {
      parityData = data;
    });
  });

  beforeEach(() => {
    cy.visit('/');
  });

  it('Python ONNX Runtime ve Tarayıcı ONNX Runtime-Web arasındaki fark < 1e-4 olmalıdır', () => {
    expect(parityData).to.exist;
    expect(parityData.test_cases).to.have.length.of.at.least(5);

    cy.window().should('have.property', '__predictML');

    cy.window().then(async (win: any) => {
      for (const testCase of parityData.test_cases) {
        const browserResult = await win.__predictML(testCase.features);
        const pythonProb = testCase.python_probability;
        const browserProb = browserResult.probability;
        const diff = Math.abs(pythonProb - browserProb);

        cy.log(`Test Case: ${testCase.id}`);
        cy.log(`Python: ${pythonProb} | Browser: ${browserProb} | Diff: ${diff}`);

        // 1e-4 (0.0001) tolerans sınırı
        expect(diff, `Parite farkı ${testCase.id} için 1e-4 sınırını aşmamalı`).to.be.lessThan(parityData.tolerance);
      }
    });
  });

  it('Arayüzdeki model telemetrisi ve p olasılık alanı erişilebilir olmalıdır', () => {
    cy.get('[data-testid="experience-intermediate"]').click();
    cy.get('[data-testid="role-backend"]').click();
    cy.get('[data-testid="goal-architecture"]').click();
    cy.get('[data-testid="start-simulation-btn"]').click();

    cy.get('[data-cy="model-telemetry-card"]').should('be.visible');
    cy.get('[data-cy="p"]').should('be.visible').invoke('text').then((val) => {
      const pFloat = parseFloat(val.trim());
      expect(pFloat).to.be.at.least(0.0).and.at.most(1.0);
    });
  });
});
