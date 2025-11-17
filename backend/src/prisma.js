'use strict'

const fp = require('fastify-plugin')
const { PrismaClient } = require('@prisma/client')

module.exports = fp(async function prismaPlugin (fastify) {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

  // Establish connection
  await prisma.$connect()

  // Attach to fastify instance
  fastify.decorate('db', prisma)

  // Managed disconnection by Fastify lifecycle
  fastify.addHook('onClose', async (app) => {
    await app.db.$disconnect()
  })
})
