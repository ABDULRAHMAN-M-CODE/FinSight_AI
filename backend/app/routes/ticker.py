# the frontend does not do any request, the backend continiousely sends data to the frontend (if rebalancing happened)
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.core.finance.ticker_service import number_stream
router = APIRouter()
@router.get("/stream")
async def stream(request: Request):
    return StreamingResponse(
        number_stream(),
        media_type="text/event-stream"
)