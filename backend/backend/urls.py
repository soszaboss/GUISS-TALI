from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView


router = DefaultRouter()



urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),

    # routes pour la gestion des utilisateurs et profiles
    path('admin/users/', include('apps.users.urls'), name='users'),

    path('admin/', admin.site.urls),

    # routes pour l'obtention d'un access et refresh token
    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

    # routes pour la documentation de l'api
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),

    path(
        'api/doc/',
        SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui'
    ),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # routes pour l'authentification
    path('auth/', include('apps.authemail.urls'), name='auth'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)