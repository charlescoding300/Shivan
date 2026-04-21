import yts from "yt-search";
import axios from "axios";
import { sendSafeAudio } from "../lib/mediaHandler.js";

const footer = `\n> *Powered by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*`;

export default {
  name: "play",

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;
    const query = args.join(" ").trim();

    try {
      // 🎧 AUTO REACT ON COMMAND USE
      await sock.sendMessage(chatId, {
        react: { text: "🎧", key: msg.key }
      });

      if (!query) {
        return await sock.sendMessage(chatId, {
          text: `❌ Give me a song name${footer}`
        });
      }

      const search = await yts(query).catch(() => null);
      const video = search?.videos?.[0];

      if (!video) {
        return await sock.sendMessage(chatId, {
          text: `❌ No results found${footer}`
        });
      }

      await sock.sendMessage(chatId, {
        text: `_🎧 Processing: ${video.title}_${footer}`
      });

      // 🔥 SAFE AUDIO API (NO ytdl, NO CRASH)
      const api = await axios.get(
        `https://api.fabdl.com/youtube/get?url=${video.url}`
      ).catch(() => null);

      const downloadUrl = api?.data?.result?.download_url;

      if (!downloadUrl) {
        await sock.sendMessage(chatId, {
          react: { text: "❌", key: msg.key }
        });

        return await sock.sendMessage(chatId, {
          text: `❌ Failed to generate audio, please try again later${footer}`
        });
      }

      // 🎧 SEND AUDIO VIA BULLETPROOF HANDLER
      await sock.sendMessage(chatId, {
        react: { text: "🎧", key: msg.key }
      });

      await sendSafeAudio(sock, chatId, downloadUrl, {
        quoted: msg,
        fileName: `${video.title}.mp3`
      });

    } catch (err) {
      console.error("Play command error:", err);

      await sock.sendMessage(chatId, {
        react: { text: "❌", key: msg.key }
      });

      await sock.sendMessage(chatId, {
        text: `❌ Failed to generate audio, please try again later${footer}`
      });
    }
  }
};

