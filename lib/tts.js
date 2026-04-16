import fs from "fs"
import axios from "axios"

export async function tts(text, file = "voice.mp3") {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-GB&client=tw-ob&q=${encodeURIComponent(text)}`

  const res = await axios.get(url, {
    responseType: "arraybuffer",
    headers: {
      "User-Agent": "Mozilla/5.0"
    },
    timeout: 20000
  })

  const buffer = Buffer.from(res.data)

  // 🚨 validate response
  if (!buffer || buffer.length < 1000) {
    throw new Error("Invalid audio response (blocked or empty)")
  }

  fs.writeFileSync(file, buffer)

  // 🚨 confirm file exists
  if (!fs.existsSync(file)) {
    throw new Error("Audio file not saved")
  }

  return file
}
