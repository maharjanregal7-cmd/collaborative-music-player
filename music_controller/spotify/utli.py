from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import  post, put,get
from .credentials import *

BASE_URL = "https://api.spotify.com/v1/me/"


def _get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in,refresh_token):
    tokens = _get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if tokens:
        tokens.access_token = access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.refresh_token = refresh_token
        tokens.save(update_fields=['access_token', 'token_type', 'expires_in', 'refresh_token'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, token_type=token_type, expires_in=expires_in, refresh_token=refresh_token)
        tokens.save()
        

def is_spotify_authenticated (session_id):
    tokens = _get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            return False
        return True
    return False

def refresh_spotify_token(session_id):
    tokens = _get_user_tokens(session_id)
    refresh_token = tokens.refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant-type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()
    
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    
    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

def execute_spotify_request(session_id  , endpoint, post_=False, put_=False):
    tokens = _get_user_tokens(session_id)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "  + {tokens.access_token}
    }
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = post(BASE_URL + endpoint,{}, headers=headers)
    try:
        return response.json()
    except:
        return {"Error": "Issue with request"}
    
def play_song(session_id):
    return execute_spotify_request(session_id, "player/play", put_=True)

def pause_song(session_id):
    return execute_spotify_request(session_id, "player/pause", put_=True)

def skip_song(session_id):
    return execute_spotify_request(session_id, "player/next", post_=True)