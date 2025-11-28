/**
 * AI Context-Aware Study Coach - Mobile App
 * Main React Native application component
 * 
 * Features:
 * - Camera input for scanning notes (hardware input)
 * - Quiz display with multiple question types (hardware output - display)
 * - TTS for reading questions (hardware output - audio)
 * - Vibration alerts for spaced repetition (hardware output - haptic)
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import StudyCoachAPI from './services/api';

// Use your computer's local IP address so your phone can connect
// Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
// Make sure your phone is on the same WiFi network
const API_BASE_URL = 'http://192.168.1.128:8000'; // Your computer's WiFi IP address

export default function App() {
  const [mode, setMode] = useState('home'); // 'home', 'results'
  const [extractedText, setExtractedText] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({}); // Track which answers are revealed
  const [selectedOptions, setSelectedOptions] = useState({}); // Track selected multiple choice answers

  // Request permissions on mount
  React.useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        console.log('Camera permission not granted');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  /**
   * Handle scanning notes from camera
   * This is the hardware input - phone camera
   */
  const handleScanNotes = async () => {
    try {
      setLoading(true);
      
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to scan notes');
        setLoading(false);
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images', // String value works across all expo-image-picker versions
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Upload image to backend
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'notes.jpg',
        });

        // Step 1: Scan image (OCR)
        const scanResponse = await StudyCoachAPI.scanNotes(formData);
        
        if (scanResponse.success) {
          setExtractedText(scanResponse.text);
          
          // Step 2: Generate quiz, summary, and flashcards
          await generateStudyContent(scanResponse.text);
        } else {
          Alert.alert('Error', 'Failed to extract text from image');
        }
      }
    } catch (error) {
      console.error('Error scanning notes:', error);
      Alert.alert('Error', 'Failed to scan notes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate all study content (quiz, summary, flashcards)
   * Shows results progressively as they become available
   */
  const generateStudyContent = async (text) => {
    try {
      setLoading(true);
      setMode('results');
      
      // Reset state
      setQuizData(null);
      setSummary('');
      setFlashcards([]);
      setRevealedAnswers({});
      setSelectedOptions({});
      
      // Generate all content in parallel, but update UI as each completes
      const quizPromise = StudyCoachAPI.generateQuiz(text, 'multiple_choice')
        .then(result => {
          console.log('Quiz result received:', JSON.stringify(result, null, 2));
          if (result.success && result.quiz) {
            console.log('Quiz data structure:', JSON.stringify(result.quiz, null, 2));
            setQuizData(result.quiz);
            Vibration.vibrate(100); // Light vibration when quiz is ready
          } else {
            console.warn('Quiz generation failed or no quiz data:', result);
          }
          return result;
        })
        .catch(e => {
          console.error('Quiz generation failed:', e);
          return { success: false, error: e.message };
        });
      
      const summaryPromise = StudyCoachAPI.generateSummary(text)
        .then(result => {
          if (result.success && result.summary) {
            setSummary(result.summary);
            Vibration.vibrate(50); // Light vibration when summary is ready
          }
          return result;
        })
        .catch(e => {
          console.error('Summary generation failed:', e);
          return { success: false, error: e.message };
        });
      
      const flashcardsPromise = StudyCoachAPI.generateFlashcards(text)
        .then(result => {
          if (result.success && result.flashcards) {
            setFlashcards(result.flashcards);
            Vibration.vibrate(50); // Light vibration when flashcards are ready
          }
          return result;
        })
        .catch(e => {
          console.error('Flashcards generation failed:', e);
          return { success: false, error: e.message };
        });
      
      // Wait for all to complete (but UI updates happen as each finishes)
      await Promise.all([quizPromise, summaryPromise, flashcardsPromise]);
      
      // Final vibration when all content is ready
      Vibration.vibrate(200);
      
    } catch (error) {
      console.error('Error generating content:', error);
      Alert.alert('Error', 'Failed to generate content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Text-to-Speech function
   * This is hardware output - audio playback
   */
  const handleTextToSpeech = async (text) => {
    try {
      // Use Expo Speech for TTS
      Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Error with TTS:', error);
      Alert.alert('Error', 'Failed to convert text to speech');
    }
  };

  /**
   * Toggle answer reveal for a question
   */
  const toggleAnswer = (questionId) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
    
    // Trigger vibration on reveal
    Vibration.vibrate(50);
  };

  /**
   * Handle multiple choice option selection
   */
  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    
    // Trigger vibration on selection
    Vibration.vibrate(50);
  };

  /**
   * Render home screen
   */
  const renderHome = () => (
    <View style={styles.container}>
      <Text style={styles.title}>AI Study Coach</Text>
      <Text style={styles.subtitle}>Scan your notes to generate quizzes</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleScanNotes}
        disabled={loading}
      >
        <Text style={styles.buttonText}>📷 Scan Notes</Text>
      </TouchableOpacity>
      
      {loading && <ActivityIndicator size="large" style={styles.loader} />}
    </View>
  );

  /**
   * Render quiz question card
   */
  const renderQuizQuestion = (question, index, type) => {
    const questionId = `${type}-${index}`;
    const isRevealed = revealedAnswers[questionId];

    if (type === 'multiple_choice') {
      return (
        <View key={index} style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {index + 1}</Text>
          <Text style={styles.question}>{question.question}</Text>
          
          {question.options && question.options.map((option, optIndex) => {
            const isSelected = selectedOptions[questionId] === optIndex;
            const isCorrect = optIndex === question.correct_answer;
            const showAnswer = isRevealed && isCorrect;
            
            return (
              <TouchableOpacity
                key={optIndex}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionSelected,
                  showAnswer && styles.optionCorrect
                ]}
                onPress={() => handleOptionSelect(questionId, optIndex)}
              >
                <Text style={styles.optionText}>{option}</Text>
                {showAnswer && <Text style={styles.correctBadge}>✓ Correct</Text>}
              </TouchableOpacity>
            );
          })}
          
          <TouchableOpacity
            style={styles.revealButton}
            onPress={() => toggleAnswer(questionId)}
          >
            <Text style={styles.revealButtonText}>
              {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
            </Text>
          </TouchableOpacity>
          
          {isRevealed && question.explanation && (
            <Text style={styles.explanation}>{question.explanation}</Text>
          )}
          
          <TouchableOpacity
            style={styles.ttsButton}
            onPress={() => handleTextToSpeech(question.question)}
          >
            <Text style={styles.ttsButtonText}>🔊 Read Question</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === 'fill_blank') {
      return (
        <View key={index} style={styles.questionCard}>
          <Text style={styles.questionNumber}>Fill in the Blank {index + 1}</Text>
          <Text style={styles.question}>{question.question}</Text>
          
          <TouchableOpacity
            style={styles.revealButton}
            onPress={() => toggleAnswer(questionId)}
          >
            <Text style={styles.revealButtonText}>
              {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
            </Text>
          </TouchableOpacity>
          
          {isRevealed && (
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>Answer:</Text>
              <Text style={styles.answer}>{question.answer}</Text>
              {question.hint && <Text style={styles.hint}>Hint: {question.hint}</Text>}
            </View>
          )}
          
          <TouchableOpacity
            style={styles.ttsButton}
            onPress={() => handleTextToSpeech(question.question)}
          >
            <Text style={styles.ttsButtonText}>🔊 Read Question</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === 'short_answer') {
      return (
        <View key={index} style={styles.questionCard}>
          <Text style={styles.questionNumber}>Short Answer {index + 1}</Text>
          <Text style={styles.question}>{question.question}</Text>
          
          <TouchableOpacity
            style={styles.revealButton}
            onPress={() => toggleAnswer(questionId)}
          >
            <Text style={styles.revealButtonText}>
              {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
            </Text>
          </TouchableOpacity>
          
          {isRevealed && (
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>Expected Answer:</Text>
              <Text style={styles.answer}>{question.answer}</Text>
              {question.key_points && question.key_points.length > 0 && (
                <View style={styles.keyPointsBox}>
                  <Text style={styles.keyPointsLabel}>Key Points:</Text>
                  {question.key_points.map((point, ptIndex) => (
                    <Text key={ptIndex} style={styles.keyPoint}>• {point}</Text>
                  ))}
                </View>
              )}
            </View>
          )}
          
          <TouchableOpacity
            style={styles.ttsButton}
            onPress={() => handleTextToSpeech(question.question)}
          >
            <Text style={styles.ttsButtonText}>🔊 Read Question</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  /**
   * Render results screen with quizzes, summary, and flashcards
   */
  const renderResults = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setMode('home');
          setQuizData(null);
          setSummary('');
          setFlashcards([]);
          setExtractedText('');
          setRevealedAnswers({});
          setSelectedOptions({});
        }}
      >
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>

      {/* Summary Section */}
      {summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Summary</Text>
          <Text style={styles.sectionContent}>{summary}</Text>
          <TouchableOpacity
            style={styles.ttsButton}
            onPress={() => handleTextToSpeech(summary)}
          >
            <Text style={styles.ttsButtonText}>🔊 Read Summary</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quiz Section - Multiple Choice Only */}
      {quizData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Multiple Choice Quiz</Text>
          
          {/* Multiple Choice Questions */}
          {(() => {
            // Handle different possible data structures
            let questions = null;
            
            if (quizData.multiple_choice && Array.isArray(quizData.multiple_choice)) {
              questions = quizData.multiple_choice;
            } else if (Array.isArray(quizData)) {
              // If quizData is directly an array
              questions = quizData;
            } else if (quizData.questions && Array.isArray(quizData.questions)) {
              // Alternative structure
              questions = quizData.questions;
            }
            
            if (questions && questions.length > 0) {
              return (
                <View style={styles.quizTypeSection}>
                  {questions.map((q, index) => {
                    // Ensure question has required fields
                    if (!q || !q.question) {
                      console.warn(`Question ${index} is missing required fields:`, q);
                      return null;
                    }
                    return renderQuizQuestion(q, index, 'multiple_choice');
                  })}
                </View>
              );
            } else {
              // Show debug info in development
              return (
                <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
                  <Text style={{ color: '#999', fontStyle: 'italic', marginBottom: 10 }}>
                    No quiz questions available yet...
                  </Text>
                  {__DEV__ && (
                    <Text style={{ fontSize: 10, color: '#ccc', marginTop: 10 }}>
                      Debug - Quiz data keys: {JSON.stringify(Object.keys(quizData || {}))}
                      {'\n'}Has multiple_choice: {quizData?.multiple_choice ? 'Yes' : 'No'}
                      {'\n'}Type: {Array.isArray(quizData) ? 'Array' : typeof quizData}
                    </Text>
                  )}
                </View>
              );
            }
          })()}
        </View>
      )}

      {/* Flashcards Section */}
      {flashcards && flashcards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎴 Flashcards</Text>
          {flashcards.map((card, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardFront}>{card.front}</Text>
              <Text style={styles.cardBack}>{card.back}</Text>
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => handleTextToSpeech(`${card.front}. ${card.back}`)}
              >
                <Text style={styles.ttsButtonText}>🔊 Read Card</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {loading && <ActivityIndicator size="large" style={styles.loader} />}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {mode === 'home' && renderHome()}
      {mode === 'results' && renderResults()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  quizTypeSection: {
    marginBottom: 20,
  },
  quizTypeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  questionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  optionCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  correctBadge: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  revealButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  revealButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerBox: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  answer: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  hint: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  explanation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  keyPointsBox: {
    marginTop: 10,
  },
  keyPointsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  keyPoint: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 3,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFront: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardBack: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  ttsButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  ttsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
