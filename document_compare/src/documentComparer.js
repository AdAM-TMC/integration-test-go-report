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
            // Extract both raw text and structured content
            const [rawResult, structuredResult] = await Promise.all([
                mammoth.extractRawText({ buffer }),
                mammoth.convert({ buffer }, {
                    styleMap: [
                        "p[style-name='Heading 1'] => h1:fresh",
                        "p[style-name='Heading 2'] => h2:fresh",
                        "p[style-name='Heading 3'] => h3:fresh"
                    ]
                })
            ]);

            return {
                raw: rawResult.value,
                structured: structuredResult.value,
                // Split text into paragraphs for better context
                paragraphs: rawResult.value.split('\n').filter(p => p.trim())
            };
        } catch (error) {
            throw new Error(`Error extracting text from ${docPath}: ${error.message}`);
        }
    }

    findContextInParagraphs(text, paragraphs) {
        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            if (paragraph.includes(text)) {
                return {
                    paragraphNumber: i + 1,
                    paragraph: paragraph.trim(),
                    beforeParagraph: i > 0 ? paragraphs[i - 1].trim() : null,
                    afterParagraph: i < paragraphs.length - 1 ? paragraphs[i + 1].trim() : null,
                    // Calculate approximate word position in paragraph
                    wordPosition: paragraph.substring(0, paragraph.indexOf(text)).split(/\s+/).length + 1
                };
            }
        }
        return null;
    }

    async compareDocuments() {
        try {
            // Extract text from both documents
            const baselineContent = await this.extractTextFromDoc(this.baselinePath);
            const newContent = await this.extractTextFromDoc(this.newVersionPath);

            // Compare texts
            const changes = diff.diffWords(baselineContent.raw, newContent.raw);

            // Process differences
            changes.forEach((part, index) => {
                if (part.added || part.removed) {
                    const type = part.added ? 'Addition' : 'Removal';
                    const content = part.value;
                    
                    // Find context in appropriate document
                    const context = this.findContextInParagraphs(
                        content,
                        type === 'Addition' ? newContent.paragraphs : baselineContent.paragraphs
                    );

                    if (context) {
                        this.differences.push({
                            type,
                            content: content.trim(),
                            location: {
                                paragraphNumber: context.paragraphNumber,
                                wordPosition: context.wordPosition,
                                paragraphContext: {
                                    before: context.beforeParagraph,
                                    current: context.paragraph,
                                    after: context.afterParagraph
                                }
                            },
                            navigationGuide: `To locate this ${type.toLowerCase()}:\n` +
                                `1. Go to paragraph ${context.paragraphNumber}\n` +
                                `2. Look for text around word position ${context.wordPosition}\n` +
                                `3. Search for the surrounding context:\n` +
                                `   ${context.paragraph.substring(0, 100)}...`
                        });
                    }
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

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            baselineDocument: path.basename(this.baselinePath),
            newVersionDocument: path.basename(this.newVersionPath),
            summary: {
                totalDifferences: this.differences.length,
                additions: this.differences.filter(d => d.type === 'Addition').length,
                removals: this.differences.filter(d => d.type === 'Removal').length
            },
            differences: this.differences.map((diff, index) => ({
                id: index + 1,
                ...diff,
                howToFind: diff.navigationGuide
            })),
            navigationTips: [
                "1. Use Ctrl+G (Go To) in Word to quickly navigate to specific paragraphs",
                "2. Use Ctrl+F (Find) to search for the surrounding text context",
                "3. Look for the content around the specified word position in the paragraph"
            ]
        };

        fs.writeFileSync(
            this.outputPath,
            JSON.stringify(report, null, 2),
            'utf8'
        );
    }
}

module.exports = DocumentComparer;