import fs from "fs"
import { exec } from "child_process"
import { loveWords, sadWords, angryWords } from "../lib/emotions.js"

// 🧠 ADVANCED EMOTION DETECTION
function detectEmotion(text) {
  const t = text.toLowerCase()

  const matchCount = (arr) => {
    let count = 0
    for (const w of arr) {
      if (t.includes(w)) count++
    }
    return count
  }

  const loveScore = matchCount(loveWords)
  const sadScore = matchCount(sadWords)
  const angryScore = matchCount(angryWords)

  // decide strongest emotion
  if (angryScore > loveScore && angryScore > sadScore) return "angry"
  if (sadScore > loveScore && sadScore > angryScore) return "sad"
  if (loveScore > angryScore && loveScore > sadScore) return "love"

  return "normal"
}

// 🎙 UK FEMALE VOICES
function getVoice(emotion) {
  if (emotion === "angry") return "en-GB-SoniaNeural"
  if (emotion === "sad") return "en-GB-LibbyNeural"
  if (emotion === "love") return "en-GB-SoniaNeural"
  return "en-GB-SoniaNeural"
}

// 🔊 TTS ENGINE
function tts(text, voice, file = "voice.mp3") {
  return new Promise((resolve, reject) => {
    const safe = text.replace(/"/g, "'")
    const cmd = `edge-tts --text "${safe}" --voice ${voice} --write-media ${file}`

    exec(cmd, (err) => {
      if (err) return reject(err)
      resolve(file)
    })
  })
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
    const voice = getVoice(emotion)

    // ⚡ status message
    const sent = await sock.sendMessage(chat, {
      text: `🎙 Processing voice...
Emotion: ${emotion}
Voice:Female (Neural)`
    })

    try {
      const file = await tts(text, voice)

      // 🎧 send audio
      await sock.sendMessage(chat, {
        audio: fs.readFileSync(file),
        mimetype: "audio/mpeg",
        ptt: true
      })

      // ✨ final edit message
      await sock.sendMessage(chat, {
        text: `✔ Voice generated successfully
Emotion: ${emotion}
Voice: ${voice}

> *Created by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*`,
        edit: sent.key
      })

    } catch (e) {
      console.log(e)

      await sock.sendMessage(chat, {
        text: "❌ Voice generation failed"
      })
    }
  }
}
