from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User,Teacher, Student

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['username'] = self.user.username
        return data

# Teacher Serializer
class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

# Student Serializer
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class AdminCreateTeacherSerializer(serializers.Serializer):
    # User fields
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('teacher', 'teacher')])

    # Teacher profile fields
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    subject_specialization = serializers.CharField()
    employee_id = serializers.CharField()
    date_of_joining = serializers.DateField()
    status = serializers.ChoiceField(choices=[('active', 'active'), ('inactive', 'inactive')])

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if Teacher.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already used for a teacher.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
        username=validated_data['username'],
        password=validated_data['password'],
        role='teacher',
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name'],
        email=validated_data['email']
        )
        teacher = Teacher.objects.create(
        user=user,
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name'],
        email=validated_data['email'],
        phone=validated_data['phone'],
        subject_specialization=validated_data['subject_specialization'],
        employee_id=validated_data['employee_id'],
        date_of_joining=validated_data['date_of_joining'],
        status=validated_data['status']
        )
        return teacher

class AdminCreateStudentSerializer(serializers.Serializer):
    # User fields
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('student', 'student')])

    # Student profile fields
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    roll_number = serializers.CharField()
    student_class = serializers.CharField()
    date_of_birth = serializers.DateField()
    admission_date = serializers.DateField()
    status = serializers.ChoiceField(choices=[('active', 'active'), ('inactive', 'inactive')])
    assigned_teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all())

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already used for a student.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            role='student',
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email']
        )
        student = Student.objects.create(
            user=user,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            roll_number=validated_data['roll_number'],
            student_class=validated_data['student_class'],
            date_of_birth=validated_data['date_of_birth'],
            admission_date=validated_data['admission_date'],
            status=validated_data['status'],
            assigned_teacher=validated_data['assigned_teacher']
        )
        return student
