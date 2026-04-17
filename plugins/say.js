import fs from "fs"
import { exec } from "child_process"

export default {
  name: "say",
  pattern: /^\.say (.+)/i,

  run: async (sock, m) => {
    const chat = m.key.remoteJid

    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      ""

    const msg = text.replace(".say", "").trim()

    if (!msg) {
      return sock.sendMessage(chat, {
        text: "⚠️ Usage: .say your text"
      })
    }

    // 🗣️ SINGLE AUTO REACT ONLY
    await sock.sendMessage(chat, {
      react: { text: "🗣️", key: m.key }
    })

    const file = "say.mp3"
    const voice = "en-GB-SoniaNeural"

    // ⚡ SINGLE STATUS MESSAGE (NO SPAM)
    const status = await sock.sendMessage(chat, {
      text: "🗣️ Generating voice..."
    })

    // =========================
    // 🔊 SAFE EDGE-TTS COMMAND
    // =========================

    exec(
      `npx edge-tts -t "${msg.replace(/"/g, "'")}" -v ${voice} --write-media ${file}`,
      async (err) => {
        if (err) {
          console.log("TTS ERROR:", err)

          return sock.sendMessage(chat, {
            text: "❌ Audio generation failed (check voice engine)"
          })
        }

        try {
          await new Promise(r => setTimeout(r, 1200))

          if (!fs.existsSync(file) || fs.statSync(file).size < 1000) {
            return sock.sendMessage(chat, {
              text: "❌ Audio file missing or corrupted"
            })
          }

          const buffer = fs.readFileSync(file)

          await sock.sendMessage(chat, {
            audio: buffer,
            mimetype: "audio/mpeg",
            ptt: true
          })

          await sock.sendMessage(chat, {
            text: `
✔ VOICE READY
VOICE: UK FEMALE (SONIA)
STATUS: SUCCESS

> *Created by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
            `,
            edit: status.key
          })

          setTimeout(() => {
            try {
              fs.unlinkSync(file)
            } catch {}
          }, 5000)

        } catch (e) {
          console.log(e)

          sock.sendMessage(chat, {
            text: "❌ Failed to send audio"
          })
        }
      }
    )
  }
}
