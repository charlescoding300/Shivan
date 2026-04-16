export default {
  name: "ping",

  run: async (sock, msg) => {
    const chat = msg.key.remoteJid

    // 🧠 start timer
    const start = process.hrtime.bigint()

    // 📩 initial message
    const sent = await sock.sendMessage(chat, {
      text: "⏳ SYSTEM INITIALIZING..."
    })

    // 💻 hacker animation (edit same message every 1s)
    const steps = [
      "🖥️ ACCESSING MAINFRAME...",
      "📡 BYPASSING FIREWALL...",
      "🔐 INJECTING PAYLOAD...",
      "⚡ SYSTEM BREACH DETECTED..."
    ]

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 1000))

      await sock.sendMessage(chat, {
        text: step,
        edit: sent.key
      })
    }

    // 🧠 end timer
    const end = process.hrtime.bigint()
    const latencyMicro = Number(end - start) / 1000

    await new Promise(r => setTimeout(r, 1000))

    // 🔥 final result
    const finalText = `╔═══〔 SYSTEM PING 〕═══╗
┃ ⚡ Response Time: ${latencyMicro.toFixed(2)} μs
╚═══════════════════════╝

> Created by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*`

    await sock.sendMessage(chat, {
      text: finalText,
      edit: sent.key
    })
  }
}
