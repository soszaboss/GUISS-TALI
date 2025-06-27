from django_filters.rest_framework import DjangoFilterBackend

from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter, OpenApiTypes

from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.users.models import User, Profile
from serializers.users import UserSerializer, ProfileSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('profile').all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['role']
    search_fields = [
        'profile__first_name',
        'profile__last_name',
        'email',
        'phone_number',
    ]

    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve', 'update', 'destroy']:
    #         return [permissions.IsAdminUser()]
    #     elif self.action == 'me':
    #         return [permissions.IsAuthenticated()]
    #     return super().get_permissions()
    @extend_schema(
        responses={
            200: OpenApiResponse(description="Utilisateur récupéré avec succès."),
            404: OpenApiResponse(description="Utilisateur non trouvé."),
        },
        description="Récupère les détails d'un utilisateur spécifique.",
        parameters=[
            OpenApiParameter(name='Bearer', type=OpenApiTypes.STR, required=True,
                             description="Access token pour l'authentification"),
        ]
    )
    @action(detail=False, methods=['get'], url_path='me', permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Endpoint personnalisé pour accéder à l'utilisateur courant"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    



class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def destroy(self, request, *args, **kwargs):
        return Response({"detail": "Suppression non autorisée."}, status=405)