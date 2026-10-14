/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CollegeProvider, useCollege } from './context/CollegeContext.jsx';
import { Header } from './components/layout/Header.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { DashboardView } from './components/dashboard/DashboardView.jsx';
import { AdminDashboardView } from './components/admin/AdminDashboardView.jsx';
import { CourseCatalogView } from './components/courses/CourseCatalogView.jsx';
import { AttendanceTrackerView } from './components/attendance/AttendanceTrackerView.jsx';
import { TimetableView } from './components/timetable/TimetableView.jsx';
import { UpcomingEventsView } from './components/events/UpcomingEventsView.jsx';
import { NotificationsView } from './components/notifications/NotificationsView.jsx';
import { StudentsClubView } from './components/clubs/StudentsClubView.jsx';
import { StudyMaterialsView } from './components/materials/StudyMaterialsView.jsx';
import { GradingView } from './components/grading/GradingView.jsx';
import { StudentRegistrationView } from './components/students/StudentRegistrationView.jsx';
import { AnalyticsView } from './components/analytics/AnalyticsView.jsx';
import { StudentPortalView } from './components/student/StudentPortalView.jsx';
import { LoginView } from './components/auth/LoginView.jsx';
import { ToastContainer } from './components/common/Toast.jsx';
import { CourseFormModal } from './components/courses/CourseFormModal.jsx';
import { StudentRegisterModal } from './components/students/StudentRegisterModal.jsx';
import { StudentPhotoModal } from './components/student/StudentPhotoModal.jsx';
import { FacultyAuthGateModal } from './components/auth/FacultyAuthGateModal.jsx';
import { AddFacultyModal } from './components/admin/AddFacultyModal.jsx';
import { ScheduleExamModal } from './components/admin/ScheduleExamModal.jsx';
import { StudentDetailModal } from './components/admin/StudentDetailModal.jsx';
import { PostAnnouncementModal } from './components/admin/PostAnnouncementModal.jsx';
import { FacultyStaffView } from './components/admin/FacultyStaffView.jsx';
import { DepartmentsView } from './components/admin/DepartmentsView.jsx';
import { AcademicTermsView } from './components/admin/AcademicTermsView.jsx';
import { ExaminationsView } from './components/admin/ExaminationsView.jsx';
import { AssignmentsView } from './components/admin/AssignmentsView.jsx';
import { AnnouncementsView } from './components/admin/AnnouncementsView.jsx';
import { UserManagementView } from './components/admin/UserManagementView.jsx';
import { SystemSettingsView } from './components/admin/SystemSettingsView.jsx';
import { AuditLogsView } from './components/admin/AuditLogsView.jsx';
import { StudentDashboardView } from './components/student/StudentDashboardView.jsx';
import { StudentCoursesView } from './components/student/StudentCoursesView.jsx';
import { StudentAssignmentsView } from './components/student/StudentAssignmentsView.jsx';
import { StudentAcademicProgressView } from './components/student/StudentAcademicProgressView.jsx';
import { StudentLibraryView } from './components/student/StudentLibraryView.jsx';
import { StudentCalendarView } from './components/student/StudentCalendarView.jsx';
import { StudentProfileView } from './components/student/StudentProfileView.jsx';
import { StudentSettingsView } from './components/student/StudentSettingsView.jsx';
import { StudentSupportView } from './components/student/StudentSupportView.jsx';

