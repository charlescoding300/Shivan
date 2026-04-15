import sys
import asyncio
import edge_tts
import time

text = sys.argv[1]
emotion = sys.argv[2] if len(sys.argv) > 2 else "normal"

voices = {
    "anger": "en-US-GuyNeural",
    "sad": "en-GB-RyanNeural",
    "hype": "en-US-DavisNeural",
    "happy": "en-US-JennyNeural",
    "heartbreak": "en-GB-SoniaNeural",
    "normal": "en-US-JennyNeural"
}

voice = voices.get(emotion, "en-US-JennyNeural")

filename = f"voice_{int(time.time()*1000)}.mp3"

async def main():
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(filename)

asyncio.run(main())

print(filename)
