# Testing Walkthrough

This document provides a comprehensive guide to testing the AI Study Coach system, including unit tests, integration tests, and edge case handling.

## Test Structure

```
tests/
├── test_ocr_service.py      # Unit tests for OCR microservice
├── test_api_gateway.py      # Unit tests for API Gateway/Orchestrator
├── test_integration.py      # End-to-end integration tests
├── test_data/              # Test data files
└── requirements.txt         # Test dependencies
```

## Running Tests

### Prerequisites

1. Install test dependencies:
```bash
pip install -r tests/requirements.txt
```

2. Ensure services are running (for integration tests):
```bash
docker-compose up -d
```

### Run All Tests

```bash
pytest tests/ -v
```

### Run Specific Test Suites

```bash
# OCR Service tests only
pytest tests/test_ocr_service.py -v

# API Gateway tests only
pytest tests/test_api_gateway.py -v

# Integration tests only
pytest tests/test_integration.py -v
```

## Test Categories

### 1. Unit Tests

#### OCR Service Tests (`test_ocr_service.py`)

- **test_health_check**: Verifies health endpoint
- **test_extract_text_from_image**: Tests text extraction from clear images
- **test_extract_text_invalid_file_type**: Tests error handling for non-image files
- **test_extract_text_empty_image**: Tests handling of images with no text
- **test_extract_text_missing_file**: Tests validation error handling

#### API Gateway Tests (`test_api_gateway.py`)

- **test_health_check**: Verifies service health monitoring
- **test_parse_json_array_valid**: Tests JSON parsing logic
- **test_scan_endpoint_success**: Tests image scanning workflow
- **test_generate_quiz_endpoint**: Tests quiz generation
- **test_generate_quiz_empty_text**: Tests input validation

### 2. Integration Tests

#### End-to-End Workflows (`test_integration.py`)

- **test_complete_workflow_scan_to_quiz**: Full workflow from image to quiz
- **test_scan_summary_workflow**: Image scan to summary generation
- **test_error_handling_invalid_image**: Error handling for invalid inputs
- **test_service_health_checks**: Service availability verification

### 3. Edge Case Tests

#### Edge Cases in `test_api_gateway.py`

- **test_scan_with_blurry_image**: Handles low-quality images
- **test_scan_with_very_short_text**: Handles minimal text extraction
- **test_llm_service_timeout**: Handles LLM service timeouts
- **test_ocr_service_unavailable**: Handles service unavailability

#### Edge Cases in `test_integration.py`

- **test_low_light_image_simulation**: Handles dark/poorly lit images
- **test_very_long_text**: Handles very long extracted text

## Debugging Failed Tests

### Example: Debugging a Failed OCR Test

**Scenario**: `test_extract_text_from_image` fails

**Steps to Debug**:

1. **Check test output**:
```bash
pytest tests/test_ocr_service.py::TestOCRService::test_extract_text_from_image -v -s
```

2. **Verify OCR service is running**:
```bash
curl http://localhost:8001/health
```

3. **Check Tesseract installation**:
```bash
docker exec study-coach-ocr tesseract --version
```

4. **Test OCR manually**:
```python
from PIL import Image
import pytesseract

img = Image.open("test_image.jpg")
text = pytesseract.image_to_string(img)
print(text)
```

5. **Check logs**:
```bash
docker logs study-coach-ocr
```

### Example: Debugging a Failed Integration Test

**Scenario**: `test_complete_workflow_scan_to_quiz` fails

**Steps to Debug**:

1. **Check service availability**:
```bash
# Check API Gateway
curl http://localhost:8000/health

# Check OCR Service
curl http://localhost:8001/health

# Check Ollama
curl http://localhost:11434/api/tags
```

2. **Verify Ollama model is available**:
```bash
docker exec study-coach-ollama ollama list
```

3. **Pull model if missing**:
```bash
docker exec study-coach-ollama ollama pull llama3
```

4. **Test workflow manually**:
```bash
# Step 1: Scan image
curl -X POST http://localhost:8000/api/scan \
  -F "file=@test_image.jpg"

# Step 2: Generate quiz (use extracted text from step 1)
curl -X POST http://localhost:8000/api/generate_quiz \
  -H "Content-Type: application/json" \
  -d '{"text": "Your extracted text here", "quiz_type": "all"}'
```

5. **Check service logs**:
```bash
docker logs study-coach-gateway
docker logs study-coach-ocr
docker logs study-coach-ollama
```

## Common Test Failures and Fixes

### 1. OCR Service Not Available

**Error**: `ConnectionError: Service unavailable`

**Fix**:
```bash
docker-compose up -d ocr-service
# Wait for service to start
sleep 5
pytest tests/test_ocr_service.py -v
```

### 2. Ollama Model Not Found

**Error**: `Failed to generate content with AI: model not found`

**Fix**:
```bash
docker exec study-coach-ollama ollama pull llama3
```

### 3. Test Timeout

**Error**: `TimeoutError: Request timed out`

**Fix**: Increase timeout in test or check service performance:
```python
# In test file, increase timeout
response = requests.post(url, json=data, timeout=300)  # 5 minutes
```

### 4. JSON Parsing Errors

**Error**: `JSONDecodeError: Expecting value`

**Fix**: Check LLM response format. The `_parse_json_array` function should handle this, but verify:
```python
# Check what LLM actually returned
print(f"LLM Response: {response_text}")
```

## Test Coverage Goals

- **Unit Tests**: >80% code coverage
- **Integration Tests**: All critical workflows covered
- **Edge Cases**: All identified edge cases tested

## Continuous Integration

Tests should be run:
- Before each commit
- In CI/CD pipeline
- After major changes
- Before releases

## Adding New Tests

When adding new features:

1. Add unit tests for new service methods
2. Add integration tests for new workflows
3. Add edge case tests for error conditions
4. Update this walkthrough with new test scenarios

## Test Data Management

- Use temporary files for test images (created in tests)
- Clean up test files after tests complete
- Use realistic but simple test data
- Avoid committing large test files to repository

