const moment = require("moment-timezone")

module.exports = {
  name: "day",
  pattern: /^\.day$/i,

  run: async (sock, m) => {
    const chat = m.key.remoteJid

    // 🇳🇬 Nigeria timezone (you can change if needed)
    const now = moment().tz("Africa/Lagos")

    const day = now.format("dddd")
    const date = now.format("DD")
    const month = now.format("MMMM")
    const year = now.format("YYYY")

    const time12 = now.format("hh:mm:ss A")

    const text = `
📅 *TODAY'S INFORMATION*

🗓️ Day: ${day}
📆 Date: ${date}
📌 Month: ${month}
📅 Year: ${year}

⏰ Time: ${time12} (12-hour format)

> *Powered by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
    `.trim()

    await sock.sendMessage(chat, {
      text
    })

    // 🗓️ AUTO REACT
    try {
      await sock.sendMessage(chat, {
        react: {
          text: "🗓️",
          key: m.key
        }
      })
    } catch (e) {
      console.log("react error:", e)
    }
  }
}
