import moment from "moment-timezone"

export async function dayCommand(sock, chatId) {
    try {
        const now = moment().tz("Africa/Lagos")

        const day = now.format("dddd")
        const date = now.format("DD")
        const month = now.format("MMMM")
        const year = now.format("YYYY")
        const time = now.format("hh:mm:ss A") // 12 hour format

        const message = `\`\`\` loading this wonderful day 🌍 \`\`\`

📅 *Day:* ${day}
📆 *Date:* ${date}
🗓️ *Month:* ${month}
📆្នាំ *Year:* ${year}
⏰ *Time:* ${time}

> *Powered by  ▒▒▒ˡᵉˣʸ⃝⃝༒💘*`

        await sock.sendMessage(chatId, { text: message })

    } catch (err) {
        console.log("Day command error:", err)
    }
}
