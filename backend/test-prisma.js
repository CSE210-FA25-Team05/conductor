// Quick Prisma test - run with: node test-prisma.js
require('dotenv').config();
const prisma = require('./src/prisma');

async function test() {
  try {
    console.log('🔌 Testing Prisma connection...');
    await prisma.$connect();

    const count = await prisma.user.count();
    console.log(`✅ Connected! Found ${count} users in database.`);

    const users = await prisma.user.findMany({ take: 3 });
    console.log('📋 Sample users:');
    users.forEach((u) => console.log(`   - ${u.email} (${u.globalRole})`));

    await prisma.$disconnect();
    console.log('✅ Test passed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

test();
