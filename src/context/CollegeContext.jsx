import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_STUDENTS, 
  INITIAL_COURSES, 
  INITIAL_GRADES, 
  INITIAL_LIVE_SESSION, 
  PAST_SESSIONS,
  SUBJECT_ATTENDANCE_DATA,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STUDENT_CLUBS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_STAFF,
  INITIAL_DEPARTMENTS,
  INITIAL_TERMS,
  INITIAL_EXAMINATIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SETTINGS,
} from '../data/mockData.js';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from '../services/firebase.js';
import { apiClient } from '../services/apiClient.js';

export function calculateGrade(weightedScore) {
  if (weightedScore >= 97) return { letterGrade: 'A+', gpaPoint: 4.0 };
  if (weightedScore >= 93) return { letterGrade: 'A', gpaPoint: 4.0 };
  if (weightedScore >= 90) return { letterGrade: 'A-', gpaPoint: 3.7 };
  if (weightedScore >= 87) return { letterGrade: 'B+', gpaPoint: 3.3 };
  if (weightedScore >= 83) return { letterGrade: 'B', gpaPoint: 3.0 };
  if (weightedScore >= 80) return { letterGrade: 'B-', gpaPoint: 2.7 };
  if (weightedScore >= 77) return { letterGrade: 'C+', gpaPoint: 2.3 };
  if (weightedScore >= 73) return { letterGrade: 'C', gpaPoint: 2.0 };
  if (weightedScore >= 70) return { letterGrade: 'C-', gpaPoint: 1.7 };
  if (weightedScore >= 65) return { letterGrade: 'D+', gpaPoint: 1.3 };
  if (weightedScore >= 60) return { letterGrade: 'D', gpaPoint: 1.0 };
  return { letterGrade: 'F', gpaPoint: 0.0 };
}

const CollegeContext = createContext(null);

