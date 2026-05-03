import asyncio

async def number_stream():
    while True:
        # core logic lives here (not in main)
        yield "data: 1\n\n"
        await asyncio.sleep(1)