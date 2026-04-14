import axios from "axios"

export const name = "ai"

export async function run(sock, msg, args) {
  const text = args.join(" ")

  if (!text) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: `
▒▒▒ LEXY AI SYSTEM ⚡

⚠️ COMMAND REQUIRED:
.ai <message>
`
    })
  }

  try {
    const res = await axios.get(
      "https://api.affiliateplus.xyz/api/chatbot",
      {
        params: {
          message: text,
          botname: "LEXY-VORTEX",
          ownername: "Hacker Core"
        }
      }
    )

    const reply = res.data.message

    // ⚔️ HACKER STYLE OUTPUT
    const hackerText = `
▒▒▒ LEXY AI CORE TERMINAL ⚡
──────────────────────
🧠 INPUT:
> ${text}

🤖 RESPONSE:
> ${reply}

──────────────────────
STATUS: ONLINE 🟢
MODE: DARK AI SYSTEM
`

    await sock.sendMessage(msg.key.remoteJid, {
      text: hackerText
    })

  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `
▒▒▒ LEXY AI SYSTEM ⚠️

ERROR: CONNECTION FAILED
STATUS: OFFLINE MODE
`
    })
  }
}
