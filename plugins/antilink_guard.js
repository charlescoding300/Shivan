export default {
  name: "antilink_guard",

  run: async (sock, msg) => {
    try {
      const chat = msg.key.remoteJid
      if (!chat || !chat.endsWith("@g.us")) return

      global.antilinkDB = global.antilinkDB || {}
      const group = global.antilinkDB[chat]
      if (!group || group.mode === "off") return

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        ""

      if (!text) return

      const linkRegex = /(https?:\/\/|www\.|wa\.me|t\.me)/i
      if (!linkRegex.test(text)) return

      const sender = msg.key.participant
      const metadata = await sock.groupMetadata(chat)
      const groupName = metadata.subject || "this group"

      // delete message first
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

      if (!group.warnings) group.warnings = {}
      if (!group.warnings[sender]) group.warnings[sender] = 0

      group.warnings[sender]++

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

      if (group.mode === "warn") {
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

      if (group.mode === "kick") {
        await sock.groupParticipantsUpdate(chat, [sender], "remove")

        await sock.sendMessage(chat, {
          text: `🚨 _User removed for sending link in ${groupName}_`
        })
      }

    } catch (e) {
      console.log("ANTILINK ERROR:", e.message)
    }
  }
}
