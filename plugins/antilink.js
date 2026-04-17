export default {
  name: "antilink",

  run: async (sock, msg) => {
    const jid = msg.key.remoteJid;
    if (!jid?.endsWith('@g.us')) return; // Only work in groups

    // Safe text extraction
    let text = '';
    if (msg.message?.conversation) text = msg.message.conversation;
    else if (msg.message?.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
    else if (msg.message?.imageMessage?.caption) text = msg.message.imageMessage.caption;
    else if (msg.message?.videoMessage?.caption) text = msg.message.videoMessage.caption;

    text = text.trim();

    // Module-level state (persists while bot is running)
    if (!global.antilinkMode) global.antilinkMode = 'delete'; // default: delete
    if (!global.antilinkWarnings) global.antilinkWarnings = new Map(); // userJid => count

    const isBot = msg.key.fromMe;
    if (isBot) return;

    const sender = msg.key.participant || msg.key.remoteJid;
    const senderJid = sender.split('@')[0] + '@s.whatsapp.net';

    // Check if sender is admin
    let isAdmin = false;
    try {
      const groupMeta = await sock.groupMetadata(jid);
      isAdmin = groupMeta.participants.some(p => 
        (p.id === sender || p.id === senderJid) && 
        (p.admin === 'admin' || p.admin === 'superadmin')
      );
    } catch (e) {
      // Safe fallback
      isAdmin = false;
    }

    if (isAdmin) return; // Ignore admins

    // === Command handler: .antilink delete | warn | kick ===
    const args = text.toLowerCase().split(/\s+/);
    if (args[0] === '.antilink' || args[0] === '!antilink') {
      if (!isAdmin) { // Only admins can change mode
        await sock.sendMessage(jid, { text: '❌ Only group admins can change anti-link mode.' });
        return;
      }

      const newMode = args[1];
      if (['delete', 'warn', 'kick'].includes(newMode)) {
        global.antilinkMode = newMode;
        await sock.sendMessage(jid, { 
          text: `✅ Anti-link mode set to: *${newMode.toUpperCase()}*` 
        });
      } else {
        await sock.sendMessage(jid, { 
          text: `Current mode: *${global.antilinkMode.toUpperCase()}*\n\nUsage: .antilink delete / warn / kick` 
        });
      }
      return;
    }

    // === Automatic link detection ===
    const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;
    const hasLink = urlRegex.test(text);

    if (!hasLink) return;

    // Link detected → take action
    try {
      // 1. Delete the message (correct Baileys v6/v7 format)
      await sock.sendMessage(jid, { delete: msg.key });

      // 2. React with 🔗 on the original message
      await sock.sendMessage(jid, {
        react: {
          text: '🔗',
          key: msg.key
        }
      });

      // 3. Take action based on mode
      const currentMode = global.antilinkMode;

      if (currentMode === 'warn') {
        let warns = global.antilinkWarnings.get(senderJid) || 0;
        warns++;
        global.antilinkWarnings.set(senderJid, warns);

        await sock.sendMessage(jid, {
          text: `⚠️ Link detected and deleted!\n@\( {sender.split('@')[0]}, this is warning # \){warns}.\nDo not send links.`,
          mentions: [senderJid]
        });
      } 
      else if (currentMode === 'kick') {
        await sock.groupParticipantsUpdate(jid, [senderJid], "remove");

        await sock.sendMessage(jid, {
          text: `🚫 Link detected → @${sender.split('@')[0]} has been removed from the group.`,
          mentions: [senderJid]
        });
      } 
      else {
        // default: delete only (silent or with short message)
        await sock.sendMessage(jid, {
          text: `🔗 Links are not allowed in this group.`
        });
      }

    } catch (err) {
      console.error('Anti-link error:', err.message);
      // Never crash the bot
    }
  }
};
