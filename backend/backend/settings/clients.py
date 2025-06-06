import os
from backend.env import APPS_DIR, BASE_DIR, env

env.read_env(os.path.join(BASE_DIR, ".env"))


FRONT_LOGIN_URL= os.environ.get('FRONT_LOGIN_URL')
FRONT_RESET_PASSWORD= os.environ.get('FRONT_RESET_PASSWORD')
SITE_NAME='GUISS TALI'