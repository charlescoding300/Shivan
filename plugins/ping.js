export default {
  name: "ping",

  run: async (sock, msg) => {
    const chat = msg.key.remoteJid

    // 📟 react instantly
    await sock.sendMessage(chat, {
      react: {
        text: "📟",
        key: msg.key
      }
    })

    const start = process.hrtime.bigint()

    const sent = await sock.sendMessage(chat, {
      text: "```⏳ SYSTEM INITIALIZING...```"
    })

    await new Promise(r => setTimeout(r, 1000))

    const end = process.hrtime.bigint()
    const latencyMicro = Number(end - start) / 1000

    await sock.sendMessage(chat, {
      text: `╔═══〔 SYSTEM PING 〕═══╗
┃ ⚡ Response Time: ${latencyMicro.toFixed(2)} μs
╚═══════════════════════╝

> *Created by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*`,
      edit: sent.key
    })
  }
}
