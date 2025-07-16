from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # include app urls
    path('api/exams/', include('exams.urls')),
]
