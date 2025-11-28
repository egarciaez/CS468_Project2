"""
Unit tests for API Gateway/Orchestrator Service
Tests orchestration logic and service coordination
"""

import pytest
import os
import sys
from unittest.mock import Mock, patch, MagicMock
import json

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'api-gateway'))

from main import app, _parse_json_array
from fastapi.testclient import TestClient

client = TestClient(app)


class TestAPIGateway:
    """Test suite for API Gateway"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        with patch('requests.get') as mock_get:
            # Mock OCR service response
            mock_ocr = Mock()
            mock_ocr.status_code = 200
            mock_ocr.json.return_value = {"status": "healthy"}
            
            # Mock Ollama response
            mock_ollama = Mock()
            mock_ollama.status_code = 200
            
            mock_get.side_effect = [mock_ocr, mock_ollama]
            
            response = client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert "services" in data
    
    def test_parse_json_array_valid(self):
        """Test JSON array parsing with valid input"""
        valid_json = '[{"question": "Test?", "answer": "Yes"}]'
        result = _parse_json_array(valid_json)
        assert isinstance(result, list)
        assert len(result) == 1
        assert result[0]["question"] == "Test?"
    
    def test_parse_json_array_with_extra_text(self):
        """Test JSON array parsing with extra text around JSON"""
        text_with_json = 'Here is the JSON:\n[{"key": "value"}]\nThat was it.'
        result = _parse_json_array(text_with_json)
        assert isinstance(result, list)
        assert len(result) == 1
        assert result[0]["key"] == "value"
    
    def test_parse_json_array_invalid(self):
        """Test JSON array parsing with invalid input"""
        invalid_json = "This is not JSON"
        result = _parse_json_array(invalid_json)
        # Should return empty array on parse error
        assert isinstance(result, list)
        assert len(result) == 0
    
    @patch('requests.post')
    def test_scan_endpoint_success(self, mock_post):
        """Test scan endpoint with successful OCR"""
        # Mock OCR service response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": True,
            "text": "Extracted text from image"
        }
        mock_post.return_value = mock_response
        
        # Create test file
        import tempfile
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        temp_file.write(b"fake image data")
        temp_file.close()
        
        try:
            with open(temp_file.name, "rb") as f:
                files = {"file": ("test.jpg", f, "image/jpeg")}
                response = client.post("/api/scan", files=files)
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["text"] == "Extracted text from image"
        finally:
            os.unlink(temp_file.name)
    
    @patch('requests.post')
    def test_generate_quiz_endpoint(self, mock_post):
        """Test quiz generation endpoint"""
        # Mock Ollama response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "response": '[{"question": "What is AI?", "answer": "Artificial Intelligence"}]'
        }
        mock_post.return_value = mock_response
        
        request_data = {
            "text": "AI stands for Artificial Intelligence. It is the simulation of human intelligence.",
            "quiz_type": "short_answer"
        }
        
        response = client.post("/api/generate_quiz", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "quiz" in data
    
    def test_generate_quiz_empty_text(self):
        """Test quiz generation with empty text"""
        request_data = {
            "text": "",
            "quiz_type": "all"
        }
        
        response = client.post("/api/generate_quiz", json=request_data)
        assert response.status_code == 400


class TestEdgeCases:
    """Edge case tests for API Gateway"""
    
    @patch('requests.post')
    def test_scan_with_blurry_image(self, mock_post):
        """Test handling of blurry/low-quality images"""
        # OCR service might return minimal or no text
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": True,
            "text": "No text could be extracted from the image."
        }
        mock_post.return_value = mock_response
        
        import tempfile
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        temp_file.write(b"blurry image")
        temp_file.close()
        
        try:
            with open(temp_file.name, "rb") as f:
                files = {"file": ("blurry.jpg", f, "image/jpeg")}
                response = client.post("/api/scan", files=files)
            
            # Should still return success, but with message
            assert response.status_code == 200
        finally:
            os.unlink(temp_file.name)
    
    @patch('requests.post')
    def test_scan_with_very_short_text(self, mock_post):
        """Test handling of very short extracted text"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": True,
            "text": "Hi"
        }
        mock_post.return_value = mock_response
        
        import tempfile
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        temp_file.write(b"short text image")
        temp_file.close()
        
        try:
            with open(temp_file.name, "rb") as f:
                files = {"file": ("short.jpg", f, "image/jpeg")}
                response = client.post("/api/scan", files=files)
            
            assert response.status_code == 200
            # Should handle short text gracefully
        finally:
            os.unlink(temp_file.name)
    
    @patch('requests.post')
    def test_llm_service_timeout(self, mock_post):
        """Test handling of LLM service timeout"""
        import requests
        mock_post.side_effect = requests.exceptions.Timeout("Request timed out")
        
        request_data = {
            "text": "Test text for quiz generation",
            "quiz_type": "all"
        }
        
        response = client.post("/api/generate_quiz", json=request_data)
        # Should return error status
        assert response.status_code == 500
    
    @patch('requests.post')
    def test_ocr_service_unavailable(self, mock_post):
        """Test handling when OCR service is unavailable"""
        import requests
        mock_post.side_effect = requests.exceptions.ConnectionError("Service unavailable")
        
        import tempfile
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        temp_file.write(b"test image")
        temp_file.close()
        
        try:
            with open(temp_file.name, "rb") as f:
                files = {"file": ("test.jpg", f, "image/jpeg")}
                response = client.post("/api/scan", files=files)
            
            # Should return service unavailable status
            assert response.status_code == 503
        finally:
            os.unlink(temp_file.name)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

