from django.urls import path
from .views import health, login_view, users_collection, user_detail

urlpatterns = [
    path('health/', health),
    path('login/', login_view),
    path('users/', users_collection),
    path('users/<int:user_id>/', user_detail),
]
