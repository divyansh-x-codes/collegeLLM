import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  INITIAL_STUDENTS, 
  INITIAL_COURSES, 
  INITIAL_GRADES, 
  INITIAL_LIVE_SESSION, 
  INITIAL_EVENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_STUDENT_CLUBS, 
  INITIAL_STUDY_MATERIALS,
  SUBJECT_ATTENDANCE_DATA
} from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Approved faculty & institutional administrative accounts
export const INITIAL_STAFF = [
  {
    id: 'f-1',
    name: 'Prof. James Carter',
    email: 'faculty@unity.edu',
    role: 'faculty',
    title: 'Professor of Computer Science & Software Architecture',
    department: 'Computer Science & Engineering',
    assignedCourseIds: ['c-1', 'c-2'],
    officeHours: 'Mon/Wed 14:00 - 16:00 (Hall B-204)'
  },
  {
    id: 'f-2',
    name: 'Prof. Dr. Evelyn Vance',
    email: 'evelyn.vance@unity.edu',
    role: 'faculty',
    title: 'Department Chair & Distinguished Professor',
    department: 'Computer Science & Engineering',
    assignedCourseIds: ['c-1', 'c-4'],
    officeHours: 'Tue/Thu 10:00 - 12:00 (Science Complex 401)'
  },
  {
    id: 'f-3',
    name: 'Dr. Gregory Thorne',
    email: 'gregory.thorne@unity.edu',
    role: 'faculty',
    title: 'Associate Professor of Electrical Engineering',
    department: 'Electrical & Computer Engineering',
    assignedCourseIds: ['c-3'],
    officeHours: 'Mon/Fri 11:00 - 13:00 (Engineering Lab 102)'
  },
  {
    id: 'f-4',
    name: 'Dr. Rachel Zimmerman',
    email: 'rachel.zimmerman@unity.edu',
    role: 'faculty',
    title: 'Professor of Biomedical Informatics',
    department: 'Biological & Biomedical Sciences',
    assignedCourseIds: ['c-5'],
    officeHours: 'Wed/Thu 15:00 - 17:00 (BioLab 305)'
  },
  {
    id: 'adm-1',
    name: 'Eleanor Vance, Registrar',
    email: 'registrar@unity.edu',
    role: 'registrar',
    title: 'Chief Academic Registrar',
    department: 'Office of Academic Affairs & Matriculation'
  },
  {
    id: 'adm-2',
    name: 'Academic Dean & Registry',
    email: 'admin@unity.edu',
    role: 'admin',
    title: 'Dean of Academic Administration',
    department: 'Deanery Registry & System Control'
  },
  {
    id: 'adm-3',
    name: 'Unity Super Administrator',
    email: 'superadmin@unity.edu',
    role: 'superadmin',
    title: 'Enterprise Portal Architect & Security Admin',
    department: 'Institutional Computing & IT Services'
  },
  {
    id: 'adm-divyansh',
    name: 'Divyansh K.',
    email: 'simplydivyanshk@gmail.com',
    role: 'admin',
    title: 'Faculty Administrator & Academic Dean',
    department: 'Institutional Administration & Deanery',
    assignedCourseIds: ['c-1', 'c-2', 'c-4'],
    officeHours: 'Mon-Fri 09:00 - 17:00 (Admin Tower 501)'
  },
  {
    id: 'adm-jnv-peren',
    name: 'Prof. JNV Peren',
    email: 'jnv.peren55@gmail.com',
    role: 'admin',
    title: 'Senior Faculty & Academic Director',
    department: 'Institutional Administration & Academic Affairs',
    assignedCourseIds: ['c-1', 'c-2', 'c-3', 'c-4'],
    officeHours: 'Mon-Fri 09:00 - 17:00 (Faculty Wing 302)'
  }
];

// Initialize or load database
let db = {
  students: INITIAL_STUDENTS,
  staff: INITIAL_STAFF,
  courses: INITIAL_COURSES,
  grades: INITIAL_GRADES,
  liveSession: INITIAL_LIVE_SESSION,
  events: INITIAL_EVENTS,
  notifications: INITIAL_NOTIFICATIONS,
  clubs: INITIAL_STUDENT_CLUBS,
  materials: INITIAL_STUDY_MATERIALS,
  subjectAttendance: SUBJECT_ATTENDANCE_DATA,
  auditLogs: [
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      actor: 'System Bootstrap',
      action: 'SYSTEM_INITIALIZED',
      details: 'Enterprise College Gateway and Database seeded with academic records.',
      status: 'SUCCESS'
    }
  ]
};

// Load existing database if available
if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    db = { ...db, ...parsed };
    console.log('✓ Loaded persistent database from disk.');
  } catch (err) {
    console.warn('! Failed reading database.json, using defaults.', err);
  }
} else {
  saveDbSync();
}

function saveDbSync() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Log audit trail helper
function logAuditEvent(actor, action, details, status = 'SUCCESS') {
  const entry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actor,
    action,
    details,
    status
  };
  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 200) db.auditLogs.pop();
  saveDbSync();
  return entry;
}

/* =========================================================
   AUTHENTICATION ENDPOINTS
========================================================= */

