import React, { useState } from 'react';
import { useConversation } from '@elevenlabs/react';

const VoiceInterface = ({ onTranscript, onResponse }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Ready to start');

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Connected to ElevenLabs Agent');
      setIsConnected(true);
      setStatus('Connected - Listening');
    },
    onDisconnect: () => {
      console.log('❌ Disconnected from ElevenLabs');
      setIsConnected(false);
      setStatus('Disconnected');
    },
    onMessage: (message) => {
      console.log('📨 Full message object:', JSON.stringify(message, null, 2));
      
      // Try different message structures
      if (message.type === 'user_transcript' || message.source === 'user') {
        const transcript = message.message || message.text || message.content || '';
        console.log('👤 User transcript:', transcript);
        if (transcript && onTranscript) {
          onTranscript(transcript);
        }
      } 
      else if (message.type === 'agent_response' || message.source === 'ai') {
        const response = message.message || message.text || message.content || '';
        console.log('🤖 Agent response:', response);
        if (response && onResponse) {
          onResponse(response);
        }
      }
      // Fallback - check message.message structure
      else if (message.message) {
        if (message.message.role === 'user') {
          const transcript = message.message.content;
          console.log('👤 User said (fallback):', transcript);
          if (transcript && onTranscript) {
            onTranscript(transcript);
          }
        } else if (message.message.role === 'assistant') {
          const response = message.message.content;
          console.log('🤖 Agent said (fallback):', response);
          if (response && onResponse) {
            onResponse(response);
          }
        }
      }
    },
    onError: (error) => {
      console.error('❌ ElevenLabs error:', error);
      setStatus(`Error: ${error.message || 'Connection failed'}`);
    },
  });

  const startConversation = async () => {
    try {
      setStatus('Connecting...');
      
      const agentId = process.env.REACT_APP_ELEVENLABS_AGENT_ID;
      
      if (!agentId) {
        alert('❌ Missing Agent ID. Check your .env file.');
        setStatus('Configuration error');
        return;
      }

      console.log('🚀 Starting with agent:', agentId);

      await conversation.startSession({
        agentId: agentId,
      });

      console.log('✅ Session started successfully');
      setStatus('Connected - Speak now!');
    } catch (error) {
      console.error('❌ Failed to start:', error);
      setStatus(`Failed: ${error.message}`);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setStatus('Session ended');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🎤 ElevenLabs Voice Agent</h3>
        <div style={styles.status}>
          <span style={{
            ...styles.statusDot,
            backgroundColor: isConnected ? '#10b981' : '#6b7280'
          }}></span>
          <span style={styles.statusText}>{status}</span>
        </div>
      </div>

      <div style={styles.controls}>
        {!isConnected ? (
          <button
            onClick={startConversation}
            style={{...styles.button, ...styles.startButton}}
            disabled={conversation.status === 'connecting'}
          >
            {conversation.status === 'connecting' ? '⏳ Connecting...' : '▶️ Start Agent'}
          </button>
        ) : (
          <button
            onClick={endConversation}
            style={{...styles.button, ...styles.endButton}}
          >
            ⏹️ End Session
          </button>
        )}
      </div>

      <div style={styles.info}>
        <div style={styles.infoBox}>
          {isConnected ? (
            <>
              <p style={styles.infoText}>
                🎙️ <strong>Microphone is active!</strong>
              </p>
              <p style={styles.helpText}>
                Try saying:<br/>
                • "Generate a function to add two numbers"<br/>
                • "Create a Python function to reverse a string"<br/>
                • "Write code to check if a number is prime"
              </p>
            </>
          ) : (
            <p style={styles.infoText}>
              Click "Start Agent" and allow microphone access when prompted.
            </p>
          )}
        </div>
        
        <div style={styles.debug}>
          <small>SDK Status: {conversation.status || 'idle'}</small>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '14px',
    fontWeight: '500',
  },
  controls: {
    marginBottom: '20px',
  },
  button: {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
  endButton: {
    backgroundColor: '#ef4444',
    color: '#fff',
  },
  info: {
    backgroundColor: '#2d2d2d',
    borderRadius: '6px',
  },
  infoBox: {
    padding: '16px',
  },
  infoText: {
    margin: '0 0 12px 0',
    fontSize: '15px',
    color: '#e5e7eb',
  },
  helpText: {
    margin: 0,
    fontSize: '13px',
    color: '#9ca3af',
    lineHeight: '1.6',
  },
  debug: {
    padding: '8px 16px',
    borderTop: '1px solid #374151',
    color: '#6b7280',
    fontFamily: 'monospace',
    fontSize: '11px',
  },
};

export default VoiceInterface;