import fs from "fs"

const DB_FILE = "./antilink.json"

function loadDB() {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "{}")
  return JSON.parse(fs.readFileSync(DB_FILE))
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

export default {
  name: "antilink",

  run: async (sock, msg, args) => {
    const chat = msg.key.remoteJid
    const isGroup = chat.endsWith("@g.us")

    if (!isGroup) {
      return sock.sendMessage(chat, {
        text: "❌ Group only command"
      })
    }

    const db = loadDB()
    const input = args.join(" ").toLowerCase()

    if (!db[chat]) {
      db[chat] = { mode: "off", warnings: {} }
    }

    if (!input) {
      return sock.sendMessage(chat, {
        text: `
Usage:
.antilink on
.antilink/warn on
.antilink/kick on
.antilink off
`
      })
    }

    // 🔗 AUTO REACT (when setting mode)
    const react = async () => {
      await sock.sendMessage(chat, {
        react: {
          text: "🔗",
          key: msg.key
        }
      })
    }

    // 🟡 DELETE + WARN MODE
    if (input === "on") {
      db[chat].mode = "delete_warn"
      db[chat].warnings = {}

      await react()
      saveDB(db)

      return sock.sendMessage(chat, {
        text: "🛡️ Antilink DELETE + WARN MODE ENABLED"
      })
    }

    // 🟢 WARN MODE
    if (input === "warn on") {
      db[chat].mode = "warn"
      db[chat].warnings = {}

      await react()
      saveDB(db)

      return sock.sendMessage(chat, {
        text: "🛡️ Antilink WARN MODE ENABLED"
      })
    }

    // 🔴 KICK MODE
    if (input === "kick on") {
      db[chat].mode = "kick"
      db[chat].warnings = {}

      await react()
      saveDB(db)

      return sock.sendMessage(chat, {
        text: "🚨 Antilink KICK MODE ENABLED"
      })
    }

    // ❌ OFF
    if (input === "off") {
      db[chat].mode = "off"
      db[chat].warnings = {}

      saveDB(db)

      return sock.sendMessage(chat, {
        text: "⚠️ Antilink DISABLED"
      })
    }
  }
}
