# Setup and Run Guide - AI Study Coach

This guide provides step-by-step instructions for setting up and running the complete AI Study Coach system.

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm (for mobile app development)
- Expo CLI (for React Native app)
- A mobile device or emulator for testing

## Quick Start

### 1. Start All Services

```bash
# Navigate to project root
cd /path/to/studyCoach

# Start all microservices
docker-compose up -d

# Check service status
docker-compose ps
```

### 2. Pull Ollama Model

```bash
# Pull the llama3 model (first time only, may take several minutes)
docker exec study-coach-ollama ollama pull llama3

# Verify model is available
docker exec study-coach-ollama ollama list
```

### 3. Verify Services

```bash
# Check API Gateway
curl http://localhost:8000/health

# Check OCR Service
curl http://localhost:8001/health

# Check Ollama
curl http://localhost:11434/api/tags
```

### 4. Start Mobile App

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies (first time only)
npm install

# Start Expo development server
npm start

# Or use Expo CLI directly
expo start
```

### 5. Connect Mobile Device

1. **Find your computer's IP address**:
   - Windows: `ipconfig` (look for IPv4 address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Update API URL in mobile app**:
   - Edit `mobile-app/services/api.js`
   - Change `API_BASE_URL` to your computer's IP:
     ```javascript
     const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000';
     ```

3. **Connect device**:
   - Ensure phone and computer are on the same WiFi network
   - Scan QR code from Expo or enter URL manually
   - App should connect to backend

## Detailed Setup

### Docker Services

The system consists of three Docker services:

1. **OCR Service** (Port 8001)
   - Handles text extraction from images
   - Uses Tesseract OCR

2. **Ollama LLM Service** (Port 11434)
   - Runs LLM models for content generation
   - Stores models in persistent volume

3. **API Gateway** (Port 8000)
   - Orchestrates all services
   - Main entry point for mobile app

### Service Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api-gateway
docker-compose logs -f ocr-service
docker-compose logs -f ollama
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears Ollama models)
docker-compose down -v
```

## Testing the System

### 1. Test OCR Service

```bash
# Using curl with a test image
curl -X POST http://localhost:8001/extract \
  -F "file=@path/to/test_image.jpg"
```

### 2. Test API Gateway

```bash
# Test scan endpoint
curl -X POST http://localhost:8000/api/scan \
  -F "file=@path/to/test_image.jpg"

# Test quiz generation (use extracted text from above)
curl -X POST http://localhost:8000/api/generate_quiz \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Machine Learning is a subset of AI. It uses algorithms to learn from data.",
    "quiz_type": "all"
  }'
```

### 3. Run Automated Tests

```bash
# Install test dependencies
pip install -r tests/requirements.txt

# Run all tests
pytest tests/ -v

# Run specific test suite
pytest tests/test_ocr_service.py -v
pytest tests/test_api_gateway.py -v
pytest tests/test_integration.py -v
```

## Troubleshooting

### Services Not Starting

```bash
# Check Docker status
docker ps

# Check for port conflicts
netstat -an | grep 8000
netstat -an | grep 8001
netstat -an | grep 11434

# Restart services
docker-compose restart
```

### Ollama Model Not Found

```bash
# Check if model exists
docker exec study-coach-ollama ollama list

# Pull model if missing
docker exec study-coach-ollama ollama pull llama3

# Try alternative model
docker exec study-coach-ollama ollama pull mistral
# Then update OLLAMA_MODEL in docker-compose.yml
```

### Mobile App Can't Connect

1. **Check IP address**:
   - Ensure mobile app has correct IP
   - Verify computer and phone are on same network

2. **Check firewall**:
   - Allow port 8000 through firewall
   - Windows: Check Windows Firewall settings
   - Mac/Linux: Check firewall rules

3. **Test connection**:
   ```bash
   # From phone browser, try:
   http://YOUR_IP:8000/health
   ```

### OCR Not Working

```bash
# Check Tesseract installation
docker exec study-coach-ocr tesseract --version

# Check OCR service logs
docker-compose logs ocr-service

# Test OCR directly
docker exec study-coach-ocr python -c "import pytesseract; print('OK')"
```

### LLM Generation Failing

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Check model availability
docker exec study-coach-ollama ollama list

# Test Ollama directly
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Hello",
  "stream": false
}'
```

## Environment Variables

### API Gateway

Edit `docker-compose.yml` to change:

```yaml
environment:
  - OCR_SERVICE_URL=http://ocr-service:8001
  - LLM_SERVICE_URL=http://ollama:11434
  - OLLAMA_MODEL=llama3  # Change model here
  - TTS_ENABLED=true
```

### OCR Service

```yaml
environment:
  - TESSERACT_CMD=/usr/bin/tesseract
```

## Development Mode

### Hot Reload

Services are configured for development with volume mounts:

```yaml
volumes:
  - ./api-gateway:/app
  - ./ocr-service:/app
```

Changes to code will be reflected after service restart:

```bash
docker-compose restart api-gateway
docker-compose restart ocr-service
```

### Debugging

```bash
# Access service containers
docker exec -it study-coach-gateway bash
docker exec -it study-coach-ocr bash
docker exec -it study-coach-ollama bash

# View real-time logs
docker-compose logs -f --tail=100
```

## Production Deployment

For production:

1. **Remove volume mounts** (use COPY in Dockerfile)
2. **Set specific model versions** in docker-compose.yml
3. **Configure proper CORS** origins in API Gateway
4. **Set up reverse proxy** (nginx) for API Gateway
5. **Use environment files** for secrets
6. **Enable HTTPS** for API Gateway

## Next Steps

- Read `DESIGN.md` for architecture details
- Read `AI_CODE_DOCUMENTATION.md` for AI code details
- Read `tests/TESTING_WALKTHROUGH.md` for testing guide
- Review `QUICK_START.md` for mobile app setup

## Support

For issues:
1. Check service logs: `docker-compose logs`
2. Review `TROUBLESHOOTING.md`
3. Run tests: `pytest tests/ -v`
4. Check service health: `curl http://localhost:8000/health`

