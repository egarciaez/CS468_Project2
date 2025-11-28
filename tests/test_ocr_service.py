"""
Unit tests for OCR Service
Tests text extraction from images using Tesseract OCR
"""

import pytest
import os
import sys
from PIL import Image, ImageDraw, ImageFont
import tempfile

# Add parent directory to path to import services
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'ocr-service'))

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def create_test_image_with_text(text: str) -> str:
    """Create a temporary image file with text for testing"""
    # Create a simple image with text
    img = Image.new('RGB', (400, 200), color='white')
    draw = ImageDraw.Draw(img)
    
    # Try to use a default font, fallback to basic if not available
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except:
        font = ImageFont.load_default()
    
    draw.text((10, 10), text, fill='black', font=font)
    
    # Save to temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
    img.save(temp_file.name)
    temp_file.close()
    
    return temp_file.name


class TestOCRService:
    """Test suite for OCR Service"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        assert "OCR Service" in response.json()["service"]
    
    def test_extract_text_from_image(self):
        """Test text extraction from a clear image"""
        # Create test image
        test_text = "Hello World\nThis is a test"
        image_path = create_test_image_with_text(test_text)
        
        try:
            with open(image_path, "rb") as f:
                files = {"file": ("test.jpg", f, "image/jpeg")}
                response = client.post("/extract", files=files)
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert "text" in data
            # OCR might not extract perfectly, but should return something
            assert len(data["text"]) > 0
        finally:
            os.unlink(image_path)
    
    def test_extract_text_invalid_file_type(self):
        """Test error handling for non-image files"""
        # Create a text file instead of image
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt')
        temp_file.write(b"This is not an image")
        temp_file.close()
        
        try:
            with open(temp_file.name, "rb") as f:
                files = {"file": ("test.txt", f, "text/plain")}
                response = client.post("/extract", files=files)
            
            assert response.status_code == 400
        finally:
            os.unlink(temp_file.name)
    
    def test_extract_text_empty_image(self):
        """Test handling of image with no text"""
        # Create blank image
        img = Image.new('RGB', (200, 200), color='white')
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        img.save(temp_file.name)
        temp_file.close()
        
        try:
            with open(temp_file.name, "rb") as f:
                files = {"file": ("blank.jpg", f, "image/jpeg")}
                response = client.post("/extract", files=files)
            
            assert response.status_code == 200
            data = response.json()
            # Should still return success, but with message about no text
            assert data["success"] is True
        finally:
            os.unlink(temp_file.name)
    
    def test_extract_text_missing_file(self):
        """Test error handling when no file is provided"""
        response = client.post("/extract")
        assert response.status_code == 422  # Validation error


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

