# Quick Start Guide

## Prerequisites Check

```bash
# Check Docker
docker --version
docker-compose --version

# Check Python (for local development)
python --version  # Should be 3.11+

# Check Node.js (for mobile app)
node --version
npm --version
```

## 5-Minute Setup

### Step 1: Start Services
```bash
# Linux/Mac
./setup.sh

# Windows PowerShell
.\setup.ps1

# Or manually:
docker-compose up -d
docker exec study-coach-ollama ollama pull llama3
```

### Step 2: Verify Backend
```bash
curl http://localhost:8000/
# Should return: {"message":"Study Coach API is running","status":"healthy"}
```

### Step 3: Test API
```bash
# Test health
curl http://localhost:8000/

# Test content generation (requires text input)
curl -X POST http://localhost:8000/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{"text": "Machine learning is a subset of AI.", "content_type": "summary"}'
```

### Step 4: Run Tests
```bash
# Install test dependencies
pip install -r tests/requirements.txt
pip install -r backend/requirements.txt

# Run tests
pytest tests/test_backend.py -v
```

## Mobile App Setup

```bash
cd mobile-app
npm install
npm start

# Then:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on your phone
```

## Common Commands

### Docker Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f ollama

# Restart a service
docker-compose restart backend
```

### Ollama Management
```bash
# Pull a model
docker exec study-coach-ollama ollama pull llama3

# List models
docker exec study-coach-ollama ollama list

# Test Ollama directly
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

### Backend Development
```bash
# Run locally (without Docker)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Run tests
pytest tests/test_backend.py -v
```

## Troubleshooting

### Service Not Starting
```bash
# Check container status
docker ps -a

# Check logs
docker-compose logs

# Rebuild containers
docker-compose up -d --build
```

### Ollama Connection Issues
```bash
# Verify Ollama is running
docker ps | grep ollama

# Test connection
curl http://localhost:11434/api/tags

# Restart Ollama
docker-compose restart ollama
```

### Port Already in Use
```bash
# Check what's using the port
# Linux/Mac
lsof -i :8000
# Windows
netstat -ano | findstr :8000

# Change port in docker-compose.yml if needed
```

## Next Steps

1. Read [README.md](README.md) for detailed documentation
2. Review [DESIGN.md](DESIGN.md) for architecture details
3. Check [TESTING_REPORT.md](TESTING_REPORT.md) for testing information
4. See [REFLECTION.md](REFLECTION.md) for development insights

## Getting Help

- Check the documentation files
- Review error logs: `docker-compose logs`
- Test individual services
- Check GitHub issues (if applicable)

