from django.urls import path
from rest_framework import routers

from apps.users.views import ProfileViewSet, UserViewSet

# router = routers.SimpleRouter()
# router.register(r'', UserViewSet.as_view({'get': 'list', 'delete': 'destroy', }), basename='users')
# router.register(r'profiles', ProfileViewSet)

list_users = UserViewSet.as_view({'get': 'list'})
user_details = UserViewSet.as_view({'get': 'retrieve'})
user_delete = UserViewSet.as_view({'delete': 'destroy'})
user_update = UserViewSet.as_view({'put': 'update', 'patch': 'partial_update'})

profile_details = ProfileViewSet.as_view({'get': 'retrieve'})
profile_update = ProfileViewSet.as_view({'put': 'update', 'patch': 'partial_update'})

urlpatterns = [
    path('', list_users, name='users'),
    path('<int:pk>/', user_details, name='user_details'),
    path('<int:pk>/delete/', user_delete, name='user_delete'),
    path('<int:pk>/update/', user_update, name='user_update'),

    path('profile/<int:pk>/', profile_details, name='profile'),
    path('profile/<int:pk>/update/', profile_update, name='profile_update'),
]

# urlpatterns += router.urls