import fs from "fs"

const plugins = new Map()
const prefix = "."

export async function startHandler(sock) {
  // Load plugins
  const files = fs.readdirSync("./plugins").filter(f => f.endsWith(".js"))

  for (const file of files) {
    const mod = await import(`./plugins/${file}`)
    const plugin = mod.default

    if (!plugin?.name || !plugin?.run) continue

    plugins.set(plugin.name, plugin)
    console.log("✅ Loaded:", plugin.name)
  }

  // Listen for messages
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (!text.startsWith(prefix)) return

    const args = text.slice(1).trim().split(" ")
    const cmd = args.shift().toLowerCase()

    const plugin = plugins.get(cmd)
    if (!plugin) return

    try {
      await plugin.run(sock, msg, args)
    } catch (err) {
      console.log("Plugin error:", err)
    }
  })
}
