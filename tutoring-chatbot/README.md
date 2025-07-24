# AI Tutoring Chatbot

A modern, interactive tutoring chatbot built with React and TypeScript that supports both voice and text input for personalized learning experiences.

## 🌟 Features

- **Voice and Text Input**: Students can interact using both voice commands and text input
- **Subject Selection**: Choose from Mathematics, Science, English, History, Programming, and General Questions
- **Text-to-Speech**: AI responses are automatically spoken aloud
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Chat**: Interactive conversation interface with typing indicators
- **Cross-platform**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tutoring-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 🎯 How to Use

1. **Select a Subject**: Choose your preferred subject from the subject cards
2. **Type or Speak**: 
   - Type your question in the input field
   - Click the microphone button to use voice input
3. **Get Answers**: The AI tutor will respond with explanations and guidance
4. **Voice Output**: Responses are automatically read aloud (can be toggled)

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety and better development experience
- **Lucide React** - Modern icon library
- **Web Speech API** - Voice recognition and text-to-speech
- **CSS3** - Modern styling with gradients and animations
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
tutoring-chatbot/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Styling for the application
│   ├── index.tsx        # Application entry point
│   └── index.css        # Global styles
├── package.json
└── README.md
```

## 🎨 Features in Detail

### Voice Recognition
- Uses Web Speech API for voice input
- Supports multiple languages (default: English)
- Visual feedback when listening
- Automatic transcription to text

### Text-to-Speech
- Automatic reading of AI responses
- Adjustable speech rate and pitch
- Toggle on/off functionality
- Cross-browser compatibility

### Subject-Specific Responses
- Contextual responses based on selected subject
- Educational guidance tailored to each discipline
- Encouragement for continued learning

### Responsive Design
- Mobile-optimized interface
- Touch-friendly controls
- Adaptive layout for different screen sizes
- Modern glassmorphism design

## 🔧 Customization

### Adding New Subjects
To add a new subject, modify the `subjects` array in `App.tsx`:

```typescript
const subjects: Subject[] = [
  // ... existing subjects
  { id: 'new-subject', name: 'New Subject', icon: '🎯' }
];
```

### Integrating with AI APIs
Replace the simulated response in `handleSendMessage` with actual API calls:

```typescript
// Replace this simulation with real API call
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: inputText, subject: selectedSubject })
});
```

## 🌐 Browser Support

- Chrome (recommended for full voice features)
- Firefox
- Safari
- Edge

**Note**: Voice recognition works best in Chrome and Edge browsers.

## 📱 Mobile Support

The application is fully responsive and includes:
- Touch-optimized controls
- Mobile-friendly voice input
- Adaptive layout for small screens
- Gesture-based interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎓 Educational Use

This chatbot is designed for educational purposes and can be:
- Integrated into learning management systems
- Used as a study companion
- Adapted for specific curricula
- Extended with subject-specific knowledge bases

## 🚧 Future Enhancements

- [ ] Integration with ChatGPT or other AI APIs
- [ ] User authentication and progress tracking
- [ ] Homework help with file uploads
- [ ] Multi-language support
- [ ] Voice customization options
- [ ] Study session recordings
- [ ] Quiz and assessment features

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for education and learning
