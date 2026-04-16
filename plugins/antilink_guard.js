export default {
  name: "antilink_guard",

  run: async (sock, msg) => {
    try {
      const chat = msg.key?.remoteJid
      if (!chat || !chat.endsWith("@g.us")) return
      if (!msg.message) return

      // Ensure DB exists
      global.antilinkDB = global.antilinkDB || {}
      const group = global.antilinkDB[chat]
      if (!group || group.mode === "off") return

      // Extract message text safely
      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        ""

      if (!text) return

      // 🔗 Improved link detection
      const linkRegex =
        /(https?:\/\/|www\.|wa\.me|chat\.whatsapp\.com|t\.me|discord\.gg|bit\.ly|\.com|\.net|\.org)/i

      if (!linkRegex.test(text)) return

      const sender = msg.key.participant || msg.key.remoteJid

      // Get group metadata
      const metadata = await sock.groupMetadata(chat)
      const groupName = metadata.subject || "this group"

      // Check if sender is admin
      const isAdmin = metadata.participants.find(
        p =>
          p.id === sender &&
          (p.admin === "admin" || p.admin === "superadmin")
      )

      if (isAdmin) return

      // 🔗 Auto React
      try {
        await sock.sendMessage(chat, {
          react: {
            text: "🔗",
            key: msg.key
          }
        })
      } catch {}

      // 🗑 Delete message
      try {
        await sock.sendMessage(chat, {
          delete: {
            remoteJid: chat,
            fromMe: false,
            id: msg.key.id,
            participant: msg.key.participant
          }
        })
      } catch (err) {
        console.log("Delete failed:", err.message)
      }

      // Initialize warnings
      if (!group.warnings) group.warnings = {}
      if (!group.warnings[sender]) group.warnings[sender] = 0

      group.warnings[sender]++

      // 🟡 DELETE + WARN MODE
      if (group.mode === "delete_warn") {
        await sock.sendMessage(chat, {
          text: `🚫 _Link detected!_

▒▒▒ˡᵉˣʸ⃝⃝༒🌹 doesn't want any link in _${groupName}_

⚠️ Warning ${group.warnings[sender]}/3`
        })

        if (group.warnings[sender] >= 3) {
          await sock.groupParticipantsUpdate(chat, [sender], "remove")
          group.warnings[sender] = 0
        }
      }

      // 🟢 WARN MODE
      else if (group.mode === "warn") {
        await sock.sendMessage(chat, {
          text: `🚫 _Link removed!_

▒▒▒ˡᵉˣʸ⃝⃝༒🌹 doesn't want any link in _${groupName}_

⚠️ Warning ${group.warnings[sender]}/3`
        })

        if (group.warnings[sender] >= 3) {
          await sock.groupParticipantsUpdate(chat, [sender], "remove")
          group.warnings[sender] = 0
        }
      }

      // 🔴 KICK MODE
      else if (group.mode === "kick") {
        await sock.groupParticipantsUpdate(chat, [sender], "remove")

        await sock.sendMessage(chat, {
          text: `🚨 _User removed for sending link in ${groupName}_`
        })
      }

    } catch (err) {
      console.log("ANTILINK GUARD ERROR:", err)
    }
  }
}
