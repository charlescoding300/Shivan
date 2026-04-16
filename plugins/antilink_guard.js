export default {
  name: "antilink_guard",

  run: async (sock, msg) => {
    try {
      const chat = msg.key.remoteJid
      if (!chat.endsWith("@g.us")) return

      global.antilinkDB = global.antilinkDB || {}
      const group = global.antilinkDB[chat]

      if (!group || group.mode === "off") return

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        ""

      if (!text) return

      const sender = msg.key.participant || msg.key.remoteJid

      const linkRegex = /(https?:\/\/|www\.|wa\.me|t\.me)/i

      if (!linkRegex.test(text)) return

      const metadata = await sock.groupMetadata(chat)
      const groupName = metadata.subject || "this group"

      // ⚡ ALWAYS DELETE FIRST
      try {
        await sock.sendMessage(chat, {
          delete: msg.key
        })
      } catch {}

      // ignore admins
      const isAdmin = metadata.participants.find(
        p => p.id === sender && (p.admin === "admin" || p.admin === "superadmin")
      )
      if (isAdmin) return

      if (!group.warnings[sender]) group.warnings[sender] = 0

      group.warnings[sender]++

      // 🟡 DELETE + WARN MODE
      if (group.mode === "delete_warn") {
        await sock.sendMessage(chat, {
          text: `🚫 Link detected!

▒▒▒ˡᵉˣʸ⃝⃝༒🌹 doesn't want any link in ${groupName}

⚠️ Warning ${group.warnings[sender]}/3`
        })

        if (group.warnings[sender] >= 3) {
          await sock.groupParticipantsUpdate(chat, [sender], "remove")
          group.warnings[sender] = 0
        }
      }

      // 🟢 WARN MODE
      if (group.mode === "warn") {
        await sock.sendMessage(chat, {
          text: `🚫 Link removed!

*▒▒▒ˡᵉˣʸ⃝⃝༒🌹 doesn't want any link in ${groupName}*

*⚠️ Warning ${group.warnings[sender]}/3`*
        })

        if (group.warnings[sender] >= 3) {
          await sock.groupParticipantsUpdate(chat, [sender], "remove")
          group.warnings[sender] = 0
        }
      }

      // 🔴 KICK MODE
      if (group.mode === "kick") {
        await sock.groupParticipantsUpdate(chat, [sender], "remove")

        await sock.sendMessage(chat, {
          text: `🚨 User removed for sending link in ${groupName}`
        })
      }

    } catch (e) {
      console.log("ANTILINK GUARD ERROR:", e.message)
    }
  }
}
