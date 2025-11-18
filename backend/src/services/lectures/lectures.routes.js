'use strict';

// This file defines the API endpoints for lectures
// Think of it as the "front door" - it receives HTTP requests and sends back responses
//
// Endpoints:
// GET    /api/courses/:course_id/lectures           - Get all lectures for a course
// GET    /api/courses/:course_id/lectures/:lecture_id - Get one specific lecture
// POST   /api/courses/:course_id/lectures           - Create a new lecture (professor/TA only)
// PATCH  /api/courses/:course_id/lectures/:lecture_id - Update a lecture (professor/TA only)
// DELETE /api/courses/:course_id/lectures/:lecture_id - Delete a lecture (professor/TA only)

const lecturesRepo = require('./lectures.repo');
const lecturesService = require('./lectures.service');

async function routes(fastify) {
  // Helper function to convert the logged-in user's email to a database user ID
  // The auth system gives us an email, but we need the database ID to check enrollments
  async function getDbUserId(req) {
    if (!req.user || !req.user.email) {
      return null;
    }
    return lecturesRepo.getUserIdByEmail(req.user.email);
  }

  // Get all lectures for a course
  // Anyone enrolled in the course can see the lecture list
  fastify.get(
    '/api/courses/:course_id/lectures',
    { preHandler: fastify.authenticate }, // Must be logged in
    async (req, reply) => {
      try {
        // Get the course ID from the URL
        const courseId = parseInt(req.params.course_id, 10);
        if (isNaN(courseId)) {
          return reply.code(400).send({ error: 'Invalid course_id' });
        }

        // Figure out who is making this request
        const userId = await getDbUserId(req);
        if (!userId) {
          return reply.code(401).send({ error: 'User not found in database' });
        }

        // Check if this user is actually enrolled in the course
        // Students can view, but random people can't
        const canView = await lecturesService.canViewLectures(userId, courseId);
        if (!canView) {
          return reply
            .code(403)
            .send({ error: 'You are not enrolled in this course' });
        }

        // Make sure the course actually exists
        const courseExists = await lecturesRepo.courseExists(courseId);
        if (!courseExists) {
          return reply.code(404).send({ error: 'Course not found' });
        }

        // Finally, get all the lectures and send them back
        const lectures = await lecturesRepo.getLecturesByCourseId(courseId);
        return reply.send({ lectures });
      } catch (e) {
        req.log.error(e);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get a single lecture
  fastify.get(
    '/api/courses/:course_id/lectures/:lecture_id',
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      try {
        const courseId = parseInt(req.params.course_id, 10);
        const lectureId = parseInt(req.params.lecture_id, 10);

        if (isNaN(courseId) || isNaN(lectureId)) {
          return reply
            .code(400)
            .send({ error: 'Invalid course_id or lecture_id' });
        }

        const userId = await getDbUserId(req);
        if (!userId) {
          return reply.code(401).send({ error: 'User not found in database' });
        }

        // Check if user can view lectures
        const canView = await lecturesService.canViewLectures(userId, courseId);
        if (!canView) {
          return reply
            .code(403)
            .send({ error: 'You are not enrolled in this course' });
        }

        const lecture = await lecturesRepo.getLectureById(lectureId, courseId);
        if (!lecture) {
          return reply.code(404).send({ error: 'Lecture not found' });
        }

        return reply.send({ lecture });
      } catch (e) {
        req.log.error(e);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Create a new lecture
  fastify.post(
    '/api/courses/:course_id/lectures',
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      try {
        const courseId = parseInt(req.params.course_id, 10);
        if (isNaN(courseId)) {
          return reply.code(400).send({ error: 'Invalid course_id' });
        }

        const userId = await getDbUserId(req);
        if (!userId) {
          return reply.code(401).send({ error: 'User not found in database' });
        }

        // Check if this user is allowed to create lectures
        // Only professors and TAs can do this - students get blocked
        const canModify = await lecturesService.canModifyLectures(
          userId,
          courseId
        );
        if (!canModify) {
          return reply
            .code(403)
            .send({ error: 'Only professors and TAs can create lectures' });
        }

        // Make sure the course actually exists before creating a lecture for it
        const courseExists = await lecturesRepo.courseExists(courseId);
        if (!courseExists) {
          return reply.code(404).send({ error: 'Course not found' });
        }

        // Check if the data they sent makes sense
        // Like making sure they provided a date and it's a real date
        const validation = lecturesService.validateLectureData(req.body);
        if (!validation.valid) {
          return reply.code(400).send({ error: validation.error });
        }

        const lecture = await lecturesRepo.createLecture({
          course_id: courseId,
          lecture_date: req.body.lecture_date,
          code: req.body.code || null,
        });

        return reply.code(201).send({ lecture });
      } catch (e) {
        req.log.error(e);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Update a lecture
  fastify.patch(
    '/api/courses/:course_id/lectures/:lecture_id',
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      try {
        const courseId = parseInt(req.params.course_id, 10);
        const lectureId = parseInt(req.params.lecture_id, 10);

        if (isNaN(courseId) || isNaN(lectureId)) {
          return reply
            .code(400)
            .send({ error: 'Invalid course_id or lecture_id' });
        }

        const userId = await getDbUserId(req);
        if (!userId) {
          return reply.code(401).send({ error: 'User not found in database' });
        }

        // Check if user can modify lectures
        const canModify = await lecturesService.canModifyLectures(
          userId,
          courseId
        );
        if (!canModify) {
          return reply
            .code(403)
            .send({ error: 'Only professors and TAs can update lectures' });
        }

        // Check if lecture exists
        const existingLecture = await lecturesRepo.getLectureById(
          lectureId,
          courseId
        );
        if (!existingLecture) {
          return reply.code(404).send({ error: 'Lecture not found' });
        }

        // Validate update data if provided
        if (req.body.lecture_date || req.body.code !== undefined) {
          const updateData = {
            lecture_date: req.body.lecture_date || existingLecture.lecture_date,
            code:
              req.body.code !== undefined
                ? req.body.code
                : existingLecture.code,
          };

          const validation = lecturesService.validateLectureData(updateData);
          if (!validation.valid) {
            return reply.code(400).send({ error: validation.error });
          }

          const lecture = await lecturesRepo.updateLecture(
            lectureId,
            updateData
          );
          return reply.send({ lecture });
        }

        // No fields to update
        return reply.send({ lecture: existingLecture });
      } catch (e) {
        req.log.error(e);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Delete a lecture
  fastify.delete(
    '/api/courses/:course_id/lectures/:lecture_id',
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      try {
        const courseId = parseInt(req.params.course_id, 10);
        const lectureId = parseInt(req.params.lecture_id, 10);

        if (isNaN(courseId) || isNaN(lectureId)) {
          return reply
            .code(400)
            .send({ error: 'Invalid course_id or lecture_id' });
        }

        const userId = await getDbUserId(req);
        if (!userId) {
          return reply.code(401).send({ error: 'User not found in database' });
        }

        // Check if user can modify lectures
        const canModify = await lecturesService.canModifyLectures(
          userId,
          courseId
        );
        if (!canModify) {
          return reply
            .code(403)
            .send({ error: 'Only professors and TAs can delete lectures' });
        }

        // Check if lecture exists
        const existingLecture = await lecturesRepo.getLectureById(
          lectureId,
          courseId
        );
        if (!existingLecture) {
          return reply.code(404).send({ error: 'Lecture not found' });
        }

        await lecturesRepo.deleteLecture(lectureId);
        return reply.send({ message: 'Lecture deleted successfully' });
      } catch (e) {
        req.log.error(e);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

module.exports = routes;
