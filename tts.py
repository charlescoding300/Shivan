import edge_tts
import asyncio
import sys

text = sys.argv[1] if len(sys.argv) > 1 else ""
mood = sys.argv[2] if len(sys.argv) > 2 else "normal"

voice = "en-GB-RyanNeural"
rate = "0%"

# =========================
# 🎭 SAFE VOICE CONTROL
# =========================
if mood == "angry":
    rate = "+10%"
elif mood == "sad":
    rate = "-10%"
elif mood == "romantic":
    rate = "-5%"
else:
    rate = "0%"

async def main():
    try:
        tts = edge_tts.Communicate(text, voice, rate=rate)
        await tts.save("voice.mp3")
    except Exception as e:
        print("TTS ERROR:", e)

        # fallback so it NEVER breaks
        tts = edge_tts.Communicate(text, voice)
        await tts.save("voice.mp3")

asyncio.run(main())
