const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini-service');

/**
 * POST /api/gemini/generate-code
 * Generate code from voice description
 */
router.post('/generate-code', async (req, res) => {
  try {
    const { prompt, language = 'javascript' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt is required' 
      });
    }

    console.log(`Generating ${language} code for: ${prompt}`);
    
    const result = await geminiService.generateCode(prompt, language);
    
    res.json(result);
  } catch (error) {
    console.error('Error in generate-code:', error);
    res.status(500).json({ 
      error: 'Failed to generate code',
      message: error.message 
    });
  }
});

/**
 * POST /api/gemini/debug
 * Debug code and provide suggestions
 */
router.post('/debug', async (req, res) => {
  try {
    const { code, errorMessage, language = 'javascript' } = req.body;
    
    if (!code || !errorMessage) {
      return res.status(400).json({ 
        error: 'Code and error message are required' 
      });
    }

    console.log(`Debugging ${language} code...`);
    
    const result = await geminiService.debugCode(code, errorMessage, language);
    
    res.json(result);
  } catch (error) {
    console.error('Error in debug:', error);
    res.status(500).json({ 
      error: 'Failed to debug code',
      message: error.message 
    });
  }
});

/**
 * POST /api/gemini/explain
 * Explain code functionality
 */
router.post('/explain', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Code is required' 
      });
    }

    console.log(`Explaining ${language} code...`);
    
    const result = await geminiService.explainCode(code, language);
    
    res.json(result);
  } catch (error) {
    console.error('Error in explain:', error);
    res.status(500).json({ 
      error: 'Failed to explain code',
      message: error.message 
    });
  }
});

/**
 * POST /api/gemini/architecture
 * Discuss architecture and design
 */
router.post('/architecture', async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ 
        error: 'Description is required' 
      });
    }

    console.log('Discussing architecture...');
    
    const result = await geminiService.discussArchitecture(description);
    
    res.json(result);
  } catch (error) {
    console.error('Error in architecture:', error);
    res.status(500).json({ 
      error: 'Failed to discuss architecture',
      message: error.message 
    });
  }
});

module.exports = router;