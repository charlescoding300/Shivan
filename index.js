import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from "@whiskeysockets/baileys"

import pino from "pino"
import readline from "readline"
import { startHandler } from "./handler.js"

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
    }
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      console.log("✅ Bot Connected")
    }

    if (connection === "close") {
      console.log("❌ Restarting...")
      start()
    }
  })

  // 👇 All logic goes to handler
  startHandler(sock)

  if (!state.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question("Enter WhatsApp number (no +): ", async (number) => {
      const code = await sock.requestPairingCode(number)
      console.log("Your Pairing Code:", code)
      rl.close()
    })
  }
}

start()
