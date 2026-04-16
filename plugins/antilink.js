export default {
  name: "antilink",

  run: async (sock, msg, args) => {
    try {
      const chat = msg.key.remoteJid
      if (!chat.endsWith("@g.us")) {
        return sock.sendMessage(chat, { text: "❌ Group only command" })
      }

      global.antilinkDB = global.antilinkDB || {}

      const input = args.join(" ").toLowerCase()

      if (!global.antilinkDB[chat]) {
        global.antilinkDB[chat] = {
          mode: "off",
          warnings: {}
        }
      }

      const db = global.antilinkDB[chat]

      const react = async () => {
        await sock.sendMessage(chat, {
          react: { text: "🔗", key: msg.key }
        })
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

      if (input === "on") {
        db.mode = "delete_warn"
        db.warnings = {}
        await react()

        return sock.sendMessage(chat, {
          text: "🛡️ Antilink DELETE + WARN MODE ENABLED"
        })
      }

      if (input === "warn on") {
        db.mode = "warn"
        db.warnings = {}
        await react()

        return sock.sendMessage(chat, {
          text: "🛡️ Antilink WARN MODE ENABLED"
        })
      }

      if (input === "kick on") {
        db.mode = "kick"
        db.warnings = {}
        await react()

        return sock.sendMessage(chat, {
          text: "🚨 Antilink KICK MODE ENABLED"
        })
      }

      if (input === "off") {
        db.mode = "off"
        db.warnings = {}
        return sock.sendMessage(chat, {
          text: "⚠️ Antilink DISABLED"
        })
      }

    } catch (e) {
      console.log("ANTILINK CMD ERROR:", e)
    }
  }
}
