import edge_tts
import asyncio
import sys

text = sys.argv[1]
mood = sys.argv[2] if len(sys.argv) > 2 else "normal"
filename = sys.argv[3] if len(sys.argv) > 3 else "voice.mp3"

voice_map = {
    "romantic": "en-US-JennyNeural",
    "angry": "en-US-GuyNeural",
    "hype": "en-US-DavisNeural",
    "sexy": "en-US-AriaNeural",
    "calm": "en-GB-LibbyNeural",
    "dramatic": "en-US-ChristopherNeural",
    "sad": "en-GB-SoniaNeural",
    "normal": "en-US-JennyNeural"
}

voice = voice_map.get(mood, "en-US-JennyNeural")

async def main():
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(filename)

asyncio.run(main())
