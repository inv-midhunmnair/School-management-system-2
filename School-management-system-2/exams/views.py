from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Exam, Question, Submission
from core.models import Teacher, Student
from .serializers import ExamCreateSerializer, ExamSerializer, SubmissionSerializer
from core.permissions import IsTeacher, IsStudent
from django.shortcuts import get_object_or_404


now = timezone.now()
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

class StudentActiveExamsView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        student = Student.objects.get(user=request.user)
        now = timezone.now()
        exams = Exam.objects.filter(
            assigned_students=student,
            end_time__gte=now  # Not expired
        )

        # Append has_submitted for each exam
        data = []
        for exam in exams:
            serialized = ExamSerializer(exam, context={'request': request}).data
            has_submitted = Submission.objects.filter(student=student, exam=exam).exists()
            serialized['has_submitted'] = has_submitted
            data.append(serialized)

        return Response(data)


class StudentExpiredExamsView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        student = Student.objects.get(user=request.user)
        now = timezone.now()
        expired_exams = Exam.objects.filter(
            assigned_students=student,
            end_time__lt=now  # Expired
        )
        # Only return minimal details
        data = [
            {
                "id": exam.id,
                "title": exam.title,
                "description": exam.description,
                "start_time": exam.start_time,
                "end_time": exam.end_time,
            }
            for exam in expired_exams
        ]
        return Response(data)


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

        if Submission.objects.filter(student=student, exam=exam).exists():
            return Response({"error": "You have already submitted this exam"}, status=403)
        
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
            return Response({"error": "You cannot view the exam before the start time"}, status=403)
        if now > exam.end_time:
            return Response({"error": "This exam has expired"}, status=403)

        serializer = ExamSerializer(exam)
        return Response(serializer.data)

class StudentScoreView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=404)

        submissions = Submission.objects.filter(student=student)
        result = []

        for submission in submissions:
            score = 0
            total = 0

            answers_list = submission.answers  # now expecting a list of dicts

            for item in answers_list:
                qid = item.get("question_id")
                selected_option = item.get("selected_option")

                try:
                    option_mapping = {
                            "option_1": "1",
                            "option_2": "2",
                            "option_3": "3",
                            "option_4": "4"}

                    question = Question.objects.get(id=qid)
                    total += 1
                    selected_option_str = option_mapping.get(selected_option)
                    if selected_option_str == str(question.correct_option):
                        score += 1  
                except Question.DoesNotExist:
                    continue

            result.append({
                "exam_id": submission.exam.id,
                "exam_title": submission.exam.title,
                "submitted_at": submission.submitted_at,
                "score": score,
                "total": total
            })

        return Response(result)
