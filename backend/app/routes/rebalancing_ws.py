
from fastapi import APIRouter, WebSocket
from app.worker import manager
import asyncio
from app.core.dependencies import get_current_user
from fastapi import Depends
from app.models.registration import User
router = APIRouter()
@router.websocket("/ws/rebalancing")
async def websocket_endpoint(websocket: WebSocket, current_user: User = Depends(get_current_user)):
    await manager.connect(current_user.id, websocket)
    try:
        while True:
            await asyncio.sleep(3600)
    except:
        manager.disconnect(current_user.id)