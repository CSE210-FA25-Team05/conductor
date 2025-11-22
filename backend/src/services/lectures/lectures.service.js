'use strict';

// This file handles the "rules" for lectures - who can do what, and what data is valid
// Think of it as the bouncer at a club - it checks if you're allowed in and if you're following the rules

const lecturesRepo = require('./lectures.repo');

// Check if someone can create/edit/delete lectures
// Only professors and TAs can do this - students can't mess with the schedule
async function canModifyLectures(userId, courseId) {
  // First, figure out what role this user has in the course
  const role = await lecturesRepo.getUserCourseRole(userId, courseId);
  
  // If they're a professor or TA, they're good to go
  // Students get blocked here
  return role === 'professor' || role === 'ta';
}

// Check if someone can view lectures
// Anyone enrolled in the course can see the lecture list - even students
async function canViewLectures(userId, courseId) {
  // Get their role in the course
  const role = await lecturesRepo.getUserCourseRole(userId, courseId);
  
  // If they have any role (professor, TA, or student), they can view
  // If role is null, they're not enrolled, so no access
  return role !== null;
}

// Make sure the lecture data makes sense before we save it
// Like checking if someone filled out a form correctly
function validateLectureData(data) {
  // Every lecture needs a date - can't have a lecture without knowing when it is
  if (!data.lecture_date) {
    return { valid: false, error: 'lecture_date is required' };
  }

  // Make sure the date is actually a real date, not gibberish
  const lectureDate = new Date(data.lecture_date);
  if (isNaN(lectureDate.getTime())) {
    return { valid: false, error: 'lecture_date must be a valid date' };
  }

  // Everything looks good!
  return { valid: true };
}

module.exports = {
  canModifyLectures,
  canViewLectures,
  validateLectureData,
};
