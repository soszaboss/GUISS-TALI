from datetime import date, timedelta
from random import randint
import secrets

# from ipware import get_client_ip

from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate, password_validation
from django.core.mail.message import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from django.utils import timezone

from apps.authemail.tokens import get_tokens_for_user
from apps.users.models import Profile
from services.users import user_create

def _generate_code():
    return randint(100000, 999999)

EXPIRY_PERIOD = getattr(settings, 'AUTH_EMAIL_EXPIRY_PERIOD') 

def _make_random_password(length=10, allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'):
        return ''.join(secrets.choice(allowed_chars) for i in range(length))


def send_multi_format_email(template_prefix, template_ctxt, target_email):
    subject_file = 'email/authemail/%s_subject.txt' % template_prefix
    txt_file = 'email/authemail/%s.txt' % template_prefix
    html_file = 'email/authemail/%s.html' % template_prefix

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

    
def user_login(email:str, password:str):
    user = authenticate(email=email, password=password)
    if user:
        if user.is_verified:
            if user.is_active:
                token = get_tokens_for_user(user)
                return token
            else:
                content = _('L`\'utilisateur n\'est pas activé.')
                raise ValidationError(content, code=401)
        else:
            content = _('L`\'utilisateur n\'est pas verifié.')
            raise ValidationError(content, code=401)
    else:
        content = _('Email ou mot de passe incorrect.')
        raise ValidationError(content, code=401)


def user_reset_password(email):
    from apps.authemail.models import PasswordResetCode
    try:
        user = get_user_model().objects.get(email=email)
        # Vérifier si un code a déjà été envoyé récemment
        last_reset = PasswordResetCode.objects.filter(user=user).order_by('-created').first()
        if last_reset and (timezone.now() - last_reset.created).seconds < 900:  # 15 min
            raise ValidationError(_('Un code de réinitialisation a déjà été envoyé récemment.'), code=400)
        
        # Delete all unused password reset codes
        PasswordResetCode.objects.filter(user=user).delete()

        if user.is_verified and user.is_active:
            password_reset_code = \
                PasswordResetCode.objects.create_password_reset_code(user)
            password_reset_code.send_password_reset_email()
            return email

    except get_user_model().DoesNotExist:
        raise ValidationError(_('Email non trouvé.'), code=404)

        # Since this is AllowAny, don't give away error.
    content = _('Reinitialisation non permis.')
    raise ValidationError(content, code=400)


def user_reset_password_verify(code):
    from apps.authemail.models import PasswordResetCode
    password_reset_code = PasswordResetCode.objects.filter(code=code).first()
    if not password_reset_code:
        raise ValidationError(_('Code invalide ou expiré.'))

    expiration_time = password_reset_code.created + timedelta(minutes=EXPIRY_PERIOD)

    if timezone.now() > expiration_time:
        password_reset_code.delete()
        raise ValidationError(_('Le code de réinitialisation a expiré.'))

    return {'success': _('Adresse email vérifiée avec succès.')}


def user_reset_password_verified(code, password):
    from apps.authemail.models import PasswordResetCode
    password_reset_code = PasswordResetCode.objects.filter(code=code).first()
    if not password_reset_code:
        raise ValidationError(_('Code invalide ou expiré.'))

    EXPIRY_PERIOD = 15  
    expiration_time = password_reset_code.created + timedelta(minutes=EXPIRY_PERIOD)

    if timezone.now() > expiration_time:
        password_reset_code.delete()
        raise ValidationError(_('Le code de réinitialisation a expiré.'))

    # Supprimer le code avant modification du mot de passe
    password_reset_code.delete()
    password_reset_code.user.set_password(password)
    password_reset_code.user.save()

    return {'success': _('Mot de passe changé avec succès.')}


# def email_change_request(*, user, new_email: str) -> str:
#     from apps.authemail.models import EmailChangeCode

#     # Check if new email already exists and is verified
#     try:
#         existing_user = get_user_model().objects.get(email=new_email)
#         if existing_user.is_verified:
#             raise ValidationError({'email': _('Email déjà pris.')}, code=status.HTTP_400_BAD_REQUEST)
#         else:
#             existing_user.delete()
#     except get_user_model().DoesNotExist:
#         pass

#     # Supprimer anciens codes
#     EmailChangeCode.objects.filter(user=user).delete()

#     # Créer le code
#     code = EmailChangeCode.objects.create_email_change_code(user, new_email)
#     code.send_email_change_emails()

#     return new_email


# def email_change_verify(*, code: str) -> dict:
    from apps.authemail.models import EmailChangeCode

    try:
        code_obj = EmailChangeCode.objects.get(code=code)
    except EmailChangeCode.DoesNotExist:
        raise ValidationError({'detail': _("Code invalide ou expiré.")}, code=status.HTTP_400_BAD_REQUEST)

    delta = date.today() - code_obj.created.date()
    if delta.days > EmailChangeCode.objects.get_EXPIRY_PERIOD():
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


@transaction.atomic
def user_signup(email: str, role: str, phone_number: str, profile: dict | Profile=None):
    from apps.authemail.models import PasswordResetCode
    User = get_user_model()

    if User.objects.filter(email=email).exists():
        raise ValidationError(_('Email address already taken.'), code=400)

    if User.objects.filter(phone_number=phone_number).exists():
        raise ValidationError(_('Phone number already taken.'), code=400)

    password = _make_random_password(length=6)
    user = user_create(
        email=email,
        password=password,
        phone_number=phone_number,
        role=role,
        profile=profile
    )
    password_reset_code = PasswordResetCode.objects.create_password_reset_code(user)
    client_domain = getattr(settings, 'CLIENT_DOMAIN')
    front_login_url = f'{client_domain}/auth/login'
    front_reset_password = f'{client_domain}/auth/reset-password/{password_reset_code.code}'
    site_name = getattr(settings, 'SITE_NAME', '')
    expiration_time = password_reset_code.created + timedelta(minutes=EXPIRY_PERIOD)
    expiration_time = expiration_time.strftime('%d-%m-%Y %H:%M:%S')

    context = {
        'email': user.email,
        'password': password,
        'login_url': front_login_url,
        'password_reset_url': front_reset_password,
        'site_name': site_name,
        'expiration_time': expiration_time,
    }
 
    return send_multi_format_email('welcome_email', context, target_email=user.email)
