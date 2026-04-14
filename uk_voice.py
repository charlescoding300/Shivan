import edge_tts
import asyncio
import sys

async def main():
    text = " ".join(sys.argv[1:])

    voice = "en-GB-RyanNeural"

    communicate = edge_tts.Communicate(text, voice)
    await communicate.save("voice.mp3")

asyncio.run(main())

