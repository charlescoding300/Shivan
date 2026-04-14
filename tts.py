import edge_tts
import asyncio
import sys

text = " ".join(sys.argv[1:])

async def main():
    # 🇬🇧 UK Neural Human Voice
    tts = edge_tts.Communicate(text, "en-GB-RyanNeural")
    await tts.save("voice.mp3")

asyncio.run(main())
