import fs from "fs"

export const name = "menu"

// 1 second delay helper
const sleep = (ms) => new Promise(res => setTimeout(res, ms))

export async function run(sock, msg) {
  const jid = msg.key.remoteJid

  // get available commands dynamically
  const files = fs.readdirSync("./plugins")
    .filter(f => f.endsWith(".js") && f !== "menu.js")
    .map(f => f.replace(".js", ""))

  // ⚔️ STEP 1 - INITIALIZE
  const sent = await sock.sendMessage(jid, {
    text: "```Initializing Menu....```"
  })

  await sleep(1000)

  // ⚔️ STEP 2 - CONNECTING
  await sock.sendMessage(jid, {
    text: "```Connecting to DARK WEB SERVER...```",
    edit: sent.key
  })

  await sleep(1000)

  // ⚔️ STEP 3 - DECRYPT CORE (YOUR CUSTOM LINE)
  await sock.sendMessage(jid, {
    text: "```Decrypting ▒▒▒ˡᵉˣʸ⃝⃝༒💘 CORE...```",
    edit: sent.key
  })

  await sleep(1000)

  // ⚔️ FINAL MENU BUILD
  let menuText = `
▒▒▒ˡᵉˣʸ⃝⃝༒💘 SYSTEM ONLINE ⚡

🌐 DARK WEB SERVER CONNECTED
━━━━━━━━━━━━━━━━━━

📜 AVAILABLE COMMANDS:
`

  for (const cmd of files) {
    menuText += `\n• .${cmd}`
  }

  menuText += `
━━━━━━━━━━━━━━━━━━
STATUS: ONLINE 🟢
MODE: HACKER CORE ACTIVE ⚡
`

  // ⚔️ FINAL EDIT → MENU
  await sock.sendMessage(jid, {
    text: menuText,
    edit: sent.key
  })
}
