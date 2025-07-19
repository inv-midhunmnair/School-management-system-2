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
from django.http import HttpResponse,JsonResponse
from rest_framework.parsers import MultiPartParser
import csv, io
from .models import User, Student, Teacher
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
import csv
from io import StringIO, TextIOWrapper
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

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

class ImportStudentsCSVView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file', None)
        csv_text = request.data.get('csv_text', None)

        if not file and not csv_text:
            return JsonResponse({"error": "Please upload a .csv file or provide csv_text."}, status=400)

        try:
            # Enforce only CSV file upload
            if file:
                ext = os.path.splitext(file.name)[1].lower()
                if ext != '.csv':
                    return JsonResponse({"error": "Only .csv files are allowed."}, status=400)
                data = file.read().decode('utf-8')
            else:
                data = csv_text  # For fallback, if needed

            io_string = io.StringIO(data)
            reader = csv.DictReader(io_string)

            created_students = []
            errors = []

            for idx, row in enumerate(reader, start=1):
                try:
                    with transaction.atomic():
                        user = User.objects.create_user(
                            username=row['username'].strip(),
                            password=row['password'].strip(),
                            first_name=row['first_name'].strip(),
                            last_name=row['last_name'].strip(),
                            email=row['email'].strip(),
                            role='student'
                        )
                        student = Student.objects.create(
                            user=user,
                            first_name=row['first_name'].strip(),
                            last_name=row['last_name'].strip(),
                            email=row['email'].strip(),
                            phone=row['phone'].strip(),
                            roll_number=row['roll_number'].strip(),
                            student_class=row['student_class'].strip(),
                            date_of_birth=row['date_of_birth'].strip(),
                            admission_date=row['admission_date'].strip(),
                            status=row['status'].strip(),
                            assigned_teacher=Teacher.objects.get(id=row['assigned_teacher_id'].strip()) if row.get('assigned_teacher_id') else None
                        )
                        created_students.append(student.id)
                except Exception as e:
                    errors.append(f"Row {idx}: {str(e)}")

            return JsonResponse({
                "success": f"{len(created_students)} students created.",
                "errors": errors
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

class ImportTeachersCSVView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        # Handle file upload
        if 'file' in request.FILES:
            try:
                file = request.FILES['file']
                decoded_file = TextIOWrapper(file.file, encoding='utf-8')
                csv_reader = csv.DictReader(decoded_file)
            except Exception as e:
                return Response({"error": f"Invalid CSV file. {str(e)}"}, status=400)

        # Handle pasted CSV text
        elif 'csv_text' in request.data:
            try:
                csv_text = request.data['csv_text']
                csv_file = StringIO(csv_text)
                csv_reader = csv.DictReader(csv_file)
            except Exception as e:
                return Response({"error": f"Invalid CSV text. {str(e)}"}, status=400)

        else:
            return Response({"error": "No CSV file or text provided."}, status=400)

        created = 0
        errors = []

        for row in csv_reader:
            try:
                if User.objects.filter(username=row['username']).exists():
                    errors.append(f"Username {row['username']} already exists.")
                    continue
                if Teacher.objects.filter(email=row['email']).exists():
                    errors.append(f"Email {row['email']} already exists.")
                    continue

                user = User.objects.create_user(
                    username=row['username'],
                    password=row['password'],
                    role='teacher'
                )

                Teacher.objects.create(
                    user=user,
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    email=row['email'],
                    phone=row['phone'],
                    subject_specialization=row['subject_specialization'],
                    employee_id=row['employee_id'],
                    date_of_joining=row['date_of_joining'],
                    status=row['status']
                )
                created += 1

            except Exception as e:
                errors.append(f"Row error: {str(e)}")

        return Response({
            "message": f"{created} teachers imported successfully.",
            "errors": errors
        }, status=status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST)

User = get_user_model()

class PasswordResetRequestView(APIView):
    permission_classes = [] 
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"
            send_mail(
                subject="Password Reset",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False
            )
            return Response({"message": "Password reset email sent."}, status=200)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=404)

class PasswordResetConfirmView(APIView):
    permission_classes = [] 
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                new_password = request.data.get("new_password")
                confirm_password=request.data.get("confirm_password")
                if new_password==confirm_password:
                    user.set_password(new_password)
                    user.save()
                    return Response({"message": "Password reset successful."}, status=200)
                else:
                    return Response({"message":"Passwords don't match."},status=400)
            else:
                return Response({"error": "Invalid or expired token."}, status=400)
        except Exception:
            return Response({"error": "Invalid token or user."}, status=400)
