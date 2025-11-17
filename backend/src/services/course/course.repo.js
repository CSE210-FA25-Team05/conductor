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
            where: { courses: { some: { id: courseId } } },
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
                id: userId,
                courses: { some: { id: courseId } },
            },
        });
        return user;
}

async function addCourse(fastify, courseData) {
    const {
        course_code,
        course_name,
        term,
        section = null,
        start_date = null,
        end_date = null,
    } = courseData || {}
    if (!course_code || !course_name || !term) {
        const e = new Error('course_code, course_name, term are required')
        e.code = 'BAD_REQUEST'
        throw e
    }
    const created = await fastify.db.courses.create({
        data: {
            course_code,
            course_name,
            term,
            section,
            start_date: start_date ? new Date(start_date) : null,
            end_date:   end_date   ? new Date(end_date)   : null,
        },
    })
    return created
}

async function updateCourse(fastify, courseId, updateData) {
    const updatedCourse = await fastify.db.courses.update({
        where: { id: courseId },
        data: updateData,
    });
    return updatedCourse;
}

async function deleteCourse(fastify, courseId) {
    const deletedCourse = await fastify.db.courses.delete({
        where: { id: courseId },
    });
    return deletedCourse;
}

module.exports = {getAllCourse, getCourseById, getUsersInCourse, getUserDetailsInCourse, addCourse, updateCourse, deleteCourse};