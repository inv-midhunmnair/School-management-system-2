from rest_framework import serializers
from .models import Exam, Question, Submission
from core.models import Student

class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_1', 'option_2', 'option_3', 'option_4','correct_option']

class QuestionStudentViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_1', 'option_2', 'option_3', 'option_4']

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionStudentViewSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'questions']

class ExamCreateSerializer(serializers.ModelSerializer):
    questions = QuestionCreateSerializer(many=True, write_only=True)
    assigned_students = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), many=True)

    class Meta:
        model = Exam
        fields = ['title', 'description', 'start_time', 'end_time', 'assigned_students', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        assigned_students = validated_data.pop('assigned_students', [])

        exam = Exam.objects.create(**validated_data)
        exam.assigned_students.set(assigned_students)

        for question_data in questions_data:
            Question.objects.create(
                exam=exam,
                text=question_data.get('text', ''),
                option_1=question_data.get('option_1', ''),
                option_2=question_data.get('option_2', ''),
                option_3=question_data.get('option_3', ''),
                option_4=question_data.get('option_4', ''),
                correct_option=question_data.get('correct_option', 1),
            )

        return exam

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['exam', 'answers']
