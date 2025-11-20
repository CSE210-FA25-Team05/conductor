require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.attendances.deleteMany();
  await prisma.lectures.deleteMany();
  await prisma.ta_teams.deleteMany();
  await prisma.enrollments.deleteMany();
  await prisma.teams.deleteMany();
  await prisma.courses.deleteMany();
  await prisma.credentials.deleteMany();
  await prisma.oauth_accounts.deleteMany();
  await prisma.users.deleteMany();

  // Seed users
  console.log('Creating users...');
  const professor = await prisma.users.create({
    data: {
      first_name: 'Professor',
      last_name: 'Mathematics',
      email: 'mathprof@ucsd.edu',
      pronouns: 'She/Her/Hers',
      global_role: 'professor',
    },
  });

  const ta = await prisma.users.create({
    data: {
      first_name: 'TA',
      last_name: 'Genius',
      email: 'genius_ta@ucsd.edu',
      pronouns: 'He/Him/His',
      global_role: 'student',
    },
  });

  const john = await prisma.users.create({
    data: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'jdoe@ucsd.edu',
      pronouns: 'He/Him/His',
      global_role: 'student',
    },
  });

  const jane = await prisma.users.create({
    data: {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jd563@ucsd.edu',
      pronouns: 'She/Her/Hers',
      global_role: 'student',
    },
  });

  // Seed courses
  console.log('Creating courses...');
  const cse210 = await prisma.courses.create({
    data: {
      course_code: 'CSE210',
      course_name: 'Software Engineering',
      term: 'FA25',
      section: 'A00',
      start_date: new Date('2025-09-23'),
      end_date: new Date('2025-12-12'),
      join_code: 'ABCDEF',
    },
  });

  const cse110 = await prisma.courses.create({
    data: {
      course_code: 'CSE110',
      course_name: 'Intro to Programming',
      term: 'FA25',
      section: 'A00',
      start_date: new Date('2025-09-23'),
      end_date: new Date('2025-12-12'),
      join_code: 'HIJKLM',
    },
  });

  // Seed teams
  console.log('Creating teams...');
  const team1 = await prisma.teams.create({
    data: {
      course_id: cse210.id,
      name: 'Team 1',
      description: 'Project Team 1 for CSE210',
    },
  });

  const team2 = await prisma.teams.create({
    data: {
      course_id: cse210.id,
      name: 'Team 2',
      description: 'Project Team 2 for CSE210',
    },
  });

  const team3 = await prisma.teams.create({
    data: {
      course_id: cse210.id,
      name: 'Team 3',
      description: 'Project Team 3 for CSE210',
    },
  });

  const team4 = await prisma.teams.create({
    data: {
      course_id: cse110.id,
      name: 'Lab Team A',
      description: 'Lab team A for CSE110',
    },
  });

  const team5 = await prisma.teams.create({
    data: {
      course_id: cse110.id,
      name: 'Lab Team B',
      description: 'Lab team B for CSE110',
    },
  });

  // Seed enrollments
  console.log('Creating enrollments...');
  await prisma.enrollments.create({
    data: {
      user_id: professor.id,
      course_id: cse210.id,
      role: 'professor',
    },
  });

  await prisma.enrollments.create({
    data: {
      user_id: professor.id,
      course_id: cse110.id,
      role: 'professor',
    },
  });

  await prisma.enrollments.create({
    data: {
      user_id: ta.id,
      course_id: cse210.id,
      role: 'ta',
    },
  });

  await prisma.enrollments.create({
    data: {
      user_id: ta.id,
      course_id: cse110.id,
      role: 'ta',
    },
  });

  await prisma.enrollments.create({
    data: {
      user_id: john.id,
      course_id: cse210.id,
      team_id: team1.id,
      role: 'student',
    },
  });

  await prisma.enrollments.create({
    data: {
      user_id: jane.id,
      course_id: cse210.id,
      team_id: team2.id,
      role: 'student',
    },
  });

  await prisma.enrollments.create({
    data: {
      user_id: john.id,
      course_id: cse110.id,
      team_id: team4.id,
      role: 'student',
    },
  });

  await prisma.enrollments.create({
    data: {
      user_id: jane.id,
      course_id: cse110.id,
      team_id: team5.id,
      role: 'student',
    },
  });

  // Seed TA team assignments
  console.log('Creating TA team assignments...');
  await prisma.ta_teams.create({
    data: {
      ta_user_id: ta.id,
      course_id: cse210.id,
      team_id: team1.id,
    },
  });

  await prisma.ta_teams.create({
    data: {
      ta_user_id: ta.id,
      course_id: cse210.id,
      team_id: team2.id,
    },
  });

  await prisma.ta_teams.create({
    data: {
      ta_user_id: ta.id,
      course_id: cse110.id,
      team_id: team4.id,
    },
  });

  // Seed lectures
  console.log('Creating lectures...');
  const lecture1 = await prisma.lectures.create({
    data: {
      course_id: cse210.id,
      lecture_date: new Date('2025-10-01'),
      code: 'CSE210-L1',
    },
  });

  const lecture2 = await prisma.lectures.create({
    data: {
      course_id: cse210.id,
      lecture_date: new Date('2025-10-03'),
      code: 'CSE210-L2',
    },
  });

  const lecture3 = await prisma.lectures.create({
    data: {
      course_id: cse110.id,
      lecture_date: new Date('2025-10-02'),
      code: 'CSE110-L1',
    },
  });

  // Seed attendances
  console.log('Creating attendances...');
  await prisma.attendances.create({
    data: {
      course_id: cse210.id,
      lecture_id: lecture1.id,
      student_id: john.id,
      updated_by: professor.id,
      update_reason: 'Initial attendance import',
    },
  });

  await prisma.attendances.create({
    data: {
      course_id: cse210.id,
      lecture_id: lecture1.id,
      student_id: jane.id,
      updated_by: professor.id,
      update_reason: 'Initial attendance import',
    },
  });

  await prisma.attendances.create({
    data: {
      course_id: cse210.id,
      lecture_id: lecture2.id,
      student_id: john.id,
      updated_by: ta.id,
      update_reason: 'Marked by TA during class',
    },
  });

  await prisma.attendances.create({
    data: {
      course_id: cse110.id,
      lecture_id: lecture3.id,
      student_id: john.id,
      updated_by: ta.id,
      update_reason: 'First lab session',
    },
  });

  await prisma.attendances.create({
    data: {
      course_id: cse110.id,
      lecture_id: lecture3.id,
      student_id: jane.id,
      updated_by: ta.id,
      update_reason: 'First lab session',
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
