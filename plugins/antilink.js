export default {
  name: "antilink",

  run: async (sock, msg, args) => {
    try {
      const chat = msg.key.remoteJid
      if (!chat.endsWith("@g.us")) return

      const metadata = await sock.groupMetadata(chat)
      const sender = msg.key.participant || msg.key.remoteJid

      // check admin
      const isAdmin = metadata.participants.find(
        p =>
          p.id === sender &&
          (p.admin === "admin" || p.admin === "superadmin")
      )

      if (!isAdmin) {
        return sock.sendMessage(chat, {
          text: "❌ Only group admins can use this command."
        })
      }

      global.antilinkDB = global.antilinkDB || {}
      if (!global.antilinkDB[chat]) {
        global.antilinkDB[chat] = {
          mode: "off",
          warnings: {}
        }
      }

      const group = global.antilinkDB[chat]

      const mode = args[0]?.toLowerCase()

      // =========================
      // 🔥 SET MODES
      // =========================

      if (mode === "on") {
        group.mode = "delete_warn"

        return sock.sendMessage(chat, {
          text: "🟢 Anti-Link ENABLED (Delete + Warn mode)"
        })
      }

      if (mode === "warn") {
        group.mode = "warn"

        return sock.sendMessage(chat, {
          text: "🟡 Anti-Link set to WARN mode"
        })
      }

      if (mode === "kick") {
        group.mode = "kick"

        return sock.sendMessage(chat, {
          text: "🔴 Anti-Link set to KICK mode"
        })
      }

      if (mode === "off") {
        group.mode = "off"

        return sock.sendMessage(chat, {
          text: "⚫ Anti-Link DISABLED"
        })
      }

      // =========================
      // HELP MENU
      // =========================
      return sock.sendMessage(chat, {
        text: `
📛 ANTI-LINK COMMANDS

.antilink on    → delete + warn
.antilink warn  → warn only
.antilink kick  → instant kick
.antilink off   → disable system
        `
      })

    } catch (err) {
      console.log("ANTILINK CMD ERROR:", err)
    }
  }
}
