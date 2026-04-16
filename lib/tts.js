import fs from "fs"
import axios from "axios"

export async function tts(text, file = "voice.mp3") {
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-GB&client=tw-ob&q=${encodeURIComponent(text)}`

    const res = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      },
      timeout: 15000
    })

    const buffer = Buffer.from(res.data)

    // 🚨 validate audio
    if (!buffer || buffer.length < 1000) {
      throw new Error("Invalid audio (blocked or empty response)")
    }

    fs.writeFileSync(file, buffer)

    return file

  } catch (err) {
    console.log("TTS ERROR:", err.message)
    throw new Error("TTS generation failed")
  }
}

