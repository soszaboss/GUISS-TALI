import os
from backend.env import APPS_DIR, BASE_DIR, env

env.read_env(os.path.join(BASE_DIR, ".env"))

# Make part of the model eventually, so it can be edited
AUTH_EMAIL_EXPIRY_PERIOD = 2880

# Email settings
# https://docs.djangoproject.com/en/3.1/topics/email/
# https://docs.djangoproject.com/en/3.1/ref/settings/#email-host

EMAIL_FROM = os.environ.get('AUTHEMAIL_DEFAULT_EMAIL_FROM')
EMAIL_BCC = os.environ.get('AUTHEMAIL_DEFAULT_EMAIL_BCC')

EMAIL_HOST = os.environ.get('AUTHEMAIL_EMAIL_HOST') or 'smtp.gmail.com'
EMAIL_PORT = os.environ.get('AUTHEMAIL_EMAIL_PORT') or 587
EMAIL_HOST_USER = os.environ.get('AUTHEMAIL_EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('AUTHEMAIL_EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

# Additionnal verfication when an user sign up
AUTH_EMAIL_VERIFICATION = False