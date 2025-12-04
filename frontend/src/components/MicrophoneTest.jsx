import React, { useState, useEffect } from 'react';

const MicrophoneTest = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [browserSupport, setBrowserSupport] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupport(false);
    }
  }, []);

  const testMicrophone = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
      console.log('✅ Microphone test started');
    };

    recognition.onresult = (event) => {
      let result = '';
      for (let i = 0; i < event.results.length; i++) {
        result += event.results[i][0].transcript;
      }
      setTranscript(result);
      console.log('📝 Captured:', result);
    };

    recognition.onerror = (event) => {
      console.error('❌ Error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🔴 Test ended');
    };

    try {
      recognition.start();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!browserSupport) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>🎤 Microphone Test</h3>
        <div style={styles.error}>
          ⚠️ Speech recognition not supported. Use Google Chrome.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🎤 FREE Microphone Test</h3>
      
      <p style={styles.description}>
        Test your microphone locally (no API calls, no credits used)
      </p>

      <button
        onClick={testMicrophone}
        disabled={isListening}
        style={{
          ...styles.button,
          opacity: isListening ? 0.5 : 1,
          cursor: isListening ? 'not-allowed' : 'pointer'
        }}
      >
        {isListening ? '🎙️ Listening...' : '▶️ Start Test'}
      </button>

      {error && (
        <div style={styles.error}>
          ❌ Error: {error}
        </div>
      )}

      {transcript && (
        <div style={styles.result}>
          <strong>✅ SUCCESS! You said:</strong>
          <div style={styles.transcript}>{transcript}</div>
        </div>
      )}

      {!transcript && !isListening && !error && (
        <div style={styles.instructions}>
          <p><strong>Instructions:</strong></p>
          <ol style={{margin: '8px 0', paddingLeft: '20px'}}>
            <li>Click "Start Test"</li>
            <li>Allow microphone when prompted</li>
            <li>Say: "Testing one two three"</li>
            <li>Check if text appears below</li>
          </ol>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    color: '#fff',
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: '600',
  },
  description: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#9ca3af',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    marginBottom: '16px',
  },
  error: {
    padding: '12px',
    backgroundColor: '#7f1d1d',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  result: {
    padding: '12px',
    backgroundColor: '#064e3b',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  transcript: {
    marginTop: '8px',
    padding: '8px',
    backgroundColor: '#065f46',
    borderRadius: '4px',
    fontStyle: 'italic',
  },
  instructions: {
    padding: '12px',
    backgroundColor: '#1f2937',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#d1d5db',
  },
};

export default MicrophoneTest;