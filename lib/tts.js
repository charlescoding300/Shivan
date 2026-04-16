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

  fs.writeFileSync(file, res.data)
  return file
}
