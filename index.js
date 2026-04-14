import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import P from "pino"
import readline from "readline"
import { loadPlugins } from "./lib/loader.js"

const plugins = new Map()
loadPlugins(plugins)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const ask = (text) =>
  new Promise(resolve => rl.question(text, resolve))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  // ⚔️ PAIRING CODE
  if (!sock.authState.creds.registered) {
    const number = await ask("📱 Enter number (234xxxxxxxxxx): ")
    const code = await sock.requestPairingCode(number.trim())

    console.log("\n⚔️ YOUR PAIRING CODE:", code)
    console.log("👉 Open WhatsApp > Linked Devices > Link with phone number\n")
  }

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text || ""

    if (!body.startsWith(".")) return

    const args = body.slice(1).trim().split(" ")
    const cmd = args.shift().toLowerCase()

    if (plugins.has(cmd)) {
      await plugins.get(cmd).run(sock, msg, args)
    }
  })

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode
      if (reason !== DisconnectReason.loggedOut) {
        startBot()
      }
    }
  })
}

startBot()
