const DocumentComparer = require('../src/documentComparer');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const diff = require('diff');

// Mock the necessary modules
jest.mock('fs');
jest.mock('mammoth');
jest.mock('diff');

describe('DocumentComparer', () => {
    const testDataDir = path.join(__dirname, 'test-data');
    const outputDir = path.join(__dirname, 'test-output');
    const baselineDocPath = path.join(testDataDir, 'baseline.docx');
    const newDocPath = path.join(testDataDir, 'newVersion.docx');
    const reportPath = path.join(outputDir, 'report.json');

    beforeAll(() => {
        // Ensure that the directories exist
        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir);
        }
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should detect differences between documents and generate a report', async () => {
        // Mock file system read
        fs.readFileSync.mockImplementation((docPath) => {
            if (docPath === baselineDocPath) {
                return Buffer.from('This is the baseline document.');
            } else if (docPath === newDocPath) {
                return Buffer.from('This is the updated document with new content.');
            }
            throw new Error('File not found');
        });

        // Mock mammoth text extraction
        mammoth.extractRawText.mockResolvedValueOnce({ value: 'This is the baseline document.' });
        mammoth.extractRawText.mockResolvedValueOnce({ value: 'This is the updated document with new content.' });

        // Mock diffWords
        diff.diffWords.mockReturnValue([
            { value: 'This is the ', added: false, removed: false },
            { value: 'baseline', added: false, removed: true },
            { value: 'updated', added: true, removed: false },
            { value: ' document with new content.', added: false, removed: false }
        ]);

        // Initialize the DocumentComparer
        const comparer = new DocumentComparer(baselineDocPath, newDocPath, reportPath);

        // Perform the comparison
        const result = await comparer.compareDocuments();

        // Assertions for the result
        expect(result.hasDifferences).toBe(true);
        expect(result.differenceCount).toBe(2);
        expect(result.reportPath).toBe(reportPath);

        // Check if the report was generated
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            reportPath,
            expect.any(String), // The report content as a JSON string
            'utf8'
        );

        // Check the structure of the generated report
        const reportContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
        expect(reportContent).toHaveProperty('baselineDocument', 'baseline.docx');
        expect(reportContent).toHaveProperty('newVersionDocument', 'newVersion.docx');
        expect(reportContent.summary.totalDifferences).toBe(2);
        expect(reportContent.differences.length).toBe(2);
    });
});