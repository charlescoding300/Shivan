import fs from "fs"
import axios from "axios"

export async function tts(text, file = "voice.mp3") {
  try {
    const res = await axios({
      method: "GET",
      url: "https://api.streamelements.com/kappa/v2/speech",
      params: {
        voice: "Brian",
        text: text
      },
      responseType: "arraybuffer"
    })

    fs.writeFileSync(file, res.data)
    return file

  } catch (err) {
    console.log("TTS ERROR:", err)
    throw err
  }
}
