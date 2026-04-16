import fs from "fs"

const DB_FILE = "./antilink.json"

function loadDB() {
  if (!fs.existsSync(DB_FILE)) return {}
  return JSON.parse(fs.readFileSync(DB_FILE))
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

export default {
  name: "antilink_guard",

  run: async (sock, msg) => {
    const chat = msg.key.remoteJid
    if (!chat.endsWith("@g.us")) return

    const db = loadDB()
    const group = db[chat]
    if (!group || group.mode === "off") return

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      ""

    const sender = msg.key.participant || msg.key.remoteJid

    const linkRegex = /(https?:\/\/|www\.|wa\.me|t\.me)/i

    if (!linkRegex.test(text)) return

    const metadata = await sock.groupMetadata(chat)
    const groupName = metadata.subject

    // ⚡ ALWAYS DELETE FIRST (GLOBAL RULE)
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

    // init warnings
    if (!group.warnings[sender]) group.warnings[sender] = 0

    group.warnings[sender]++

    // 🟡 DELETE + WARN MODE
    if (group.mode === "delete_warn") {
      await sock.sendMessage(chat, {
        text: `🚫 Link detected!

*▒▒▒ˡᵉˣʸ⃝⃝༒🌹 doesn't want any link in ${groupName}*

*⚠️ Warning ${group.warnings[sender]}/3`*
      })

      if (group.warnings[sender] >= 3) {
        await sock.groupParticipantsUpdate(chat, [sender], "remove")

        group.warnings[sender] = 0

        await sock.sendMessage(chat, {
          text: "👢 User removed after 3 warnings"
        })
      }
    }

    // 🟢 WARN MODE
    if (group.mode === "warn") {
      await sock.sendMessage(chat, {
        text: `🚫 Link removed!

*▒▒▒ˡᵉˣʸ⃝⃝༒ doesn't want any link in ${groupName}*

```⚠️ Warning ${group.warnings[sender]}/3```
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
        text: `🚨 User kicked for sending link in ${groupName}`
      })
    }

    saveDB(db)
  }
}
