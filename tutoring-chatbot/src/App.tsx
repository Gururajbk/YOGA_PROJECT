import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  User, 
  Bot, 
  Brain
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI tutor. I'm here to help you learn and answer your questions. You can type or speak to me. What subject would you like to explore today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const subjects: Subject[] = [
    { id: 'math', name: 'Mathematics', icon: '📐' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'english', name: 'English', icon: '📚' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'general', name: 'General Questions', icon: '❓' }
  ];

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me break that down for you...",
        "I understand you're asking about this topic. Here's what I can tell you:",
        "Excellent! Let's explore this concept step by step:",
        "That's an interesting area to study. Let me explain:",
        "Perfect question for learning! Here's my explanation:"
      ];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)] + " " + generateContextualResponse(inputText, selectedSubject),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Text-to-speech for AI response
      if ('speechSynthesis' in window) {
        speakText(aiResponse.text);
      }
    }, 1000);
  };

  const generateContextualResponse = (question: string, subject: string): string => {
    const responses = {
      math: "In mathematics, this concept involves understanding patterns, relationships, and logical reasoning. Would you like me to provide some examples or practice problems?",
      science: "From a scientific perspective, this involves observation, hypothesis, and experimentation. Let's explore the underlying principles together.",
      english: "In English language arts, we focus on comprehension, analysis, and effective communication. Let's dive deeper into this topic.",
      history: "Historically speaking, this connects to important events and cultural developments. Understanding the context is key.",
      programming: "In programming, we solve this through algorithms and logical thinking. Let me show you the step-by-step approach.",
      general: "This is a fundamental concept that applies across multiple disciplines. Let's explore it from different angles."
    };

    return responses[subject as keyof typeof responses] || responses.general;
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <Brain className="logo-icon" />
              <h1>AI Tutor</h1>
            </div>
            <div className="header-controls">
              <button 
                className={`voice-toggle ${isSpeaking ? 'active' : ''}`}
                onClick={isSpeaking ? stopSpeaking : () => {}}
                title={isSpeaking ? 'Stop speaking' : 'Text-to-speech enabled'}
              >
                {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Subject Selection */}
        <div className="subject-selection">
          <h3>Choose a subject:</h3>
          <div className="subjects-grid">
            {subjects.map(subject => (
              <button
                key={subject.id}
                className={`subject-card ${selectedSubject === subject.id ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <span className="subject-icon">{subject.icon}</span>
                <span className="subject-name">{subject.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-container">
          <div className="messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.isUser ? 'user' : 'ai'}`}>
                <div className="message-avatar">
                  {message.isUser ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything or click the mic to speak..."
                className="message-input"
                rows={1}
              />
              <div className="input-controls">
                <button
                  className={`voice-button ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  title="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/// <reference path="./types/speech.d.ts" />

export default App;
