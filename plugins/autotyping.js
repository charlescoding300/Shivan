const fs = require("fs")
const path = require("path")

const configPath = path.join(__dirname, "..", "data", "autotyping.json")

function load() {
  return JSON.parse(fs.readFileSync(configPath))
}

function save(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
}

module.exports = {
  name: "autotyping",

  run: async (sock, m) => {
    const chat = m.key.remoteJid

    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      ""

    const mode = text.split(" ")[1]?.toLowerCase()

    const db = load()

    if (mode === "on") db.enabled = true
    else if (mode === "off") db.enabled = false
    else db.enabled = !db.enabled

    save(db)

    await sock.sendMessage(chat, {
      text: `⌨️ Auto Typing is *${db.enabled ? "ON" : "OFF"}*`
    })
  }
}
