export default {
  name: "ping",

  run: async (sock, msg) => {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "⚡ Pong!"
    })
  }
}
