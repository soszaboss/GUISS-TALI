from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .forms import EmailUserCreationForm, EmailUserChangeForm
from .models import SignupCode, PasswordResetCode, EmailChangeCode
from ..users.models import Profile


class SignupCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'user', 'ipaddr', 'created')
    ordering = ('-created',)
    readonly_fields = ('user', 'code', 'ipaddr')
    list_per_page = 15

    def has_add_permission(self, request, obj=None):
        return False


class SignupCodeInline(admin.TabularInline):
    model = SignupCode
    fieldsets = (
        (None, {
            'fields': ('code', 'ipaddr', 'created')
        }),
    )
    readonly_fields = ('code', 'ipaddr', 'created')

    def has_add_permission(self, request, obj=None):
        return False


class PasswordResetCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'user', 'created')
    ordering = ('-created',)
    readonly_fields = ('user', 'code')
    list_per_page = 15

    def has_add_permission(self, request, obj=None):
        return False


class PasswordResetCodeInline(admin.TabularInline):
    model = PasswordResetCode
    fieldsets = (
        (None, {
            'fields': ('code', 'created')
        }),
    )
    readonly_fields = ('code', 'created')

    def has_add_permission(self, request, obj=None):
        return False


class EmailChangeCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'user', 'email', 'created')
    ordering = ('-created',)
    readonly_fields = ('user', 'code', 'email')
    list_per_page = 15

    def has_add_permission(self, request, obj=None):
        return False


class EmailChangeCodeInline(admin.TabularInline):
    model = EmailChangeCode
    fieldsets = (
        (None, {
            'fields': ('code', 'email', 'created')
        }),
    )
    readonly_fields = ('code', 'email', 'created')

    def has_add_permission(self, request, obj=None):
        return False


class ProfileInline(admin.StackedInline):
    model = Profile


class EmailUserAdmin(UserAdmin):
    readonly_fields = ( 'created', 'modified')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        # (_('Personal Info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    form = EmailUserChangeForm
    add_form = EmailUserCreationForm
    inlines = [ProfileInline, SignupCodeInline, EmailChangeCodeInline, PasswordResetCodeInline]
    list_display = (
        'email',
        'profile__first_name',
        'profile__last_name',
        'role',
        'is_verified',
        'is_staff',
        'is_active',
    )
    search_fields = ('email', 'profile__first_name', 'profile__last_name')
    ordering = ('email',)
    list_per_page = 15



admin.site.register(get_user_model(), EmailUserAdmin)
admin.site.register(SignupCode, SignupCodeAdmin)
admin.site.register(PasswordResetCode, PasswordResetCodeAdmin)
admin.site.register(EmailChangeCode, EmailChangeCodeAdmin)
