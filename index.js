import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys"

import pino from "pino"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prefix = "."

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function loader() {
  console.clear()
  console.log("🔌 Booting Bot...\n")

  const steps = [
    "Loading core system...",
    "Preparing WhatsApp engine...",
    "Loading commands...",
    "Connecting auth system...",
    "Finalizing startup..."
  ]

  for (let s of steps) {
    console.log("⏳ " + s)
    await sleep(500)
  }

  console.log("\n✅ Ready\n")
}

const commands = new Map()

async function loadCommands() {
  const files = fs.readdirSync("./commands")

  for (let file of files) {
    if (file.endsWith(".js")) {
      const cmd = await import(`./commands/${file}`)
      commands.set(cmd.default.name, cmd.default)
      console.log("📦 Loaded:", cmd.default.name)
    }
  }
}

async function startBot() {
  await loader()

  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  // Pairing code (works in Termux + Railway terminal logs)
  if (!sock.authState.creds.registered) {
    console.log("📱 Open WhatsApp → Linked Devices → Pairing Mode")
  }

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    if (!text || !text.startsWith(prefix)) return

    const args = text.slice(prefix.length).trim().split(" ")
    const cmdName = args.shift().toLowerCase()

    const cmd = commands.get(cmdName)
    if (cmd) await cmd.execute(sock, msg, args)
  })

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("🤖 Bot Connected")
    }
  })

  await loadCommands()
}

startBot()
