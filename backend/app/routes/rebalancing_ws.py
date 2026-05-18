
from fastapi import APIRouter, WebSocket
from app.worker import manager
import asyncio
from fastapi import Depends
from jose import jwt, JWTError
from app.core.security.jwt import SECRET_KEY, ALGORITHM
from typing import Annotated

from fastapi import (
    Cookie,
    Depends,
    Query,
    WebSocket,
    WebSocketException,
    status,
)

async def get_cookie_or_token(
    websocket: WebSocket,
    access_token: Annotated[str | None, Cookie()] = None,
    token: Annotated[str | None, Query()] = None,
):
    if access_token is None and token is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return access_token or token

router = APIRouter()
@router.websocket("/ws/rebalancing")
async def websocket_endpoint(
        websocket: WebSocket,
        cookie_or_token: Annotated[str, Depends(get_cookie_or_token)]
        ):
    await websocket.accept()
   
    # Extract user_id from the verified token/cookie string
    try:
        payload = jwt.decode(
            cookie_or_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id = payload.get("sub")
        
        if not user_id:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
            
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    await manager.connect(int(user_id), websocket)
    try:
        while True:
            await asyncio.sleep(3600)
    except:
        manager.disconnect(int(user_id))