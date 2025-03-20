import { getFunctions, httpsCallable } from "firebase/functions";

// Initialize Firebase Functions
const functions = getFunctions();
const getScripture = httpsCallable(functions, 'getScripture');

// Update openReading function
async function openReading(index, date) {
  currentReadingIndex = index;
  const reading = readingPlan[date].readings[index];
  
  // Set the reader title
  document.getElementById('reader-title').textContent = reading.reference;
  
  // Show loading state
  document.getElementById('reader-content').innerHTML = `
    <div class="loading-indicator">
      <i class="fas fa-spinner"></i> Loading scripture...
    </div>
  `;
  
  // Show the reader screen
  showScreen('reader-screen');
  
  try {
    // Call Bible API via Firebase Function
    const result = await getScripture({ reference: reading.reference });
    
    // Format and display the content
    let formattedContent = '';
    
    if (result.data && result.data.content) {
      // Extract chapter number from reference
      const chapterMatch = reading.reference.match(/\d+/);
      const chapterNumber = chapterMatch ? chapterMatch[0] : '';
      
      formattedContent = `
        <div class="chapter-number">${chapterNumber}</div>
        <div class="scripture-text">${result.data.content}</div>
      `;
    } else {
      formattedContent = `<div class="error-message">Scripture content not available.</div>`;
    }
    
    document.getElementById('reader-content').innerHTML = formattedContent;
    
  } catch (error) {
    console.error("Error loading scripture:", error);
    document.getElementById('reader-content').innerHTML = `
      <div class="error-message">
        Error loading scripture: ${error.message || 'Unknown error'}
      </div>
    `;
  }
}
