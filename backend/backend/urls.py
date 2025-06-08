from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView


router = DefaultRouter()



urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),

    path('admin/', admin.site.urls, name='admin'), 

    # routes pour la gestion des utilisateurs et profiles
    path('users/', include('apps.users.urls'), name='users'),

    # routes pour l'obtention d'un access et refresh token
    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    # routes pour la gestion de la liste noire des tokens
    path(
        'api/token/blacklist/',
        TokenBlacklistView.as_view(),
            name='token_blacklist'
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

    # routes pour les patients
    path('patients/', include('apps.patients.urls'), name='patients'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)