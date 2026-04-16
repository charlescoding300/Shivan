import fs from "fs"

export default {
  name: "menu",

  run: async (sock, msg) => {
    const chat = msg.key.remoteJid

    // 🤖 react instantly
    await sock.sendMessage(chat, {
      react: {
        text: "🤖",
        key: msg.key
      }
    })

    const sent = await sock.sendMessage(chat, {
      text: "```⧉ SCANNING SYSTEM...```"
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

┌── ⌬ COMMANDS ──┐
${commands.map(c => `│ .${c}`).join("\n")}
└────────────────┘

> SYSTEM ONLINE
> MODULES: ${commands.length}

> *CREATED BY ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
`

    await sock.sendMessage(chat, {
      text: menuText,
      edit: sent.key
    })
  }
}
