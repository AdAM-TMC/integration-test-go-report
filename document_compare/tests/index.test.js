const path = require('path');
const { main } = require('../src/index');

const mockCompareAll = jest.fn().mockResolvedValue('Mocked comparison complete');
jest.mock('../src/batchCompare', () => {
    return jest.fn().mockImplementation(() => ({
        compareAll: mockCompareAll
    }));
});

describe('Document Comparison Script', () => {
    let originalExit;

    beforeAll(() => {
        // Save the original process.exit
        originalExit = process.exit;
        // Mock process.exit to prevent the test from exiting
        process.exit = jest.fn();
    });

    afterAll(() => {
        // Restore the original process.exit after tests
        process.exit = originalExit;
    });

    it('should log paths and call compareAll', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await main();

        expect(consoleLogSpy).toHaveBeenCalledWith('Starting document comparison...');
        expect(consoleLogSpy).toHaveBeenCalledWith('Downloads path:', path.resolve(__dirname, '../../cypress/downloads'));
        expect(consoleLogSpy).toHaveBeenCalledWith('Samples path:', path.resolve(__dirname, '../samples'));
        expect(consoleLogSpy).toHaveBeenCalledWith('Reports path:', path.resolve(__dirname, '../reports'));

        const BatchDocumentComparer = require('../src/batchCompare');
        // Ensure the constructor was called
        expect(BatchDocumentComparer).toHaveBeenCalled();
        // Ensure compareAll method was called
        expect(mockCompareAll).toHaveBeenCalled();

        consoleLogSpy.mockRestore();
    });

    it('should handle errors and call process.exit', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const BatchDocumentComparer = require('../src/batchCompare');
        // Force the batch comparer to throw an error
        BatchDocumentComparer.mockImplementationOnce(() => ({
            compareAll: jest.fn().mockRejectedValue(new Error('Mocked error'))
        }));

        await main();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error running comparison:', expect.any(Error));
        expect(process.exit).toHaveBeenCalledWith(1);

        consoleErrorSpy.mockRestore();
    });
});
