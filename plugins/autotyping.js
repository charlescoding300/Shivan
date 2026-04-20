import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import isOwnerOrSudo from "../lib/isOwner.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configPath = path.join(__dirname, "..", "data", "autotyping.json")

function initConfig() {
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(path.dirname(configPath), { recursive: true })
        fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2))
    }
    return JSON.parse(fs.readFileSync(configPath))
}

export async function autotypingCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId)

        if (!message.key.fromMe && !isOwner) {
            return await sock.sendMessage(chatId, {
                text: "❌ Owner only command!"
            })
        }

        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            ""

        const args = text.trim().split(" ").slice(1)
        const config = initConfig()

        if (args[0] === "on") config.enabled = true
        else if (args[0] === "off") config.enabled = false
        else config.enabled = !config.enabled

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

        await sock.sendMessage(chatId, {
            text: `⌨️ Auto Typing is *${config.enabled ? "ON" : "OFF"}*`
        })

    } catch (e) {
        console.log("autotyping error:", e)
    }
}

export function isAutotypingEnabled() {
    return initConfig().enabled === true
}

export async function handleAutotyping(sock, chatId, text = "") {
    if (!isAutotypingEnabled()) return

    await sock.presenceSubscribe(chatId)

    await sock.sendPresenceUpdate("composing", chatId)

    const delay = Math.max(2000, Math.min(5000, text.length * 80))
    await new Promise(r => setTimeout(r, delay))

    await sock.sendPresenceUpdate("paused", chatId)
}
