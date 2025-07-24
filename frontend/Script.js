// Global variables
let isRecording = false;
let recognition = null;
let speechSynthesis = window.speechSynthesis;
let currentVoice = null;

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const voiceIndicator = document.getElementById('voiceIndicator');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');
const charCount = document.getElementById('charCount');
const clearChatBtn = document.getElementById('clearChat');
const toggleThemeBtn = document.getElementById('toggleTheme');
const fileInput = document.getElementById('fileInput');
const voiceResponseCheckbox = document.getElementById('voiceResponse');
const notificationsCheckbox = document.getElementById('notifications');
const languageSelect = document.getElementById('languageSelect');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    initializeTextToSpeech();
    setupEventListeners();
    loadUserPreferences();
    adjustTextareaHeight();
});

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            isRecording = true;
            voiceBtn.classList.add('recording');
            voiceIndicator.style.display = 'flex';
            voiceBtn.querySelector('i').className = 'fas fa-stop';
        };
        
        recognition.onend = function() {
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceIndicator.style.display = 'none';
            voiceBtn.querySelector('i').className = 'fas fa-microphone';
        };
        
        recognition.onresult = function(event) {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (finalTranscript) {
                messageInput.value = finalTranscript;
                updateCharCounter();
                sendMessage();
            } else {
                messageInput.value = interimTranscript;
                updateCharCounter();
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            showNotification('Speech recognition error. Please try again.', 'error');
        };
    } else {
        voiceBtn.style.display = 'none';
        console.warn('Speech recognition not supported in this browser.');
    }
}

// Initialize Text-to-Speech
function initializeTextToSpeech() {
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = function() {
            const voices = speechSynthesis.getVoices();
            currentVoice = voices.find(voice => voice.lang.includes('en')) || voices[0];
        };
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Send button
    sendBtn.addEventListener('click', sendMessage);
    
    // Enter key to send message
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        adjustTextareaHeight();
        updateCharCounter();
    });
    
    // Voice button
    voiceBtn.addEventListener('click', toggleVoiceRecording);
    
    // Clear chat button
    clearChatBtn.addEventListener('click', clearChat);
    
    // Theme toggle button
    toggleThemeBtn.addEventListener('click', toggleTheme);
    
    // File input
    fileInput.addEventListener('change', handleFileUpload);
    
    // Settings
    voiceResponseCheckbox.addEventListener('change', saveUserPreferences);
    notificationsCheckbox.addEventListener('change', saveUserPreferences);
    languageSelect.addEventListener('change', function() {
        if (recognition) {
            recognition.lang = this.value === 'en' ? 'en-US' : 
                              this.value === 'es' ? 'es-ES' : 'fr-FR';
        }
        saveUserPreferences();
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Send Message Function
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    updateCharCounter();
    adjustTextareaHeight();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
        
        // Text-to-speech for bot response
        if (voiceResponseCheckbox.checked) {
            speakText(response);
        }
    }, 1000 + Math.random() * 2000);
}

// Quick Question Function
function sendQuickQuestion(question) {
    messageInput.value = question;
    updateCharCounter();
    sendMessage();
}

// Add Message to Chat
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.textContent = message;
    
    const timestamp = document.createElement('span');
    timestamp.className = 'message-time';
    timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    content.appendChild(messageText);
    content.appendChild(timestamp);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Show notification for new messages
    if (sender === 'bot' && notificationsCheckbox.checked && document.hidden) {
        showNotification('New message from TutorBot', 'info');
    }
}

