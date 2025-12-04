import MicrophoneTest from './components/MicrophoneTest';
import React, { useState, useEffect } from 'react';
import VoiceInterface from './components/VoiceInterface';
import CodeEditor from './components/CodeEditor';
import ChatHistory from './components/ChatHistory';
import { createSession, generateCode, debugCode, explainCode } from './services/api';
import './App.css';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('// Your generated code will appear here\n// Say "generate a function to..." to start coding!\n');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);

  // Create session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await createSession(language);
        setSessionId(response.sessionId);
        console.log('Session created:', response.sessionId);
        addMessage('Welcome to EchoCode! I can help you generate code, debug issues, or explain code. Try saying "generate a function to add two numbers"!', 'ai');
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    };
    initSession();
  }, []);

  const addMessage = (content, type = 'user') => {
    const message = {
      content,
      type,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleTranscript = async (transcript) => {
    console.log('User said:', transcript);
    addMessage(transcript, 'user');

    // Determine intent and call appropriate API
    setIsLoading(true);
    try {
      if (transcript.toLowerCase().includes('generate') || 
          transcript.toLowerCase().includes('create') ||
          transcript.toLowerCase().includes('write') ||
          transcript.toLowerCase().includes('make') ||
          transcript.toLowerCase().includes('build')) {
        // Generate code
        const response = await generateCode(transcript, language);
        if (response.success) {
          setCode(response.code);
          addMessage(`I've generated the code for you!`, 'ai');
        } else {
          addMessage(`Sorry, I couldn't generate the code: ${response.error}`, 'ai');
        }
      } else if (transcript.toLowerCase().includes('debug') || 
                 transcript.toLowerCase().includes('fix') ||
                 transcript.toLowerCase().includes('error')) {
        // Debug code
        const response = await debugCode(code, transcript, language);
        if (response.success) {
          addMessage(response.suggestion, 'ai');
        } else {
          addMessage(`Sorry, I couldn't debug the code: ${response.error}`, 'ai');
        }
      } else if (transcript.toLowerCase().includes('explain') || 
                 transcript.toLowerCase().includes('what does')) {
        // Explain code
        const response = await explainCode(code, language);
        if (response.success) {
          addMessage(response.explanation, 'ai');
        } else {
          addMessage(`Sorry, I couldn't explain the code: ${response.error}`, 'ai');
        }
      } else {
        // General response
        addMessage('I can help you generate code, debug issues, or explain code. Try saying "generate a function" or "explain this code"!', 'ai');
      }
    } catch (error) {
      console.error('Error processing request:', error);
      addMessage('Sorry, something went wrong. Please try again.', 'ai');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = (response) => {
    console.log('AI responded:', response);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎙️ EchoCode - Voice-Driven Pair Programming</h1>
        <p>Powered by ElevenLabs & Google Gemini</p>
      </header>

      <div className="main-container">
        {/* Left Panel - Voice & Chat */}
        <div className="left-panel">
  <MicrophoneTest />
  <VoiceInterface
    onTranscript={handleTranscript}
    onResponse={handleResponse}
  />
  <div className="chat-container">
    <ChatHistory messages={messages} />
  </div>
</div>

        {/* Right Panel - Code Editor */}
        <div className="right-panel">
          <div className="editor-header">
            <h3>📝 Code Editor</h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-selector"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
            </select>
          </div>
          <div className="editor-container">
            {isLoading ? (
              <div className="loading">
                <p>🤔 Thinking...</p>
              </div>
            ) : (
              <CodeEditor
                code={code}
                language={language}
                onChange={(value) => setCode(value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;