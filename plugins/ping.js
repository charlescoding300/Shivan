export const name = "ping"

export async function run(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏓 Pong! Bot is alive"
  })
}

