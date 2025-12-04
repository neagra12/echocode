const express = require('express');
const router = express.Router();

// In-memory session storage (for now)
// Later we can upgrade to Firestore
const sessions = new Map();

/**
 * POST /api/session/create
 * Create a new coding session
 */
router.post('/create', async (req, res) => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      messages: [],
      codeHistory: [],
      language: req.body.language || 'javascript'
    };
    
    sessions.set(sessionId, session);
    
    console.log(`Created session: ${sessionId}`);
    
    res.json({
      success: true,
      sessionId,
      session
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ 
      error: 'Failed to create session',
      message: error.message 
    });
  }
});

/**
 * GET /api/session/:sessionId
 * Get session details
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ 
      error: 'Failed to get session',
      message: error.message 
    });
  }
});

/**
 * POST /api/session/:sessionId/message
 * Add a message to the session
 */
router.post('/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, type = 'user' } = req.body;
    
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }
    
    const messageObj = {
      id: `msg_${Date.now()}`,
      type,
      content: message,
      timestamp: new Date().toISOString()
    };
    
    session.messages.push(messageObj);
    sessions.set(sessionId, session);
    
    res.json({
      success: true,
      message: messageObj
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ 
      error: 'Failed to add message',
      message: error.message 
    });
  }
});

/**
 * POST /api/session/:sessionId/code
 * Save code to session history
 */
router.post('/:sessionId/code', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { code, language, description } = req.body;
    
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }
    
    const codeEntry = {
      id: `code_${Date.now()}`,
      code,
      language: language || session.language,
      description,
      timestamp: new Date().toISOString()
    };
    
    session.codeHistory.push(codeEntry);
    sessions.set(sessionId, session);
    
    res.json({
      success: true,
      codeEntry
    });
  } catch (error) {
    console.error('Error saving code:', error);
    res.status(500).json({ 
      error: 'Failed to save code',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/session/:sessionId
 * Delete a session
 */
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const deleted = sessions.delete(sessionId);
    
    if (!deleted) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Session deleted'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ 
      error: 'Failed to delete session',
      message: error.message 
    });
  }
});

module.exports = router;