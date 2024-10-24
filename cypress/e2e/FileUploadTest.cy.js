describe('File Upload Test', () => {

  it('should upload a file and click the "Añadir Archivo" button', () => {
    cy.visit('/#/Home', { timeout: 10000 });

    const fileName = 'upload.txt';
    const courseCode = 'ABC123';

    // Select option "Semáforo"
    cy.selectOption('Semáforo');

    // Upload the file and verify success
    cy.uploadFile(fileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
   // cy.verifyToastMessage('File uploaded successfully');

    // Verify the file in the table
    cy.verifyFileInTable(fileName);

    // Add course code and verify
    cy.addCourseCode(courseCode);

    // Click the "Generar Word" button
    cy.clickGenerateWord();

    // Verify the outcome after clicking "Generar Word"
    cy.verifyToastMessage('La hoja del excel Control de CURSOS no existe en la archivo Semáforo.');
  });


  it('should upload a file and handle "La columna Mod. Recup." validation', () => {
    cy.visit('/#/Home', { timeout: 10000 });

    const fileName = 'SEMÁFORO CURSOS 2024 1.xlsx';
    const courseCode = 'A-2024-FE-2190-MM-0';

    // Select option "Semáforo"
    cy.selectOption('Semáforo');

    // Upload the file and verify success
    cy.uploadFile(fileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo SEMÁFORO CURSOS 2024 1.xlsx añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(fileName);

    // Add course code and verify
    cy.addCourseCode(courseCode);

    // Click the "Generar Word" button
    cy.clickGenerateWord();

    // Verify the validation message in toast
    cy.verifyToastMessage('La columna Mod. Recup. de la hoja Control de CURSOS del excel Semáforo, debe ser rellenada.');
  });
  

  it('should upload a SEMAFORO file and Anexo 4', () => {
    cy.visit('/#/Home', { timeout: 10000 });

    const fileName = 'SEMÁFORO CURSOS 2024 1.xlsx';
    const Anexo4fileName = 'Anexo4. ARAÑAS RESUMEN SATISTACCION ASISTENTES 2024 1.xlsx';
    const courseCode = 'A-2024-FE-2190-MM-3';

    // Select option "Semáforo"
    cy.selectOption('Semáforo');

    // Upload the file and verify success
    cy.uploadFile(fileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+fileName+' añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(fileName);

    // Select option "Anexo 4"
    cy.selectOptionByLocator('Anexo 4','#pv_id_1_2');

    // Upload the file and verify success
    cy.uploadFile(Anexo4fileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+Anexo4fileName+' añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(Anexo4fileName);

    // Add course code and verify
    cy.addCourseCode(courseCode);

    // Click the "Generar Word" button
    cy.clickGenerateWord();

    // Verify the validation message in toast
    cy.verifyToastMessage('¡Reporte generado correctamente!');

    // Click the download button
    cy.clickDownloadButton();

    cy.reload();

  });

  it('should upload files SEMAFORO, Anexo 4 Anexo 1 y 3, Anexo 5 with delete', () => {
    cy.visit('/#/Home', { timeout: 10000 });

    const fileName = 'SEMÁFORO CURSOS 2024 1.xlsx';
    const fileName2 = 'SEMÁFORO CURSOS 2024 2.xlsx';
    const Anexo4fileName = 'Anexo4. ARAÑAS RESUMEN SATISTACCION ASISTENTES 2024 1.xlsx';
    const Anexo4BfileName = 'Anexo4. ARAÑAS RESUMEN SATISTACCION ASISTENTES 2024 2.xlsx';
    const Anexo1fileName = 'Anexos 1 y 3. ASISTENTES 1.xlsx';
    const Anexo5fileName = 'Anexo 5 SATISFACCION SUPERVISORES 1.xlsx';
    const courseCode = 'A-2024-FI-7103-O1-4';

    // Select option "Semáforo"
    cy.selectOption('Semáforo');

    // Upload the file and verify success
    cy.uploadFile(fileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+fileName+' añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(fileName);

    // Select option "Anexo 1 y 3"
    cy.selectOptionByLocator('Anexo 1 y 3','#pv_id_1_0');

    // Upload the file and verify success
    cy.uploadFile(Anexo1fileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+Anexo1fileName+' añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(Anexo1fileName);

    // Select option "Anexo 4"
    cy.selectOptionByLocator('Anexo 4','#pv_id_1_1');

    // Upload the file and verify success
    cy.uploadFile(Anexo4fileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+Anexo4fileName+' añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(Anexo4fileName);

    // Add course code and verify
    cy.addCourseCode(courseCode);

    // Click the "Generar Word" button
    cy.clickGenerateWord();

    // Verify the validation message in toast
    //Validacion Nueva en version 0.3.1
    cy.verifyToastMessage('ErrorLa columna Nº Pend. de la hoja Control de CURSOS del excel Semáforo tiene un valor 0, y se ha adjuntado Anexo 1 y 3 y tiene filas mostrables.');

    cy.deleteFileInTable(fileName);

    // Select option "Semáforo"
    cy.selectOptionByLocator('Semáforo','#pv_id_1_2');

    // Upload the file and verify success
    cy.uploadFile(fileName2);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+fileName2+' añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(fileName2);

    // Click the "Generar Word" button
    cy.clickGenerateWord();
    
    // Verify the validation message in toast
    cy.verifyToastMessage('ErrorLa columna Valor Araña de la hoja Control de CURSOS del excel Semáforo tiene un valor 0.9143, y no se ha adjuntado Anexo 4 o no tiene filas mostrables.');

    cy.deleteFileInTable(Anexo4fileName);

    // Select option "Anexo 4"
    cy.selectOptionByLocator('Anexo 4','#pv_id_1_2');

    // Upload the file and verify success
    cy.uploadFile(Anexo4BfileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+Anexo4BfileName+' añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(Anexo4BfileName);

    // Click the "Generar Word" button
    cy.clickGenerateWord();

    // Verify the toast message
    cy.verifyToastMessage('ErrorLa columna Coment. de la hoja Control de CURSOS del excel Semáforo tiene un valor SI, y no se ha adjuntado Anexo 5 o no tiene filas mostrables.');

    // Select option "Anexo 5"
    cy.selectOptionByLocator('Anexo 5','#pv_id_1_1');

    // Upload the file and verify success
    cy.uploadFile(Anexo5fileName);

    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();

    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+Anexo5fileName+' añadido correctamente.');

    // Verify the file in the table
    cy.verifyFileInTable(Anexo5fileName);

    // Click the "Generar Word" button
    cy.clickGenerateWord();

    // Verify the validation message in toast
    cy.verifyToastMessage('¡Reporte generado correctamente!');

    // Click the download button
    cy.clickDownloadButton();
  });

  it('should upload files SEMAFORO, Anexo 4 Anexo 1 y 3 and Anexo2', () => {
    cy.visit('/#/Home', { timeout: 10000 });
  
    const fileName = 'SEMÁFORO CURSOS 2024 2.xlsx';
    const Anexo4fileName = 'Anexo4. ARAÑAS RESUMEN SATISTACCION ASISTENTES 2024 1.xlsx';
    const Anexo2fileName = 'Anexo2 3.pdf';
    const Anexo1fileName = 'Anexos 1 y 3. ASISTENTES 1.xlsx';
    const courseCode = 'A-2024-FI-7115-TC-12';
  
      // Select "Anexo 2"
      cy.selectOption('Anexo 2');
  
      // Upload the file and verify success
      cy.uploadFile(Anexo2fileName);
    
      // Click "Añadir Archivo" button
      cy.get('button[aria-label="Añadir Archivo"]').click();
    
      // Verify the toast message
      cy.verifyToastMessage('¡Archivo añadido!Archivo '+Anexo2fileName+' añadido correctamente.');
    
      // Verify the file in the table
      cy.verifyFileInTable(Anexo2fileName);
  
    // Select option "Semáforo"
    cy.selectOption('Semáforo');
  
    // Upload the file and verify success
    cy.uploadFile(fileName);
  
    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();
  
    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+fileName+' añadido correctamente.');
  
    // Verify the file in the table
    cy.verifyFileInTable(fileName);
  
    // Select option "Anexo 1 y 3"
    cy.selectOptionByLocator('Anexo 1 y 3','#pv_id_1_0');
  
    // Upload the file and verify success
    cy.uploadFile(Anexo1fileName);
  
    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();
  
    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+Anexo1fileName+' añadido correctamente.');
  
    // Verify the file in the table
    cy.verifyFileInTable(Anexo1fileName);
  
    // Select option "Anexo 4"
    cy.selectOptionByLocator('Anexo 4','#pv_id_1_0');
  
    // Upload the file and verify success
    cy.uploadFile(Anexo4fileName);
  
    // Click "Añadir Archivo" button
    cy.get('button[aria-label="Añadir Archivo"]').click();
  
    // Verify the toast message
    cy.verifyToastMessage('¡Archivo añadido!Archivo '+Anexo4fileName+' añadido correctamente.');
  
    // Verify the file in the table
    cy.verifyFileInTable(Anexo4fileName);
  
    // Add course code and verify
    cy.addCourseCode(courseCode);
  
    // Click the "Generar Word" button
    cy.clickGenerateWord();

    // Verify the validation message in toast
    cy.verifyToastMessage('¡Reporte generado correctamente!');
  
    // Click the download button
    cy.clickDownloadButton();
  });
});