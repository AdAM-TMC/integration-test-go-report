# Document Comparison Tool

This is a Node.js project that provides a script to compare Microsoft Word documents and generate detailed reports on any differences found.

## Features

- Batch processing of multiple Word documents
- Identification of additions, removals, and other differences
- Detailed reporting with paragraph-level context
- Navigation guidance to easily locate differences in the original documents
- Summary report with overall comparison status

## Usage

1. Install dependencies:

   ```bash
   npm install
   ```

2. Update the paths in the `src/index.js` file to match your local setup:

   ```javascript
   const downloadsPath = path.resolve('path/to/downloads/directory');
   const samplesPath = path.resolve('path/to/samples/directory');
   const reportsPath = path.resolve('path/to/reports/directory');
   ```

3. Run the comparison:

   ```bash
   npm start
   ```

This will compare all .docx files in the `downloads` directory against the corresponding files in the `samples` directory, and generate individual reports and a summary report in the `reports` directory.

## Report Format

The comparison reports are generated in JSON format and contain the following information:

- Timestamp of the comparison
- Names of the baseline and new version documents
- Summary statistics (total differences, additions, removals)
- Detailed list of differences with:
  - Difference type (Addition or Removal)
  - Difference content
  - Paragraph number and word position of the change
  - Surrounding paragraph context
- Step-by-step instructions on how to locate the differences in the original Word documents

## Navigation Tips

To easily navigate the differences in the Word documents:

1. Use `Ctrl+G` (Go To) to jump to the specific paragraph number listed in the report.
2. Once in the right paragraph, use `Ctrl+F` to search for the surrounding text context provided in the report.
3. Look for the difference around the specified word position within the paragraph.

## Future Improvements

- Add support for tracking formatting changes
- Create a HTML report with side-by-side document comparison
- Implement configurable difference thresholds
- Allow filtering of specific types of differences

## Contributing

If you find any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request.
