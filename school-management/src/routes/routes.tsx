import { Routes, Route } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../auth/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import RegisterTeacherPage from "../pages/RegisterTeacherPage";
import RegisterStudentPage from "../pages/RegisterStudentPage";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />

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
    </Routes>
  );
}

export default App;
