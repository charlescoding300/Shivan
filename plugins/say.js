export default {
  name: "ping",

  run: async (sock, msg) => {
    const chat = msg.key.remoteJid

    const start = process.hrtime.bigint()

    const sent = await sock.sendMessage(chat, {
      text: "⏳ Initializing system..."
    })

    const steps = [
      "🖥️ Accessing mainframe...",
      "📡 Bypassing firewall...",
      "🔐 Injecting payload...",
      "⚡ System Breached..."
    ]

    // ⏱️ 1 second delay per edit
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 1000))

      await sock.sendMessage(chat, {
        text: step,
        edit: sent.key
      })
    }

    const end = process.hrtime.bigint()
    const latencyMicro = Number(end - start) / 1000

    await new Promise(r => setTimeout(r, 1000))

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
