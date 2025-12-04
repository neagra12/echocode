const { VertexAI } = require('@google-cloud/vertexai');

class GeminiService {
  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = 'us-central1';
    this.model = 'gemini-2.5-flash';
    
    // Initialize Vertex AI
    this.vertexAI = new VertexAI({
      project: this.projectId,
      location: this.location
    });
    
    this.generativeModel = this.vertexAI.getGenerativeModel({
      model: this.model,
    });
  }

  /**
   * Generate code based on user's voice description
   */
  async generateCode(prompt, language = 'javascript') {
    try {
      const enhancedPrompt = `You are an expert pair programming assistant. 
The user wants to: ${prompt}

Generate clean, well-commented ${language} code that:
1. Follows best practices
2. Includes error handling
3. Is production-ready
4. Has helpful comments

Provide ONLY the code, no explanations before or after.`;

      const result = await this.generativeModel.generateContent(enhancedPrompt);
      const response = result.response;
      const text = response.candidates[0].content.parts[0].text;
      
      return {
        success: true,
        code: text,
        language: language
      };
    } catch (error) {
      console.error('Error generating code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Debug code and provide suggestions
   */
  async debugCode(code, errorMessage, language = 'javascript') {
    try {
      const prompt = `You are debugging ${language} code.

CODE:
${code}

ERROR:
${errorMessage}

Provide:
1. What's wrong
2. How to fix it
3. The corrected code

Format your response clearly.`;

      const result = await this.generativeModel.generateContent(prompt);
      const response = result.response;
      const text = response.candidates[0].content.parts[0].text;
      
      return {
        success: true,
        suggestion: text
      };
    } catch (error) {
      console.error('Error debugging code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Explain code functionality
   */
  async explainCode(code, language = 'javascript') {
    try {
      const prompt = `Explain this ${language} code in simple terms:

${code}

Provide:
1. What it does overall
2. Key parts explained
3. Any potential issues`;

      const result = await this.generativeModel.generateContent(prompt);
      const response = result.response;
      const text = response.candidates[0].content.parts[0].text;
      
      return {
        success: true,
        explanation: text
      };
    } catch (error) {
      console.error('Error explaining code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Discuss architecture and design
   */
  async discussArchitecture(description) {
    try {
      const prompt = `As a software architect, discuss this system design:

${description}

Provide:
1. Recommended architecture
2. Technology choices
3. Potential challenges
4. Best practices`;

      const result = await this.generativeModel.generateContent(prompt);
      const response = result.response;
      const text = response.candidates[0].content.parts[0].text;
      
      return {
        success: true,
        advice: text
      };
    } catch (error) {
      console.error('Error discussing architecture:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export a singleton instance
module.exports = new GeminiService();