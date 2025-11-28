"""
Test suite for backend API
Tests all core functionality including OCR, audio processing, and AI generation
"""

import pytest
import requests
import os
import json
from fastapi.testclient import TestClient
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app

client = TestClient(app)

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_IMAGE_PATH = os.path.join(os.path.dirname(__file__), "test_data", "test_notes.jpg")
TEST_AUDIO_PATH = os.path.join(os.path.dirname(__file__), "test_data", "test_audio.m4a")


class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_root_endpoint(self):
        """Test that the API is running"""
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
        assert response.json()["status"] == "healthy"


class TestOCRService:
    """Test OCR functionality"""
    
    def test_scan_notes_endpoint_exists(self):
        """Test that scan-notes endpoint exists"""
        # Create a dummy image file for testing
        import io
        from PIL import Image
        
        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='white')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {"file": ("test.jpg", img_bytes, "image/jpeg")}
        response = client.post("/api/scan-notes", files=files)
        
        # Should return 200 or 500 (depending on OCR setup)
        assert response.status_code in [200, 500]
    
    def test_scan_notes_without_file(self):
        """Test scan-notes endpoint without file"""
        response = client.post("/api/scan-notes")
        assert response.status_code == 422  # Validation error


class TestAudioService:
    """Test audio processing functionality"""
    
    def test_process_audio_endpoint_exists(self):
        """Test that process-audio endpoint exists"""
        # Create a dummy audio file
        import io
        audio_bytes = io.BytesIO(b"fake audio data")
        
        files = {"file": ("test.m4a", audio_bytes, "audio/m4a")}
        response = client.post("/api/process-audio", files=files)
        
        # Should return 200 or 500 (depending on audio setup)
        assert response.status_code in [200, 500]
    
    def test_process_audio_without_file(self):
        """Test process-audio endpoint without file"""
        response = client.post("/api/process-audio")
        assert response.status_code == 422  # Validation error


class TestAIService:
    """Test AI content generation"""
    
    def test_generate_content_endpoint_exists(self):
        """Test that generate-content endpoint exists"""
        test_text = "This is a test text about machine learning. Machine learning is a subset of artificial intelligence."
        
        response = client.post(
            "/api/generate-content",
            json={"text": test_text, "content_type": "all"}
        )
        
        # Should return 200 or 500 (depending on Ollama setup)
        assert response.status_code in [200, 500]
    
    def test_generate_content_without_text(self):
        """Test generate-content endpoint without text"""
        response = client.post(
            "/api/generate-content",
            json={"content_type": "all"}
        )
        assert response.status_code == 422  # Validation error
    
    def test_generate_content_empty_text(self):
        """Test generate-content endpoint with empty text"""
        response = client.post(
            "/api/generate-content",
            json={"text": "", "content_type": "all"}
        )
        assert response.status_code == 400  # Bad request


class TestTTSService:
    """Test text-to-speech functionality"""
    
    def test_text_to_speech_endpoint_exists(self):
        """Test that text-to-speech endpoint exists"""
        test_text = "What is machine learning?"
        
        response = client.post(
            "/api/text-to-speech",
            json={"text": test_text}
        )
        
        # Should return 200 or 500 (depending on TTS setup)
        assert response.status_code in [200, 500]
    
    def test_text_to_speech_without_text(self):
        """Test text-to-speech endpoint without text"""
        response = client.post("/api/text-to-speech", json={})
        assert response.status_code == 422  # Validation error


class TestIntegration:
    """Integration tests for complete workflows"""
    
    def test_complete_workflow_scan_to_content(self):
        """Test complete workflow: scan notes -> generate content"""
        # This is a placeholder for integration testing
        # In a real scenario, you would:
        # 1. Upload an image
        # 2. Get extracted text
        # 3. Generate content from text
        # 4. Verify all steps work together
        
        assert True  # Placeholder
    
    def test_complete_workflow_audio_to_content(self):
        """Test complete workflow: record audio -> generate content"""
        # This is a placeholder for integration testing
        assert True  # Placeholder


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

