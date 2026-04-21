import axios from "axios";

const footer = `\n> *Powered by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*`;

export default {
  name: "say",

  async execute(sock, msg, args = []) {
    try {
      const chatId = msg.key.remoteJid;
      const text = args.join(" ").trim();

      // 🗣️ AUTO REACT (your new style)
      await sock.sendMessage(chatId, {
        react: { text: "🗣️", key: msg.key }
      });

      if (!text) {
        return await sock.sendMessage(chatId, {
          text: `❌ Usage: .say <text>${footer}`
        });
      }

      // 🇬🇧 UK FEMALE TTS (Google translate voice - stable fallback)
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=en-GB&client=tw-ob`;

      // 🔥 convert to buffer (Railway-safe)
      const res = await axios.get(ttsUrl, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const audioBuffer = Buffer.from(res.data, "binary");

      await sock.sendMessage(chatId, {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        ptt: true // voice note style 🎙️
      }, { quoted: msg });

      // footer message
      await sock.sendMessage(chatId, {
        text: footer
      });

    } catch (err) {
      console.error("Say command error:", err);

      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ UK voice failed, try again later${footer}`
      });
    }
  }
};
