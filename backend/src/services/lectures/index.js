'use strict';

/**
 * Lectures Service Plugin
 *
 * This plugin wires the lectures routes into the Fastify instance.
 */

const lecturesRoutes = require('./lectures.routes');

module.exports = async function lecturesServicePlugin(fastify, opts) {
  fastify.register(lecturesRoutes);
};
