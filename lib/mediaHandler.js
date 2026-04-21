import axios from "axios";

const footer = `\n> *Powered by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*`;

/* =======================
   🎧 SAFE AUDIO SENDER
======================= */
export async function sendSafeAudio(sock, chatId, url, options = {}) {
  try {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid audio URL");
    }

    const head = await axios.head(url).catch(() => null);

    if (!head?.status || head.status >= 400) {
      throw new Error("Audio URL unreachable");
    }

    return await sock.sendMessage(chatId, {
      audio: { url },
      mimetype: "audio/mpeg",
      ...options
    });

  } catch (err) {
    console.error("Audio error:", err.message);

    return await sock.sendMessage(chatId, {
      text: `❌ Failed to generate audio, please try again later${footer}`
    });
  }
}

/* =======================
   🖼 SAFE IMAGE SENDER
======================= */
export async function sendSafeImage(sock, chatId, url, caption = "") {
  try {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid image URL");
    }

    const head = await axios.head(url).catch(() => null);

    if (!head?.status || head.status >= 400) {
      throw new Error("Image URL unreachable");
    }

    return await sock.sendMessage(chatId, {
      image: { url },
      caption: caption + footer
    });

  } catch (err) {
    console.error("Image error:", err.message);

    return await sock.sendMessage(chatId, {
      text: `❌ Failed to send image${footer}`
    });
  }
}

/* =======================
   🎥 SAFE VIDEO SENDER
======================= */
export async function sendSafeVideo(sock, chatId, url, caption = "", options = {}) {
  try {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid video URL");
    }

    const head = await axios.head(url).catch(() => null);

    if (!head?.status || head.status >= 400) {
      throw new Error("Video URL unreachable");
    }

    return await sock.sendMessage(chatId, {
      video: { url },
      caption: caption + footer,
      ...options
    });

  } catch (err) {
    console.error("Video error:", err.message);

    return await sock.sendMessage(chatId, {
      text: `❌ Failed to send video${footer}`
    });
  }
}
