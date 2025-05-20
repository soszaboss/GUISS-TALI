import os
import binascii
from datetime import date

# from ipware import get_client_ip

from django.conf import settings
from django.contrib.auth import get_user_model, authenticate, password_validation
from django.core.mail.message import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _

from rest_framework import status
from rest_framework.exceptions import ValidationError

from apps.authemail.tokens import get_tokens_for_user
from apps.users.models import User


def _generate_code():
    return binascii.hexlify(os.urandom(20)).decode('utf-8')


def send_multi_format_email(template_prefix, template_ctxt, target_email):
    subject_file = 'authemail/%s_subject.txt' % template_prefix
    txt_file = 'authemail/%s.txt' % template_prefix
    html_file = 'authemail/%s.html' % template_prefix

    subject = render_to_string(subject_file).strip()
    from_email = settings.EMAIL_FROM
    to = target_email
    bcc_email = settings.EMAIL_BCC
    text_content = render_to_string(txt_file, template_ctxt)
    html_content = render_to_string(html_file, template_ctxt)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to],
                                 bcc=[bcc_email])
    msg.attach_alternative(html_content, 'text/html')
    msg.send()


def user_signup(email:str, role:str, phone_number:str):

    must_validate_email = getattr(settings, "AUTH_EMAIL_VERIFICATION", False)

    try:
        user = get_user_model().objects.get(email=email)
        if user.is_verified:
            content = {'detail': _('Email address already taken.')}
            return ValidationError(content, code=status.HTTP_400_BAD_REQUEST)

        is_phone_number_exists = get_user_model().objects.filter(phone_number=phone_number).exists()
        if is_phone_number_exists:
            content = {'detail': _('Phone number already taken.')}
            return ValidationError(content, code=status.HTTP_400_BAD_REQUEST)

        from apps.authemail.models import SignupCode
        try:
            # Delete old signup codes
            signup_code = SignupCode.objects.get(user=user)
            signup_code.delete()
        except SignupCode.DoesNotExist:
            pass

    except get_user_model().DoesNotExist:
        # generate a random password and assign it to the new user.
        password = User.objects.make_random_password()
        if role == User.Role.ADMIN:
            user = User.objects.create_superuser(
                email=email,
                password=password,
                phone_number=phone_number
            )
        else:
            extra_fields = {
                'is_active': True,
                'is_verified': True,
                'role': role,
            }
            user = User.objects.create_user(
                email,
                password,
                phone_number,
                **extra_fields
            )

    if not must_validate_email:
        # user.is_verified = True
        context = {
            'email': user.email,
            'password': user.password,
        }
        send_multi_format_email('welcome_email',
                                context,
                                target_email=user.email)
    # user.save()

    # if must_validate_email:
    #     # Create and associate signup code
    #     client_ip = get_client_ip(request)[0]
    #     if client_ip is None:
    #         client_ip = '0.0.0.0'  # Unable to get the client's IP address
    #     signup_code = SignupCode.objects.create_signup_code(user, client_ip)
    #     signup_code.send_signup_email()

    return user


def user_login(email:str, password:str):
    user = authenticate(email=email, password=password)
    if user:
        if user.is_verified:
            if user.is_active:
                token = get_tokens_for_user(user)
                return token
            else:
                content = {'detail': _('L`\'utilisateur n\'est pas activé.')}
                return ValidationError(content, code=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {'detail':_('L`\'utilisateur n\'est pas verifié.')}
            return ValidationError(content, code=status.HTTP_401_UNAUTHORIZED)
    else:
        content = {'detail':_('Impossible de s\' authentifier avec ses credentials.')}
        return ValidationError(content, code=status.HTTP_401_UNAUTHORIZED)


def user_reset_password(email):
    from apps.authemail.models import PasswordResetCode
    try:
        user = get_user_model().objects.get(email=email)

        # Delete all unused password reset codes
        PasswordResetCode.objects.filter(user=user).delete()

        if user.is_verified and user.is_active:
            password_reset_code = \
                PasswordResetCode.objects.create_password_reset_code(user)
            password_reset_code.send_password_reset_email()
            return email

    except get_user_model().DoesNotExist:
        pass

        # Since this is AllowAny, don't give away error.
    content = {'detail': _('Reinitialisation non permis.')}
    return ValidationError(content, code=status.HTTP_400_BAD_REQUEST)


def user_reset_password_verify(code):
    from apps.authemail.models import PasswordResetCode

    password_reset_code = PasswordResetCode.objects.get(code=code)

    # Delete password reset code if older than expiry period
    delta = date.today() - password_reset_code.created_at.date()
    if delta.days > PasswordResetCode.objects.get_expiry_period():
        password_reset_code.delete()
        raise PasswordResetCode.DoesNotExist()

    content = {'success': _('Adresse email vérifié avec succès.')}

    return content


def user_reset_password_verified(code, password):
    from apps.authemail.models import PasswordResetCode

    password_reset_code = PasswordResetCode.objects.get(code=code)
    password_reset_code.user.set_password(password)
    password_reset_code.user.save()

    # Delete password reset code just used
    password_reset_code.delete()

    content = {'success': _('Mot de passe changé.')}
    return content


def email_change_request(*, user, new_email: str) -> str:
    from apps.authemail.models import EmailChangeCode

    # Check if new email already exists and is verified
    try:
        existing_user = get_user_model().objects.get(email=new_email)
        if existing_user.is_verified:
            raise ValidationError({'email': _('Email déjà pris.')}, code=status.HTTP_400_BAD_REQUEST)
        else:
            existing_user.delete()
    except get_user_model().DoesNotExist:
        pass

    # Supprimer anciens codes
    EmailChangeCode.objects.filter(user=user).delete()

    # Créer le code
    code = EmailChangeCode.objects.create_email_change_code(user, new_email)
    code.send_email_change_emails()

    return new_email


def email_change_verify(*, code: str) -> dict:
    from apps.authemail.models import EmailChangeCode

    try:
        code_obj = EmailChangeCode.objects.get(code=code)
    except EmailChangeCode.DoesNotExist:
        raise ValidationError({'detail': _("Code invalide ou expiré.")}, code=status.HTTP_400_BAD_REQUEST)

    delta = date.today() - code_obj.created.date()
    if delta.days > EmailChangeCode.objects.get_expiry_period():
        code_obj.delete()
        raise ValidationError({'detail': _("Ce code a expiré.")}, code=status.HTTP_400_BAD_REQUEST)

    # Si email déjà utilisé par user vérifié, rejet
    try:
        user_with_email = get_user_model().objects.get(email=code_obj.email)
        if user_with_email.is_verified:
            code_obj.delete()
            raise ValidationError({'detail': _('Email déjà pris.')}, code=status.HTTP_400_BAD_REQUEST)
        else:
            user_with_email.delete()
    except get_user_model().DoesNotExist:
        pass

    # Mise à jour de l'email
    user = code_obj.user
    user.email = code_obj.email
    user.save()
    code_obj.delete()

    return {'success': _('Adresse email changée avec succès.')}


def password_change(*, user, password: str) -> dict:
    try:
        password_validation.validate_password(password=password, user=user)
    except ValidationError as e:
        raise ValidationError({'password': list(e.messages)}, code=status.HTTP_400_BAD_REQUEST)

    user.set_password(password)
    user.save()
    return {'success': _('Mot de passe changé.')}
