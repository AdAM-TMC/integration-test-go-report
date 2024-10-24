describe('Data-Driven Test with Code List', () => {
  beforeEach(() => {
    cy.fixture('10code-messages.json').as('codes').then((codes) => {
      cy.log(JSON.stringify(codes));
    });
    cy.reload();
  });

  it('should validate each code from the list', function () {
    const fileName = 'SEMÁFORO CURSOS 2024 1.xlsx';
    this.codes.forEach((item) => {
      const code = item.code;
      const expectedMessage = item.message;

      cy.log('Proceso para el codigo:'+code);
      cy.visit('/#/Home', { timeout: 10000 });
      cy.log('Select option "Semáforo');
      cy.selectOption('Semáforo');
      cy.log('Upload the file and verify success');
      cy.uploadFile(fileName);
      cy.log('Click "Añadir Archivo" button');
      cy.get('button[aria-label="Añadir Archivo"]').click();
      cy.verifyToastMessage('¡Archivo añadido!Archivo SEMÁFORO CURSOS 2024 1.xlsx añadido correctamente.');
      cy.log('Add course code and verify');
      cy.addCourseCode(code);
      cy.log('Click the "Generar Word" button');
      cy.clickGenerateWord();
      cy.log('check if message match: '+expectedMessage);
      cy.verifyToastMessage(expectedMessage);
      cy.reload();
    });
  });
});