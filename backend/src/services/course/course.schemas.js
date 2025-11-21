export const JoinCodeType = { type: 'string', minLength: 6, maxLength: 6 };
export const DateType = { type: 'string', format: 'date' };
export const DateTimeType = { type: 'string', format: 'date-time' };

export const CreateCourseParams = {
  type: 'object',
  properties: {
    course_code: { type: 'string' },
    course_name: { type: 'string' },
    term: { type: 'string' },
    section: { type: 'string', default: '1' },
    join_code: JoinCodeType,
    start_date: DateType,
    end_date: DateType,
  },
  required: ['course_code', 'course_name', 'term', 'start_date', 'end_date'],
};

export const UpdateCourseParams = {
  type: 'object',
  properties: {
    course_code: { type: 'string' },
    course_name: { type: 'string' },
    term: { type: 'string' },
    section: { type: 'string' },
    join_code: JoinCodeType,
    start_date: DateType,
    end_date: DateType,
  },
};

export const CourseInfo = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    course_code: { type: 'string' },
    course_name: { type: 'string' },
    term: { type: 'string' },
    section: { type: 'string' },
    join_code: JoinCodeType,
    start_date: DateType,
    end_date: DateType,
  },
  required: [
    'id',
    'course_code',
    'course_name',
    'term',
    'section',
    'join_code',
    'start_date',
    'end_date',
  ],
};

export const AddEnrollmentParams = {
  type: 'object',
  properties: {
    user_id: { type: 'number' },
    team_id: { type: 'number', nullable: true },
    created_date: DateTimeType,
    role: { type: 'string', default: 'student' },
  },
  required: ['user_id'],
};

export const UpdateEnrollmentParams = {
  type: 'object',
  properties: {
    role: { type: 'string' },
  },
  required: ['role'],
};

export const EnrollmentInfo = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    user_id: { type: 'number' },
    course_id: { type: 'number' },
    team_id: { type: 'number' },
    created_date: DateTimeType,
    role: { type: 'string' },
  },
  required: ['id', 'user_id', 'course_id', 'team_id', 'created_date', 'role'],
};
