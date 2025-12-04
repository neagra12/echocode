import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session APIs
export const createSession = async (language = 'javascript') => {
  const response = await api.post('/api/session/create', { language });
  return response.data;
};

export const getSession = async (sessionId) => {
  const response = await api.get(`/api/session/${sessionId}`);
  return response.data;
};

export const addMessageToSession = async (sessionId, message, type = 'user') => {
  const response = await api.post(`/api/session/${sessionId}/message`, {
    message,
    type,
  });
  return response.data;
};

export const saveCodeToSession = async (sessionId, code, language, description) => {
  const response = await api.post(`/api/session/${sessionId}/code`, {
    code,
    language,
    description,
  });
  return response.data;
};

// Gemini APIs
export const generateCode = async (prompt, language = 'javascript') => {
  const response = await api.post('/api/gemini/generate-code', {
    prompt,
    language,
  });
  return response.data;
};

export const debugCode = async (code, errorMessage, language = 'javascript') => {
  const response = await api.post('/api/gemini/debug', {
    code,
    errorMessage,
    language,
  });
  return response.data;
};

export const explainCode = async (code, language = 'javascript') => {
  const response = await api.post('/api/gemini/explain', {
    code,
    language,
  });
  return response.data;
};

export const discussArchitecture = async (description) => {
  const response = await api.post('/api/gemini/architecture', {
    description,
  });
  return response.data;
};

// ElevenLabs APIs
export const listVoices = async () => {
  const response = await api.get('/api/elevenlabs/voices');
  return response.data;
};

export const createAgent = async (name, prompt, voiceId) => {
  const response = await api.post('/api/elevenlabs/create-agent', {
    name,
    prompt,
    voiceId,
  });
  return response.data;
};

export const listAgents = async () => {
  const response = await api.get('/api/elevenlabs/agents');
  return response.data;
};

export default api;