function MainApp() {
  const { 
    activeTab, 
    role, 
    isAuthenticated,
    isStudentPhotoModalOpen,
    setIsStudentPhotoModalOpen,
    isFacultyAuthGateOpen,
    setIsFacultyAuthGateOpen,
    students,
    courses,
    setSelectedCourseId
  } = useCollege();

  // Modal visibility states for administrative operations
  const [isRegisterStudentOpen, setIsRegisterStudentOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [isScheduleExamOpen, setIsScheduleExamOpen] = useState(false);
  const [isPostAnnouncementOpen, setIsPostAnnouncementOpen] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  const isAdminOrFaculty = role === 'admin' || role === 'professor' || role === 'faculty';

  // If user is logged out, show the dedicated Student & Faculty Login Portal
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden antialiased font-sans bg-[#070b14] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Bar Navigation Header - Permanently Fixed at Top */}
      <Header 
        onSelectStudent={(student) => setSelectedStudentForModal(student)}
        onSelectCourse={(course) => {
          setSelectedCourseId(course.id);
        }}
      />

      {/* Main Viewport Split with Permanently Fixed Navigation Sidebar */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <Sidebar
          onOpenRegisterStudent={() => setIsRegisterStudentOpen(true)}
          onOpenAddCourse={() => setIsAddCourseOpen(true)}
        />

        {/* Dynamic Content Surface - Only this scrolls */}
        <main className="flex-1 overflow-y-auto pb-16 transition-all bg-[#070b14] min-w-0 custom-scrollbar">
          <div key={`${activeTab}-${role}`} className="page-transition">
            {activeTab === 'dashboard' && (
              isAdminOrFaculty ? (
                <AdminDashboardView
                  onOpenAddStudent={() => setIsRegisterStudentOpen(true)}
                  onOpenAddFaculty={() => setIsAddFacultyOpen(true)}
                  onOpenCreateCourse={() => setIsAddCourseOpen(true)}
                  onOpenScheduleExam={() => setIsScheduleExamOpen(true)}
                  onOpenPostAnnouncement={() => setIsPostAnnouncementOpen(true)}
                  onViewStudentDetails={(st) => setSelectedStudentForModal(st)}
                />
              ) : (
                <StudentDashboardView />
              )
            )}

            {activeTab === 'students' && (
              <StudentRegistrationView
                isRegisterModalOpen={isRegisterStudentOpen}
                setIsRegisterModalOpen={setIsRegisterStudentOpen}
              />
            )}

            {activeTab === 'faculty' && (
              <FacultyStaffView onOpenAddFaculty={() => setIsAddFacultyOpen(true)} />
            )}

            {activeTab === 'departments' && <DepartmentsView />}

            {activeTab === 'courses' && (
              isAdminOrFaculty ? <CourseCatalogView /> : <StudentCoursesView />
            )}

            {activeTab === 'terms' && <AcademicTermsView />}

            {activeTab === 'timetable' && <TimetableView />}

            {activeTab === 'examinations' && <ExaminationsView />}

            {activeTab === 'grading' && <GradingView />}

            {activeTab === 'attendance' && <AttendanceTrackerView />}

            {activeTab === 'assignments' && (
              isAdminOrFaculty ? <AssignmentsView /> : <StudentAssignmentsView />
            )}

            {activeTab === 'progress' && <StudentAcademicProgressView />}

            {activeTab === 'announcements' && <AnnouncementsView />}

            {activeTab === 'users' && <UserManagementView />}

            {(activeTab === 'reports' || activeTab === 'analytics') && <AnalyticsView />}

            {activeTab === 'settings' && (
              isAdminOrFaculty ? <SystemSettingsView /> : <StudentSettingsView />
            )}

            {activeTab === 'audit' && <AuditLogsView />}

            {activeTab === 'library' && <StudentLibraryView />}

            {activeTab === 'calendar' && <StudentCalendarView />}

            {activeTab === 'profile' && <StudentProfileView />}

            {activeTab === 'support' && <StudentSupportView />}

            {/* Student Specific Tab Fallbacks */}
            {activeTab === 'events' && <UpcomingEventsView />}
            {activeTab === 'notifications' && <NotificationsView />}
            {activeTab === 'clubs' && <StudentsClubView />}
            {activeTab === 'materials' && <StudyMaterialsView />}
            {activeTab === 'portal' && <StudentPortalView />}
          </div>
        </main>
      </div>

      {/* Administrative Action Modals */}
      <StudentRegisterModal
        isOpen={isRegisterStudentOpen}
        onClose={() => setIsRegisterStudentOpen(false)}
      />

      <CourseFormModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
      />

      <AddFacultyModal
        isOpen={isAddFacultyOpen}
        onClose={() => setIsAddFacultyOpen(false)}
      />

      <ScheduleExamModal
        isOpen={isScheduleExamOpen}
        onClose={() => setIsScheduleExamOpen(false)}
      />

      <PostAnnouncementModal
        isOpen={isPostAnnouncementOpen}
        onClose={() => setIsPostAnnouncementOpen(false)}
      />

      <StudentDetailModal
        student={selectedStudentForModal}
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
      />

      <StudentPhotoModal
        isOpen={isStudentPhotoModalOpen}
        onClose={() => setIsStudentPhotoModalOpen(false)}
      />

      <FacultyAuthGateModal
        isOpen={isFacultyAuthGateOpen}
        onClose={() => setIsFacultyAuthGateOpen(false)}
      />

      {/* Responsive Toast Feedback System */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <CollegeProvider>
      <MainApp />
    </CollegeProvider>
  );
}
