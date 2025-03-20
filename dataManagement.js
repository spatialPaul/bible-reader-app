import { db } from './firebase.js';
import { 
  doc, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  increment
} from "firebase/firestore";

// Load user data
async function loadUserData(userId) {
  try {
    // Get user profile
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      userSettings = userDoc.data().readingSettings;
      updateUserDisplay(userDoc.data().displayName);
    }
    
    // Get user statistics
    const statsDoc = await getDoc(doc(db, "stats", userId));
    if (statsDoc.exists()) {
      updateStatsDisplay(statsDoc.data());
    }
    
    // Load today's readings and progress
    await loadDailyReadings(userId, currentDate);
    
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Load daily readings and progress
async function loadDailyReadings(userId, date) {
  try {
    // Get reading plan for the date
    const dayData = readingPlan[date];
    
    // Get user progress for the date
    const progressDoc = await getDoc(doc(db, "progress", userId, "dates", date));
    
    if (progressDoc.exists()) {
      // Apply saved progress to reading plan
      const savedReadings = progressDoc.data().readings;
      
      savedReadings.forEach((savedReading, index) => {
        if (dayData && dayData.readings[index]) {
          dayData.readings[index].completed = savedReading.completed;
        }
      });
    }
    
    // Render the readings
    renderReadings('reading-container', date);
    updateProgress();
    
  } catch (error) {
    console.error("Error loading daily readings:", error);
  }
}

// Save reading progress
async function saveReadingProgress(userId, date) {
  try {
    const dayData = readingPlan[date];
    
    if (!dayData) return;
    
    // Save progress to Firestore
    await setDoc(doc(db, "progress", userId, "dates", date), {
      readings: dayData.readings.map(reading => ({
        type: reading.type,
        reference: reading.reference,
        completed: reading.completed,
        completedAt: reading.completed ? new Date() : null
      })),
      updatedAt: new Date()
    });
    
    // Update user stats
    await updateUserStats(userId);
    
  } catch (error) {
    console.error("Error saving reading progress:", error);
  }
}

// Update user statistics
async function updateUserStats(userId) {
  try {
    // Calculate streak
    let streak = calculateStreak(userId);
    
    // Count completed readings
    let totalReadings = 0;
    let completedDays = 0;
    
    // Calculate from user progress
    const progressQuery = query(collection(db, "progress", userId, "dates"));
    const querySnapshot = await getDocs(progressQuery);
    
    querySnapshot.forEach((doc) => {
      const dateData = doc.data();
      const completedReadings = dateData.readings.filter(r => r.completed).length;
      totalReadings += completedReadings;
      
      if (completedReadings === dateData.readings.length) {
        completedDays++;
      }
    });
    
    // Update stats in Firestore
    await setDoc(doc(db, "stats", userId), {
      streak: streak,
      totalReadings: totalReadings,
      completedDays: completedDays,
      lastUpdated: new Date()
    });
    
    // Update display
    updateStatsDisplay({
      streak, totalReadings, completedDays
    });
    
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
}
