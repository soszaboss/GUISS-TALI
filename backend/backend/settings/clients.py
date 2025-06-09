import os
from backend.env import APPS_DIR, BASE_DIR, env

env.read_env(os.path.join(BASE_DIR, ".env"))



SITE_NAME='GUISS TALI'
CLIENT_DOMAIN= os.environ.get('CLIENT_DOMAIN', 'http://localhost:5173')