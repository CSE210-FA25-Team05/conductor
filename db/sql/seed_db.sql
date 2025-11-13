-- Seed users
INSERT INTO users (first_name, last_name, email, pronouns, global_role) VALUES
    ('Professor', 'Mathematics', 'mathprof@ucsd.edu', 'She/Her/Hers', 'professor'),
    ('TA',        'Genius',      'genius_ta@ucsd.edu', 'He/Him/His',  'student'),
    ('John',      'Doe',         'jdoe@ucsd.edu',      'He/Him/His',  'student'),
    ('Jane',      'Doe',         'jd563@ucsd.edu',     'She/Her/Hers','student');

-- Seed courses
INSERT INTO courses (course_code, course_name, term, section, instructor_id, start_date, end_date) VALUES
    (
        'CSE210',
        'Software Engineering',
        'FA25',
        'A00',
        (SELECT id FROM users WHERE email = 'mathprof@ucsd.edu'),
        '2025-09-23',
        '2025-12-12'
    ),
    (
        'CSE110',
        'Intro to Programming',
        'FA25',
        'A00',
        (SELECT id FROM users WHERE email = 'mathprof@ucsd.edu'),
        '2025-09-23',
        '2025-12-12'
    );

-- Teams for CSE210
INSERT INTO teams (course_id, name, description) VALUES
    (
        (SELECT id FROM courses
         WHERE course_code = 'CSE210'
           AND term = 'FA25'
           AND section = 'A00'),
        'Team 1',
        'Project Team 1 for CSE210'
    ),
    (
        (SELECT id FROM courses
         WHERE course_code = 'CSE210'
           AND term = 'FA25'
           AND section = 'A00'),
        'Team 2',
        'Project Team 2 for CSE210'
    ),
    (
        (SELECT id FROM courses
         WHERE course_code = 'CSE210'
           AND term = 'FA25'
           AND section = 'A00'),
        'Team 3',
        'Project Team 3 for CSE210'
    );

-- Teams for CSE110
INSERT INTO teams (course_id, name, description) VALUES
    (
        (SELECT id FROM courses
         WHERE course_code = 'CSE110'
           AND term = 'FA25'
           AND section = 'A00'),
        'Lab Team A',
        'Lab team A for CSE110'
    ),
    (
        (SELECT id FROM courses
         WHERE course_code = 'CSE110'
           AND term = 'FA25'
           AND section = 'A00'),
        'Lab Team B',
        'Lab team B for CSE110'
    );

-- Instructor enrollments
INSERT INTO enrollments (user_id, course_id, role) VALUES
    (
        (SELECT id FROM users WHERE email = 'mathprof@ucsd.edu'),
        (SELECT id FROM courses
         WHERE course_code = 'CSE210'
           AND term = 'FA25'
           AND section = 'A00'),
        'instructor'
    ),
    (
        (SELECT id FROM users WHERE email = 'mathprof@ucsd.edu'),
        (SELECT id FROM courses
         WHERE course_code = 'CSE110'
           AND term = 'FA25'
           AND section = 'A00'),
        'instructor'
    );

-- TA enrollments
INSERT INTO enrollments (user_id, course_id, role) VALUES
    (
        (SELECT id FROM users WHERE email = 'genius_ta@ucsd.edu'),
        (SELECT id FROM courses
         WHERE course_code = 'CSE210'
           AND term = 'FA25'
           AND section = 'A00'),
        'ta'
    ),
    (
        (SELECT id FROM users WHERE email = 'genius_ta@ucsd.edu'),
        (SELECT id FROM courses
         WHERE course_code = 'CSE110'
           AND term = 'FA25'
           AND section = 'A00'),
        'ta'
    );

-- Student enrollments for CSE210
INSERT INTO enrollments (user_id, course_id, team_id, role) VALUES
    (
        (SELECT id FROM users WHERE email = 'jdoe@ucsd.edu'),
        (SELECT id FROM courses
         WHERE course_code = 'CSE210'
           AND term = 'FA25'
           AND section = 'A00'),
        (SELECT t.id
         FROM teams t
         JOIN courses c ON t.course_id = c.id
         WHERE c.course_code = 'CSE210'
           AND c.term = 'FA25'
           AND c.section = 'A00'
           AND t.name = 'Team 1'),
        'student'
    ),
    (
        (SELECT id FROM users WHERE email = 'jd563@ucsd.edu'),
        (SELECT id FROM courses
         WHERE course_code = 'CSE210'
           AND term = 'FA25'
           AND section = 'A00'),
        (SELECT t.id
         FROM teams t
         JOIN courses c ON t.course_id = c.id
         WHERE c.course_code = 'CSE210'
           AND c.term = 'FA25'
           AND c.section = 'A00'
           AND t.name = 'Team 2'),
        'student'
    );

-- Student enrollments for CSE110
INSERT INTO enrollments (user_id, course_id, team_id, role) VALUES
    (
        (SELECT id FROM users WHERE email = 'jdoe@ucsd.edu'),
        (SELECT id FROM courses
         WHERE course_code = 'CSE110'
           AND term = 'FA25'
           AND section = 'A00'),
        (SELECT t.id
         FROM teams t
         JOIN courses c ON t.course_id = c.id
         WHERE c.course_code = 'CSE110'
           AND c.term = 'FA25'
           AND c.section = 'A00'
           AND t.name = 'Lab Team A'),
        'student'
    ),
    (
        (SELECT id FROM users WHERE email = 'jd563@ucsd.edu'),
        (SELECT id FROM courses
         WHERE course_code = 'CSE110'
           AND term = 'FA25'
           AND section = 'A00'),
        (SELECT t.id
         FROM teams t
         JOIN courses c ON t.course_id = c.id
         WHERE c.course_code = 'CSE110'
           AND c.term = 'FA25'
           AND c.section = 'A00'
           AND t.name = 'Lab Team B'),
        'student'
    );

-- TA (genius_ta@ucsd.edu) assigned to some teams
INSERT INTO ta_teams (ta_user_id, team_id) VALUES
    (
        (SELECT id FROM users WHERE email = 'genius_ta@ucsd.edu'),
        (SELECT t.id
         FROM teams t
         JOIN courses c ON t.course_id = c.id
         WHERE c.course_code = 'CSE210'
           AND c.term = 'FA25'
           AND c.section = 'A00'
           AND t.name = 'Team 1')
    ),
    (
        (SELECT id FROM users WHERE email = 'genius_ta@ucsd.edu'),
        (SELECT t.id
         FROM teams t
         JOIN courses c ON t.course_id = c.id
         WHERE c.course_code = 'CSE210'
           AND c.term = 'FA25'
           AND c.section = 'A00'
           AND t.name = 'Team 2')
    ),
    (
        (SELECT id FROM users WHERE email = 'genius_ta@ucsd.edu'),
        (SELECT t.id
         FROM teams t
         JOIN courses c ON t.course_id = c.id
         WHERE c.course_code = 'CSE110'
           AND c.term = 'FA25'
           AND c.section = 'A00'
           AND t.name = 'Lab Team A')
    );
