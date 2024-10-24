const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const diff = require('diff');

class DocumentComparer {
    constructor(baselinePath, newVersionPath, outputPath) {
        this.baselinePath = baselinePath;
        this.newVersionPath = newVersionPath;
        this.outputPath = outputPath;
        this.differences = [];
    }

    async extractTextFromDoc(docPath) {
        try {
            const buffer = fs.readFileSync(docPath);
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } catch (error) {
            throw new Error(`Error extracting text from ${docPath}: ${error.message}`);
        }
    }

    async compareDocuments() {
        try {
            // Extract text from both documents
            const baselineText = await this.extractTextFromDoc(this.baselinePath);
            const newVersionText = await this.extractTextFromDoc(this.newVersionPath);

            // Compare texts
            const changes = diff.diffWords(baselineText, newVersionText);

            // Process differences
            changes.forEach((part, index) => {
                if (part.added) {
                    this.differences.push({
                        type: 'Addition',
                        content: part.value,
                        position: this.findPosition(changes, index)
                    });
                }
                if (part.removed) {
                    this.differences.push({
                        type: 'Removal',
                        content: part.value,
                        position: this.findPosition(changes, index)
                    });
                }
            });

            // Generate report
            this.generateReport();

            return {
                hasDifferences: this.differences.length > 0,
                differenceCount: this.differences.length,
                reportPath: this.outputPath
            };
        } catch (error) {
            throw new Error(`Comparison failed: ${error.message}`);
        }
    }

    findPosition(changes, currentIndex) {
        let position = 0;
        for (let i = 0; i < currentIndex; i++) {
            if (!changes[i].removed) {
                position += changes[i].value.length;
            }
        }
        return position;
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            baselineDocument: path.basename(this.baselinePath),
            newVersionDocument: path.basename(this.newVersionPath),
            differences: this.differences,
            summary: {
                totalDifferences: this.differences.length,
                additions: this.differences.filter(d => d.type === 'Addition').length,
                removals: this.differences.filter(d => d.type === 'Removal').length
            }
        };

        fs.writeFileSync(
            this.outputPath,
            JSON.stringify(report, null, 2),
            'utf8'
        );
    }
}

module.exports = DocumentComparer;