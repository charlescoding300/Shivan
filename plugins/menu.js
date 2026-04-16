import fs from "fs"

export default {
  name: "menu",

  run: async (sock, msg) => {
    const chat = msg.key.remoteJid

    const sent = await sock.sendMessage(chat, {
      text: "```⧉ INITIALIZING COMMAND MATRIX...```"
    })

    await new Promise(r => setTimeout(r, 800))

    const files = fs.readdirSync("./plugins")

    const commands = files
      .filter(f => f.endsWith(".js") && f !== "menu.js")
      .map(f => f.replace(".js", ""))

    const menuText = `
╔════════════════════════════╗
║     ⚡ WABBOT SYSTEM ⚡     ║
╚════════════════════════════╝

┌── ⌬ AVAILABLE COMMANDS ──┐
${commands.length
  ? commands.map(c => `│ .${c}`).join("\n")
  : "│ (no commands loaded)"}
└──────────────────────────┘

┌── ⌬ SYSTEM STATUS ──┐
│ STATUS   → ONLINE
│ ENGINE   → BAILEYS MD
│ MODULES  → ${commands.length}
└─────────────────────┘

> TYPE .menu TO REFRESH SYSTEM

> *CREATED BY ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
`

    await sock.sendMessage(chat, {
      text: menuText,
      edit: sent.key
    })
  }
}
