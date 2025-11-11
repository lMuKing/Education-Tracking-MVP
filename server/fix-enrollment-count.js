// Script to fix current_enrolled_count for all sessions
// Run this once to sync existing data

require('dotenv').config();
const mongoose = require('mongoose');
const Session = require('./src/Models/sessionModel');
const SessionEnrollment = require('./src/Models/sessionEnrollmentModel');

async function fixEnrollmentCounts() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to database');

    // Get all sessions
    const sessions = await Session.find();
    console.log(`\n📊 Found ${sessions.length} sessions\n`);

    for (const session of sessions) {
      // Count actual enrollments for this session
      const actualCount = await SessionEnrollment.countDocuments({ 
        session_id: session._id 
      });

      // Update the session document
      session.current_enrolled_count = actualCount;
      await session.save();

      console.log(`✅ ${session.title}`);
      console.log(`   Old count: ${session.current_enrolled_count || 0}`);
      console.log(`   New count: ${actualCount}`);
      console.log('');
    }

    console.log('✅ All session enrollment counts updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixEnrollmentCounts();
