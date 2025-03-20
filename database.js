// users - Store user profiles and settings
users/{userId} = {
  displayName: "User's Name",
  email: "user@example.com",
  createdAt: timestamp,
  readingSettings: {
    notificationsEnabled: true,
    reminderTime: "08:00",
    darkMode: false,
    textSize: "medium"
  }
}

// progress - Store reading progress
progress/{userId}/dates/{dateString} = {
  readings: [
    {
      type: "oldTestament",
      reference: "Genesis 1:1-31",
      completed: true,
      completedAt: timestamp
    },
    {
      type: "newTestament",
      reference: "Matthew 1:1-25",
      completed: false
    },
    {
      type: "psalmsProverbs",
      reference: "Psalm 1:1-6",
      completed: false
    }
  ]
}

// stats - Store user statistics
stats/{userId} = {
  streak: 7,
  totalReadings: 42,
  completedDays: 14,
  lastCompletedDate: "2025-03-23"
}