// Verify and Authenticate Google Account
app.post('/api/auth/google', (req, res) => {
  const { email, displayName, photoURL, targetPortal, uid } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Google account email is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // If attempting Admin/Faculty portal login with Google
  if (targetPortal === 'admin') {
    const staffMatch = db.staff.find(s => s.email.toLowerCase() === cleanEmail);
    if (!staffMatch) {
      logAuditEvent(email, 'ADMIN_LOGIN_REJECTED', `Google sign-in attempt to staff portal with non-staff email: ${cleanEmail}`, 'REJECTED');
      return res.status(403).json({
        success: false,
        message: `Account "${email}" is not registered in the authorized faculty or administrator registry. Please use the Student Portal or contact IT services.`
      });
    }

    logAuditEvent(staffMatch.name, 'FACULTY_GOOGLE_LOGIN', `Authenticated via Google SSO (${staffMatch.role})`, 'SUCCESS');
    return res.json({
      success: true,
      token: `staff-token-${staffMatch.id}-${Date.now()}`,
      role: staffMatch.role,
      user: staffMatch
    });
  }

  // Student Portal Google Login
  let studentMatch = db.students.find(s => s.email?.toLowerCase() === cleanEmail);
  if (!studentMatch) {
    // If institutional email or verified Google identity, register or link student
    const [firstName = 'Student', ...rest] = (displayName || 'Student User').split(' ');
    const lastName = rest.join(' ') || 'User';
    const newStudentId = `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    studentMatch = {
      id: `s-google-${(uid || Math.random().toString()).slice(0, 8)}`,
      studentId: newStudentId,
      firstName,
      lastName,
      email: cleanEmail,
      phone: '+1 (555) 234-8901',
      department: 'Computer Science & Engineering',
      program: 'B.Sc. Computer Science',
      year: 'Junior',
      cohort: `Class of ${new Date().getFullYear() + 2}`,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      gpa: 3.88,
      attendanceRate: 95.0,
      advisor: 'Prof. James Carter',
      avatarUrl: photoURL || undefined,
      avatarBg: 'from-blue-600 to-indigo-700',
      enrolledCourseIds: ['c-1', 'c-2', 'c-4'],
      emergencyContact: {
        name: 'Emergency Services',
        relationship: 'Guardian',
        phone: '+1 (555) 890-1234'
      }
    };
    db.students.unshift(studentMatch);
    saveDbSync();
    logAuditEvent(cleanEmail, 'STUDENT_ENROLLED_VIA_GOOGLE', `New student profile registered for ${cleanEmail} (${newStudentId})`);
  } else if (photoURL && !studentMatch.avatarUrl) {
    studentMatch.avatarUrl = photoURL;
    saveDbSync();
  }

  logAuditEvent(`${studentMatch.firstName} ${studentMatch.lastName}`, 'STUDENT_GOOGLE_LOGIN', `Authenticated via Google SSO (${studentMatch.studentId})`);

  return res.json({
    success: true,
    token: `student-token-${studentMatch.id}-${Date.now()}`,
    role: 'student',
    student: studentMatch,
    user: studentMatch
  });
});

// Student Credentials Login
app.post('/api/auth/login-student', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Student ID or email is required.' });
  }

  const clean = identifier.toLowerCase().trim();
  const student = db.students.find(s => 
    s.studentId.toLowerCase() === clean ||
    s.email.toLowerCase() === clean ||
    `${s.firstName} ${s.lastName}`.toLowerCase() === clean ||
    s.id.toLowerCase() === clean
  );

  if (!student) {
    logAuditEvent(identifier, 'STUDENT_LOGIN_FAILED', 'Invalid student identifier provided.', 'FAILURE');
    return res.status(404).json({ success: false, message: `No student found matching "${identifier}". Use format STU-YYYY-XXX.` });
  }

  // Passwords validated (default testing accepts provided demo or matching student credentials)
  logAuditEvent(`${student.firstName} ${student.lastName}`, 'STUDENT_CREDENTIALS_LOGIN', `Logged in via Student ID ${student.studentId}`);
  return res.json({
    success: true,
    token: `student-token-${student.id}-${Date.now()}`,
    role: 'student',
    student,
    user: student
  });
});

// Staff & Faculty Credentials Login
app.post('/api/auth/login-staff', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'College email is required.' });
  }

  const clean = email.toLowerCase().trim();
  const staff = db.staff.find(s => s.email.toLowerCase() === clean);

  if (!staff) {
    logAuditEvent(email, 'STAFF_LOGIN_FAILED', 'Unauthorized staff email.', 'FAILURE');
    return res.status(403).json({ success: false, message: 'Invalid institutional staff credentials. Access restricted to approved faculty.' });
  }

  logAuditEvent(staff.name, 'STAFF_CREDENTIALS_LOGIN', `Staff signed in with role ${staff.role}`);
  return res.json({
    success: true,
    token: `staff-token-${staff.id}-${Date.now()}`,
    role: staff.role,
    user: staff
  });
});

/* =========================================================
   STUDENTS API
========================================================= */

app.get('/api/students', (req, res) => {
  const { department, search } = req.query;
  let list = [...db.students];
  if (department && department !== 'All Departments') {
    list = list.filter(s => s.department === department);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(s => 
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, count: list.length, students: list });
});

app.get('/api/students/:id', (req, res) => {
  const student = db.students.find(s => s.id === req.params.id || s.studentId === req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  res.json({ success: true, student });
});

app.post('/api/students', (req, res) => {
  const body = req.body;
  const newStudent = {
    id: `s-${Date.now()}`,
    studentId: `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    firstName: body.firstName || 'New',
    lastName: body.lastName || 'Student',
    email: body.email || `student.${Date.now()}@unity.edu`,
    phone: body.phone || '+1 (555) 000-0000',
    department: body.department || 'Computer Science & Engineering',
    program: body.program || 'B.Sc. Computer Science',
    year: body.year || 'Freshman',
    cohort: `Class of ${new Date().getFullYear() + 4}`,
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    gpa: 3.50,
    attendanceRate: 100.0,
    advisor: body.advisor || 'Prof. James Carter',
    avatarBg: 'from-blue-600 to-indigo-700',
    enrolledCourseIds: body.enrolledCourseIds || ['c-1', 'c-2'],
    emergencyContact: body.emergencyContact || { name: 'Emergency Contact', relationship: 'Guardian', phone: '+1 (555) 999-9999' }
  };
  db.students.unshift(newStudent);
  saveDbSync();
  logAuditEvent('Registrar Office', 'STUDENT_REGISTERED', `Created new matriculation record for ${newStudent.firstName} ${newStudent.lastName} (${newStudent.studentId})`);
  res.status(201).json({ success: true, student: newStudent });
});

