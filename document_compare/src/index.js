const path = require('path');
const BatchDocumentComparer = require('./batchCompare');

// Define absolute paths based on the project structure
const downloadsPath = path.resolve(__dirname, '../../cypress/downloads');
const samplesPath = path.resolve(__dirname, '../samples');
const reportsPath = path.resolve(__dirname, '../reports');

async function main() {
    try {
        console.log('Starting document comparison...');
        console.log('Downloads path:', downloadsPath);
        console.log('Samples path:', samplesPath);
        console.log('Reports path:', reportsPath);

        const batchComparer = new BatchDocumentComparer(
            downloadsPath,
            samplesPath,
            reportsPath
        );

        await batchComparer.compareAll();
    } catch (error) {
        console.error('Error running comparison:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };