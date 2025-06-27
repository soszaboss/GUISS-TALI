from django.urls import path

from apps.authemail import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView


urlpatterns = [
    # path(
    #     'signup/',
    #     views.Signup.as_view(),
    #     name='signup_client'
    # ),
     # routes pour l'obtention d'un access et refresh token
    path(
        'token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    # routes pour la gestion de la liste noire des tokens
    path(
        'token/blacklist/',
        TokenBlacklistView.as_view(),
            name='token_blacklist'
    ),

    path(
        'login/',
        views.LoginView.as_view(),
        name='authemail-login'
    ),

    path(
        'password/reset/',
        views.PasswordResetView.as_view(),
         name='authemail-password-reset'
    ),

    path(
        'password/reset/verify/',
        views.PasswordResetVerifyView.as_view(),
         name='authemail-password-reset-verify'
    ),

    path(
        'password/reset/verified/',
        views.PasswordResetVerifiedView.as_view(),
         name='authemail-password-reset-verified'
    ),

    # path(
    #     'email/change/',
    #     views.EmailChangeView.as_view(),
    #      name='authemail-email-change'
    # ),

    # path(
    #     'email/change/verify/',
    #     views.EmailChangeVerifyView.as_view(),
    #      name='authemail-email-change-verify'
    # ),

    path(
        'password/change/',
        views.PasswordChangeView.as_view(),
         name='authemail-password-change'
    ),
]