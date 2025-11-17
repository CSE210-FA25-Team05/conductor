'use strict';

/**
 * course service module
 * This module provides business logic for course-related operations.
 */

const courseRepo = require('./course.repo');

/**
 * Check the join code for a course.
 * @param {FastifyInstance} fastify - Fastify instance with Prisma client
 * @param {number} courseId - ID of the course
 * @param {string} joinCode - Join code to verify
 * @returns {Promise<boolean>} True if join code matches, false otherwise
 */
async function checkCourseJoinCode(fastify, courseId, joinCode) {
  const storedJoinCode = await courseRepo.getCourseJoinCode(fastify, courseId);
  return storedJoinCode === joinCode;
}

module.exports = {
  checkCourseJoinCode,
};