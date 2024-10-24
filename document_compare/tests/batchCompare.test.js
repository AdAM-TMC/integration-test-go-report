const BatchDocumentComparer = require('../src/batchCompare');
const DocumentComparer = require('../src/documentComparer');
const fs = require('fs');
const path = require('path');

// Mock dependencies
jest.mock('fs');
jest.mock('../src/documentComparer');
jest.mock('path');

describe('BatchDocumentComparer', () => {
    // Test paths
    const downloadsPath = '/downloads';
    const samplesPath = '/samples';
    const reportsPath = '/reports';
    
    // Sample files
    const testFiles = [
        'document1.docx',
        'document2.docx',
        'document3.docx'
    ];

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Mock path.join to return predictable paths
        path.join.mockImplementation((...args) => args.join('/'));

        // Mock DocumentComparer constructor
        DocumentComparer.mockClear();
    });

    test('should successfully compare documents with no differences', async () => {
        // Mock file system operations
        fs.readdirSync.mockReturnValue([...testFiles, 'ignore.txt']);
        fs.existsSync.mockReturnValue(true);
        
        // Mock successful comparison results
        const mockCompareDocuments = jest.fn().mockResolvedValue({
            hasDifferences: false,
            differenceCount: 0,
            reportPath: '/reports/report.json'
        });

        // Set up DocumentComparer mock
        DocumentComparer.mockImplementation(() => ({
            compareDocuments: mockCompareDocuments
        }));

        const batchComparer = new BatchDocumentComparer(downloadsPath, samplesPath, reportsPath);
        const summary = await batchComparer.compareAll();

        // Verify results
        expect(summary.statistics.passed).toBe(3);
        expect(summary.statistics.failed).toBe(0);
        expect(summary.statistics.errors).toBe(0);
        expect(summary.status).toBe('PASSED');
        expect(summary.results).toHaveLength(3);
    });

    test('should handle documents with differences', async () => {
        // Mock file system operations
        fs.readdirSync.mockReturnValue(testFiles);
        fs.existsSync.mockReturnValue(true);
        
        // Mock comparison results with differences
        const mockCompareDocuments = jest.fn().mockResolvedValue({
            hasDifferences: true,
            differenceCount: 2,
            reportPath: '/reports/report.json'
        });

        // Set up DocumentComparer mock
        DocumentComparer.mockImplementation(() => ({
            compareDocuments: mockCompareDocuments
        }));

        const batchComparer = new BatchDocumentComparer(downloadsPath, samplesPath, reportsPath);
        
        await expect(batchComparer.compareAll()).rejects.toThrow('Comparison failed: 3 failures, 0 errors');
        expect(batchComparer.failureCount).toBe(3);
        expect(batchComparer.successCount).toBe(0);
    });

    test('should handle missing sample files', async () => {
        // Mock file system operations
        fs.readdirSync.mockReturnValue(testFiles);
        fs.existsSync.mockReturnValue(false); // Simulate missing sample files
        
        const batchComparer = new BatchDocumentComparer(downloadsPath, samplesPath, reportsPath);
        const summary = await batchComparer.compareAll();

        expect(DocumentComparer).not.toHaveBeenCalled();
        expect(summary.statistics.total).toBe(3);
        expect(summary.statistics.passed).toBe(0);
    });

    test('should handle comparison errors', async () => {
        // Mock file system operations
        fs.readdirSync.mockReturnValue(testFiles);
        fs.existsSync.mockReturnValue(true);
        
        // Mock comparison error
        const mockCompareDocuments = jest.fn().mockRejectedValue(new Error('Comparison failed'));

        // Set up DocumentComparer mock
        DocumentComparer.mockImplementation(() => ({
            compareDocuments: mockCompareDocuments
        }));

        const batchComparer = new BatchDocumentComparer(downloadsPath, samplesPath, reportsPath);
        
        await expect(batchComparer.compareAll()).rejects.toThrow('Comparison failed: 0 failures, 3 errors');
        expect(batchComparer.errorCount).toBe(3);
        expect(batchComparer.results).toHaveLength(3);
        expect(batchComparer.results[0].status).toBe('ERROR');
    });

    test('should generate correct summary report', async () => {
        // Mock file system operations
        fs.readdirSync.mockReturnValue(testFiles);
        fs.existsSync.mockReturnValue(true);
        
        let callCount = 0;
        // Mock mixed comparison results
        const mockCompareDocuments = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 2) { // Make the second document have differences
                return Promise.resolve({
                    hasDifferences: true,
                    differenceCount: 2,
                    reportPath: '/reports/report.json'
                });
            }
            return Promise.resolve({
                hasDifferences: false,
                differenceCount: 0,
                reportPath: '/reports/report.json'
            });
        });
    
        // Set up DocumentComparer mock
        DocumentComparer.mockImplementation(() => ({
            compareDocuments: mockCompareDocuments
        }));
    
        const batchComparer = new BatchDocumentComparer(downloadsPath, samplesPath, reportsPath);
        
        try {
            await batchComparer.compareAll();
        } catch (error) {
            // We expect this error, but want to verify the summary was written correctly
            expect(error.message).toBe('Comparison failed: 1 failures, 0 errors');
        }
    
        // Verify the writeFileSync was called
        expect(fs.writeFileSync).toHaveBeenCalled();
        
        // Get the actual call arguments
        const writeCallArgs = fs.writeFileSync.mock.calls[0];
        
        // Verify the file path contains 'summary-'
        expect(writeCallArgs[0]).toContain('summary-');
        
        // Parse and verify the written content
        const writtenContent = JSON.parse(writeCallArgs[1]);
        
        // Verify the content structure
        expect(writtenContent).toMatchObject({
            totalFiles: 3,
            statistics: {
                passed: 2,
                failed: 1,
                errors: 0,
                total: 3
            },
            status: 'FAILED',
            results: expect.arrayContaining([
                expect.objectContaining({
                    fileName: 'document2.docx',
                    status: 'FAILED',
                    hasDifferences: true,
                    differenceCount: 2
                })
            ])
        });
    });
});