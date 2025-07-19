// src/routes/Routes.tsx
import { Routes, Route } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../auth/ProtectedRoute";
import CreateExamPage from "../pages/CreateExamPage";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import RegisterTeacherPage from "../pages/RegisterTeacherPage";
import RegisterStudentPage from "../pages/RegisterStudentPage";
import TeachersPage from "../pages/TeachersPage";
import StudentsPage from "../pages/StudentsPage";
import TeacherStudentsPage from "../pages/TeacherStudentsPage";
import TeacherProfilePage from "../pages/TeacherProfilePage";
import StudentTeacherPage from "../pages/StudentTeacherPage";
import StudentProfilePage from "../pages/StudentProfilePage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ImportStudentsPage from "../pages/ImportStudentsPage";
import StudentExamsPage from "../pages/StudentExamsPage";
import AttemptExamPage from "../pages/AttemptExamPage";

const AppRoutes = () => (
  <Routes>
    {/* Public Route */}
    <Route
      path="/login"
      element={
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      }
    />

    {/* Protected Routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/register-teacher"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <RegisterTeacherPage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/register-student"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <RegisterStudentPage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/teachers"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <TeachersPage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/students"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <StudentsPage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/teacher/students"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <TeacherStudentsPage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/teacher/profile"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <TeacherProfilePage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/student/teacher"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <StudentTeacherPage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/student/profile"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <StudentProfilePage />
            </AppLayout>
          }
        />
      }
    />
    <Route
  path="/forgot-password"
  element={
    <AuthLayout>
      <ForgotPasswordPage />
    </AuthLayout>
  }
/>

<Route
  path="/reset-password/:uidb64/:token"
  element={<ResetPasswordPage />}
/>

<Route
  path="/import-students"
  element={
    <ProtectedRoute
      element={
        <AppLayout>
          <ImportStudentsPage />
        </AppLayout>
      }
    />
  }
/>
<Route
  path="/teacher/create-exam"
  element={
    <ProtectedRoute
      element={
        <AppLayout>
          <CreateExamPage />
        </AppLayout>
      }
    />
  }
/>

<Route
  path="exams/student/exams"  
  element={
    <ProtectedRoute
      element={
        <AppLayout>
          <StudentExamsPage />
        </AppLayout>
      }
    />
  }
/>

<Route
  path="/student/view/:exam_id/"
  element={
    <ProtectedRoute
      element={
        <AppLayout>
          <AttemptExamPage />
        </AppLayout>
      }
    />
  }
/>

  </Routes>
);

export default AppRoutes;
