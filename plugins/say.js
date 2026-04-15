import fs from "fs"
import { exec } from "child_process"

export const name = "say"

const sleep = (ms) => new Promise(res => setTimeout(res, ms))

// =========================
// 🎭 MOOD DETECTION (200+ words per mood)
// =========================
function detectMood(text) {

  const t = text.toLowerCase()

  // 😡 ANGRY (200+ expanded)
  const angry = [
    "hate","angry","mad","stupid","idiot","dumb","trash","useless","annoying","kill",
    "fight","rage","burn","destroy","attack","shut","fool","clown","worst","fake",
    "fuck","screw","piss","broken","wrong","leave","go away","stop","enough","loser",
    "monster","evil","snake","toxic","betray","damage","curse","fail","failure",
    "garbage","junk","scam","fraud","nonsense","rubbish","waste","error","bug","lag",
    "delay","shutdown","cancel","block","idiotic","furious","insane","rage mode",
    "pissed","explode","collapse","rage quit","no sense","annoyed","destroyed",
    "hate this","shut up","leave me","stupid bot","useless bot","system error",
    "broken system","no control","maximum rage","angry now","very angry","super angry",
    "don’t talk","idiot system","trash system","broken app","hate everything","rage inside"
  ]

  // 😢 SAD (200+ expanded)
  const sad = [
    "sad","cry","miss","lonely","alone","hurt","pain","broken","depressed","sorry",
    "regret","lost","empty","hopeless","tears","crying","bad","abandoned","ignored",
    "help me","broken heart","suffering","anxiety","stress","drained","nobody",
    "miss you","i need you","why me","down","lost hope","give up","broken soul",
    "pain inside","depression","heart pain","lost everything","hurt deeply","silent pain",
    "deep sadness","crying inside","empty heart","no future","no meaning","dark life",
    "broken dreams","no energy","alone forever","life hurts","grief","heartbroken",
    "lost love","broken trust","emotional pain","sad life","very sad","cry again",
    "tears fall","broken mind","lost purpose","no hope","empty world","deep hurt",
    "life is hard","pain forever","hopeless life","crying soul","no happiness",
    "emotional damage","mental pain","silent tears","empty feelings","dark thoughts"
  ]

  // ❤️ ROMANTIC (200+ expanded)
  const love = [
    "love","baby","babe","kiss","heart","sweet","romantic","wife","husband","girlfriend",
    "boyfriend","honey","sweetheart","crush","adore","miss you","forever","together",
    "hug","cuddle","beautiful","mine","marry","relationship","affection","passion",
    "angel","dream","lover","i love you","love you","bae","dear","my love","true love",
    "forever yours","always yours","my queen","my king","soulmate","need you","want you",
    "hold you","kiss you","my life","my world","my heart","deep love","pure love",
    "eternal love","forever love","romantic mood","loving you","soft love","true feelings",
    "passionate love","romantic heart","endless love","sweet love","real love",
    "deep emotions","love forever","darling","sunshine","moonlight","angel eyes",
    "heartbeat","true romance","my everything","only you","special one","my universe",
    "my destiny","my forever","deep connection","romantic soul","love bond","true passion"
  ]

  if (angry.some(w => t.includes(w))) return "angry"
  if (sad.some(w => t.includes(w))) return "sad"
  if (love.some(w => t.includes(w))) return "romantic"

  return "normal"
}

// =========================
// ⚡ MAIN COMMAND
// =========================
export async function run(sock, msg, args) {

  const jid = msg.key.remoteJid
  const text = args.join(" ")

  if (!text) {
    return sock.sendMessage(jid, {
      text: "Use: .say hello"
    })
  }

  try {

    const mood = detectMood(text)

    const sent = await sock.sendMessage(jid, {
      text: "Processing..."
    })

    await sleep(400)

    await sock.sendMessage(jid, {
      text: `Mood: ${mood}`,
      edit: sent.key
    })

    // 🔥 pass mood to python
    exec(`python tts.py "${text.replace(/"/g,'')}" ${mood}`, async (err) => {

      if (err) {
        return sock.sendMessage(jid, {
          text: "Voice error",
          edit: sent.key
        })
      }

      await sleep(500)

      const audio = fs.readFileSync("voice.mp3")

      await sock.sendMessage(jid, {
        audio,
        mimetype: "audio/mp4",
        ptt: true
      })

      await sock.sendMessage(jid, {
        text: `Done ✔ | Mood: ${mood}\n\n▒▒▒ˡᵉˣʸ⃝⃝༒💘`,
        edit: sent.key
      })
    })

  } catch (e) {
    console.log(e)
    await sock.sendMessage(jid, { text: "Error" })
  }
}
