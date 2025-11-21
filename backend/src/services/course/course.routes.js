'use strict';

const { mapAndReply } = require('../../utils/error-map');

/**
 * Course Routes Plugin
 * GET
 * /api/courses - get all courses
 * /api/courses/:course_id - get specific course data
 * /api/courses/:course_id/users - get all users in class
 * /api/courses/:course_id/users/:user_id - get specific user details in context of course
 *
 * POST
 * /api/courses - create a new course
 *
 * PATCH
 * /api/courses/:course_id - update course details
 *
 * DELETE
 * /api/courses/:course_id - delete a course
 *
 * POST
 * /api/courses/:course_id/users - enroll a user into a course
 * /api/courses/:course_id/join - join a course with join code
 *
 *
 */

module.exports = async function courseRoutes(fastify, options) {
  const courseRepo = require('./course.repo');
  const courseService = require('./course.service');
  const courseSchemas = require('./course.schemas');

  fastify.get(
    '/courses',
    {
      schema: {
        summary: 'Get all courses',
        tags: ['Courses'],
        response: {
          200: {
            type: 'array',
            items: courseSchemas.CourseInfo,
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const res = await courseRepo.getAllCourse(fastify.db);
        return res;
      } catch (error) {
        console.error(error);
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.get(
    '/courses/:course_id',
    {
      schema: {
        summary: 'Get a course with id',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
          },
        },
        response: {
          200: courseSchemas.CourseInfo,
        },
      },
    },
    async (request, reply) => {
      try {
        const res = await courseRepo.getCourseById(
          fastify.db,
          parseInt(request.params.course_id, 10)
        );
        return res;
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.get(
    '/courses/:course_id/users',
    {
      schema: {
        summary: 'Get a list of users in a course',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
          },
        },
        response: {
          200: {
            type: 'array',
            items: courseSchemas.EnrollmentInfo,
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const res = await courseRepo.getUsersInCourse(
          fastify.db,
          parseInt(request.params.course_id, 10)
        );
        return res;
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.get(
    '/courses/:course_id/users/:user_id',
    {
      schema: {
        summary: 'Get a user in a course',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
            user_id: { type: 'number' },
          },
        },
        response: {
          200: courseSchemas.EnrollmentInfo,
        },
      },
    },
    async (request, reply) => {
      try {
        const res = await courseRepo.getUserDetailsInCourse(
          fastify.db,
          parseInt(request.params.course_id, 10),
          parseInt(request.params.user_id, 10)
        );
        return res;
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.post(
    '/courses',
    {
      schema: {
        summary: 'Create a course',
        tags: ['Courses'],
        body: courseSchemas.CreateCourseParams,
        response: {
          201: courseSchemas.CourseInfo,
        },
      },
    },
    async (request, reply) => {
      try {
        const course = await courseRepo.addCourse(fastify.db, request.body);
        reply.code(201).send(course);
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.patch(
    '/courses/:course_id',
    {
      schema: {
        summary: 'Update a course with id',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
          },
        },
        body: courseSchemas.UpdateCourseParams,
        response: {
          200: courseSchemas.CourseInfo,
        },
      },
    },
    async (request, reply) => {
      try {
        await courseRepo.updateCourse(
          fastify.db,
          parseInt(request.params.course_id, 10),
          request.body
        );
        reply.send();
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.delete(
    '/courses/:course_id',
    {
      schema: {
        summary: 'Delete a course with id',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
          },
        },
        response: {
          204: { type: 'null' },
        },
      },
    },
    async (request, reply) => {
      try {
        await courseRepo.deleteCourse(
          fastify.db,
          parseInt(request.params.course_id, 10)
        );
        reply.code(204).send();
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.post(
    '/courses/:course_id/users',
    {
      schema: {
        summary: 'Add a user in a course',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
          },
        },
        body: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
          },
          required: ['user_id'],
        },
        response: {
          201: courseSchemas.EnrollmentInfo,
        },
      },
    },
    async (request, reply) => {
      try {
        await courseRepo.addEnrollment(
          fastify.db,
          parseInt(request.params.course_id, 10),
          request.body.user_id
        );
        reply.code(201).send();
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.post(
    '/courses/:course_id/join',
    {
      schema: {
        summary: 'Enroll in a course using the course code',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
          },
        },
        body: {
          type: 'object',
          properties: {
            join_code: courseSchemas.JoinCodeType,
            user_id: { type: 'number' },
          },
          required: ['join_code'],
        },
        response: {
          200: courseSchemas.EnrollmentInfo,
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const isValid = await courseService.checkCourseJoinCode(
          fastify.db,
          parseInt(request.params.course_id, 10),
          request.body.join_code
        );
        if (!isValid) {
          return reply.code(400).send({ error: 'Invalid join code' });
        }
        await courseRepo.addEnrollment(
          fastify.db,
          parseInt(request.params.course_id, 10),
          request.body.user_id
        );
        reply.code(201).send();
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.patch(
    '/courses/:course_id/users/:user_id',
    {
      schema: {
        summary: 'Update user enrollment in a course',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
            user_id: { type: 'number' },
          },
        },
        body: courseSchemas.UpdateEnrollmentParams,
        response: {
          200: courseSchemas.EnrollmentInfo,
        },
      },
    },
    async (request, reply) => {
      try {
        await courseRepo.updateEnrollmentRole(
          fastify.db,
          parseInt(request.params.course_id, 10),
          parseInt(request.params.user_id, 10),
          request.body.role
        );
        reply.send();
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );

  fastify.delete(
    '/courses/:course_id/users/:user_id',
    {
      schema: {
        summary: 'Remove a user from a course',
        tags: ['Courses'],
        params: {
          type: 'object',
          properties: {
            course_id: { type: 'number' },
            user_id: { type: 'number' },
          },
        },
        response: {
          204: courseSchemas.EnrollmentInfo,
        },
      },
    },
    async (request, reply) => {
      try {
        await courseRepo.deleteEnrollment(
          fastify.db,
          parseInt(request.params.course_id, 10),
          parseInt(request.params.user_id, 10)
        );
        reply.code(204).send();
      } catch (error) {
        return mapAndReply(error, reply);
      }
    }
  );
};