// Generate AI Response (placeholder - replace with actual AI integration)
function generateAIResponse(userMessage) {
    const responses = {
        'photosynthesis': 'Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in chloroplasts and involves two main stages: the light-dependent reactions and the Calvin cycle. During this process, plants absorb carbon dioxide from the air and water from the soil, using sunlight to produce glucose and oxygen.',
        'algebra': 'Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations. Key concepts include variables, coefficients, expressions, and equations. Would you like help with a specific algebra problem or concept?',
        'grammar': 'Grammar is the set of structural rules governing the composition of clauses, phrases, and words in a language. Key components include parts of speech (nouns, verbs, adjectives, etc.), sentence structure, punctuation, and syntax. What specific grammar topic would you like to explore?',
        'history': 'History is the study of past events, particularly in human affairs. It helps us understand how societies, cultures, and civilizations have developed over time. What specific historical period or event would you like to learn about?'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    // Default responses
    const defaultResponses = [
        "That's an interesting question! Let me help you understand this concept better. Could you provide more specific details about what you'd like to learn?",
        "I'd be happy to help you with that topic. Can you tell me more about what specific aspect you're struggling with?",
        "Great question! This is an important concept to understand. Let me break it down for you step by step.",
        "I can definitely help you with that. Would you like me to explain the basics first, or do you have a specific problem you're working on?",
        "That's a topic I love discussing! What would you like to know specifically? I can provide examples and explanations to help you understand better."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Voice Recording Functions
function toggleVoiceRecording() {
    if (!recognition) {
        showNotification('Speech recognition not supported in this browser.', 'error');
        return;
    }
    
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

// Text-to-Speech Function
function speakText(text) {
    if ('speechSynthesis' in window && currentVoice) {
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = currentVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        speechSynthesis.speak(utterance);
    }
}

// Typing Indicator Functions
function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Utility Functions
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

function updateCharCounter() {
    const count = messageInput.value.length;
    charCount.textContent = count;
    charCount.style.color = count > 800 ? '#f87171' : count > 600 ? '#fbbf24' : '#94a3b8';
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Hello! I'm your personal AI tutor. I'm here to help you learn and answer any questions you have. You can type your questions or use voice input by clicking the microphone button. What would you like to learn today?</p>
                    <span class="message-time">Just now</span>
                </div>
            </div>
        `;
    }
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? null : 'dark';
    
    body.setAttribute('data-theme', newTheme || '');
    
    const icon = toggleThemeBtn.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    localStorage.setItem('theme', newTheme || 'light');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size too large. Maximum size is 10MB.', 'error');
        return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('File type not supported. Please upload images, PDFs, or Word documents.', 'error');
        return;
    }
    
    // Simulate file processing
    addMessage(`📎 Uploaded file: ${file.name}`, 'user');
    
    setTimeout(() => {
        addMessage(`I've received your file "${file.name}". I can help you analyze this document. What would you like to know about it?`, 'bot');
    }, 1000);
    
    // Clear file input
    event.target.value = '';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 400px;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            .notification-error { border-left: 4px solid #f87171; }
            .notification-success { border-left: 4px solid #4ade80; }
            .notification-info { border-left: 4px solid #667eea; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.25rem;
                color: #64748b;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function saveUserPreferences() {
    const preferences = {
        voiceResponse: voiceResponseCheckbox.checked,
        notifications: notificationsCheckbox.checked,
        language: languageSelect.value
    };
    localStorage.setItem('tutorbot-preferences', JSON.stringify(preferences));
}

function loadUserPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        toggleThemeBtn.querySelector('i').className = 'fas fa-sun';
    }
    
    // Load preferences
    const savedPreferences = localStorage.getItem('tutorbot-preferences');
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        voiceResponseCheckbox.checked = preferences.voiceResponse !== false;
        notificationsCheckbox.checked = preferences.notifications !== false;
        languageSelect.value = preferences.language || 'en';
        
        if (recognition && preferences.language) {
            recognition.lang = preferences.language === 'en' ? 'en-US' : 
                              preferences.language === 'es' ? 'es-ES' : 'fr-FR';
        }
    }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Handle page visibility for notifications
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && 'speechSynthesis' in window) {
        // Stop speech when page becomes visible
        speechSynthesis.cancel();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        sendMessage();
    }
    
    // Ctrl/Cmd + K to focus message input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        messageInput.focus();
    }
    
    // Escape to stop speech
    if (e.key === 'Escape' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
});

// Handle errors gracefully
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please refresh the page if issues persist.', 'error');
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
