const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export const name = "ping"

export async function run(sock, msg) {
  const jid = msg.key.remoteJid

  const start = Date.now()

  const sent = await sock.sendMessage(jid, {
    text: "Connecting to Google IP address..."
  })

  await sleep(600)

  const mid = Date.now() - start

  await sock.sendMessage(jid, {
    text: `Pinging... ${mid} ms`,
    edit: sent.key
  })

  await sleep(600)

  const final = Date.now() - start

  await sock.sendMessage(jid, {
    text: `
▒▒▒ˡᵉˣʸ⃝⃝༒💘 is online ⚡

Latency: ${final} ms

*Created by ▒▒▒ˡᵉˣʸ⃝⃝༒💘*
`,
    edit: sent.key
  })
}
