import fs from "fs"
import { tts } from "../lib/tts.js"
import { loveWords, sadWords, angryWords } from "../lib/emotions.js"

// 🧠 emotion detection
function detectEmotion(text) {
  const t = text.toLowerCase()
  const is = (arr) => arr.some(w => t.includes(w))

  if (is(angryWords)) return "angry"
  if (is(sadWords)) return "sad"
  if (is(loveWords)) return "love"
  return "normal"
}

export default {
  name: "say",

  run: async (sock, msg, args) => {
    const chat = msg.key.remoteJid
    const text = args.join(" ")

    if (!text) {
      return sock.sendMessage(chat, {
        text: "Usage: .say <text>"
      })
    }

    // 🧠 detect emotion
    const emotion = detectEmotion(text)

    const sent = await sock.sendMessage(chat, {
      text: `🎙 Generating voice...
Emotion: ${emotion}
Engine: Google TTS`
    })

    try {
      // 🔊 generate audio
      const file = await tts(text)

      // 🚨 safety check
      if (!fs.existsSync(file)) {
        throw new Error("Audio file not found")
      }

      const audio = fs.readFileSync(file)

      // 🎧 send voice note
      await sock.sendMessage(chat, {
        audio,
        mimetype: "audio/mpeg",
        ptt: true
      })

      // ✨ update same message
      await sock.sendMessage(chat, {
        text: `✔ Voice Generated Successfully
Emotion: ${emotion}

> *Created by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*`,
        edit: sent.key
      })

    } catch (err) {
      console.log("SAY ERROR:", err)

      await sock.sendMessage(chat, {
        text: "❌ Failed to generate voice (audio error)"
      })
    }
  }
}
