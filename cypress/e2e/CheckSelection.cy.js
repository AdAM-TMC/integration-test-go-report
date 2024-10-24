describe('Select options and verify their selection', () => {
  it('should click the option selector and select "Semáforo"', () => {
    cy.visit('/#/Home', { timeout: 10000 });
    // Select "Semáforo"
    cy.selectOption('Semáforo');
  });

  it('should click the option selector and select "Anexo 1 y 3"', () => {
    cy.visit('/#/Home', { timeout: 10000 });
    // Select "Anexo 1 y 3"
    cy.selectOption('Anexo 1 y 3');
  });

  it('should click the option selector and select "Anexo 2"', () => {
    cy.visit('/#/Home', { timeout: 10000 });
    // Select "Anexo 2"
    cy.selectOption('Anexo 2');
  });

  it('should click the option selector and select "Anexo 4"', () => {
    cy.visit('/#/Home', { timeout: 10000 });
    // Select "Anexo 4"
    cy.selectOption('Anexo 4');
  });

  it('should click the option selector and select "Anexo 5"', () => {
    cy.visit('/#/Home', { timeout: 10000 });
    // Select "Anexo 5"
    cy.selectOption('Anexo 5');
  });

  it('should select Semáforo and Anexo options', () => {
    cy.visit('/#/Home', { timeout: 10000 });
    // Select "Semáforo"
    cy.selectOption('Semáforo');
    
    // Select "Anexo 1 y 3"
    cy.selectOption('Anexo 1 y 3');
    
    // Select "Anexo 2"
    cy.selectOption('Anexo 2');
    
    // Select "Anexo 4"
    cy.selectOption('Anexo 4');
    
    // Select "Anexo 5"
    cy.selectOption('Anexo 5');
  });
});