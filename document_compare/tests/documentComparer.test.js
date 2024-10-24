const DocumentComparer = require('../src/documentComparer');
const path = require('path');
const fs = require('fs');

describe('DocumentComparer', () => {
    const testDataDir = path.join(__dirname, 'test-data');
    const outputDir = path.join(__dirname, 'test-output');

    beforeAll(() => {
        // Create test directories if they don't exist
        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir);
        }
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
    });

    test('should detect differences between documents', async () => {
       
    });

});