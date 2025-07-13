from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin, IsTeacher, IsStudent
from rest_framework import viewsets
from .models import Teacher, Student
from .serializers import (TeacherSerializer, StudentSerializer,
AdminCreateTeacherSerializer, AdminCreateStudentSerializer)
from rest_framework import status

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Admin-only Teacher CRUD
class TeacherAdminViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

# Admin-only Student CRUD
class StudentAdminViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class AdminCreateTeacherView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = AdminCreateTeacherSerializer(data=request.data)
        if serializer.is_valid():
            teacher = serializer.save()
            return Response({"message": "Teacher created successfully", "teacher_id": teacher.id}, status=201)
        return Response(serializer.errors, status=400)

class AdminCreateStudentView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = AdminCreateStudentSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            return Response({"message": "Student created successfully", "student_id": student.id}, status=201)
        return Response(serializer.errors, status=400)

# Teacher: View own profile
class TeacherProfileView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        try:
            teacher = Teacher.objects.get(user=request.user)
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response({"error": "Teacher profile not found."}, status=404)

# Teacher: View assigned students
class TeacherAssignedStudentsView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        try:
            teacher = Teacher.objects.get(user=request.user)
            students = Student.objects.filter(assigned_teacher=teacher)
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response({"error": "Teacher profile not found."}, status=404)

# Student: View own profile
class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
            serializer = StudentSerializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({"error": "Student profile not found."}, status=404)

# Student: View assigned teacher
class StudentAssignedTeacherView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
            teacher = student.assigned_teacher
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({"error": "Student profile not found."}, status=404)
        except Teacher.DoesNotExist:
            return Response({"error": "Assigned teacher not found."}, status=404)

import csv
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from core.permissions import IsAdmin  # your custom permission

from core.models import Student, Teacher

class ExportStudentsCSVView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="students.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'First Name', 'Last Name', 'Email', 'Phone Number',
            'Roll Number', 'Class', 'DOB', 'Admission Date',
            'Status', 'Assigned Teacher'
        ])

        students = Student.objects.select_related('assigned_teacher').all()

        for s in students:
            writer.writerow([
                s.first_name, s.last_name, s.email, s.phone,
                s.roll_number, s.student_class, s.date_of_birth,
                s.admission_date, s.status,
                f"{s.assigned_teacher.first_name} {s.assigned_teacher.last_name}" if s.assigned_teacher else ''
            ])

        return response


class ExportTeachersCSVView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="teachers.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'First Name', 'Last Name', 'Email', 'Phone Number',
            'Employee ID', 'Subject', 'Date of Joining', 'Status'
        ])

        teachers = Teacher.objects.all()
        for t in teachers:
            writer.writerow([
                t.first_name, t.last_name, t.email, t.phone,
                t.employee_id, t.subject_specialization,
                t.date_of_joining, t.status
            ])

        return response
