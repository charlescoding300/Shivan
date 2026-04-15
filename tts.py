import edge_tts
import asyncio
import sys

text = sys.argv[1] if len(sys.argv) > 1 else ""
mood = sys.argv[2] if len(sys.argv) > 2 else "normal"

voice = "en-GB-RyanNeural"
rate = "0%"

# 🎭 emotional voice tuning
if mood == "angry":
    rate = "+25%"
elif mood == "sad":
    rate = "-35%"
elif mood == "romantic":
    rate = "-15%"
else:
    rate = "0%"

async def main():
    tts = edge_tts.Communicate(
        text,
        voice,
        rate=rate
    )
    await tts.save("voice.mp3")

asyncio.run(main())
