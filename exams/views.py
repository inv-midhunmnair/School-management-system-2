from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Exam, Submission
from core.models import Teacher, Student
from .serializers import ExamCreateSerializer, ExamSerializer, SubmissionSerializer
from core.permissions import IsTeacher, IsStudent

class CreateExamView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request):
        teacher = Teacher.objects.get(user=request.user)
        data = request.data.copy()
        data['created_by'] = teacher.id
        serializer = ExamCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save(created_by=teacher)
            return Response({"message": "Exam created"}, status=201)
        return Response(serializer.errors, status=400)

class StudentAssignedExamsView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        student = Student.objects.get(user=request.user)
        now = timezone.now()
        exams = Exam.objects.filter(assigned_students=student)
        serializer = ExamSerializer(exams, many=True)
        return Response(serializer.data)

class AttemptExamView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, exam_id):
        student = Student.objects.get(user=request.user)
        try:
            exam = Exam.objects.get(id=exam_id, assigned_students=student)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found or not assigned to you"}, status=404)

        now = timezone.now()
        if now < exam.start_time:
            return Response({"error": "Exam has not started yet"}, status=403)
        if now > exam.end_time:
            return Response({"error": "Exam has ended"}, status=403)

        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            Submission.objects.create(
                student=student,
                exam=exam,
                answers=serializer.validated_data['answers']
            )
            return Response({"message": "Exam submitted successfully"}, status=200)
        return Response(serializer.errors, status=400)

class ViewExamDetail(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request, exam_id):
        student = Student.objects.get(user=request.user)
        try:
            exam = Exam.objects.get(id=exam_id, assigned_students=student)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found or not assigned to you"}, status=404)

        now = timezone.now()
        if now < exam.start_time:
            return Response({"error": "Exam has not started yet"}, status=403)
        if now > exam.end_time:
            return Response({"error": "Exam has ended"}, status=403)

        serializer = ExamSerializer(exam)
        return Response(serializer.data)
