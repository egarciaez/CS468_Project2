# Contributing to AI Context-Aware Study Coach

Thank you for your interest in contributing to the Study Coach project!

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone <your-fork-url>
   cd studyCoach
   ```

2. **Set Up Docker Services**
   ```bash
   # On Linux/Mac
   ./setup.sh
   
   # On Windows
   .\setup.ps1
   ```

3. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Mobile App
   cd ../mobile-app
   npm install
   ```

## Development Guidelines

### Code Style

- **Python**: Follow PEP 8 style guide
- **JavaScript**: Follow ESLint configuration
- **Documentation**: Add docstrings to all functions and classes
- **Comments**: Explain complex logic and non-trivial operations

### Testing

- Write tests for all new features
- Ensure all tests pass before submitting PR
- Add test cases for edge cases and error handling

### Commit Messages

Use clear, descriptive commit messages:
```
feat: Add flashcard export functionality
fix: Resolve OCR text extraction issue
docs: Update API documentation
test: Add integration tests for audio processing
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add/update tests
4. Update documentation if needed
5. Ensure all tests pass
6. Submit pull request with clear description

## Reporting Issues

When reporting issues, please include:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Docker version, etc.)
- Relevant logs or error messages

## Code Review

All contributions require review. Please be patient and responsive to feedback.

Thank you for contributing!

