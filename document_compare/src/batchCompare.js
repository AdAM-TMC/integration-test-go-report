// src/batchCompare.js
const DocumentComparer = require('./documentComparer');
const path = require('path');
const fs = require('fs');

class BatchDocumentComparer {
    constructor(downloadsPath, samplesPath, reportsPath) {
        this.downloadsPath = downloadsPath;
        this.samplesPath = samplesPath;
        this.reportsPath = reportsPath;
        this.results = [];
        this.failureCount = 0;
        this.successCount = 0;
        this.errorCount = 0;
    }

    async compareAll() {
        try {
            const downloadFiles = fs.readdirSync(this.downloadsPath)
                .filter(file => file.endsWith('.docx'));

            console.log('\n=== Starting Batch Document Comparison ===\n');

            for (const file of downloadFiles) {
                const downloadFilePath = path.join(this.downloadsPath, file);
                const sampleFilePath = path.join(this.samplesPath, file);
                
                if (!fs.existsSync(sampleFilePath)) {
                    console.log(`⚠️  Warning: No sample file found for ${file}`);
                    continue;
                }

                console.log(`\n📄 Comparing: ${file}`);
                console.log(`   Download: ${downloadFilePath}`);
                console.log(`   Sample: ${sampleFilePath}`);

                const reportFileName = `report-${file.replace('.docx', '')}-${Date.now()}.json`;
                const reportPath = path.join(this.reportsPath, reportFileName);

                try {
                    const comparer = new DocumentComparer(sampleFilePath, downloadFilePath, reportPath);
                    const result = await comparer.compareDocuments();

                    // Determine if this comparison is a failure
                    const isFailure = result.differenceCount > 0;
                    
                    this.results.push({
                        fileName: file,
                        status: isFailure ? 'FAILED' : 'PASSED',
                        ...result
                    });

                    if (isFailure) {
                        this.failureCount++;
                        console.log(`❌ Comparison FAILED for ${file}`);
                        console.log(`   ${result.differenceCount} differences found`);
                        console.log(`   See detailed report: ${reportPath}`);
                    } else {
                        this.successCount++;
                        console.log(`✅ Comparison PASSED for ${file}`);
                        console.log(`   No differences found`);
                        console.log(`   Report: ${reportPath}`);
                    }

                } catch (error) {
                    this.errorCount++;
                    console.error(`⚠️  Error comparing ${file}: ${error.message}`);
                    this.results.push({
                        fileName: file,
                        status: 'ERROR',
                        error: error.message
                    });
                }
            }

            // Generate summary report
            const summaryPath = path.join(this.reportsPath, `summary-${Date.now()}.json`);
            const summary = {
                timestamp: new Date().toISOString(),
                totalFiles: downloadFiles.length,
                statistics: {
                    passed: this.successCount,
                    failed: this.failureCount,
                    errors: this.errorCount,
                    total: downloadFiles.length
                },
                status: this.failureCount === 0 && this.errorCount === 0 ? 'PASSED' : 'FAILED',
                results: this.results
            };

            fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

            console.log('\n=== Batch Comparison Complete ===');
            console.log(`📊 Summary:`);
            console.log(`   Total Files: ${downloadFiles.length}`);
            console.log(`   ✅ Passed: ${this.successCount}`);
            console.log(`   ❌ Failed: ${this.failureCount}`);
            console.log(`   ⚠️  Errors: ${this.errorCount}`);
            console.log(`   Overall Status: ${summary.status}`);
            console.log(`   Full report: ${summaryPath}\n`);

            // If there were any failures or errors, throw an error to indicate test failure
            if (this.failureCount > 0 || this.errorCount > 0) {
                throw new Error(`Comparison failed: ${this.failureCount} failures, ${this.errorCount} errors`);
            }

            return summary;

        } catch (error) {
            console.error('❌ Batch comparison failed:', error.message);
            throw error;
        }
    }
}

module.exports = BatchDocumentComparer;