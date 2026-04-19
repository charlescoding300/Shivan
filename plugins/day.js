export default {
  name: "day",
  pattern: /^\.day$/i,

  run: async (sock, m) => {
    const chat = m.key.remoteJid

    // 🗓️ Auto react
    await sock.sendMessage(chat, {
      react: { text: "🗓️", key: m.key }
    })

    // Loading message
    const loadingMsg = await sock.sendMessage(chat, {
      text: "```Loading this wonderful day 🌍```"
    })

    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000))

    const now = new Date()

    const day = now.toLocaleString("en-GB", { weekday: "long" })
    const date = now.getDate()
    const month = now.toLocaleString("en-GB", { month: "long" })
    const year = now.getFullYear()
    const time = now.toLocaleTimeString("en-GB")

    // Edit message (no spam)
    await sock.sendMessage(chat, {
      text: `
🌍 *Today Information*

📅 Day: ${day}
📆 Date: ${date}
🗓 Month: ${month}
📅 Year: ${year}
⏰ Time: ${time}

> *Powered by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
      `,
      edit: loadingMsg.key
    })
  }
}
