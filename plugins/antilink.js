const URL_REGEX =
  /(https?:\/\/|www\.|wa\.me|chat\.whatsapp\.com|t\.me|discord\.gg|bit\.ly|\.com|\.net|\.org|\.xyz)/i

global.antilinkDB = global.antilinkDB || {}

export default {
  name: "antilink",

  run: async (sock, msg) => {
    try {
      const chat = msg.key?.remoteJid
      if (!chat || !chat.endsWith("@g.us")) return
      if (!msg.message) return

      const group = global.antilinkDB[chat]
      if (!group || group.mode === "off") return

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        ""

      if (!text || !URL_REGEX.test(text)) return

      const sender = msg.key.participant || msg.key.remoteJid

      const metadata = await sock.groupMetadata(chat)
      const groupName = metadata.subject || "this group"

      const isAdmin = metadata.participants.find(
        p => p.id === sender && (p.admin === "admin" || p.admin === "superadmin")
      )
      if (isAdmin) return

      // 🔗 react
      try {
        await sock.sendMessage(chat, {
          react: { text: "🔗", key: msg.key }
        })
      } catch {}

      // 🗑 delete (ESM safe)
      try {
        await sock.sendMessage(chat, {
          delete: {
            remoteJid: chat,
            id: msg.key.id,
            participant: sender
          }
        })
      } catch (e) {
        console.log("Delete failed:", e.message)
      }

      // warnings
      if (!group.warnings) group.warnings = {}
      if (!group.warnings[sender]) group.warnings[sender] = 0

      group.warnings[sender]++

      const warningText = `🚫 _Link detected!_

▒▒▒ˡᵉˣʸ⃝⃝༒🌹 doesn't want any link in _${groupName}_

⚠️ Warning ${group.warnings[sender]}/3`

      if (group.mode === "delete") {
        await sock.sendMessage(chat, { text: warningText })
      }

      if (group.mode === "warn") {
        await sock.sendMessage(chat, { text: warningText })

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

    } catch (err) {
      console.log("ANTILINK ERROR:", err)
    }
  }
}
