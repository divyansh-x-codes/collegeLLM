import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  MapPin, 
  Award,
  ChevronRight,
  FolderOpen,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Layers,
  Check,
  TrendingUp,
  Mail,
  Building,
  HelpCircle,
  X,
  ShieldCheck,
  BookMarked
} from 'lucide-react';

export const StudentCoursesView = () => {
  const { currentStudent, courses, grades, setActiveTab, setSelectedCourseId, showToast } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [syllabusModalCourse, setSyllabusModalCourse] = useState(null);

  const student = currentStudent || {
    firstName: 'Divyansh',
    lastName: 'Chaudhary',
    studentId: 'STU-2026-808',
    enrolledCourseIds: ['c-1', 'c-2', 'c-3', 'c-4']
  };

  const getCourseGrade = (courseId, defaultGrade, defaultScore) => {
    const sId = student.id || student.studentId || 'stu-1';
    const rec = (grades || []).find(g => g.courseId === courseId && (g.studentId === sId || g.studentId === 'stu-1'));
    if (rec && rec.status === 'Published' && rec.letterGrade && rec.letterGrade !== 'N/A') {
      return {
        grade: rec.letterGrade,
        score: `${rec.weightedPercentage}%`,
        color: rec.letterGrade.startsWith('A') 
          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
          : rec.letterGrade.startsWith('B')
          ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
          : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      };
    }
    return {
      grade: defaultGrade,
      score: defaultScore,
      color: defaultGrade.startsWith('A') 
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    };
  };

  const g1 = getCourseGrade('c-1', 'A', '92.4%');
  const g2 = getCourseGrade('c-2', 'A-', '89.6%');
  const g3 = getCourseGrade('c-3', 'B+', '86.2%');
  const g4 = getCourseGrade('c-4', 'A', '94.8%');

  // Full enriched collegiate courses list
  const enrolledCourses = [
    {
      id: 'c-1',
      code: 'CS-301',
      title: 'Advanced Algorithms & Complexity',
      department: 'Computer Science & Engineering',
      credits: 4,
      term: 'Fall 2026',
      attendance: 96.2,
      attendedClasses: 25,
      totalClasses: 26,
      syllabusProgress: 68,
      currentGrade: g1.grade,
      currentScore: g1.score,
      gradeColor: g1.color,
      instructor: {
        name: 'Dr. Evelyn Vance',
        title: 'Professor & Department Chair',
        email: 'e.vance@unity.edu',
        office: 'Turing Hall 410',
        hours: 'Mon/Wed 02:00 PM – 04:00 PM'
      },
      schedule: {
        days: 'Mon, Wed, Fri',
        time: '10:00 AM – 11:30 AM',
        room: 'Hall B · Turing Amphitheater'
      },
      prerequisites: ['CS-201 Data Structures', 'MATH-210 Discrete Mathematics'],
      description: 'Rigorous study of algorithmic design paradigms including dynamic programming, greedy methods, amortized analysis, network flow, and introduction to NP-completeness and approximation algorithms.',
      modules: [
        { title: 'Module 1: Advanced Asymptotic Analysis & Recurrences', status: 'Completed' },
        { title: 'Module 2: Amortized Analysis & Fibonacci Heaps', status: 'Completed' },
        { title: 'Module 3: Dynamic Programming & Optimal Substructure', status: 'Completed' },
        { title: 'Module 4: Graph Flow Networks & Bipartite Matching', status: 'In Progress' },
        { title: 'Module 5: NP-Completeness & Reductions', status: 'Upcoming' },
        { title: 'Module 6: Approximation Algorithms & Randomized Methods', status: 'Upcoming' }
      ],
      assessments: [
        { name: 'Problem Sets (6)', weight: 20 },
        { name: 'Midterm Examination', weight: 25 },
        { name: 'Graph Theory & DP Lab', weight: 20 },
        { name: 'Final Examination', weight: 25 },
        { name: 'Lecture Participation', weight: 10 }
      ],
      pendingAssignments: 1
    },
    {
      id: 'c-2',
      code: 'CS-420',
      title: 'Distributed Systems & Cloud Architecture',
      department: 'Computer Science & Engineering',
      credits: 4,
      term: 'Fall 2026',
      attendance: 95.5,
      attendedClasses: 21,
      totalClasses: 22,
      syllabusProgress: 64,
      currentGrade: g2.grade,
      currentScore: g2.score,
      gradeColor: g2.color,
      instructor: {
        name: 'Dr. Evelyn Vance',
        title: 'Professor & Department Chair',
        email: 'e.vance@unity.edu',
        office: 'Turing Hall 410',
        hours: 'Tue/Thu 03:00 PM – 05:00 PM'
      },
      schedule: {
        days: 'Tue, Thu',
        time: '01:30 PM – 03:00 PM',
        room: 'Lab 304 · Von Neumann Wing'
      },
      prerequisites: ['CS-301 Advanced Algorithms', 'CS-250 Computer Systems'],
      description: 'Principles of reliable distributed computing: consensus protocols (Paxos, Raft), replication models, logical clocks, Byzantine fault tolerance, and scalable cloud storage primitives.',
      modules: [
        { title: 'Module 1: RPC, gRPC & Protocol Buffers', status: 'Completed' },
        { title: 'Module 2: Logical Clocks & Vector Timestamps', status: 'Completed' },
        { title: 'Module 3: Raft Consensus Protocol & Leader Election', status: 'Completed' },
        { title: 'Module 4: Two-Phase Commit & Distributed Transactions', status: 'In Progress' },
        { title: 'Module 5: Byzantine Fault Tolerance & Blockchain Basics', status: 'Upcoming' },
        { title: 'Module 6: Cloud Native Kubernetes Microservice Capstone', status: 'Upcoming' }
      ],
      assessments: [
        { name: 'Raft Consensus Lab', weight: 30 },
        { name: 'Midterm Design Paper', weight: 25 },
        { name: 'Final Microservice Capstone', weight: 35 },
        { name: 'Seminar Discussions', weight: 10 }
      ],
      pendingAssignments: 1
    },
    {
      id: 'c-3',
      code: 'ECE-215',
      title: 'Signals, Systems & Digital Filtering',
      department: 'Electrical & Computer Engineering',
      credits: 3,
      term: 'Fall 2026',
      attendance: 91.8,
      attendedClasses: 19,
      totalClasses: 21,
      syllabusProgress: 60,
      currentGrade: g3.grade,
      currentScore: g3.score,
      gradeColor: g3.color,
      instructor: {
        name: 'Prof. Arthur Pendelton',
        title: 'Associate Professor',
        email: 'a.pendelton@unity.edu',
        office: 'Maxwell Center 202',
        hours: 'Mon/Wed 04:00 PM – 05:30 PM'
      },
      schedule: {
        days: 'Mon, Wed',
        time: '02:00 PM – 03:30 PM',
        room: 'Maxwell Annex 105'
      },
      prerequisites: ['MATH-220 Linear Algebra', 'PHYS-102 General Physics II'],
      description: 'Continuous and discrete-time signals, linear time-invariant systems, convolution, Fourier series and transforms, Z-transforms, sampling theorem, and digital filter synthesis in MATLAB.',
      modules: [
        { title: 'Module 1: Continuous & Discrete Time LTI Systems', status: 'Completed' },
        { title: 'Module 2: Fourier Series & Continuous Fourier Transform', status: 'Completed' },
        { title: 'Module 3: Nyquist-Shannon Sampling & Reconstruction', status: 'Completed' },
        { title: 'Module 4: Discrete Fourier Transform & FFT Algorithms', status: 'In Progress' },
        { title: 'Module 5: Z-Transform & Digital Filter Stability', status: 'Upcoming' },
        { title: 'Module 6: FIR/IIR Filter Synthesis in MATLAB', status: 'Upcoming' }
      ],
      assessments: [
        { name: 'Fourier Transform Problem Sets', weight: 25 },
        { name: 'MATLAB DSP Lab Project', weight: 25 },
        { name: 'Comprehensive Final', weight: 40 },
        { name: 'Lab Attendance & Notes', weight: 10 }
      ],
      pendingAssignments: 1
    },
    {
      id: 'c-4',
      code: 'STAT-310',
      title: 'Mathematical Statistics & Inference',
      department: 'Data Science & Applied Math',
      credits: 3,
      term: 'Fall 2026',
      attendance: 95.0,
      attendedClasses: 21,
      totalClasses: 22,
      syllabusProgress: 65,
      currentGrade: g4.grade,
      currentScore: g4.score,
      gradeColor: g4.color,
      instructor: {
        name: 'Dr. Gregory Thorne',
        title: 'Senior Faculty & Statistical Fellow',
        email: 'g.thorne@unity.edu',
        office: 'Euler Hall 12',
        hours: 'Tue/Thu 11:30 AM – 01:00 PM'
      },
      schedule: {
        days: 'Tue, Thu',
        time: '10:00 AM – 11:30 AM',
        room: 'Euler Hall 12'
      },
      prerequisites: ['MATH-201 Multivariable Calculus', 'STAT-200 Probability Theory'],
      description: 'Classical probability distributions, convergence in probability, maximum likelihood estimation, confidence intervals, Neyman-Pearson hypothesis testing, and Bayesian statistical paradigms.',
      modules: [
        { title: 'Module 1: Probability Inequalities & Limit Theorems', status: 'Completed' },
        { title: 'Module 2: Sufficient Statistics & Rao-Blackwell Theorem', status: 'Completed' },
        { title: 'Module 3: Maximum Likelihood Estimation & Cramér-Rao', status: 'Completed' },
        { title: 'Module 4: Neyman-Pearson Lemma & Hypothesis Tests', status: 'In Progress' },
        { title: 'Module 5: Likelihood Ratio Tests & Asymptotics', status: 'Upcoming' },
        { title: 'Module 6: Bayesian Credible Intervals & MCMC', status: 'Upcoming' }
      ],
      assessments: [
        { name: 'Weekly Problem Sets', weight: 30 },
        { name: 'Midterm Exam (MLE & Testing)', weight: 30 },
        { name: 'Final Examination', weight: 30 },
        { name: 'Statistical Computing Lab', weight: 10 }
      ],
      pendingAssignments: 1
    }
  ];

  // Filtering
  const filtered = enrolledCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDeptFilter === 'all' || course.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-7 text-slate-100 font-sans antialiased">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Academic Matriculation
            </span>
            <span>·</span>
            <span className="text-teal-400 font-mono">Fall 2026 Term</span>
            <span>·</span>
            <span className="text-slate-300">Degree Program: B.Sc. Computer Science</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/10">
              <BookOpen className="w-7 h-7" />
            </div>
            <span>My Enrolled Courses</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Official curriculum modules enrolled for {student.firstName}'s current semester.
          </p>
        </div>

        {/* Top Actions & Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 rounded-xl bg-[#0c1427] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-64 shadow-inner"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setActiveTab('timetable')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-[#0c1427] hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>View Schedule</span>
          </button>
        </div>
      </div>

      {/* 2. Top Academic Metrics Cards (Matching Box Aesthetics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Registered Course Load</p>
            <p className="text-2xl font-extrabold text-white mt-1">{totalCredits} Credit Units</p>
            <p className="text-[11px] text-teal-400 mt-0.5 font-mono">4 Core Enrolled Modules</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Current Semester GPA</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">3.88 / 4.00</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Dean's List Distinction</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Average Attendance</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">94.8%</p>
            <p className="text-[11px] text-teal-400 mt-0.5 font-mono">✓ 86 of 91 Sessions Present</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Pending Deliverables</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">4 Active Tasks</p>
            <p className="text-[11px] text-amber-300 mt-0.5 font-mono">2 Due Before Friday</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Department Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pl-1 shrink-0 font-semibold">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          Division:
        </span>
        {[
          { id: 'all', label: 'All Registered Courses (4)' },
          { id: 'Computer Science & Engineering', label: 'Computer Science (2)' },
          { id: 'Electrical & Computer Engineering', label: 'Electrical Engineering (1)' },
          { id: 'Data Science & Applied Math', label: 'Data Science & Math (1)' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedDeptFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
              selectedDeptFilter === filter.id
                ? 'bg-gradient-to-r from-indigo-500/20 to-teal-500/20 text-indigo-200 border-indigo-500/40 shadow-sm'
                : 'bg-[#0c1427] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* 4. ENHANCED COURSE CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="p-6 rounded-3xl bg-[#0c1427] border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-5 group relative overflow-hidden"
          >
            {/* Ambient subtle glow on hover */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />

            <div>
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm">
                    {course.code}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800">
                    {course.department.split('&')[0].trim()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    {course.credits} Credit Hours
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${course.gradeColor}`}>
                    Standing: {course.currentGrade} ({course.currentScore})
                  </span>
                </div>
              </div>

              {/* Course Title & Department */}
              <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                {course.title}
              </h3>
              <p className="text-xs text-indigo-400 font-mono mt-0.5">{course.department}</p>
              
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5 line-clamp-2">
                {course.description}
              </p>

              {/* Progress & Attendance Visual Meters */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-slate-800/80">
                {/* Meter 1: Attendance */}
                <div className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Class Attendance</span>
                    <span className="font-bold text-teal-300">{course.attendance}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full" 
                      style={{ width: `${course.attendance}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {course.attendedClasses} of {course.totalClasses} Sessions Attended
                  </span>
                </div>

                {/* Meter 2: Syllabus Coverage */}
                <div className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Syllabus Completion</span>
                    <span className="font-bold text-indigo-300">{course.syllabusProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                      style={{ width: `${course.syllabusProgress}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Module 4 of 6 In Progress
                  </span>
                </div>
              </div>

              {/* Schedule & Faculty Metadata */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2 text-xs text-slate-300 font-mono">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Instructor:</span>
                  </span>
                  <span className="text-white font-medium">{course.instructor.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Time:</span>
                  </span>
                  <span className="text-slate-200">{course.schedule.time}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Location:</span>
                  </span>
                  <span className="text-emerald-300 font-sans">{course.schedule.room}</span>
                </div>
              </div>
            </div>

            {/* Course Card Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setActiveTab('materials');
                }}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-teal-300 bg-[#080d1b] hover:bg-slate-800 rounded-xl border border-slate-800 hover:border-teal-500/40 transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>Course Materials</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSyllabusModalCourse(course)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-[#080d1b] hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                >
                  <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Syllabus &amp; Modules</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setActiveTab('assignments');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-950/40 transition-all cursor-pointer"
                >
                  <span>Assignments</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          COURSE SYLLABUS & MODULES EXPLORER MODAL
      ========================================================================= */}
      {syllabusModalCourse && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c1427] border border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-100 font-sans space-y-6 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {syllabusModalCourse.code}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Curriculum Syllabus</span>
                  </div>
                  <h3 className="font-bold text-white text-lg mt-0.5">{syllabusModalCourse.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSyllabusModalCourse(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Course Overview */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Course Description &amp; Objectives</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#080d1b] p-3.5 rounded-2xl border border-slate-800">
                {syllabusModalCourse.description}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Formal Prerequisites</span>
              <div className="flex flex-wrap gap-2">
                {syllabusModalCourse.prerequisites.map(p => (
                  <span key={p} className="text-xs font-mono px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-teal-300">
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly Modules List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
                <span>Semester Curriculum Modules</span>
                <span className="text-indigo-400">6 Modules</span>
              </div>

              <div className="space-y-2">
                {syllabusModalCourse.modules.map((mod, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-200">{mod.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      mod.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : mod.status === 'In Progress'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grading Assessment Weightage */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Grade Assessment Weightages</span>
              <div className="p-3.5 rounded-2xl bg-[#080d1b] border border-slate-800 space-y-2">
                {syllabusModalCourse.assessments.map(asm => (
                  <div key={asm.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{asm.name}</span>
                    <span className="font-mono font-bold text-teal-300">{asm.weight}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty Office Hours */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-1">
              <span className="font-bold text-indigo-300 font-mono">Faculty Contact &amp; Office Hours</span>
              <p className="text-slate-300">
                {syllabusModalCourse.instructor.name} · {syllabusModalCourse.instructor.office}
              </p>
              <p className="text-slate-400 font-mono text-[11px]">
                Email: {syllabusModalCourse.instructor.email} · Office Hours: {syllabusModalCourse.instructor.hours}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSyllabusModalCourse(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
              >
                Close Syllabus
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
