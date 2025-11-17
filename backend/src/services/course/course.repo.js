'use strict';

/**
 * Course Repository
 *
 * This module provides data access methods for course-related operations.
 */

/**
 * Get all courses.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @returns {Promise<Array>} List of all courses
 */
async function getAllCourse(fastify) {
  const courses = await fastify.db.courses.findMany();
  return courses;
}

/**
 * Get a course by ID.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @returns {Promise<Object>} Course object
 */
async function getCourseById(fastify, courseId) {
  const course = await fastify.db.courses.findUnique({
    where: { id: courseId },
  });
  return course;
}

/**
 * Get users in a course.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @returns {Promise<Array>} List of users in the course
 */
async function getUsersInCourse(fastify, courseId) {
  const users = await fastify.db.enrollments.findMany({
    where: { course_id: courseId },
  });
  return users;
}

/**
 * Get user details in a course.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @returns {Promise<Object>} User object
 */
async function getUserDetailsInCourse(fastify, courseId, userId) {
  const user = await fastify.db.enrollments.findFirst({
    where: {
      user_id: userId,
      course_id: courseId,
    },
  });
  return user;
}

/** Add a new course.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @param {Object} courseData - Data for the new course
 * @returns {Promise<Object>} Created course object
 */
async function addCourse(fastify, courseData) {
  const {
    course_code,
    course_name,
    term,
    section = null,
    start_date = null,
    end_date = null,
  } = courseData || {};
  if (!course_code || !course_name || !term) {
    const e = new Error('course_code, course_name, term are required');
    e.code = 'BAD_REQUEST';
    throw e;
  }
  const created = await fastify.db.courses.create({
    data: {
      course_code,
      course_name,
      term,
      section,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
    },
  });
  return created;
}

/** Update course details.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @param {number} courseId - ID of the course to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated course object
 */
async function updateCourse(fastify, courseId, updateData) {
  const updatedCourse = await fastify.db.courses.update({
    where: { id: courseId },
    data: updateData,
  });
  return updatedCourse;
}

/** Delete a course.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @param {number} courseId - ID of the course to delete
 * @returns {Promise<Object>} Deleted course object
 */
async function deleteCourse(fastify, courseId) {
  const deletedCourse = await fastify.db.courses.delete({
    where: { id: courseId },
  });
  return deletedCourse;
}

/** Get the join code for a course.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @param {number} courseId - ID of the course
 * @returns {Promise<string>} Join code of the course
 */
async function getCourseJoinCode(fastify, courseId) {
  const course = await fastify.db.courses.findUnique({
    where: { id: courseId },
    select: { join_code: true },
  });
  return course ? course.join_code : null;
}

/** Add an enrollment of a user into a course.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @param {number} courseId - ID of the course
 * @param {number} userId - ID of the user
 * @returns {Promise<Object>} Created enrollment object
 */
async function addEnrollment(fastify, courseId, userId) {
  const enrollment = await fastify.db.enrollments.create({
    data: {
      course_id: courseId,
      user_id: userId,
    },
  });
  return enrollment;
}

/** Update the role of a user in a course enrollment.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @param {number} courseId - ID of the course
 * @param {number} userId - ID of the user
 * @param {string} role - New role to assign
 * @returns {Promise<Object>} Updated enrollment object
 */
async function updateEnrollmentRole(fastify, courseId, userId, role) {
  const updatedEnrollment = await fastify.db.enrollments.updateMany({
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
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @param {number} courseId - ID of the course
 * @param {number} userId - ID of the user
 * @returns {Promise<Object>} Deleted enrollment object
 */
async function deleteEnrollment(fastify, courseId, userId) {
  const deletedEnrollment = await fastify.db.enrollments.deleteMany({
    where: {
      course_id: courseId,
      user_id: userId,
    },
  });
  return deletedEnrollment;
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
