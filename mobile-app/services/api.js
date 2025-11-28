/**
 * API Service for communicating with the backend API Gateway
 * This service communicates with the microservice architecture
 */

// Use your computer's local IP address so your phone can connect
// Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
// Make sure your phone is on the same WiFi network
const API_BASE_URL = 'http://192.168.1.128:8000'; // Your computer's WiFi IP address

class StudyCoachAPI {
  /**
   * Scan notes from image (calls /api/scan endpoint)
   * @param {FormData} formData - FormData containing image file
   * @returns {Promise<Object>} Response with extracted text
   */
  static async scanNotes(formData) {
    try {
      console.log('Uploading image to:', `${API_BASE_URL}/api/scan`);
      
      // Don't set Content-Type header - browser will set it with boundary
      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error scanning notes:', error);
      // Check if it's a network error
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend. Make sure your phone and computer are on the same WiFi network and the backend is running at ' + API_BASE_URL);
      }
      throw error;
    }
  }

  /**
   * Process audio recording
   * @param {FormData} formData - FormData containing audio file
   * @returns {Promise<Object>} Response with transcribed text
   */
  static async processAudio(formData) {
    try {
      // Don't set Content-Type header - browser will set it with boundary
      const response = await fetch(`${API_BASE_URL}/api/process-audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    }
  }

  /**
   * Generate quiz from text (calls /api/generate_quiz endpoint)
   * @param {string} text - Input text
   * @param {string} quizType - Type of quiz: 'multiple_choice', 'fill_blank', 'short_answer', or 'all'
   * @returns {Promise<Object>} Response with generated quiz
   */
  static async generateQuiz(text, quizType = 'all') {
    try {
      // Ensure text is not empty
      if (!text || text.trim().length === 0) {
        throw new Error('Text input is required');
      }

      const requestBody = {
        text: text.trim(),
        quiz_type: quizType,
      };

      console.log('API Request to:', `${API_BASE_URL}/api/generate_quiz`);

      const response = await fetch(`${API_BASE_URL}/api/generate_quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Check if it's a network error
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend. Make sure your phone and computer are on the same WiFi network and the backend is running at ' + API_BASE_URL);
      }
      throw error;
    }
  }

  /**
   * Generate summary from text (calls /api/summary endpoint)
   * @param {string} text - Input text
   * @returns {Promise<Object>} Response with generated summary
   */
  static async generateSummary(text) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text input is required');
      }

      const requestBody = {
        text: text.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/api/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  /**
   * Generate flashcards from text (calls /api/generate_flashcards endpoint)
   * @param {string} text - Input text
   * @returns {Promise<Object>} Response with generated flashcards
   */
  static async generateFlashcards(text) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text input is required');
      }

      const requestBody = {
        text: text.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/api/generate_flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw error;
    }
  }

  /**
   * Generate all content (quiz, summary, flashcards) - convenience method
   * @param {string} text - Input text
   * @returns {Promise<Object>} Response with all generated content
   */
  static async generateAllContent(text) {
    try {
      const [quizResult, summaryResult, flashcardsResult] = await Promise.all([
        this.generateQuiz(text, 'multiple_choice').catch(e => ({ success: false, error: e.message })),
        this.generateSummary(text).catch(e => ({ success: false, error: e.message })),
        this.generateFlashcards(text).catch(e => ({ success: false, error: e.message })),
      ]);

      return {
        success: true,
        content: {
          quiz: quizResult.success ? quizResult.quiz : null,
          summary: summaryResult.success ? summaryResult.summary : null,
          flashcards: flashcardsResult.success ? flashcardsResult.flashcards : null,
        },
      };
    } catch (error) {
      console.error('Error generating all content:', error);
      throw error;
    }
  }
}

export default StudyCoachAPI;


