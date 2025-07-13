from django.db import migrations

def truncate_students_and_teachers(apps, schema_editor):
    Student = apps.get_model('core', 'Student')
    Teacher = apps.get_model('core', 'Teacher')
    
    # Delete all records
    Student.objects.all().delete()
    Teacher.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),  # update this
    ]

    operations = [
        migrations.RunPython(truncate_students_and_teachers),
    ]
