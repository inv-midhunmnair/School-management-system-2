// src/routes/Routes.tsx
import { Routes, Route } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../auth/ProtectedRoute";

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
  </Routes>
);

export default AppRoutes;
