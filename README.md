# AI Context-Aware Study Coach

A complete microservice-based mobile application that uses the phone camera (hardware input) to scan notes and provides AI-generated quizzes, summaries, and flashcards. Features hardware outputs including display, TTS audio, and vibration alerts.

## Features

- 📷 **Camera Input**: Scan handwritten or printed notes using phone camera (hardware input)
- 🤖 **AI-Powered Quiz Generation**: 
  - Multiple choice questions
  - Fill-in-the-blank questions
  - Short answer questions
  - Flashcards
  - Summaries
- 📱 **Hardware Outputs**:
  - Display: Quiz questions with tap-to-reveal answers
  - TTS Audio: Read questions aloud
  - Vibration: Haptic feedback for interactions
- 🏗️ **Microservice Architecture**: 
  - OCR Service (standalone)
  - API Gateway/Orchestrator
  - Ollama LLM Service
- 🐳 **Dockerized**: Complete Docker Compose setup
- 🧠 **Ollama Integration**: Local LLM for privacy
- ✅ **50%+ AI-Generated Code**: Integration code, API interfaces, prompts

## Project Structure

```
studyCoach/
├── ocr-service/            # OCR Microservice (FastAPI)
│   ├── main.py            # OCR service application
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # OCR container config
├── api-gateway/           # API Gateway/Orchestrator (FastAPI)
│   ├── main.py           # Gateway application
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Gateway container config
├── mobile-app/            # React Native mobile app
│   ├── App.js            # Main app component
│   ├── services/         # API service layer
│   │   └── api.js        # API Gateway client
│   └── package.json      # Node dependencies
├── tests/                 # Comprehensive test suite
│   ├── test_ocr_service.py    # OCR unit tests
│   ├── test_api_gateway.py    # Gateway unit tests
│   ├── test_integration.py    # Integration tests
│   ├── TESTING_WALKTHROUGH.md  # Testing guide
│   └── requirements.txt       # Test dependencies
├── docker-compose.yml     # Docker orchestration (all services)
├── DESIGN.md             # Complete architecture design
├── AI_CODE_DOCUMENTATION.md # AI-generated code documentation
├── SETUP_AND_RUN.md      # Setup and run instructions
└── README.md             # This file
```

## Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js and npm (for mobile app development)
- Expo CLI (for React Native development)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd studyCoach
```

### 2. Start Docker Services

```bash
# Start all microservices (OCR, API Gateway, Ollama)
docker-compose up -d

# Pull the Ollama model (first time only, may take several minutes)
docker exec study-coach-ollama ollama pull llama3

# Verify model is available
docker exec study-coach-ollama ollama list
```

### 3. Verify Services

```bash
# Check API Gateway health
curl http://localhost:8000/health

# Check OCR Service health
curl http://localhost:8001/health

# Check Ollama
curl http://localhost:11434/api/tags
```

### 4. Run Tests

```bash
# Install test dependencies
pip install -r tests/requirements.txt
pip install -r backend/requirements.txt

# Run tests
pytest tests/test_backend.py -v
```

### 5. Start Mobile App

```bash
cd mobile-app
npm install
npm start
```

## API Endpoints

### API Gateway Endpoints

**Health Check**
```
GET /health
```

**Scan Image (OCR)**
```
POST /api/scan
Content-Type: multipart/form-data
Body: file (image file)
Response: {"success": true, "text": "extracted text"}
```

**Generate Quiz**
```
POST /api/generate_quiz
Content-Type: application/json
Body: {
  "text": "extracted text",
  "quiz_type": "all" | "multiple_choice" | "fill_blank" | "short_answer"
}
Response: {
  "success": true,
  "quiz": {
    "multiple_choice": [...],
    "fill_blank": [...],
    "short_answer": [...]
  }
}
```

**Generate Summary**
```
POST /api/summary
Content-Type: application/json
Body: {"text": "extracted text"}
Response: {"success": true, "summary": "..."}
```

**Generate Flashcards**
```
POST /api/generate_flashcards
Content-Type: application/json
Body: {"text": "extracted text"}
Response: {"success": true, "flashcards": [...]}
```

### OCR Service Endpoints

**Health Check**
```
GET /health
```

**Extract Text**
```
POST /extract
Content-Type: multipart/form-data
Body: file (image file)
Response: {"success": true, "text": "extracted text"}
```

## Configuration

### Environment Variables

**API Gateway** (in `docker-compose.yml`):
- `OCR_SERVICE_URL`: OCR service URL (default: `http://ocr-service:8001`)
- `LLM_SERVICE_URL`: Ollama service URL (default: `http://ollama:11434`)
- `OLLAMA_MODEL`: LLM model name (default: `llama3`)
- `TTS_ENABLED`: Enable TTS features (default: `true`)

**OCR Service** (in `docker-compose.yml`):
- `TESSERACT_CMD`: Tesseract executable path (default: `/usr/bin/tesseract`)

**Mobile App** (in `mobile-app/services/api.js`):
- Update `API_BASE_URL` to your computer's IP address (e.g., `http://192.168.1.128:8000`)

## Development

### Backend Development

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run locally (requires Ollama running)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Mobile App Development

```bash
cd mobile-app
npm install
npm start

# For iOS
npm run ios

# For Android
npm run android
```

## Testing

### Run All Tests
```bash
# Install test dependencies
pip install -r tests/requirements.txt

# Run all tests
pytest tests/ -v
```

### Run Specific Test Suites
```bash
# OCR Service tests
pytest tests/test_ocr_service.py -v

# API Gateway tests
pytest tests/test_api_gateway.py -v

# Integration tests
pytest tests/test_integration.py -v
```

### Run with Coverage
```bash
pytest tests/ --cov=api-gateway --cov=ocr-service --cov-report=html
```

See `tests/TESTING_WALKTHROUGH.md` for comprehensive testing documentation.

## Troubleshooting

### Ollama Service Not Available
```bash
# Check if Ollama container is running
docker ps | grep ollama

# Restart Ollama
docker-compose restart ollama

# Pull model if missing
docker exec study-coach-ollama ollama pull llama3
```

### OCR Not Working
- Ensure Tesseract is installed in the Docker container
- Check image quality and format (JPEG, PNG supported)
- Verify file upload is successful

### Audio Transcription Issues
- Ensure audio file format is supported (M4A, WAV, MP3)
- Check audio quality and clarity
- Verify Whisper service is configured (if using API)

## Documentation

- **DESIGN.md**: Complete architecture design with microservice diagrams, data flow, and AI tool mapping
- **AI_CODE_DOCUMENTATION.md**: Detailed documentation of AI-generated code (50%+ requirement)
- **SETUP_AND_RUN.md**: Step-by-step setup and run instructions
- **tests/TESTING_WALKTHROUGH.md**: Comprehensive testing guide with debugging walkthroughs
- **TESTING_REPORT.md**: Testing documentation with results
- **REFLECTION.md**: Development reflection on AI-assisted development experience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is developed for educational purposes as part of an AI-assisted development assignment.

## Authors

- awagne30
- melvinczyk

## Acknowledgments

- Ollama for providing local LLM capabilities
- Tesseract OCR for text extraction
- FastAPI for the web framework
- React Native and Expo for mobile development

