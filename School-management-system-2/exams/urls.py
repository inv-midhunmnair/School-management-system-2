from django.urls import path
from .views import CreateExamView, StudentActiveExamsView, AttemptExamView, StudentExpiredExamsView, StudentScoreView,ViewExamDetail

urlpatterns = [
    path('teacher/create-exam/', CreateExamView.as_view(), name='create-exam'),
    path('student/exams/<int:exam_id>/submit/', AttemptExamView.as_view(), name='submit-exam'),
    path('student/view/<exam_id>/', ViewExamDetail.as_view()),
    path('student/exams/active/', StudentActiveExamsView.as_view(), name='student-active-exams'),
    path('student/exams/expired/', StudentExpiredExamsView.as_view(), name='student-expired-exams'),
    path('student/scores/',StudentScoreView.as_view(),name='scores')
]
