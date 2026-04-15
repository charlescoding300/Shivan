import fs from "fs"
import { exec } from "child_process"

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// =========================
// 🎭 300+ MOOD SYSTEM (SAFE + SCALABLE)
// =========================
const moodDB = {
  angry: [
    "angry","mad","hate","stupid","idiot","trash","useless","fuck","screw","kill",
    "fight","rage","burn","destroy","attack","fool","clown","worst","fake","annoying",
    "piss","broken","wrong","stop","go away","enough","loser","monster","evil","snake",
    "toxic","betray","damage","curse","fail","failure","garbage","junk","scam","fraud",
    "nonsense","waste","error","bug","lag","furious","insane","rageful","violent",
    "dumbass","pathetic","worthless","liar","cheater","corrupt","burn you","hate you"
  ],

  sad: [
    "sad","cry","miss","lonely","alone","hurt","pain","broken","depressed","sorry",
    "regret","lost","empty","hopeless","tears","crying","bad","abandoned","stress",
    "drained","help me","heartbroken","anxiety","lost hope","give up","dark","grief",
    "suffering","despair","dead inside","no strength","weak","fragile","silent tears",
    "ignored","unloved","worth nothing","invisible","cold world","no future","empty soul"
  ],

  love: [
    "love","baby","kiss","heart","sweet","romantic","wife","husband","girlfriend",
    "boyfriend","honey","sweetheart","crush","adore","forever","together","hug",
    "beautiful","mine","marry","affection","passion","angel","bae","dear","soulmate",
    "i love you","need you","want you","hold you","my life","my world","romance",
    "deep love","true love","eternal","forever yours","my queen","my king","heartbeat",
    "destiny","obsessed with you","dream girl","dream boy"
  ]
}

// =========================
// 🎭 DETECTION ENGINE
// =========================
function detectMood(text = "") {
  const t = text.toLowerCase()

  for (const mood in moodDB) {
    if (moodDB[mood].some(word => t.includes(word))) {
      return mood
    }
  }

  return "normal"
}

// =========================
// ⚡ COMMAND EXPORT (FIX FOR "undefined LOADED")
// =========================
export const name = "say"

export async function run(sock, msg, args) {

  const jid = msg.key.remoteJid
  const text = args.join(" ")

  if (!text) {
    return sock.sendMessage(jid, { text: "Use: .say hello" })
  }

  const mood = detectMood(text)
  const safeText = text.replace(/["'`]/g, "")

  await sock.sendMessage(jid, {
    text: `🎙 Processing voice...\nMood: ${mood}`
  })

  try {

    exec(`python3 tts.py "${safeText}" ${mood}`)

    await sleep(4000)

    if (!fs.existsSync("voice.mp3")) {
      return sock.sendMessage(jid, {
        text: "❌ Audio not generated"
      })
    }

    const audio = fs.readFileSync("voice.mp3")

    await sock.sendMessage(jid, {
      audio,
      mimetype: "audio/mp4",
      ptt: true
    })

    await sock.sendMessage(jid, {
      text: `✅ Done | Mood: ${mood}\n\n▒▒▒ˡᵉˣʸ⃝⃝༒💘`
    })

  } catch (e) {
    console.log(e)
    await sock.sendMessage(jid, {
      text: "❌ Say command error"
    })
  }
}
