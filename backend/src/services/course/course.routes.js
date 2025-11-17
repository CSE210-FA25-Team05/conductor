'use strict';

const { mapAndReply } = require('../../utils/error-map');

/**
 * Course Routes Plugin
 *
 * /api/courses - get all courses
 * /api/courses/:course_id - get specific course data
 * /api/courses/:course_id/users - get all users in class
 * /api/courses/:course_id/users/:user_id - get specific user details in context of course
 */

module.exports = async function courseRoutes(fastify, options) {
  const courseRepo = require('./course.repo');
  fastify.get('/courses', async (request, reply) => {
    try {
      const res = await courseRepo.getAllCourse(fastify);
      return res;
    } catch (error) {
      console.error(error);
      return mapAndReply(error, reply);
    }
  });

  fastify.get('/courses/:course_id', async (request, reply) => {
    try {
      const res = await courseRepo.getCourseById(
        fastify,
        parseInt(request.params.course_id, 10)
      );
      return res;
    } catch (error) {
      return mapAndReply(error, reply);
    }
  });

  fastify.get('/courses/:course_id/users', async (request, reply) => {
    try {
      const res = await courseRepo.getUsersInCourse(
        fastify,
        parseInt(request.params.course_id, 10)
      );
      return res;
    } catch (error) {
      return mapAndReply(error, reply);
    }
  });

  fastify.get('/courses/:course_id/users/:user_id', async (request, reply) => {
    try {
      const res = await courseRepo.getUserDetailsInCourse(
        fastify,
        parseInt(request.params.course_id, 10),
        parseInt(request.params.user_id, 10)
      );
      return res;
    } catch (error) {
      return mapAndReply(error, reply);
    }
  });

  fastify.post('/courses', async (request, reply) => {
    try {
      const course = await courseRepo.addCourse(fastify, request.body);
      reply.code(201).header('Location', `/courses/${course.id}`).send();
    } catch (error) {
      return mapAndReply(error, reply);
    }
  });

  fastify.patch('/courses/:course_id', async (request, reply) => {
    try {
      await courseRepo.updateCourse(
        fastify,
        parseInt(request.params.course_id, 10),
        request.body
      );
      reply.send();
    } catch (error) {
      return mapAndReply(error, reply);
    }
  });
  fastify.delete('/courses/:course_id', async (request, reply) => {
    try {
      await courseRepo.deleteCourse(
        fastify,
        parseInt(request.params.course_id, 10)
      );
      reply.code(204).send();
    } catch (error) {
      return mapAndReply(error, reply);
    }
  });
};
