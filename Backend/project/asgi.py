"""
ASGI config for project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os, socketio
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

django_asgi_app = get_asgi_application()

application = socketio.ASGIApp(sio, django_asgi_app)

import chat.sio_events