export const CollegeProvider = ({ children }) => {
  // Authentication & Role
  const [role, setRole] = useState(() => {
    return localStorage.getItem('unity_role') || 'student';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('unity_auth');
    return saved === 'true';
  });

  const [currentStudentId, setCurrentStudentId] = useState(() => {
    return localStorage.getItem('unity_student_id') || 's-1';
  });

  const [firebaseUser, setFirebaseUser] = useState(null);

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('unity_staff');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const hasDivyansh = parsed.some(s => s.email?.toLowerCase() === 'simplydivyanshk@gmail.com');
          if (!hasDivyansh) {
            const divyansh = INITIAL_STAFF.find(s => s.email?.toLowerCase() === 'simplydivyanshk@gmail.com');
            if (divyansh) parsed.push(divyansh);
          }
          const hasJnv = parsed.some(s => s.email?.toLowerCase() === 'jnv.peren55@gmail.com');
          if (!hasJnv) {
            const jnv = INITIAL_STAFF.find(s => s.email?.toLowerCase() === 'jnv.peren55@gmail.com');
            if (jnv) parsed.push(jnv);
          }
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_STAFF;
  });

  const [currentStaffUser, setCurrentStaffUser] = useState(() => {
    const saved = localStorage.getItem('unity_staff_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('unity_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    if (currentStaffUser) {
      localStorage.setItem('unity_staff_user', JSON.stringify(currentStaffUser));
    } else {
      localStorage.removeItem('unity_staff_user');
    }
  }, [currentStaffUser]);

  const [activeTab, setActiveTab] = useState('dashboard');

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('unity_sidebar_collapsed');
    return saved !== null ? saved === 'true' : true;
  });

  // Table density mode: 'compact' or 'comfortable'
  const [isCompactMode, setIsCompactMode] = useState(() => {
    const saved = localStorage.getItem('unity_compact_mode');
    return saved !== null ? saved === 'true' : true; // Default compact as requested
  });

  // Primary Data Collections
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('unity_students') || localStorage.getItem('veritas_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_STUDENTS;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('unity_courses') || localStorage.getItem('veritas_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_COURSES;
  });

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('unity_grades') || localStorage.getItem('veritas_grades');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_GRADES;
  });

  const [liveSession, setLiveSession] = useState(() => {
    const saved = localStorage.getItem('unity_live_session') || localStorage.getItem('veritas_live_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_LIVE_SESSION;
  });

  const [pastSessions] = useState(PAST_SESSIONS);
  const [selectedCourseId, setSelectedCourseId] = useState('c-1');
  const [toasts, setToasts] = useState([]);
  const [isStudentPhotoModalOpen, setIsStudentPhotoModalOpen] = useState(false);
  const [isFacultyAuthGateOpen, setIsFacultyAuthGateOpen] = useState(false);

  // Dedicated Subject-Wise Attendance state
  const [subjectAttendance, setSubjectAttendance] = useState(() => {
    const saved = localStorage.getItem('unity_subject_attendance');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SUBJECT_ATTENDANCE_DATA;
  });

  // Additional campus modules
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('unity_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_EVENTS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('unity_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [studentClubs, setStudentClubs] = useState(() => {
    const saved = localStorage.getItem('unity_clubs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STUDENT_CLUBS;
  });

  const [studyMaterials, setStudyMaterials] = useState(() => {
    const saved = localStorage.getItem('unity_study_materials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STUDY_MATERIALS;
  });

  // Administrative Collections
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('unity_departments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_DEPARTMENTS;
  });

  const [academicTerms, setAcademicTerms] = useState(() => {
    const saved = localStorage.getItem('unity_academic_terms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TERMS;
  });

  const [examinations, setExaminations] = useState(() => {
    const saved = localStorage.getItem('unity_examinations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_EXAMINATIONS;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('unity_assignments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ASSIGNMENTS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('unity_announcements');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('unity_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('unity_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'aud-1', timestamp: new Date(Date.now() - 3600000).toISOString(), actor: 'System Bootstrap', action: 'SYSTEM_INITIALIZED', details: 'All institutional modules online', status: 'Success' },
      { id: 'aud-2', timestamp: new Date(Date.now() - 1800000).toISOString(), actor: 'Divyansh K. (Administrator)', action: 'PORTAL_ACCESS', details: 'Authenticated to Institutional Administration & Deanery', status: 'Success' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('unity_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('unity_academic_terms', JSON.stringify(academicTerms));
  }, [academicTerms]);

  useEffect(() => {
    localStorage.setItem('unity_examinations', JSON.stringify(examinations));
  }, [examinations]);

  useEffect(() => {
    localStorage.setItem('unity_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('unity_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('unity_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('unity_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('unity_subject_attendance', JSON.stringify(subjectAttendance));
  }, [subjectAttendance]);

  useEffect(() => {
    localStorage.setItem('unity_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('unity_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('unity_clubs', JSON.stringify(studentClubs));
  }, [studentClubs]);

  useEffect(() => {
    localStorage.setItem('unity_study_materials', JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  // Current logged in student
  const currentStudent = students.find((s) => s.id === currentStudentId) || (students.length > 0 ? students[0] : undefined);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('unity_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('unity_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem('unity_student_id', currentStudentId);
    }
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem('unity_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('unity_compact_mode', String(isCompactMode));
  }, [isCompactMode]);

  useEffect(() => {
    localStorage.setItem('unity_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('unity_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('unity_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('unity_live_session', JSON.stringify(liveSession));
  }, [liveSession]);

  useEffect(() => {
    try {
      localStorage.setItem('unity_announcements', JSON.stringify(announcements));
    } catch (e) {}
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('unity_examinations', JSON.stringify(examinations));
    } catch (e) {}
  }, [examinations]);

  // Live synchronization revision tracker
  const [syncVersion, setSyncVersion] = useState(0);

  // Poll backend sync version every 3 seconds for cross-portal synchronization
  useEffect(() => {
    let isMounted = true;
    const checkSync = async () => {
      try {
        const res = await fetch('/api/sync/version');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.version !== syncVersion) {
            setSyncVersion(data.version);
            // Re-fetch authoritative collections from backend
            fetchServerCollections();
          }
        }
      } catch (e) {
        // Fallback to local cache if backend is resting
      }
    };

    const fetchServerCollections = async () => {
      try {
        const [resStudents, resCourses, resStaff, resDepts, resTerms, resExams, resAnn, resAsg, resSettings, resAudit] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/courses'),
          fetch('/api/staff'),
          fetch('/api/admin/departments'),
          fetch('/api/admin/academic-terms'),
          fetch('/api/examinations'),
          fetch('/api/announcements'),
          fetch('/api/assignments'),
          fetch('/api/settings'),
          fetch('/api/audit-logs')
        ]);
        if (resStudents.ok) {
          const sJson = await resStudents.json();
          if (Array.isArray(sJson)) setStudents(sJson);
        }
        if (resCourses.ok) {
          const cJson = await resCourses.json();
          if (Array.isArray(cJson)) setCourses(cJson);
        }
        if (resStaff.ok) {
          const stJson = await resStaff.json();
          if (Array.isArray(stJson)) setStaff(stJson);
        }
        if (resDepts.ok) {
          const dJson = await resDepts.json();
          if (dJson.departments) setDepartments(dJson.departments);
        }
        if (resTerms.ok) {
          const tJson = await resTerms.json();
          if (tJson.terms) setAcademicTerms(tJson.terms);
        }
        if (resExams.ok) {
          const eJson = await resExams.json();
          if (eJson.examinations) setExaminations(eJson.examinations);
        }
        if (resAnn.ok) {
          const aJson = await resAnn.json();
          if (aJson.announcements) setAnnouncements(aJson.announcements);
        }
        if (resAsg.ok) {
          const asgJson = await resAsg.json();
          if (asgJson.assignments) setAssignments(asgJson.assignments);
        }
        if (resSettings.ok) {
          const setJson = await resSettings.json();
          if (setJson.settings) setSystemSettings(setJson.settings);
        }
        if (resAudit.ok) {
          const audJson = await resAudit.json();
          if (audJson.auditLogs) setAuditLogs(audJson.auditLogs);
        }
      } catch (err) {
        console.warn('Sync re-fetch notice:', err);
      }
    };

    checkSync();
    const interval = setInterval(checkSync, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [syncVersion]);

  const showToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Student Authentication
  const loginAsStudent = (identifier) => {
    const clean = identifier.trim().toLowerCase();
    if (!clean) {
      showToast('Please enter your Student ID or university email.', 'error');
      return false;
    }

    if (clean === 'simplydivyanshk@gmail.com') {
      showToast('Faculty Administrator credentials detected. Routing to Admin Portal...', 'info');
      return loginStaffCredentials('simplydivyanshk@gmail.com', 'faculty@2024');
    }

    if (clean === 'jnv.peren55@gmail.com') {
      showToast('Senior Faculty & Academic Director credentials detected. Routing to Faculty Portal...', 'info');
      return loginStaffCredentials('jnv.peren55@gmail.com', 'faculty@2024');
    }

    const found = students.find((s) => 
      s.studentId.toLowerCase() === clean ||
      s.email.toLowerCase() === clean ||
      s.firstName.toLowerCase() === clean ||
      s.lastName.toLowerCase() === clean ||
      `${s.firstName} ${s.lastName}`.toLowerCase() === clean ||
      s.id.toLowerCase() === clean
    ) || students.find((s) =>
      s.studentId.toLowerCase().includes(clean) ||
      s.email.toLowerCase().includes(clean) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(clean)
    );

    if (found) {
      setCurrentStudentId(found.id);
      setRole('student');
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      showToast(`Welcome back, ${found.firstName} ${found.lastName}! Logged in as ${found.studentId}.`, 'success');
      return true;
    }

    showToast(`No student found matching "${identifier}". Try student ID like STU-2024-001 or select from the student roster.`, 'error');
    return false;
  };

  const loginAsFaculty = (targetRole, facultyMember = null) => {
    const assignedUser = facultyMember || staff.find(s => s.role === targetRole) || staff[0];
    setCurrentStaffUser(assignedUser);
    setRole(targetRole);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    showToast(`Signed in as ${assignedUser.name} (${assignedUser.title}).`, 'success');
  };

  const loginStaffCredentials = (email, password) => {
    const clean = email.toLowerCase().trim();
    if (!clean) {
      showToast('Please enter your institutional faculty email.', 'error');
      return false;
    }

    if (password && (clean === 'simplydivyanshk@gmail.com' || clean === 'jnv.peren55@gmail.com')) {
      const allowed = ['faculty@2024', 'admin123', 'admin', 'divyansh@2024', 'peren@2024', 'jnv@2024'];
      if (!allowed.includes(password)) {
        showToast('Invalid faculty password. Please verify your credentials.', 'error');
        return false;
      }
    }

    let matchedStaff = staff.find(s => s.email.toLowerCase() === clean);
    if (!matchedStaff && clean === 'simplydivyanshk@gmail.com') {
      matchedStaff = {
        id: 'adm-divyansh',
        name: 'Divyansh K.',
        email: 'simplydivyanshk@gmail.com',
        role: 'admin',
        title: 'Faculty Administrator & Academic Dean',
        department: 'Institutional Administration & Deanery',
        assignedCourseIds: ['c-1', 'c-2', 'c-4'],
        officeHours: 'Mon-Fri 09:00 - 17:00 (Admin Tower 501)'
      };
      setStaff(prev => [...prev, matchedStaff]);
    }
    if (!matchedStaff && clean === 'jnv.peren55@gmail.com') {
      matchedStaff = {
        id: 'adm-jnv-peren',
        name: 'Prof. JNV Peren',
        email: 'jnv.peren55@gmail.com',
        role: 'admin',
        title: 'Senior Faculty & Academic Director',
        department: 'Institutional Administration & Academic Affairs',
        assignedCourseIds: ['c-1', 'c-2', 'c-3', 'c-4'],
        officeHours: 'Mon-Fri 09:00 - 17:00 (Faculty Wing 302)'
      };
      setStaff(prev => [...prev, matchedStaff]);
    }

    if (!matchedStaff) {
      showToast(`Access Denied: "${email}" is not found in the approved faculty & admin roster.`, 'error');
      return false;
    }

    setCurrentStaffUser(matchedStaff);
    setRole(matchedStaff.role || 'admin');
    setIsAuthenticated(true);
    setIsFacultyAuthGateOpen(false);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${matchedStaff.name}! Authenticated to Admin & Faculty Portal.`, 'success');
    return true;
  };

  const requestSwitchToFaculty = () => {
    if (role === 'admin' || role === 'faculty' || role === 'professor') {
      setRole('faculty');
      setActiveTab('dashboard');
      showToast('Switched to Faculty Portal view.', 'info');
    } else {
      setIsFacultyAuthGateOpen(true);
    }
  };

  const loginWithGoogle = async ({ targetPortal = 'student' } = {}) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setFirebaseUser(user);

      const email = (user.email || '').toLowerCase().trim();
      const displayName = user.displayName || 'College User';

      // Portal-specific authorization guard
      const isMasterAdmin = email === 'simplydivyanshk@gmail.com' || email === 'jnv.peren55@gmail.com';
      if (targetPortal === 'admin' || isMasterAdmin) {
        let staffMatch = staff.find(s => s.email.toLowerCase() === email);
        if (!staffMatch && email === 'simplydivyanshk@gmail.com') {
          staffMatch = {
            id: 'adm-divyansh',
            name: displayName && displayName !== 'College User' ? displayName : 'Divyansh K.',
            email: 'simplydivyanshk@gmail.com',
            role: 'admin',
            title: 'Faculty Administrator & Academic Dean',
            department: 'Institutional Administration & Deanery',
            assignedCourseIds: ['c-1', 'c-2', 'c-4'],
            officeHours: 'Mon-Fri 09:00 - 17:00 (Admin Tower 501)'
          };
          setStaff(prev => [...prev, staffMatch]);
        }
        if (!staffMatch && email === 'jnv.peren55@gmail.com') {
          staffMatch = {
            id: 'adm-jnv-peren',
            name: displayName && displayName !== 'College User' ? displayName : 'Prof. JNV Peren',
            email: 'jnv.peren55@gmail.com',
            role: 'admin',
            title: 'Senior Faculty & Academic Director',
            department: 'Institutional Administration & Academic Affairs',
            assignedCourseIds: ['c-1', 'c-2', 'c-3', 'c-4'],
            officeHours: 'Mon-Fri 09:00 - 17:00 (Faculty Wing 302)'
          };
          setStaff(prev => [...prev, staffMatch]);
        }

        if (!staffMatch) {
          showToast(`Access Denied: Google account "${user.email}" is not registered as an authorized faculty member or administrator. Please use the Student Portal.`, 'error');
          return { success: false, unauthorized: true, message: 'Unauthorized staff account.' };
        }

        setCurrentStaffUser(staffMatch);
        setRole(staffMatch.role || 'admin');
        setIsAuthenticated(true);
        setIsFacultyAuthGateOpen(false);
        setActiveTab('dashboard');
        showToast(`Welcome, ${staffMatch.name}! Authenticated as Administrator.`, 'success');
        return { success: true, user: staffMatch, role: staffMatch.role };
      }

      // Student Portal Google Login
      const nameParts = displayName.trim().split(' ');
      const firstName = nameParts[0] || 'Student';
      const lastName = nameParts.slice(1).join(' ') || 'User';

      let matched = students.find((s) => s.email?.toLowerCase() === email);

      if (!matched) {
        // Auto-enroll new student account from Google Auth
        const generatedId = `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
        matched = {
          id: `s-google-${user.uid.slice(0, 8)}`,
          studentId: generatedId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: user.phoneNumber || '+1 (555) 234-8901',
          department: 'Computer Science & Engineering',
          program: 'B.Sc. Computer Science',
          year: 'Junior',
          cohort: `Class of ${new Date().getFullYear() + 2}`,
          enrollmentDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          gpa: 3.88,
          attendanceRate: 95.0,
          advisor: 'Prof. James Carter',
          avatarUrl: user.photoURL || undefined,
          avatarBg: 'from-blue-600 to-indigo-700',
          enrolledCourseIds: ['c-1', 'c-2', 'c-4'],
          emergencyContact: {
            name: 'Primary Contact',
            relationship: 'Guardian',
            phone: '+1 (555) 778-9901',
          },
        };
        setStudents((prev) => [matched, ...prev]);
      } else if (user.photoURL && !matched.avatarUrl) {
        matched.avatarUrl = user.photoURL;
      }

      setCurrentStudentId(matched.id);
      setRole('student');
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      showToast(`Welcome back, ${displayName}! Verified via Google Single Sign-On.`, 'success');
      return { success: true, user, student: matched, role: 'student' };
    } catch (error) {
      console.error('Firebase Google Sign-In Error:', error);
      const isUnauthorizedDomain = error.code === 'auth/unauthorized-domain' || (error.message && error.message.toLowerCase().includes('unauthorized domain'));
      if (error.code === 'auth/popup-closed-by-user') {
        showToast('Google Sign-In popup was closed.', 'info');
      } else if (isUnauthorizedDomain) {
        showToast('Firebase domain error: Please add localhost in Firebase Console.', 'error');
      } else {
        showToast(error.message || 'Google authentication failed.', 'error');
      }
      return { success: false, error, isUnauthorizedDomain };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
    setFirebaseUser(null);
    setIsAuthenticated(false);
    showToast('Signed out of Unity College Portal.', 'info');
  };

  // Real-time Student Self Check-In
  const studentSelfCheckIn = (token) => {
    if (!currentStudent) {
      return { success: false, message: 'Please log in as a student to check in.' };
    }

    if (!liveSession.isLive) {
      showToast('No live attendance session is active right now.', 'error');
      return { success: false, message: 'Lecture session is currently closed.' };
    }

    const isEnrolled = currentStudent.enrolledCourseIds.includes(liveSession.courseId);
    if (!isEnrolled) {
      showToast(`You are not enrolled in ${liveSession.courseCode}.`, 'error');
      return { success: false, message: `You are not enrolled in ${liveSession.courseCode}.` };
    }

    const alreadyChecked = liveSession.records[currentStudent.id]?.status === 'Present';
    if (alreadyChecked) {
      showToast(`You are already marked Present for ${liveSession.courseCode}!`, 'info');
      return { success: true, message: 'Already checked in!' };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setLiveSession((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [currentStudent.id]: {
          status: 'Present',
          timestamp: timeStr,
          method: 'QR Code',
          notes: token ? `Verified via token (${token})` : 'Student portal instant check-in',
        },
      },
    }));

    showToast(`✓ Check-In Confirmed! ${currentStudent.firstName} marked Present at ${timeStr}.`, 'success');
    return { success: true, message: 'Attendance verified!' };
  };

  // COURSE CATALOG CRUD
  const addCourse = async (courseData) => {
    const newId = `c-${Date.now()}`;
    const newCourse = {
      ...courseData,
      id: newId,
      enrolledStudentIds: [],
      assessments: [
        { id: `asm-${newId}-1`, name: 'Assignments & Quizzes', category: 'Assignments', weight: 25, maxScore: 100 },
        { id: `asm-${newId}-2`, name: 'Midterm Examination', category: 'Midterm Exam', weight: 30, maxScore: 100 },
        { id: `asm-${newId}-3`, name: 'Term Project / Lab', category: 'Lab Projects', weight: 35, maxScore: 100 },
        { id: `asm-${newId}-4`, name: 'Attendance & Engagement', category: 'Attendance', weight: 10, maxScore: 100 },
      ],
    };

    setCourses((prev) => [newCourse, ...prev]);

    try {
      await fetch('/api/admin/quick-actions/create-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
    } catch (err) {
      console.warn('Backend course creation sync:', err);
    }

    showToast(`Course "${newCourse.code}: ${newCourse.title}" successfully created.`, 'success');
    return newCourse;
  };

  const updateCourse = (id, updates) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Course details updated successfully.', 'success');
  };

  const deleteCourse = (id) => {
    const courseToDelete = courses.find((c) => c.id === id);
    if (!courseToDelete) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        enrolledCourseIds: s.enrolledCourseIds.filter((cid) => cid !== id),
      }))
    );
    setGrades((prev) => prev.filter((g) => g.courseId !== id));
    if (selectedCourseId === id) {
      setSelectedCourseId(courses.find((c) => c.id !== id)?.id || '');
    }
    showToast(`Course "${courseToDelete.code}" deleted.`, 'info');
  };

  const toggleEnrollment = (courseId, studentId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const isEnrolled = course.enrolledStudentIds.includes(studentId);

    if (isEnrolled) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? { ...c, enrolledStudentIds: c.enrolledStudentIds.filter((sid) => sid !== studentId) }
            : c
        )
      );
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, enrolledCourseIds: s.enrolledCourseIds.filter((cid) => cid !== courseId) }
            : s
        )
      );
      showToast(`Dropped from course ${course.code}.`, 'info');
    } else {
      if (course.enrolledStudentIds.length >= course.capacity) {
        showToast(`Cannot enroll: ${course.code} is at maximum capacity (${course.capacity}).`, 'error');
        return;
      }
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? { ...c, enrolledStudentIds: [...c.enrolledStudentIds, studentId] }
            : c
        )
      );
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, enrolledCourseIds: [...s.enrolledCourseIds, courseId] }
            : s
        )
      );
      setGrades((prev) => {
        const exists = prev.some((g) => g.courseId === courseId && g.studentId === studentId);
        if (exists) return prev;
        const newRecord = {
          id: `g-${Date.now()}`,
          studentId,
          courseId,
          scores: {},
          weightedPercentage: 0,
          letterGrade: 'N/A',
          gpaPoint: 0.0,
          status: 'Draft',
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
        };
        return [...prev, newRecord];
      });
      showToast(`Successfully enrolled in ${course.code}!`, 'success');
    }
  };

  // STUDENT REGISTRATION
  const registerStudent = async (data) => {
    const currentYear = new Date().getFullYear();
    const count = students.length + 1;
    const studentId = `STU-${currentYear}-${String(count).padStart(3, '0')}`;
    const avatarGradients = [
      'from-blue-600 to-indigo-700',
      'from-emerald-600 to-teal-700',
      'from-purple-600 to-pink-700',
      'from-amber-600 to-orange-700',
      'from-cyan-600 to-blue-700',
      'from-rose-600 to-red-700',
    ];
    const avatarBg = avatarGradients[Math.floor(Math.random() * avatarGradients.length)];

    const newStudent = {
      ...data,
      id: `s-${Date.now()}`,
      studentId,
      avatarBg,
      status: data.status || 'Active',
      gpa: 3.80,
      attendanceRate: 100.0,
    };

    setStudents((prev) => [newStudent, ...prev]);

    try {
      await fetch('/api/admin/quick-actions/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
    } catch (err) {
      console.warn('Backend student registration sync:', err);
    }

    if (newStudent.enrolledCourseIds && newStudent.enrolledCourseIds.length > 0) {
      setCourses((prev) =>
        prev.map((c) =>
          newStudent.enrolledCourseIds.includes(c.id)
            ? { ...c, enrolledStudentIds: [...c.enrolledStudentIds, newStudent.id] }
            : c
        )
      );
    }

    showToast(`Registered student ${newStudent.firstName} ${newStudent.lastName} (${studentId})`, 'success');
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Student profile updated.', 'success');
  };

  const deleteStudent = (id) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        enrolledStudentIds: c.enrolledStudentIds.filter((sid) => sid !== id),
      }))
    );
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
    showToast(`Removed student ${student.firstName} ${student.lastName}.`, 'info');
  };

  // ATTENDANCE METHODS
  const updateAttendanceStatus = (
    studentId, 
    status, 
    method = 'Manual',
    notes
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setLiveSession((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [studentId]: {
          status,
          timestamp: timeStr,
          method,
          notes: notes || prev.records[studentId]?.notes,
        },
      },
    }));
  };

  const markAllPresent = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const activeCourse = courses.find((c) => c.id === liveSession.courseId);
    const enrolledIds = activeCourse?.enrolledStudentIds || Object.keys(liveSession.records);

    const updatedRecords = { ...liveSession.records };
    enrolledIds.forEach((sid) => {
      updatedRecords[sid] = {
        status: 'Present',
        timestamp: timeStr,
        method: 'Manual',
      };
    });

    setLiveSession((prev) => ({
      ...prev,
      records: updatedRecords,
    }));
    showToast('Marked all students Present for this lecture session.', 'success');
  };

  const clearAllAttendance = () => {
    setLiveSession((prev) => ({
      ...prev,
      records: {},
    }));
    showToast('Cleared attendance roll-call for this session.', 'info');
  };

  const simulateRandomCheckIn = () => {
    const activeCourse = courses.find((c) => c.id === liveSession.courseId);
    const candidateIds = activeCourse?.enrolledStudentIds || [];
    const notPresent = candidateIds.filter((sid) => {
      const rec = liveSession.records[sid];
      return !rec || rec.status !== 'Present';
    });

    if (notPresent.length === 0) {
      showToast('All enrolled students have already checked in!', 'info');
      return;
    }

    const randomStudentId = notPresent[Math.floor(Math.random() * notPresent.length)];
    const student = students.find((s) => s.id === randomStudentId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const methods = ['QR Code', 'NFC Card'];
    const chosenMethod = methods[Math.floor(Math.random() * methods.length)];

    setLiveSession((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [randomStudentId]: {
          status: 'Present',
          timestamp: timeStr,
          method: chosenMethod,
        },
      },
    }));

    if (student) {
      showToast(`⚡ Live Check-In: ${student.firstName} ${student.lastName} scanned via ${chosenMethod} (${timeStr})`, 'success');
    }
  };

  const toggleSessionLive = (isLive) => {
    setLiveSession((prev) => ({ ...prev, isLive }));
    showToast(isLive ? 'Lecture attendance session is now LIVE' : 'Attendance session concluded & saved.', 'info');
  };

  // GRADING METHODS
  const updateGradeScore = (recordId, assessmentId, score) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id !== recordId) return g;
        const newScores = { ...g.scores, [assessmentId]: score };
        
        const course = courses.find((c) => c.id === g.courseId);
        let weighted = 0;
        let totalWeight = 0;

        if (course) {
          course.assessments.forEach((asm) => {
            const asmScore = newScores[asm.id] !== undefined ? newScores[asm.id] : 0;
            const percentage = (asmScore / asm.maxScore) * 100;
            weighted += (percentage * asm.weight) / 100;
            totalWeight += asm.weight;
          });
        }

        const normalizedScore = totalWeight > 0 ? (weighted / totalWeight) * 100 : weighted;
        const rounded = Math.round(normalizedScore * 10) / 10;
        const { letterGrade, gpaPoint } = calculateGrade(rounded);

        return {
          ...g,
          scores: newScores,
          weightedPercentage: rounded,
          letterGrade,
          gpaPoint,
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
        };
      })
    );
  };

  const publishGrades = (courseId) => {
    setGrades((prev) =>
      prev.map((g) => (g.courseId === courseId ? { ...g, status: 'Published' } : g))
    );
    showToast('Final term grades published to student academic records.', 'success');
  };

  const unpublishGrades = (courseId) => {
    setGrades((prev) =>
      prev.map((g) => (g.courseId === courseId ? { ...g, status: 'Draft' } : g))
    );
    showToast('Grades reverted to draft status for faculty revision.', 'info');
  };

  const toggleClubJoin = (clubId) => {
    setStudentClubs((prev) =>
      prev.map((c) => {
        if (c.id === clubId) {
          const joined = !c.joined;
          showToast(joined ? `Joined ${c.name}!` : `Left ${c.name}.`, 'success');
          return { ...c, joined, members: joined ? c.members + 1 : c.members - 1 };
        }
        return c;
      })
    );
  };

  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read.', 'info');
  };

  const toggleEventRegistration = (eventId) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const registered = !e.registered;
          showToast(registered ? `RSVP confirmed for ${e.title}!` : `Registration cancelled for ${e.title}.`, 'success');
          return { ...e, registered };
        }
        return e;
      })
    );
  };

  // ADMINISTRATIVE ACTION METHODS
  const addDepartment = async (deptData) => {
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptData)
      });
      const data = await res.json();
      if (data.success && data.department) {
        setDepartments(prev => [...prev, data.department]);
        showToast(`Department "${data.department.name}" (${data.department.code}) created successfully.`, 'success');
        return data.department;
      }
    } catch (e) {
      console.warn('Backend department create error:', e);
    }
    const localDept = { id: `dept-${Date.now()}`, ...deptData };
    setDepartments(prev => [...prev, localDept]);
    showToast(`Department "${localDept.name}" created.`, 'success');
    return localDept;
  };

  const updateDepartment = async (id, updates) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    try {
      await fetch(`/api/admin/departments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {}
    showToast('Department records updated.', 'success');
  };

  const deleteDepartment = async (id) => {
    const dept = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(d => d.id !== id));
    try {
      await fetch(`/api/admin/departments/${id}`, { method: 'DELETE' });
    } catch (e) {}
    showToast(`Department ${dept?.code || ''} archived.`, 'info');
  };

  const addAcademicTerm = async (termData) => {
    try {
      const res = await fetch('/api/admin/academic-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(termData)
      });
      const data = await res.json();
      if (data.success && data.term) {
        setAcademicTerms(prev => [...prev, data.term]);
        showToast(`Academic Term "${data.term.name}" registered.`, 'success');
        return data.term;
      }
    } catch (e) {}
    const localTerm = { id: `term-${Date.now()}`, ...termData };
    setAcademicTerms(prev => [...prev, localTerm]);
    showToast(`Academic Term registered.`, 'success');
    return localTerm;
  };

  const setActiveAcademicTerm = async (id) => {
    setAcademicTerms(prev => prev.map(t => ({
      ...t,
      isCurrent: t.id === id,
      status: t.id === id ? 'Active' : (t.status === 'Active' ? 'Completed' : t.status)
    })));
    try {
      await fetch(`/api/admin/academic-terms/${id}/activate`, { method: 'PUT' });
    } catch (e) {}
    showToast('Authoritative active term updated across all portals.', 'success');
  };

  const scheduleExamination = async (examData) => {
    try {
      const res = await fetch('/api/examinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });
      const data = await res.json();
      if (data.success && data.examination) {
        setExaminations(prev => [...prev, data.examination]);
        showToast(`Examination "${data.examination.title}" scheduled.`, 'success');
        return data.examination;
      }
    } catch (e) {}
    const localExam = { id: `exam-${Date.now()}`, ...examData };
    setExaminations(prev => [...prev, localExam]);
    showToast('Examination scheduled.', 'success');
    return localExam;
  };

  const cancelExamination = async (id) => {
    const exam = examinations.find(e => e.id === id);
    setExaminations(prev => prev.filter(e => e.id !== id));
    try {
      await fetch(`/api/examinations/${id}`, { method: 'DELETE' });
    } catch (e) {}
    showToast(`Examination ${exam?.title || ''} cancelled.`, 'info');
  };

  const createAssignment = async (asgData) => {
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asgData)
      });
      const data = await res.json();
      if (data.success && data.assignment) {
        setAssignments(prev => [...prev, data.assignment]);
        showToast(`Assignment "${data.assignment.title}" published.`, 'success');
        return data.assignment;
      }
    } catch (e) {}
    const localAsg = { id: `asg-${Date.now()}`, ...asgData, submissionsCount: 0, status: 'Published' };
    setAssignments(prev => [...prev, localAsg]);
    showToast(`Assignment published.`, 'success');
    return localAsg;
  };

  const updateAssignment = async (id, updates) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    try {
      await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {}
    showToast('Assignment details updated.', 'success');
  };

  const submitAssignment = async (asgId, submission) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === asgId) {
        return {
          ...a,
          status: 'Submitted',
          submittedFile: submission.file,
          submittedAt: new Date().toISOString(),
          submissionNotes: submission.notes || '',
          submissionsCount: (a.submissionsCount || 0) + 1
        };
      }
      return a;
    }));
    try {
      await fetch(`/api/assignments/${asgId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
    } catch (e) {}
    showToast('Assignment submitted successfully! Receipt generated.', 'success');
  };

  const addStudyMaterial = async (materialData) => {
    const newMaterial = {
      id: `mat-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      ...materialData
    };
    setStudyMaterials(prev => [newMaterial, ...prev]);
    try {
      await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMaterial)
      });
    } catch (e) {}
    showToast(`Study material "${newMaterial.title}" released to students!`, 'success');
    return newMaterial;
  };

  const deleteStudyMaterial = async (id) => {
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
    } catch (e) {}
    showToast('Material removed from repository.', 'info');
  };

  const postAnnouncement = async (annData) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annData)
      });
      const data = await res.json();
      if (data.success && data.announcement) {
        setAnnouncements(prev => [data.announcement, ...prev]);
        showToast(`Announcement "${data.announcement.title}" broadcasted.`, 'success');
        return data.announcement;
      }
    } catch (e) {}
    const localAnn = { id: `ann-${Date.now()}`, date: new Date().toISOString().split('T')[0], ...annData };
    setAnnouncements(prev => [localAnn, ...prev]);
    showToast('Announcement posted.', 'success');
    return localAnn;
  };

  const deleteAnnouncement = async (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    } catch (e) {}
    showToast('Announcement removed.', 'info');
  };

  const addFaculty = async (facultyData) => {
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyData)
      });
      const data = await res.json();
      if (data.success && data.staff) {
        setStaff(prev => [...prev, data.staff]);
        showToast(`Faculty member ${data.staff.name} provisioned.`, 'success');
        return data.staff;
      }
    } catch (e) {}
    const localStaff = { id: `staff-${Date.now()}`, ...facultyData, status: 'Active' };
    setStaff(prev => [...prev, localStaff]);
    showToast(`Faculty account created.`, 'success');
    return localStaff;
  };

  const updateFaculty = async (id, updates) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    try {
      await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {}
    showToast('Faculty profile updated.', 'success');
  };

  const deleteFaculty = async (id) => {
    const member = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    } catch (e) {}
    showToast(`Faculty record for ${member?.name || ''} removed.`, 'info');
  };

  const updateUserRole = async (userId, newRole) => {
    setStaff(prev => prev.map(s => s.id === userId ? { ...s, role: newRole } : s));
    setStudents(prev => prev.map(st => st.id === userId ? { ...st, role: newRole } : st));
    try {
      await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
    } catch (e) {}
    showToast(`User role updated to ${newRole}.`, 'success');
  };

  const updateUserStatus = async (userId, newStatus) => {
    setStaff(prev => prev.map(s => s.id === userId ? { ...s, status: newStatus } : s));
    setStudents(prev => prev.map(st => st.id === userId ? { ...st, status: newStatus } : st));
    try {
      await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}
    showToast(`Account status updated to ${newStatus}.`, 'success');
  };

  const updateSystemSettings = async (updates) => {
    setSystemSettings(prev => ({ ...prev, ...updates }));
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {}
    showToast('Institutional configuration and security policies saved.', 'success');
  };

  const logAuditEvent = (action, details) => {
    const newLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentStaffUser ? `${currentStaffUser.name} (${currentStaffUser.role})` : (role || 'System'),
      action,
      details,
      status: 'Success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const resetToDefaults = () => {
    localStorage.removeItem('unity_students');
    localStorage.removeItem('unity_courses');
    localStorage.removeItem('unity_grades');
    localStorage.removeItem('unity_live_session');
    localStorage.removeItem('unity_subject_attendance');
    localStorage.removeItem('unity_events');
    localStorage.removeItem('unity_notifications');
    localStorage.removeItem('unity_clubs');
    localStorage.removeItem('unity_role');
    localStorage.removeItem('unity_student_id');
    localStorage.removeItem('veritas_students');
    localStorage.removeItem('veritas_courses');
    localStorage.removeItem('veritas_grades');
    localStorage.removeItem('veritas_live_session');
    setStudents(INITIAL_STUDENTS);
    setCourses(INITIAL_COURSES);
    setGrades(INITIAL_GRADES);
    setLiveSession(INITIAL_LIVE_SESSION);
    setSubjectAttendance(SUBJECT_ATTENDANCE_DATA);
    setEvents(INITIAL_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setStudentClubs(INITIAL_STUDENT_CLUBS);
    setRole('student');
    setCurrentStudentId('s-1');
    setIsAuthenticated(true);
    showToast('Demo environment reset to initial campus state.', 'info');
  };

  return (
    <CollegeContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        students,
        courses,
        grades,
        liveSession,
        pastSessions,
        subjectAttendance,
        setSubjectAttendance,
        events,
        toggleEventRegistration,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        studentClubs,
        toggleClubJoin,
        studyMaterials,
        selectedCourseId,
        setSelectedCourseId,
        toasts,
        showToast,
        dismissToast,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isCompactMode,
        setIsCompactMode,
        isStudentPhotoModalOpen,
        setIsStudentPhotoModalOpen,
        isFacultyAuthGateOpen,
        setIsFacultyAuthGateOpen,
        requestSwitchToFaculty,
        isAuthenticated,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        staff,
        currentStaffUser,
        firebaseUser,
        loginWithGoogle,
        loginAsStudent,
        loginStaffCredentials,
        loginAsFaculty,
        logout,
        apiClient,
        studentSelfCheckIn,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleEnrollment,
        registerStudent,
        updateStudent,
        deleteStudent,
        updateAttendanceStatus,
        markAllPresent,
        clearAllAttendance,
        simulateRandomCheckIn,
        toggleSessionLive,
        updateGradeScore,
        publishGrades,
        unpublishGrades,
        resetToDefaults,
        // Administrative Suite additions
        departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        academicTerms,
        addAcademicTerm,
        setActiveAcademicTerm,
        examinations,
        scheduleExamination,
        cancelExamination,
        assignments,
        createAssignment,
        updateAssignment,
        submitAssignment,
        studyMaterials,
        setStudyMaterials,
        addStudyMaterial,
        deleteStudyMaterial,
        announcements,
        postAnnouncement,
        deleteAnnouncement,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        updateUserRole,
        updateUserStatus,
        systemSettings,
        updateSystemSettings,
        auditLogs,
        logAuditEvent,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
