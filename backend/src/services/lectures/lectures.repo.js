'use strict';

// This file talks directly to the database
// It's like a librarian - you ask for something, it goes and gets it from the database
// Doesn't care about permissions or rules, just fetches data

const prisma = require('../../prisma');

// Get all the lectures for a specific course
// We only get lectures that haven't been deleted (deleted_at is null)
// Sorted by date so the earliest lecture comes first
async function getLecturesByCourseId(courseId) {
  return prisma.lectures.findMany({
    where: {
      course_id: courseId,
      deleted_at: null, // Don't show deleted lectures
    },
    orderBy: {
      lecture_date: 'asc', // Oldest first
    },
  });
}

// Get one specific lecture by its ID
// If courseId is provided, we double-check the lecture actually belongs to that course
// This prevents someone from accessing lectures from other courses
async function getLectureById(lectureId, courseId = null) {
  const where = {
    id: lectureId,
    deleted_at: null, // Not deleted
  };

  // Optional safety check - make sure lecture is in the right course
  if (courseId !== null) {
    where.course_id = courseId;
  }

  return prisma.lectures.findFirst({
    where,
  });
}

// Create a new lecture in the database
// Just saves it - doesn't check if you're allowed to do this
async function createLecture(data) {
  return prisma.lectures.create({
    data: {
      course_id: data.course_id,
      lecture_date: data.lecture_date,
      code: data.code || null, // Code is optional, so use null if not provided
    },
  });
}

// Update an existing lecture
// Changes the date or code, and updates the timestamp
async function updateLecture(lectureId, data) {
  return prisma.lectures.update({
    where: { id: lectureId },
    data: {
      lecture_date: data.lecture_date,
      code: data.code,
      updated_at: new Date(), // Track when it was last changed
    },
  });
}

// "Delete" a lecture - but we don't actually delete it from the database
// Instead we mark it as deleted by setting deleted_at timestamp
// This way we can recover it later if needed, and it keeps history
async function deleteLecture(lectureId) {
  return prisma.lectures.update({
    where: { id: lectureId },
    data: {
      deleted_at: new Date(), // Mark as deleted now
      updated_at: new Date(),
    },
  });
}

// Check if a course actually exists in the database
// Used to make sure someone isn't trying to create lectures for a fake course
async function courseExists(courseId) {
  const course = await prisma.courses.findFirst({
    where: {
      id: courseId,
      deleted_at: null, // Not deleted
    },
  });
  return !!course; // Convert to true/false
}

// Figure out what role a user has in a specific course
// Returns 'professor', 'ta', 'student', or null if they're not enrolled
// This is how we know if someone is allowed to do things
async function getUserCourseRole(userId, courseId) {
  const enrollment = await prisma.enrollments.findFirst({
    where: {
      user_id: userId,
      course_id: courseId,
      deleted_at: null, // Active enrollment only
    },
  });

  // If they're enrolled, return their role. Otherwise null
  return enrollment ? enrollment.role : null;
}

// Convert an email address to a user ID from the database
// The auth system gives us emails, but we need database IDs to check enrollments
async function getUserIdByEmail(email) {
  const user = await prisma.users.findUnique({
    where: {
      email: email.toLowerCase(), // Emails are case-insensitive
      deleted_at: null, // Not deleted
    },
  });

  return user ? user.id : null;
}

module.exports = {
  getLecturesByCourseId,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
  courseExists,
  getUserCourseRole,
  getUserIdByEmail,
};
