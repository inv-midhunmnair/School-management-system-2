from django.urls import path
from .views import CreateExamView, StudentAssignedExamsView, AttemptExamView,ViewExamDetail

urlpatterns = [
    path('teacher/create-exam/', CreateExamView.as_view(), name='create-exam'),
    path('student/exams/', StudentAssignedExamsView.as_view(), name='student-exams'),
    path('student/exams/<int:exam_id>/submit/', AttemptExamView.as_view(), name='submit-exam'),
    path('student/view/<exam_id>/', ViewExamDetail.as_view())
]
