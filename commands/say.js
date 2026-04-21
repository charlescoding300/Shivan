import fs from "fs"
import https from "https"
import { exec } from "child_process"

export default {
  name: "say",

  async execute(sock, msg, args) {

    if (!args.length) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "Example:\n.say Hello my love"
      })
    }

    const text = args.join(" ")

    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "🗣️", key: msg.key }
    })

    const loading = await sock.sendMessage(msg.key.remoteJid, {
      text: `
╔══ VOICE ENGINE ══╗
⏳ Generating UK voice...
╚══════════════╝

> Powered by ▒▒▒ˡᵉˣʸ⃝⃝༒💘
      `
    })

    const mp3 = "voice.mp3"
    const ogg = "voice.ogg"

    const url =
      "https://translate.google.com/translate_tts?ie=UTF-8&q=" +
      encodeURIComponent(text) +
      "&tl=en-gb&client=tw-ob"

    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(mp3)

      https.get(url, (res) => {
        res.pipe(file)
        file.on("finish", () => file.close(resolve))
      }).on("error", reject)
    })

    exec(`ffmpeg -y -i ${mp3} -c:a libopus ${ogg}`, async () => {

      await sock.sendMessage(msg.key.remoteJid, {
        text: `
✔ Voice Ready 🇬🇧

> *Powered by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
        `,
        edit: loading.key
      })

      await sock.sendMessage(msg.key.remoteJid, {
        audio: fs.readFileSync(ogg),
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      })

      fs.unlinkSync(mp3)
      fs.unlinkSync(ogg)
    })
  }
}
