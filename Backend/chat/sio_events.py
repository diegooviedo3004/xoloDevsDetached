from project.asgi import sio  
from django.conf import settings
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from .models import Conversation, Message

import jwt

User = get_user_model()


@sio.event
async def connect(sid, environ, auth):
    token = auth.get("token")
    print(f"token: {token}")
    if not token:
        await sio.disconnect(sid)
        return
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")

        if not user_id:
            raise jwt.InvalidTokenError("El token no contiene el user_id")

        user = await database_sync_to_async(User.objects.get)(id=user_id)
        await sio.save_session(sid, {"user_id": user.id})
        print(f"Usuario autenticado con éxito y conectado: {user.id}")

    except jwt.ExpiredSignatureError:
        print("Token expirado")
        await sio.disconnect(sid)
    except jwt.InvalidTokenError:
        print("Token inválido")
        await sio.disconnect(sid)
    except User.DoesNotExist:
        print("Usuario no encontrado")
        await sio.disconnect(sid)

    print("Client connected:", sid)

@sio.event
async def disconnect(sid):
    session = await sio.get_session(sid)
    print("Usuario desconectado:", session.get("user_id"))

@sio.event
async def join_room(sid, room_id):
    session = await sio.get_session(sid)
    user_id = session.get('user_id')

    if not user_id:
        await sio.disconnect(sid)
        return

    other_user = await get_other_user_in_room(room_id, user_id)
    if other_user:
        if not await is_room_full(room_id):
            await sio.enter_room(sid, room_id)
            print(f"Usuario {user_id} se ha unido a la sala {room_id}")
        else:
            await sio.emit('room_full', {'message': 'La sala ya está llena'}, to=sid)
    else:
        await sio.emit('error', {'message': 'No tienes permiso para unirte a esta sala'}, to=sid)

@sio.event
async def leave_room(sid, room_id):
    session = await sio.get_session(sid)
    user_id = session.get('user_id')

    await sio.leave_room(sid, room_id)
    print(f"Usuario {user_id} ha salido de la sala {room_id}")

@sio.event
async def send_message(sid, data):
    session = await sio.get_session(sid)
    user_id = session.get('user_id')

    content = data.get('content')
    room_id = data.get('room_id')

    if not (content and room_id):
        await sio.emit('error', {'message': 'Mensaje o sala no válidos'}, to=sid)
        return

    message = await create_message(user_id, room_id, content)

    await sio.emit('new_message', {
        'id': message.id,
        'sender': message.sender_id,
        'content': message.content,
        'timestamp': message.timestamp.isoformat(),
        'is_read': message.is_read,
        'is_deleted': message.is_deleted
    }, room=room_id)


@database_sync_to_async
def get_other_user_in_room(room_id, user_id):
    try:
        conversation = Conversation.objects.get(id=room_id)
        other_user = conversation.users.exclude(id=user_id).first()
        return other_user
    except Conversation.DoesNotExist:
        return None

@database_sync_to_async
def is_room_full(room_id):
    try:
        conversation = Conversation.objects.get(id=room_id)
        return conversation.users.count() > 2
    except Conversation.DoesNotExist:
        return False

@database_sync_to_async
def create_message(user_id, room_id, content):
    try:
        conversation = Conversation.objects.get(id=room_id)
        user = User.objects.get(id=user_id)
        message = Message.objects.create(
            sender=user,
            conversation=conversation,
            content=content
        )
        return message
    except (Conversation.DoesNotExist, User.DoesNotExist, IntegrityError) as e:
        print(f"Error al crear el mensaje: {e}")
        return None