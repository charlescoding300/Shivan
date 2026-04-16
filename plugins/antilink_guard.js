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

      const sender = msg.key.participant || msg.key.remoteJid

      const linkRegex = /(https?:\/\/|www\.|wa\.me|t\.me)/i

      if (!linkRegex.test(text)) return

      // ALWAYS DELETE FIRST
      try {
        await sock.sendMessage(chat, {
          delete: msg.key
        })
      } catch {}

      // ignore admins safely
      let metadata
      try {
        metadata = await sock.groupMetadata(chat)
      } catch {
        return
      }

      const isAdmin = metadata.participants?.find(
        p => p.id === sender && (p.admin === "admin" || p.admin === "superadmin")
      )

      if (isAdmin) return

      const groupName = metadata.subject || "this group"

      if (!group.warnings[sender]) group.warnings[sender] = 0

      group.warnings[sender]++

      // 🟡 WARN MODE
      if (group.mode === "warn" || group.mode === "delete_warn") {
        await sock.sendMessage(chat, {
          text: `🚫 Link detected!

*▒▒▒ˡᵉˣʸ⃝⃝༒🌹 doesn't want any link in ${groupName}*

*⚠️ Warning ${group.warnings[sender]}/3`*
        })

        if (group.warnings[sender] >= 3) {
          try {
            await sock.groupParticipantsUpdate(chat, [sender], "remove")
          } catch {}

          group.warnings[sender] = 0
        }
      }

      // 🔴 KICK MODE
      if (group.mode === "kick") {
        try {
          await sock.groupParticipantsUpdate(chat, [sender], "remove")
        } catch {}

        await sock.sendMessage(chat, {
          text: `🚨 User removed for sending link in ${groupName}`
        })
      }

    } catch (e) {
      console.log("ANTILINK GUARD ERROR:", e)
    }
  }
}
