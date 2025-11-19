'use strict';

const { join } = require("@prisma/client/runtime/library");

/**
 * Course Repository
 *
 * This module provides data access methods for course-related operations.
 */

/**
 * Get all courses.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @returns {Promise<Array>} List of all courses
 */
async function getAllCourse(db) {
  const courses = await db.courses.findMany();
  return courses;
}

/**
 * Get a course by ID.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @returns {Promise<Object>} Course object
 */
async function getCourseById(db, courseId) {
  const course = await db.courses.findUnique({
    where: { id: courseId },
  });
  return course;
}

/**
 * Get users in a course.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @returns {Promise<Array>} List of users in the course
 */
async function getUsersInCourse(db, courseId) {
  const users = await db.enrollments.findMany({
    where: { course_id: courseId },
  });
  return users;
}

/**
 * Get user details in a course.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @returns {Promise<Object>} User object
 */
async function getUserDetailsInCourse(db, courseId, userId) {
  const user = await db.enrollments.findFirst({
    where: {
      user_id: userId,
      course_id: courseId,
    },
  });
  return user;
}

/** Add a new course.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @param {Object} courseData - Data for the new course
 * @returns {Promise<Object>} Created course object
 */
async function addCourse(db, courseData) {
  const {
    course_code,
    course_name,
    term,
    section = null,
    start_date = null,
    end_date = null,
    join_code = null,
  } = courseData || {};

  // Validate required fields first
  if (!course_code || !course_name || !term) {
    const e = new Error('course_code, course_name, term are required');
    e.code = 'BAD_REQUEST';
    throw e;
  }

  // Ensure a unique join code exists on courseData
  if (join_code == null && !(courseData && courseData.join_code)) {
    // Generate a random 6-character join code
    let uniqueCode;
    do {
      uniqueCode = await generateJoinCode();
      const existingCourse = await db.courses.findUnique({
        where: { join_code: uniqueCode },
      });
      if (!existingCourse) {
        break;
      }
    } while (true);
    courseData = Object.assign({}, courseData, { join_code: uniqueCode });
  }

  const created = await db.courses.create({
    data: {
      course_code,
      course_name,
      term,
      section,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      join_code: (courseData && courseData.join_code) || join_code || null,
    },
  });
  return created;
}

/** Update course details.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @param {number} courseId - ID of the course to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated course object
 */
async function updateCourse(db, courseId, updateData) {
  const updatedCourse = await db.courses.update({
    where: { id: courseId },
    data: updateData,
  });
  return updatedCourse;
}

/** Delete a course.
 * @param {PrismaDBlient} db - Prisma DB client instance
 * @param {number} courseId - ID of the course to delete
 * @returns {Promise<Object>} Deleted course object
 */
async function deleteCourse(db, courseId) {
  const deletedCourse = await db.courses.delete({
    where: { id: courseId },
  });
  return deletedCourse;
}

/** Get the join code for a course.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @param {number} courseId - ID of the course
 * @returns {Promise<string>} Join code of the course
 */
async function getCourseJoinCode(db, courseId) {
  const course = await db.courses.findUnique({
    where: { id: courseId },
    select: { join_code: true },
  });
  return course ? course.join_code : null;
}

/** Add an enrollment of a user into a course.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @param {number} courseId - ID of the course
 * @param {number} userId - ID of the user
 * @returns {Promise<Object>} Created enrollment object
 */
async function addEnrollment(db, courseId, userId) {
  const enrollment = await db.enrollments.create({
    data: {
      course_id: courseId,
      user_id: userId,
    },
  });
  return enrollment;
}

/** Update the role of a user in a course enrollment.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @param {number} courseId - ID of the course
 * @param {number} userId - ID of the user
 * @param {string} role - New role to assign
 * @returns {Promise<Object>} Updated enrollment object
 */
async function updateEnrollmentRole(db, courseId, userId, role) {
  const updatedEnrollment = await db.enrollments.updateMany({
    where: {
      course_id: courseId,
      user_id: userId,
    },
    data: {
      role: role,
    },
  });
  return updatedEnrollment;
}

/** Delete an enrollment of a user from a course.
 * @param {PrismaDBClient} db - Prisma DB client instance
 * @param {number} courseId - ID of the course
 * @param {number} userId - ID of the user
 * @returns {Promise<Object>} Deleted enrollment object
 */
async function deleteEnrollment(db, courseId, userId) {
  const deletedEnrollment = await db.enrollments.deleteMany({
    where: {
      course_id: courseId,
      user_id: userId,
    },
  });
  return deletedEnrollment;
}

async function generateJoinCode() {
  const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let generatedCode = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedCode += characters.charAt(randomIndex);
    }
    return generatedCode;
}

module.exports = {
  getAllCourse,
  getCourseById,
  getUsersInCourse,
  getUserDetailsInCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseJoinCode,
  addEnrollment,
  updateEnrollmentRole,
  deleteEnrollment,
};
