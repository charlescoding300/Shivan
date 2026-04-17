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

    // 🗣️ AUTO REACT
    await sock.sendMessage(chat, {
      react: { text: "🗣️", key: m.key }
    })

    const file = "say.mp3"
    const voice = "en-GB-SoniaNeural"

    await sock.sendMessage(chat, {
      text: "🗣️ ```Connecting voice engine...```"
    })

    await new Promise(r => setTimeout(r, 600))

    await sock.sendMessage(chat, {
      text: "🎧 ```Applying UK voice smoothing...```"
    })

    await new Promise(r => setTimeout(r, 600))

    await sock.sendMessage(chat, {
      text: "⚡ ```Generating speech...```"
    })

    // 🔊 GENERATE VOICE
    exec(
      `npx edge-tts -t "${msg}" -v ${voice} --rate +5% --pitch +10Hz --write-media ${file}`,
      async (err) => {
        if (err) {
          return sock.sendMessage(chat, {
            text: "❌ Voice generation failed"
          })
        }

        try {
          await new Promise(r => setTimeout(r, 1200))

          if (!fs.existsSync(file)) {
            return sock.sendMessage(chat, {
              text: "❌ Audio file missing"
            })
          }

          const buffer = fs.readFileSync(file)

          await sock.sendMessage(chat, {
            audio: buffer,
            mimetype: "audio/mpeg",
            ptt: true
          })

          // ✔ FINAL MESSAGE WITH YOUR TAG
          await sock.sendMessage(chat, {
            text: `
✔ VOICE ENGINE COMPLETE
VOICE: UK FEMALE (SONIA NEURAL)
RATE: +5%
PITCH: +10Hz
STATUS: STABLE

> *Created by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
`
          })

          // 🧹 CLEANUP
          setTimeout(() => {
            try {
              fs.unlinkSync(file)
            } catch {}
          }, 6000)

        } catch (e) {
          console.log(e)
          sock.sendMessage(chat, {
            text: "❌ Audio send error"
          })
        }
      }
    )
  }
}
