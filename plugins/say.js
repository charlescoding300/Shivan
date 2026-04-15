import fs from "fs"
import { exec } from "child_process"
import { detectEmotion } from "../lib/aiEmotion.js"

export async function run(sock, msg, args) {

  const jid = msg.key.remoteJid
  const text = args.join(" ")

  if (!text) return sock.sendMessage(jid, { text: "Use .say text" })

  const emotion = detectEmotion(text)
  const safeText = text.replace(/["'`]/g, "")

  try {

    const file = await new Promise((resolve, reject) => {
      exec(`python3 lib/tts.py "${safeText}" ${emotion}`, (err, stdout) => {
        if (err) return reject(err)
        resolve(stdout.trim())
      })
    })

    const audio = fs.readFileSync(file)

    await sock.sendMessage(jid, {
      audio,
      mimetype: "audio/mp4",
      ptt: true
    })

    fs.unlinkSync(file)

  } catch (e) {
    console.log(e)
    sock.sendMessage(jid, { text: "❌ Say error" })
  }
}
