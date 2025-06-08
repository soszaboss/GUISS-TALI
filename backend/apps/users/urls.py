from django.urls import path

from apps.users.views import ProfileViewSet, UserViewSet
from apps.authemail.views import Signup

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
    path('me/', UserViewSet.as_view({'get': 'me'}), name='user-me'),
    path('create/', Signup.as_view(), name='user-create'),
    path('<int:pk>/', user_details, name='user_details'),
    path('<int:pk>/delete/', user_delete, name='user-delete'),
    path('<int:pk>/update/', user_update, name='user-update'),

    path('profile/<int:pk>/', profile_details, name='profile'),
    path('profile/<int:pk>/update/', profile_update, name='profile-update'),
]

# urlpatterns += router.urls