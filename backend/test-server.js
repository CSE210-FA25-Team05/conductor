// scripts/test-create-course.js
/* eslint-disable no-console */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001/api'
const AUTH = process.env.AUTH_TOKEN || '' // optional, if you have auth

function headers() {
  const h = { 'Content-Type': 'application/json' }
  if (AUTH) h['Authorization'] = AUTH
  return h
}

async function addCourseTest() {
  const course = {
    course_code: 'CSE240',
    course_name: 'Computer Architecture',
    term: '25SP',
    section: 'A',
    start_date: '2025-03-31T00:00:00.000Z',
    end_date: '2025-06-15T00:00:00.000Z'
  }

  console.log('→ Creating new course...')
  const res = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(course)
  })

  console.log('Status:', res.status)
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  console.log('Response:', data)

  if (res.ok) {
    console.log(`✅ Course created successfully (id=${data.id})`)
  } else {
    console.error('❌ Course creation failed')
    process.exit(1)
  }
}


// delete course by id
async function deleteCourse(courseId) {
  console.log(`→ Deleting course id=${courseId}...`)
  const res = await fetch(`${BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: headers(),
    body: JSON.stringify({}),
  })

  console.log('Status:', res.status)
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  console.log('Response:', data)

  if (res.ok) {
    console.log(`✅ Course id=${courseId} deleted successfully`)
  } else {
    console.error(`❌ Failed to delete course id=${courseId}`)
  }
}

// update course test
async function updateCourseTest(courseId, updateData) {
  console.log(`→ Updating course id=${courseId}...`)
  const res = await fetch(`${BASE_URL}/courses/${courseId}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(updateData),
  })

  console.log('Status:', res.status)
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  console.log('Response:', data)

  if (res.ok) {
    console.log(`✅ Course id=${courseId} updated successfully`)
  } else {
    console.error(`❌ Failed to update course id=${courseId}`)
  }
}

// get all courses test
async function getAllCoursesTest() {
  console.log('→ Fetching all courses...')
  const res = await fetch(`${BASE_URL}/courses`, {
    method: 'GET',
    headers: headers(),
  })

  console.log('Status:', res.status)
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  console.log('Response:', data)

  if (res.ok) {
    console.log(`✅ Fetched ${data.length} courses successfully`)
  } else {
    console.error('❌ Failed to fetch courses')
  }
}

// Run tests

addCourseTest()
// updateCourseTest(11, { course_name: 'Updated Course Name' })
// getAllCoursesTest()
// deleteCourse(11)