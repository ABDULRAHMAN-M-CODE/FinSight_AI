
import asyncio
async def user1():
    print("user1 start")
    await asyncio.sleep(5)
    print("user1 done")

async def user2():
    print("user2 start")
    print("user2 done")

async def main():

    try:
        await asyncio.gather(
            user1(),
            user2()
        )
    except:
        print("error happened")

asyncio.run(main())
