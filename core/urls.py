from django.urls import path,include
from .views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView,
    TeacherAdminViewSet,
    StudentAdminViewSet,
    AdminCreateStudentView,
    AdminCreateTeacherView,
    TeacherProfileView,
    TeacherAssignedStudentsView,
    StudentProfileView,
    StudentAssignedTeacherView
)

router = DefaultRouter()
router.register(r'admin/teachers', TeacherAdminViewSet, basename='admin-teacher')
router.register(r'admin/students', StudentAdminViewSet, basename='admin-student')

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    path('admin/create-teacher/', AdminCreateTeacherView.as_view()),
    path('admin/create-student/', AdminCreateStudentView.as_view()),
    path('teacher/profile/', TeacherProfileView.as_view()),
    path('teacher/students/', TeacherAssignedStudentsView.as_view()),
    path('student/profile/', StudentProfileView.as_view()),
    path('student/teacher/', StudentAssignedTeacherView.as_view()),
]
