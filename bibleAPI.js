// Install Firebase CLI and initialize functions
npm install -g firebase-tools
firebase login
firebase init functions

// In functions/index.js
const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });

// Bible API function
exports.getScripture = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature'
    );
  }
  
  const { reference } = data;
  
  try {
    // Call Bible API (example using ESV API)
    const response = await axios.get(
      `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(reference)}&include-passage-references=false&include-verse-numbers=true`,
      {
        headers: {
          'Authorization': 'Token YOUR_ESV_API_KEY'
        }
      }
    );
    
    return {
      content: response.data.passages[0],
      verses: response.data.passage_meta[0].verses
    };
  } catch (error) {
    console.error("Error fetching scripture:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to fetch scripture content'
    );
  }
});
