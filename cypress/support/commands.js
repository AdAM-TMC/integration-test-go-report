import 'cypress-file-upload';

Cypress.Commands.add('selectOption', (optionText) => {
  cy.log(`Executing 'selectOption' with optionText: "${optionText}"`);
  // Map the option text to the corresponding locator
  let optionLocator;
  switch (optionText) {
    case 'Semáforo':
      optionLocator = '#pv_id_1_0';
      break;
    case 'Anexo 1 y 3':
      optionLocator = '#pv_id_1_1';
      break;
    case 'Anexo 2':
      optionLocator = '#pv_id_1_2';
      break;
    case 'Anexo 4':
      optionLocator = '#pv_id_1_3';
      break;
    case 'Anexo 5':
      optionLocator = '#pv_id_1_4';
      break;
    default:
      throw new Error(`Option "${optionText}" not recognized`);
  }

  // Call the selectOptionByLocator method
  cy.selectOptionByLocator(optionText, optionLocator);

});

Cypress.Commands.add('selectOptionByLocator', (optionText, optionLocator) => {
  cy.log(`Executing 'selectOptionByLocator' with optionText: "${optionText}", optionLocator: "${optionLocator}"`);
  // Click the option selector to open the dropdown
  cy.get('#pv_id_1 > div').click();
  
  // Ensure the dropdown list is visible
  cy.get('#pv_id_1_list.p-select-list').should('be.visible');

  // Click the option using the mapped locator
  cy.get(optionLocator).contains(optionText).click();

  // Verify the selected option is correctly displayed
  cy.get('#pv_id_1 .p-select-label').should('have.text', optionText).and('be.visible');
});
  
  Cypress.Commands.add('uploadFile', (fileName) => {
    cy.log(`Executing 'uploadFile' with fileName: "${fileName}"`);
    cy.get('input[type="file"]').attachFile(fileName);
    cy.get('.drag-drop-upload').should('contain', fileName);
  });

  Cypress.Commands.add('uploadPDFFile', (fileName) => {
    cy.log(`Executing 'uploadPDFFile' with fileName: "${fileName}"`);
 
    // Load the file as binary
    cy.fixture(fileName, 'binary')
      .then((fileContent) => {
        // Create a Blob object from the binary file
        const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'application/pdf');
        const file = new File([blob], fileName, { type: 'application/pdf' });

        // Create a DataTransfer object to hold the file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        // Get the file input element and set the files property
        cy.get('input[type="file"]').then((input) => {
          // Set the files property of the input element
          input[0].files = dataTransfer.files;
          // Trigger the change event to notify that a file has been added
          input.trigger('change', { force: true });

          // Log to verify the files array
          cy.log(`Files in input: ${input[0].files.length}`); // Check how many files are in the input
        });

        // Wait for the upload process to complete (if there's a loading state, use that)
        cy.get('.drag-drop-upload').should('be.visible');

        });
  });
  
  Cypress.Commands.add('addCourseCode', (courseCode) => {
    cy.log(`Executing 'addCourseCode' with courseCode: "${courseCode}"`);
    cy.get('input[name="course-code"]').type(courseCode);
    cy.get('input[name="course-code"]').should('have.value', courseCode);
  });
  
  Cypress.Commands.add('clickGenerateWord', () => {
    cy.log(`Executing 'clickGenerateWord'`);
    cy.get('span.p-button-label').contains('Generar Word').click();
  });
  
  Cypress.Commands.add('verifyToastMessage', (expectedMessage) => {
    cy.log(`Executing 'verifyToastMessage' with expectedMessage: "${expectedMessage}"`);
    
    cy.get('.p-toast')
      .should('be.visible')
      .first() // Get the first visible toast element
      .then((toast) => {

        const actualMessage = toast.text(); 
        //console.log(`Actual toast message: "${actualMessage}"`);
        expect(actualMessage).to.contain(expectedMessage);
  
        // Verify the close button exists within the first toast
        cy.wrap(toast)
          .find('button[aria-label="Close"]')
          .should('exist')
          .and('be.visible')
          .first() 
          .click()
          .should('not.exist');
      });
  });

  Cypress.Commands.add('extractToastMessage', (code) => {
    cy.get('.p-toast')
      .should('be.visible')
      .first()
      .then((toast) => {
        const actualMessage = toast.text().trim();
        const jsonOutput = {
          code: code,
          message: actualMessage
        };
  
        // Convert to JSON string
        const outputString = JSON.stringify(jsonOutput);
  
        // Send output to the appendToFile task
        cy.task('appendToFile', { fileName: 'toastMessages.json', data: outputString });
  
        // Close the toast
        cy.wrap(toast)
          .find('button[aria-label="Close"]')
          .should('exist')
          .and('be.visible')
          .first()
          .click()
          .should('not.exist');
      });
  });
  
  
  Cypress.Commands.add('verifyFileInTable', (fileName) => {
    cy.log(`Executing 'verifyFileInTable' with fileName: "${fileName}"`);
    cy.get('td[data-pc-section="bodycell"]').contains(fileName).should('be.visible');
  });

  Cypress.Commands.add('deleteFileInTable', (fileName) => {
    cy.log(`Executing 'deleteFileInTable' with fileName: "${fileName}"`);
    // Find the row that contains the specified file name
    cy.get('tr').contains('td', fileName)
      .should('be.visible') // Ensure the file name is visible
      .parents('tr') // Get the parent row of the file name
      .within(() => {
        // Within this row, find the delete button and click it
        cy.get('button.p-button-danger').click();
      });
  });

  Cypress.Commands.add('getToastErrorMessage', (code, expectedMessage) => {
    cy.log(`Executing 'getToastErrorMessage' with code: "${code}", expectedMessage: "${expectedMessage}"`);
    cy.get('.p-toast')
      .should('be.visible')
      .invoke('text')
      .then((actualMessage) => {
        cy.log(`Actual message for item ${code}:`, actualMessage);
        console.log('code:' + code + ', Message:', actualMessage);
        expect(actualMessage.trim()).to.eq(expectedMessage.trim());
      });
  });

  Cypress.Commands.add('clickDownloadButton', () => {
    cy.log(`Executing 'clickDownloadButton'`);
    cy.get('button[aria-label="Descargar Documento Generado"]').click();
  });