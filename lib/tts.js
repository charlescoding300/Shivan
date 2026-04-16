import fs from "fs"
import axios from "axios"

export async function tts(text, file = "voice.mp3") {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-GB&client=tw-ob&q=${encodeURIComponent(text)}`

  const res = await axios({
    method: "GET",
    url,
    responseType: "arraybuffer",
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  })

  const buffer = Buffer.from(res.data)

  // 🚨 Validate response size
  if (!buffer || buffer.length < 1000) {
    throw new Error("Invalid or blocked audio response")
  }

  // Save file
  fs.writeFileSync(file, buffer)

  return file
}
