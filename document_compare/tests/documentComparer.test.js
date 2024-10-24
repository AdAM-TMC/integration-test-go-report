const DocumentComparer = require('../src/documentComparer');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const diff = require('diff');

jest.mock('fs');
jest.mock('mammoth');
jest.mock('diff');

describe('DocumentComparer', () => {
    const testDataDir = path.join(__dirname, 'test-data');
    const outputDir = path.join(__dirname, 'test-output');
    const baselineDocPath = path.join(testDataDir, 'baseline.docx');
    const newDocPath = path.join(testDataDir, 'newVersion.docx');
    const reportPath = path.join(outputDir, 'report.json');

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock file system read
        fs.existsSync.mockReturnValue(true);
        fs.mkdirSync.mockImplementation(() => {});

        // Mock fs.readFileSync to return test buffers
        fs.readFileSync.mockImplementation((docPath) => {
            if (docPath === baselineDocPath) {
                return Buffer.from('This is the baseline document.');
            } else if (docPath === newDocPath) {
                return Buffer.from('This is the updated document with new content.');
            }
            throw new Error('File not found');
        });

        // Mock mammoth.extractRawText
        mammoth.extractRawText.mockImplementation(({ buffer }) => {
            const text = buffer.toString();
            return Promise.resolve({
                value: text,
                messages: []
            });
        });

        // Mock mammoth.convert
        mammoth.convert.mockImplementation(({ buffer }) => {
            const text = buffer.toString();
            return Promise.resolve({
                value: text,
                messages: []
            });
        });

        // Mock diffWords
        diff.diffWords.mockReturnValue([
            { value: 'This is the ', added: false, removed: false },
            { value: 'baseline', added: false, removed: true },
            { value: 'updated', added: true, removed: false },
            { value: ' document with new content.', added: false, removed: false }
        ]);
    });

    test('should detect differences between documents and generate a report', async () => {
        const comparer = new DocumentComparer(baselineDocPath, newDocPath, reportPath);

        const result = await comparer.compareDocuments();

        // Assertions
        expect(result.hasDifferences).toBe(true);
        expect(result.differenceCount).toBe(2);
        expect(result.reportPath).toBe(reportPath);

        // Verify report generation
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            reportPath,
            expect.any(String),
            'utf8'
        );

        // Verify report content
        const reportContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
        expect(reportContent).toHaveProperty('baselineDocument', 'baseline.docx');
        expect(reportContent).toHaveProperty('newVersionDocument', 'newVersion.docx');
        expect(reportContent.summary.totalDifferences).toBe(2);
        expect(reportContent.differences.length).toBe(2);
    });
});