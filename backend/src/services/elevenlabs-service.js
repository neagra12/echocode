const axios = require('axios');

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.baseUrl = 'https://api.elevenlabs.io/v1';
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Create a conversational AI agent
   */
  async createAgent(name, prompt, voiceId) {
    try {
      const response = await this.axiosInstance.post('/convai/agents/create', {
        name: name,
        prompt: prompt || 'You are a helpful pair programming assistant.',
        voice_id: voiceId || 'default'
      });
      
      return {
        success: true,
        agent: response.data
      };
    } catch (error) {
      console.error('Error creating agent:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * List all agents
   */
  async listAgents() {
    try {
      const response = await this.axiosInstance.get('/convai/agents');
      
      return {
        success: true,
        agents: response.data
      };
    } catch (error) {
      console.error('Error listing agents:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get agent details
   */
  async getAgent(agentId) {
    try {
      const response = await this.axiosInstance.get(`/convai/agents/${agentId}`);
      
      return {
        success: true,
        agent: response.data
      };
    } catch (error) {
      console.error('Error getting agent:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * List all available voices
   */
  async listVoices() {
    try {
      const response = await this.axiosInstance.get('/voices');
      
      return {
        success: true,
        voices: response.data.voices
      };
    } catch (error) {
      console.error('Error listing voices:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Convert text to speech
   */
  async textToSpeech(text, voiceId = 'EXAVITQu4vr4xnSDxMaL') {
    try {
      const response = await this.axiosInstance.post(
        `/text-to-speech/${voiceId}`,
        {
          text: text,
          model_id: 'eleven_monolingual_v1'
        },
        {
          responseType: 'arraybuffer'
        }
      );
      
      // Convert audio to base64
      const audioBase64 = Buffer.from(response.data).toString('base64');
      
      return {
        success: true,
        audio: audioBase64
      };
    } catch (error) {
      console.error('Error in text-to-speech:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
}

// Export a singleton instance
module.exports = new ElevenLabsService();