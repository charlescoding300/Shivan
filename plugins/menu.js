import fs from "fs"

export const name = "menu"

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export async function run(sock, msg) {
  const jid = msg.key.remoteJid

  const files = fs.readdirSync("./plugins")
    .filter(f => f.endsWith(".js") && f !== "menu.js")
    .map(f => "• ." + f.replace(".js", ""))

  const sent = await sock.sendMessage(jid, {
    text: "SYSTEM BOOTING..."
  })

  await sleep(600)

  await sock.sendMessage(jid, {
    text: "LOADING CORE MODULES...",
    edit: sent.key
  })

  await sleep(600)

  await sock.sendMessage(jid, {
    text: "SCANNING PLUGINS...",
    edit: sent.key
  })

  await sleep(600)

  const menu = `
▒▒▒ SYSTEM ONLINE ⚡
━━━━━━━━━━━━━━━━━━

📜 COMMANDS:
${files.join("\n")}

━━━━━━━━━━━━━━━━━━

*Created by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
`

  await sock.sendMessage(jid, {
    text: menu,
    edit: sent.key
  })
}
