require('dotenv').config();

console.log('Environment Variables Check:');
console.log('================================');
console.log('GOOGLE_CLOUD_PROJECT_ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? 'Set' : 'Not set');
console.log('================================');

// Check if key file exists
const fs = require('fs');
const path = require('path');

const keyPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('\nKey file path:', keyPath);

try {
  if (fs.existsSync(keyPath)) {
    const stats = fs.statSync(keyPath);
    console.log('Key file exists! Size:', stats.size, 'bytes');
    
    // Try to read and parse it
    const keyContent = fs.readFileSync(keyPath, 'utf8');
    const keyJson = JSON.parse(keyContent);
    console.log('Key file is valid JSON');
    console.log('Service account email:', keyJson.client_email);
  } else {
    console.log('❌ Key file NOT FOUND at this path!');
  }
} catch (error) {
  console.log('❌ Error reading key file:', error.message);
}