// Cypress support file
// Prevent uncaught exception failures from third-party fonts or analytics
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
