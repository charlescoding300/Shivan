const fs = require("fs")
const path = require("path")

const configPath = path.join(__dirname, "../data/autotyping.json")

function isEnabled() {
  try {
    return JSON.parse(fs.readFileSync(configPath)).enabled
  } catch {
    return false
  }
}

// 🔥 THIS RUNS BEFORE EVERY REPLY
async function autoType(sock, chat, text = "") {
  if (!isEnabled()) return

  await sock.presenceSubscribe(chat)

  await sock.sendPresenceUpdate("composing", chat)

  const delay = Math.max(2000, Math.min(5000, text.length * 80))
  await new Promise(r => setTimeout(r, delay))

  await sock.sendPresenceUpdate("paused", chat)
}

module.exports = { autoType }