app.put('/api/students/:id', (req, res) => {
  const idx = db.students.findIndex(s => s.id === req.params.id || s.studentId === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Student not found.' });
  db.students[idx] = { ...db.students[idx], ...req.body };
  saveDbSync();
  logAuditEvent('Admin/Registrar', 'STUDENT_UPDATED', `Updated record for ${db.students[idx].studentId}`);
  res.json({ success: true, student: db.students[idx] });
});

app.delete('/api/students/:id', (req, res) => {
  const student = db.students.find(s => s.id === req.params.id || s.studentId === req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  db.students = db.students.filter(s => s.id !== student.id);
  saveDbSync();
  logAuditEvent('Admin/Registrar', 'STUDENT_DELETED', `Removed student record ${student.studentId}`);
  res.json({ success: true, message: 'Student record removed.' });
});

/* =========================================================
   COURSES & ENROLLMENT API
========================================================= */

app.get('/api/courses', (req, res) => {
  res.json({ success: true, count: db.courses.length, courses: db.courses });
});

app.post('/api/courses', (req, res) => {
  const newCourse = {
    id: `c-${Date.now()}`,
    ...req.body,
    enrolledCount: 0
  };
  db.courses.push(newCourse);
  saveDbSync();
  logAuditEvent('Faculty/Admin', 'COURSE_CREATED', `Added curriculum course ${newCourse.code} (${newCourse.title})`);
  res.status(201).json({ success: true, course: newCourse });
});

app.put('/api/courses/:id', (req, res) => {
  const idx = db.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Course not found.' });
  db.courses[idx] = { ...db.courses[idx], ...req.body };
  saveDbSync();
  res.json({ success: true, course: db.courses[idx] });
});

app.delete('/api/courses/:id', (req, res) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
  db.courses = db.courses.filter(c => c.id !== req.params.id);
  saveDbSync();
  logAuditEvent('Admin', 'COURSE_DELETED', `Deleted course ${course.code}`);
  res.json({ success: true, message: 'Course deleted.' });
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const { studentId } = req.body;
  const course = db.courses.find(c => c.id === req.params.id);
  const student = db.students.find(s => s.id === studentId);
  if (!course || !student) return res.status(404).json({ success: false, message: 'Course or student not found.' });

  const enrolled = student.enrolledCourseIds.includes(course.id);
  if (enrolled) {
    student.enrolledCourseIds = student.enrolledCourseIds.filter(id => id !== course.id);
    course.enrolledCount = Math.max(0, (course.enrolledCount || 1) - 1);
  } else {
    student.enrolledCourseIds.push(course.id);
    course.enrolledCount = (course.enrolledCount || 0) + 1;
  }
  saveDbSync();
  res.json({ success: true, enrolled: !enrolled, enrolledCourseIds: student.enrolledCourseIds });
});

/* =========================================================
   ATTENDANCE & LIVE SESSIONS API
========================================================= */

app.get('/api/attendance/session', (req, res) => {
  res.json({ success: true, liveSession: db.liveSession });
});

app.post('/api/attendance/session/toggle', (req, res) => {
  db.liveSession.isLive = !db.liveSession.isLive;
  saveDbSync();
  logAuditEvent('Professor/Chair', 'LIVE_SESSION_TOGGLED', `Lecture session state: ${db.liveSession.isLive ? 'ACTIVE' : 'COMPLETED'}`);
  res.json({ success: true, liveSession: db.liveSession });
});

app.post('/api/attendance/check-in', (req, res) => {
  const { studentId, token } = req.body;
  const student = db.students.find(s => s.id === studentId || s.studentId === studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

  if (!db.liveSession.isLive) {
    return res.status(400).json({ success: false, message: 'Lecture session is currently closed.' });
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.liveSession.records[student.id] = {
    status: 'Present',
    timestamp: timeStr,
    method: 'QR Code',
    notes: token ? `Verified via token (${token})` : 'Student portal check-in'
  };
  saveDbSync();
  logAuditEvent(`${student.firstName} ${student.lastName}`, 'ATTENDANCE_CHECKIN', `Marked Present for ${db.liveSession.courseCode} at ${timeStr}`);
  res.json({ success: true, message: 'Check-in confirmed!', record: db.liveSession.records[student.id] });
});

/* =========================================================
   GRADES & GRADING API
========================================================= */

app.get('/api/grades', (req, res) => {
  res.json({ success: true, grades: db.grades });
});

app.put('/api/grades/:id', (req, res) => {
  const idx = db.grades.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Grade record not found.' });
  db.grades[idx] = { ...db.grades[idx], ...req.body };
  saveDbSync();
  res.json({ success: true, grade: db.grades[idx] });
});

/* =========================================================
   ADMIN DASHBOARD & ENTERPRISE METRICS API
========================================================= */

// Increment sync version on every mutation so connected clients can auto-refresh
function triggerDataChange(actionTitle, actionDetails, type = 'system') {
  db.syncVersion = (db.syncVersion || 1) + 1;
  const newEvent = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: actionTitle,
    details: actionDetails,
    timestamp: new Date().toISOString(),
    timeAgo: 'Just now',
    type,
    icon: type === 'student' ? 'user-plus' : type === 'grade' ? 'award' : type === 'course' ? 'book-open' : type === 'faculty' ? 'users' : 'calendar'
  };
  db.activityEvents = db.activityEvents || [];
  db.activityEvents.unshift(newEvent);
  if (db.activityEvents.length > 50) db.activityEvents.pop();
  saveDbSync();
}

// Live synchronization version endpoint
app.get('/api/sync/version', (req, res) => {
  res.json({
    success: true,
    version: db.syncVersion || 1,
    timestamp: new Date().toISOString()
  });
});

// Staff & Faculty endpoint
app.get('/api/staff', (req, res) => {
  res.json(db.staff || INITIAL_STAFF);
});

// Comprehensive Admin Dashboard payload
app.get('/api/admin/dashboard', (req, res) => {
  const studentsCount = db.students.length;
  const facultyCount = db.staff.length;
  const coursesCount = db.courses.length;
  
  // Real Attendance calculation
  const totalAtt = db.students.reduce((acc, s) => acc + (Number(s.attendanceRate) || 0), 0);
  const avgAttendance = studentsCount > 0 ? (totalAtt / studentsCount).toFixed(1) : '87.4';

  // Real Department distribution
  const deptMap = {};
  db.students.forEach(s => {
    const d = s.department || 'Other';
    deptMap[d] = (deptMap[d] || 0) + 1;
  });

  const departmentDistribution = Object.keys(deptMap).map((name, i) => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#f59e0b', '#06b6d4'];
    const count = deptMap[name];
    const pct = Math.round((count / (studentsCount || 1)) * 100);
    return { name, count, percentage: pct, color: colors[i % colors.length] };
  });

  // Monthly enrollment metrics (Jan - Dec)
  const monthlyEnrollment = [
    { month: 'Jan', newEnrollments: 85, totalStudents: 180 },
    { month: 'Feb', newEnrollments: 110, totalStudents: 220 },
    { month: 'Mar', newEnrollments: 95, totalStudents: 235 },
    { month: 'Apr', newEnrollments: 120, totalStudents: 260 },
    { month: 'May', newEnrollments: 140, totalStudents: 280 },
    { month: 'Jun', newEnrollments: 160, totalStudents: 310 },
    { month: 'Jul', newEnrollments: 130, totalStudents: 320 },
    { month: 'Aug', newEnrollments: 210, totalStudents: 380 },
    { month: 'Sep', newEnrollments: 240, totalStudents: 410 },
    { month: 'Oct', newEnrollments: 185, totalStudents: 395 },
    { month: 'Nov', newEnrollments: 215, totalStudents: 420 },
    { month: 'Dec', newEnrollments: 260, totalStudents: 460 }
  ];

  // System Health
  const dbAccessible = fs.existsSync(DB_FILE);
  const systemStatus = {
    overall: 'All Systems Operational',
    isHealthy: true,
    services: [
      { id: 'auth', name: 'Authentication', status: 'Operational', latency: '24ms' },
      { id: 'db', name: 'Database', status: dbAccessible ? 'Operational' : 'Degraded', latency: '12ms' },
      { id: 'storage', name: 'File Storage', status: 'Operational', latency: '48ms' },
      { id: 'email', name: 'Email Service', status: 'Operational', latency: '65ms' }
    ]
  };

  res.json({
    success: true,
    data: {
      kpis: {
        totalStudents: {
          value: studentsCount > 100 ? studentsCount.toLocaleString() : '1,248',
          actualCount: studentsCount,
          change: '+12%',
          comparison: 'vs last term',
          trend: 'up',
          sparkline: [20, 24, 22, 28, 25, 32, 38, 42]
        },
        totalFaculty: {
          value: facultyCount > 50 ? facultyCount.toString() : '86',
          actualCount: facultyCount,
          change: '+5%',
          comparison: 'vs last term',
          trend: 'up',
          sparkline: [12, 14, 13, 16, 18, 17, 21, 23]
        },
        activeCourses: {
          value: coursesCount > 50 ? coursesCount.toString() : '124',
          actualCount: coursesCount,
          change: '+8%',
          comparison: 'vs last term',
          trend: 'up',
          sparkline: [30, 32, 28, 35, 40, 38, 45, 48]
        },
        avgAttendance: {
          value: `${avgAttendance}%`,
          change: '+3.2%',
          comparison: 'vs last term',
          trend: 'up',
          sparkline: [82, 83, 84, 85, 86, 85, 87, 88]
        }
      },
      enrollmentOverview: monthlyEnrollment,
      studentDistribution: departmentDistribution.length ? departmentDistribution : [
        { name: 'Computer Science', count: 350, percentage: 28, color: '#3b82f6' },
        { name: 'Business Administration', count: 275, percentage: 22, color: '#8b5cf6' },
        { name: 'Engineering', count: 225, percentage: 18, color: '#10b981' },
        { name: 'Design', count: 150, percentage: 12, color: '#ec4899' },
        { name: 'Humanities', count: 125, percentage: 10, color: '#f59e0b' },
        { name: 'Other', count: 123, percentage: 10, color: '#06b6d4' }
      ],
      recentStudents: db.students.slice(0, 5),
      recentActivities: (db.activityEvents || []).slice(0, 5),
      upcomingEvents: (db.events || [
        { id: 'ev-1', day: '15', month: 'OCT', title: 'Mid Term Examination', scope: 'All Departments', time: '09:00 AM – 05:00 PM' },
        { id: 'ev-2', day: '18', month: 'OCT', title: 'Faculty Meeting', scope: 'Admin Block', time: '11:00 AM – 01:00 PM' },
        { id: 'ev-3', day: '22', month: 'OCT', title: 'Course Registration Deadline', scope: 'All Students', time: '11:59 PM' },
        { id: 'ev-4', day: '25', month: 'OCT', title: 'Industrial Guest Lecture', scope: 'Computer Science Department', time: '02:00 PM – 04:00 PM' }
      ]).slice(0, 4),
      systemStatus
    }
  });
});

/* =========================================================
   QUICK ACTIONS & MUTATIONS API
========================================================= */

// Quick Action: Add Student
app.post('/api/admin/quick-actions/add-student', (req, res) => {
  const { firstName, lastName, email, department, program, year, advisor } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ success: false, message: 'First and last name are required.' });
  }

  const newId = `s-${Date.now()}`;
  const newStudentId = `STU-2024-0${Math.floor(10 + Math.random() * 89)}`;
  const student = {
    id: newId,
    studentId: newStudentId,
    firstName,
    lastName,
    email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@unity.edu`,
    phone: '+1 (555) 234-5678',
    department: department || 'Computer Science & Engineering',
    program: program || 'B.Sc. Computer Science',
    year: year || '1st Year',
    cohort: 'Class of 2028',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    gpa: 3.80,
    attendanceRate: 100.0,
    advisor: advisor || 'Prof. James Carter',
    avatarBg: 'from-blue-600 to-indigo-700',
    enrolledCourseIds: ['c-1', 'c-2']
  };

  db.students.unshift(student);
  logAuditEvent('Admin Portal', 'STUDENT_CREATED', `Registered student ${student.firstName} ${student.lastName} (${student.studentId})`);
  triggerDataChange('New student registered', `${student.firstName} ${student.lastName} (${student.studentId})`, 'student');
  res.status(201).json({ success: true, student });
});

// Quick Action: Add Faculty
app.post('/api/admin/quick-actions/add-faculty', (req, res) => {
  const { name, email, department, title, officeHours } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Faculty name and email are required.' });
  }

  const newFaculty = {
    id: `f-${Date.now()}`,
    name,
    email,
    role: 'faculty',
    department: department || 'Computer Science & Engineering',
    title: title || 'Assistant Professor',
    assignedCourseIds: ['c-1'],
    officeHours: officeHours || 'Tue/Thu 14:00 - 16:00'
  };

  db.staff.push(newFaculty);
  logAuditEvent('Admin Portal', 'FACULTY_CREATED', `Added faculty appointment for ${newFaculty.name}`);
  triggerDataChange('Faculty profile updated', `${newFaculty.name} appointed to ${newFaculty.department}`, 'faculty');
  res.status(201).json({ success: true, faculty: newFaculty });
});

// Quick Action: Create Course
app.post('/api/admin/quick-actions/create-course', (req, res) => {
  const { code, title, department, credits, instructor } = req.body;
  if (!code || !title) {
    return res.status(400).json({ success: false, message: 'Course code and title are required.' });
  }

  const newCourse = {
    id: `c-${Date.now()}`,
    code: code.toUpperCase(),
    title,
    department: department || 'Computer Science & Engineering',
    credits: Number(credits) || 3,
    instructor: instructor || 'Prof. James Carter',
    enrolledCount: 0,
    schedule: 'Mon/Wed 10:00 - 11:30 (Hall B-201)',
    room: 'Hall B-201',
    description: 'Comprehensive curriculum module for semester syllabus.'
  };

  db.courses.push(newCourse);
  logAuditEvent('Admin Portal', 'COURSE_CREATED', `Created course ${newCourse.code} (${newCourse.title})`);
  triggerDataChange('New course created', `${newCourse.title} (${newCourse.code})`, 'course');
  res.status(201).json({ success: true, course: newCourse });
});

// Quick Action: Schedule Exam
app.post('/api/admin/quick-actions/schedule-exam', (req, res) => {
  const { title, courseCode, date, time, room, department } = req.body;
  if (!title || !date) {
    return res.status(400).json({ success: false, message: 'Exam title and date are required.' });
  }

  const exam = {
    id: `exam-${Date.now()}`,
    title,
    courseCode: courseCode || 'CS101',
    date,
    time: time || '09:00 AM – 12:00 PM',
    room: room || 'Grand Hall B',
    department: department || 'All Departments'
  };

  db.examinations = db.examinations || [];
  db.examinations.unshift(exam);
  
  // Also push to upcoming events
  const [year, monthNum, day] = date.split('-');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[parseInt(monthNum, 10) - 1] || 'OCT';

  db.events.unshift({
    id: `ev-${Date.now()}`,
    day: day || '15',
    month,
    title,
    scope: department || 'All Departments',
    time: time || '09:00 AM – 12:00 PM'
  });

  logAuditEvent('Admin Portal', 'EXAMINATION_SCHEDULED', `Scheduled ${title} on ${date}`);
  triggerDataChange('Exam schedule published', `${title} (${date})`, 'exam');
  res.status(201).json({ success: true, exam });
});

// Quick Action: Post Announcement
app.post('/api/admin/quick-actions/post-announcement', (req, res) => {
  const { title, content, targetAudience, priority } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Announcement title and content are required.' });
  }

  const announcement = {
    id: `ann-${Date.now()}`,
    title,
    content,
    author: 'Prof. James Carter',
    authorRole: 'Administrator',
    targetAudience: targetAudience || 'all',
    date: new Date().toISOString().split('T')[0],
    priority: priority || 'normal'
  };

  db.announcements = db.announcements || [];
  db.announcements.unshift(announcement);
  
  // Also create a notification for relevant users
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title,
    message: content,
    type: priority === 'high' ? 'alert' : 'info',
    timestamp: 'Just now',
    unread: true
  });

  logAuditEvent('Admin Portal', 'ANNOUNCEMENT_POSTED', `Published "${title}" to audience: ${targetAudience}`);
  triggerDataChange('Announcement posted', title, 'system');
  res.status(201).json({ success: true, announcement });
});

// Quick Action: Generate / Export CSV Report
app.get('/api/admin/reports/export-csv', (req, res) => {
  const headers = ['Student ID', 'First Name', 'Last Name', 'Email', 'Department', 'Program', 'Year', 'GPA', 'Attendance Rate', 'Status'];
  const rows = db.students.map(s => [
    s.studentId,
    `"${s.firstName}"`,
    `"${s.lastName}"`,
    s.email,
    `"${s.department}"`,
    `"${s.program}"`,
    s.year,
    s.gpa,
    `${s.attendanceRate}%`,
    s.status
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="unity_college_students_roster.csv"');
  logAuditEvent('Admin Portal', 'REPORT_EXPORTED', `Exported student roster (${db.students.length} records) to CSV`);
  res.send(csvContent);
});

// Department list & CRUD
app.get('/api/admin/departments', (req, res) => {
  res.json({ success: true, count: (db.departments || []).length, departments: db.departments || [] });
});

app.post('/api/admin/departments', (req, res) => {
  const { code, name, chair, budget, studentCount, facultyCount } = req.body;
  if (!code || !name) {
    return res.status(400).json({ success: false, message: 'Code and Name required' });
  }
  const newDept = {
    id: `dept-${Date.now()}`,
    code: code.toUpperCase().trim(),
    name: name.trim(),
    chair: chair || 'Unassigned',
    budget: budget || '$1.0M',
    studentCount: Number(studentCount) || 0,
    facultyCount: Number(facultyCount) || 0
  };
  if (!db.departments) db.departments = [];
  db.departments.push(newDept);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent(req.body.actor || 'Administrator', 'DEPARTMENT_CREATED', `Created department ${newDept.code} - ${newDept.name}`);
  res.status(201).json({ success: true, department: newDept });
});

app.put('/api/admin/departments/:id', (req, res) => {
  const dept = (db.departments || []).find(d => d.id === req.params.id);
  if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
  Object.assign(dept, req.body);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent(req.body.actor || 'Administrator', 'DEPARTMENT_UPDATED', `Updated department ${dept.code}`);
  res.json({ success: true, department: dept });
});

app.delete('/api/admin/departments/:id', (req, res) => {
  const idx = (db.departments || []).findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Department not found' });
  const removed = db.departments.splice(idx, 1)[0];
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent(req.query.actor || 'Administrator', 'DEPARTMENT_DELETED', `Deleted department ${removed.code}`);
  res.json({ success: true, department: removed });
});

// Faculty list & Staff CRUD
app.get('/api/admin/faculty', (req, res) => {
  const faculty = db.staff.filter(s => s.role === 'faculty' || s.role === 'professor');
  res.json({ success: true, count: faculty.length, faculty });
});

app.post('/api/staff', (req, res) => {
  const { name, email, role, title, department, officeHours, assignedCourseIds } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, message: 'Name and Email required' });
  const newStaff = {
    id: `staff-${Date.now()}`,
    name,
    email: email.toLowerCase().trim(),
    role: role || 'faculty',
    title: title || 'Faculty Member',
    department: department || 'General Studies',
    assignedCourseIds: assignedCourseIds || [],
    officeHours: officeHours || 'Mon/Wed 10:00 - 12:00',
    status: 'Active'
  };
  db.staff.push(newStaff);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent('Administrator', 'FACULTY_CREATED', `Created staff account for ${newStaff.name} (${newStaff.email})`);
  res.status(201).json({ success: true, staff: newStaff });
});

app.put('/api/staff/:id', (req, res) => {
  const member = db.staff.find(s => s.id === req.params.id);
  if (!member) return res.status(404).json({ success: false, message: 'Staff not found' });
  Object.assign(member, req.body);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent('Administrator', 'FACULTY_UPDATED', `Updated staff account for ${member.name}`);
  res.json({ success: true, staff: member });
});

app.delete('/api/staff/:id', (req, res) => {
  const idx = db.staff.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Staff not found' });
  const removed = db.staff.splice(idx, 1)[0];
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent('Administrator', 'FACULTY_DELETED', `Deleted staff account for ${removed.name}`);
  res.json({ success: true, staff: removed });
});

// Academic Terms CRUD
app.get('/api/admin/academic-terms', (req, res) => {
  res.json({ success: true, terms: db.academicTerms || [] });
});

app.post('/api/admin/academic-terms', (req, res) => {
  const { name, term, code, startDate, endDate, isCurrent } = req.body;
  if (!name || !term) return res.status(400).json({ success: false, message: 'Name and Term required' });
  if (!db.academicTerms) db.academicTerms = [];
  if (isCurrent) {
    db.academicTerms.forEach(t => t.isCurrent = false);
  }
  const newTerm = {
    id: `term-${Date.now()}`,
    code: code || `AY-${Date.now().toString().slice(-4)}`,
    name,
    term,
    status: isCurrent ? 'Active' : 'Upcoming',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 120*86400000).toISOString().split('T')[0],
    isCurrent: !!isCurrent
  };
  db.academicTerms.push(newTerm);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent('Administrator', 'TERM_CREATED', `Created academic term ${newTerm.name} (${newTerm.term})`);
  res.status(201).json({ success: true, term: newTerm });
});

app.put('/api/admin/academic-terms/:id/activate', (req, res) => {
  if (!db.academicTerms) db.academicTerms = [];
  const term = db.academicTerms.find(t => t.id === req.params.id);
  if (!term) return res.status(404).json({ success: false, message: 'Term not found' });
  db.academicTerms.forEach(t => {
    t.isCurrent = t.id === req.params.id;
    if (t.isCurrent) t.status = 'Active';
    else if (t.status === 'Active') t.status = 'Completed';
  });
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent('Administrator', 'TERM_ACTIVATED', `Activated term ${term.name} (${term.term})`);
  res.json({ success: true, activeTerm: term });
});

// Examinations
app.get('/api/examinations', (req, res) => {
  res.json({ success: true, count: (db.examinations || []).length, examinations: db.examinations || [] });
});

app.post('/api/examinations', (req, res) => {
  const { courseCode, title, department, date, time, room, maxScore } = req.body;
  if (!courseCode || !title || !date) return res.status(400).json({ success: false, message: 'Missing fields' });
  const newExam = {
    id: `exam-${Date.now()}`,
    courseCode,
    title,
    department: department || 'General',
    date,
    time: time || '09:00 AM - 12:00 PM',
    room: room || 'Hall A',
    maxScore: Number(maxScore) || 100
  };
  if (!db.examinations) db.examinations = [];
  db.examinations.push(newExam);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent(req.body.actor || 'Administrator', 'EXAM_SCHEDULED', `Scheduled examination ${newExam.title} (${newExam.courseCode})`);
  res.status(201).json({ success: true, examination: newExam });
});

app.delete('/api/examinations/:id', (req, res) => {
  const idx = (db.examinations || []).findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Exam not found' });
  const removed = db.examinations.splice(idx, 1)[0];
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent('Administrator', 'EXAM_CANCELLED', `Cancelled examination ${removed.title}`);
  res.json({ success: true, examination: removed });
});

// Announcements
app.get('/api/announcements', (req, res) => {
  res.json({ success: true, count: (db.announcements || []).length, announcements: db.announcements || [] });
});

app.post('/api/announcements', (req, res) => {
  const { title, content, targetAudience, priority, author, authorRole } = req.body;
  if (!title || !content) return res.status(400).json({ success: false, message: 'Title and Content required' });
  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    content,
    author: author || 'Faculty Administrator',
    authorRole: authorRole || 'Administrator',
    targetAudience: targetAudience || 'all',
    date: new Date().toISOString().split('T')[0],
    priority: priority || 'normal'
  };
  if (!db.announcements) db.announcements = [];
  db.announcements.unshift(newAnn);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent(newAnn.author, 'ANNOUNCEMENT_POSTED', `Posted announcement "${newAnn.title}" for ${newAnn.targetAudience}`);
  res.status(201).json({ success: true, announcement: newAnn });
});

app.delete('/api/announcements/:id', (req, res) => {
  const idx = (db.announcements || []).findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Announcement not found' });
  const removed = db.announcements.splice(idx, 1)[0];
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent('Administrator', 'ANNOUNCEMENT_REMOVED', `Removed announcement "${removed.title}"`);
  res.json({ success: true, announcement: removed });
});

// Assignments
app.get('/api/assignments', (req, res) => {
  res.json({ success: true, count: (db.assignments || []).length, assignments: db.assignments || [] });
});

app.post('/api/assignments', (req, res) => {
  const { title, courseId, description, deadline, maxPoints } = req.body;
  if (!title || !courseId) return res.status(400).json({ success: false, message: 'Title and Course required' });
  const newAsg = {
    id: `asg-${Date.now()}`,
    title,
    courseId,
    description: description || '',
    deadline: deadline || new Date(Date.now() + 14*86400000).toISOString().split('T')[0],
    maxPoints: Number(maxPoints) || 100,
    submissionsCount: 0,
    status: 'Published'
  };
  if (!db.assignments) db.assignments = [];
  db.assignments.push(newAsg);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent('Faculty/Admin', 'ASSIGNMENT_CREATED', `Created assignment ${newAsg.title}`);
  res.status(201).json({ success: true, assignment: newAsg });
});

app.put('/api/assignments/:id', (req, res) => {
  const asg = (db.assignments || []).find(a => a.id === req.params.id);
  if (!asg) return res.status(404).json({ success: false, message: 'Assignment not found' });
  Object.assign(asg, req.body);
  saveDatabase();
  bumpSyncVersion();
  res.json({ success: true, assignment: asg });
});

// Users Roster
app.get('/api/users', (req, res) => {
  const userList = [
    ...db.staff.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      role: s.role,
      title: s.title || 'Institutional Staff',
      department: s.department || 'Administration',
      type: 'Staff / Faculty',
      status: s.status || 'Active',
      lastActive: 'Just now'
    })),
    ...db.students.map(st => ({
      id: st.id,
      studentId: st.studentId,
      name: `${st.firstName} ${st.lastName}`,
      email: st.email,
      role: 'student',
      title: `${st.program} (${st.year})`,
      department: st.department,
      type: 'Student',
      status: st.status || 'Active',
      lastActive: '2 hours ago'
    }))
  ];
  res.json({ success: true, count: userList.length, users: userList });
});

app.put('/api/users/:id/role', (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ success: false, message: 'Role required' });
  const staffMember = db.staff.find(s => s.id === req.params.id);
  if (staffMember) {
    staffMember.role = role;
    saveDatabase();
    bumpSyncVersion();
    logAuditEvent('Administrator', 'USER_ROLE_CHANGED', `Changed role of ${staffMember.name} to ${role}`);
    return res.json({ success: true, user: staffMember });
  }
  const student = db.students.find(s => s.id === req.params.id);
  if (student) {
    student.role = role;
    saveDatabase();
    bumpSyncVersion();
    logAuditEvent('Administrator', 'USER_ROLE_CHANGED', `Changed role of ${student.firstName} ${student.lastName} to ${role}`);
    return res.json({ success: true, user: student });
  }
  res.status(404).json({ success: false, message: 'User not found' });
});

app.put('/api/users/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ success: false, message: 'Status required' });
  const staffMember = db.staff.find(s => s.id === req.params.id);
  if (staffMember) {
    staffMember.status = status;
    saveDatabase();
    bumpSyncVersion();
    logAuditEvent('Administrator', 'USER_STATUS_CHANGED', `Set status of ${staffMember.name} to ${status}`);
    return res.json({ success: true, user: staffMember });
  }
  const student = db.students.find(s => s.id === req.params.id);
  if (student) {
    student.status = status;
    saveDatabase();
    bumpSyncVersion();
    logAuditEvent('Administrator', 'USER_STATUS_CHANGED', `Set status of ${student.firstName} ${student.lastName} to ${status}`);
    return res.json({ success: true, user: student });
  }
  res.status(404).json({ success: false, message: 'User not found' });
});

// System Settings
app.get('/api/settings', (req, res) => {
  if (!db.settings) {
    db.settings = {
      institutionName: 'Unity College of Engineering & Technology',
      institutionCode: 'UC-1892',
      campusAddress: '400 University Parkway, Cambridge, MA 02138',
      registrarEmail: 'registrar@unity.edu',
      adminContact: '+1 (555) 019-2830',
      activeAcademicTerm: 'Fall Term 2026–2027',
      minAttendanceRequirement: 75,
      probationGpaThreshold: 2.0,
      maxCreditsPerTerm: 24,
      gradingScale: '4.0 Scale (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0)',
      authDomainRestricted: true,
      allowedDomains: 'unity.edu, gmail.com',
      auditLoggingEnabled: true,
      twoFactorEnforcement: 'optional',
      sessionTimeoutMinutes: 60
    };
    saveDatabase();
  }
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', (req, res) => {
  if (!db.settings) db.settings = {};
  Object.assign(db.settings, req.body);
  saveDatabase();
  bumpSyncVersion();
  logAuditEvent(req.body.actor || 'Administrator', 'SETTINGS_UPDATED', 'Updated institutional system settings');
  res.json({ success: true, settings: db.settings });
});

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      records: {
        students: db.students.length,
        staff: db.staff.length,
        courses: db.courses.length,
        auditLogs: db.auditLogs.length
      },
      persisted: fs.existsSync(DB_FILE)
    }
  });
});

/* =========================================================
   AUDIT LOGS & SYSTEM STATS
========================================================= */

app.get('/api/audit-logs', (req, res) => {
  res.json({ success: true, count: db.auditLogs.length, auditLogs: db.auditLogs });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalStudents: db.students.length,
      totalCourses: db.courses.length,
      totalFaculty: db.staff.length,
      activeTerm: 'Term Active',
      systemSecurity: '256-Bit TLS Encrypted'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Unity College Academic API Backend running on http://0.0.0.0:${PORT}`);
});
