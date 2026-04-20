export default async function isOwnerOrSudo(senderId, sock, chatId) {
    const ownerNumber = process.env.OWNER_NUMBER

    if (!ownerNumber) return false

    const cleanSender = senderId.split("@")[0]

    return cleanSender === ownerNumber
}
