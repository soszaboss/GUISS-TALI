from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from django.utils.translation import gettext_lazy as _

from apps.authemail.models import PasswordResetCode
from apps.authemail.tokens import RefreshTokenSerializer
from serializers.authemail import SignupSerializer, LoginSerializer, PasswordResetSerializer, \
    PasswordResetVerifiedSerializer, EmailChangeSerializer, PasswordChangeSerializer
from services.authemail import user_login, user_reset_password, user_reset_password_verify, \
    user_reset_password_verified, email_change_request, email_change_verify, password_change


class Signup(APIView):
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

    @extend_schema(
        request=serializer_class,
        responses={201: None},
    )
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.create(serializer.data)
            return Response('', status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    @extend_schema(
        responses={
            200: TokenRefreshSerializer,
            400: OpenApiResponse(
                description="Mauvais saisis venant de l'utilisateur."
            ),
            401: OpenApiResponse(
                description="Le compte de l'utilisateur n'est soit activé, vérifié ou les crédentials sont incorrect."
            )
        },
        description="Authentification."
    )
    def post(self, request, format=None):
        """ Authentification de l'utilisateur. """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']
            password = serializer.data['password']
            return Response(user_login(email, password), status=status.HTTP_200_OK)


class LogoutView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(
        responses={
            204: OpenApiResponse(description="Logout avec succès."),
            400: OpenApiResponse(
                description="Vous n'avez pas les autorisations pour vous déconnecter."),
        },
        description="Création d'un compte super utilisateur.",
        parameters=[
            OpenApiParameter(
                name='Authorization',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.HEADER,
                description='JWT token format: Bearer <token>',
                required=True
            )
        ]
    )
    def post(self, request, *args):
        """ Deconnexion de l'utilisateur en lui retirant tous les tokens à sa disposition. """
        sz = self.get_serializer(data=request.data)
        sz.is_valid(raise_exception=True)
        sz.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordResetView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetSerializer

    @extend_schema(
        responses={
            200: OpenApiResponse(description="Un code qui vous permettra de la reinitialisation de votre mot de passe "
                                             "vous sera envoyé par email."),
            400: OpenApiResponse(description="Reinitialisation non permis."),
        },
        description="Envoie du code via email."
    )
    def post(self, request, format=None):
        """ 1. Demander un changement du mot de passe. """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']
            user_reset_password(email)


class PasswordResetVerifyView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        responses={
            200: OpenApiResponse(description="Vérification de l'appartenance du compte réussi."),
            400: OpenApiResponse(description="La vérification a échoué."),
        },
        parameters=[
            OpenApiParameter(
                name='code', type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='code',
                required=True
            )
        ],
        description="Envoie du code reçu via email pour confirmer que le compte vous appartient."
    )
    def get(self, request, format=None):
        """
            2. Vérification du code envoyé par email
            et autorisation à changer de mot de passe une fois le code valide.
        """
        code = request.GET.get('code', '')

        try:
            content = user_reset_password_verify(code)
            return Response(content, status=status.HTTP_200_OK)
        except PasswordResetCode.DoesNotExist:
            content = {'detail': _('La vérification a échoué.')}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetVerifiedView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetVerifiedSerializer

    @extend_schema(
        responses={
            200: OpenApiResponse(description="Changement du mot de passe réussi."),
            400: OpenApiResponse(description="Le changement du mot de passe a échoué."),
        },
        parameters=[
            OpenApiParameter(
                name='code', type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='code',
                required=True
            ),
            OpenApiParameter(
                name='password', type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='password',
                required=True
            )
        ],
        description="Changement du mot de passe."
    )
    def post(self, request, format=None):
        """ 3. Changement du mot de passe. """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = serializer.data['code']
            password = serializer.data['password']
            try:
                content = user_reset_password_verified(code, password)
                return Response(content, status=status.HTTP_200_OK)
            except PasswordResetCode.DoesNotExist:
                content = {'detail': _('Impossible d\'identifier l\'utilisateur.')}
                return Response(content, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class EmailChangeView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EmailChangeSerializer

    @extend_schema(
        responses={
            200: OpenApiResponse(description="Vérifier votre adresse email."),
            400: OpenApiResponse(description="Email déjà pris ou l'utilisateur n'existe pas.")
        },
        description="Envoie du code via email.",
        parameters=[
            OpenApiParameter(
                name='Authorization', type=OpenApiTypes.STR,
                location=OpenApiParameter.HEADER,
                description='JWT token format: Bearer <token>',
                required=True
            )
        ]
    )
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                email = email_change_request(
                    user=request.user,
                    new_email=serializer.validated_data['email']
                )
                return Response({'email': email}, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(e.detail, status=e.code)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailChangeVerifyView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        responses={
            200: OpenApiResponse(description="Email changé avec succès"),
            400: OpenApiResponse(description="Erreur en vérifiant votre code."),
        },
        description="Confirmation du changement de l'email.",
        parameters=[
            OpenApiParameter(name='code', type=OpenApiTypes.STR, required=True,
                             description="Code de confirmation pour changer l'email"),
        ]
    )
    def get(self, request, format=None):
        code = request.GET.get('code', '')
        try:
            result = email_change_verify(code=code)
            return Response(result, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(e.detail, status=e.code)


class PasswordChangeView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PasswordChangeSerializer

    @extend_schema(
        responses={
            204: OpenApiResponse(description="Mot de passe changé avec succès."),
            400: OpenApiResponse(
                description="Le mot de passe ne suit pas les normes de validités ou l'utilisateur n'est authentifié."),
        },
        description="Changement du mot de passe sans code de vérification.",
        parameters=[
            OpenApiParameter(
                name='Authorization',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.HEADER,
                description='JWT token format: Bearer <token>',
                required=True
            )
        ]
    )
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            try:
                result = password_change(user=request.user, password=serializer.validated_data['password'])
                return Response(result, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response(e.detail, status=e.code)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
