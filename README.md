# Integration Test Go Report

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

End-to-end testing suite for the Go Report application using Cypress, covering both frontend and backend functionalities.

## 📋 Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- Go Report application (frontend and backend) running locally

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-org/integration-test-go-report.git
cd integration-test-go-report
```

2. Install dependencies:
```bash
npm install
```

3. Install Cypress (if not already installed):
```bash
npm run install-cypress
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run cy:open` | Opens Cypress Test Runner in interactive mode |
| `npm run cy:test` | Runs Cypress tests in headless mode |
| `npm run start-document-compare` | Starts the document comparison service |

## 🏗️ Project Structure

```
integration-test-go-report/
├── cypress/
│   ├── e2e/           # Test files
│   ├── fixtures/      # Test data
│   └── support/       # Support files and commands
├── document_compare/  # Document comparison service
└── package.json      # Project configuration
```

## ⚙️ Configuration

### Package.json Details

```json
{
  "name": "integration-test-go-report",
  "version": "1.0.0",
  "description": "Cypress test for go report app (front and back)",
  "main": "index.js",
  "scripts": {
    "cy:open": "cypress open",
    "install-cypress": "npm install cypress --save-dev",
    "cy:test": "cypress run",
    "start-document-compare": "cd document_compare && npm run start"
  },
  "keywords": [],
  "author": "TMC",
  "license": "ISC",
  "devDependencies": {
    "cypress": "^13.15.0",
    "cypress-file-upload": "^5.0.8"
  }
}
```

## 🧪 Running Tests

### Interactive Mode
```bash
npm run cy:open
```
This will open the Cypress Test Runner, allowing you to run tests individually and watch them execute in real-time.

### Headless Mode
```bash
npm run cy:test
```
This will run all tests in headless mode, suitable for CI/CD pipelines.

## 📝 Writing Tests

Example test structure:
```javascript
describe('Document Comparison', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should upload and compare documents', () => {
    // Test implementation
  });
});
```

## 🔧 Dependencies

- [Cypress](https://www.cypress.io/) (^13.15.0) - Modern web testing framework
- [cypress-file-upload](https://www.npmjs.com/package/cypress-file-upload) (^5.0.8) - File upload support for Cypress

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

- TMC

## 🙏 Acknowledgments

- Cypress.io for their excellent testing framework
- All contributors to this project

## 🐛 Known Issues

Please report any bugs or issues in the GitHub issue tracker.
