import fs from "fs"
import { exec } from "child_process"

export const name = "say"

const sleep = (ms) => new Promise(res => setTimeout(res, ms))

// =========================
// 🎭 MOOD DETECTION (EXPANDED 100+ EACH)
// =========================
function detectMood(text) {

  const t = text.toLowerCase()

  // 😡 ANGRY (100+ expanded)
  const angry = [
    "hate","angry","mad","stupid","idiot","dumb","trash","useless","annoying","kill",
    "fight","rage","burn","destroy","attack","shut","fool","clown","worst","fake",
    "fuck","screw","piss","broken","wrong","leave","go away","stop","enough","loser",
    "monster","evil","snake","toxic","betray","hurt","damage","curse","fail","failure",
    "trash talk","irritate","annoyed","furious","insane","rage mode","useless bot",
    "stupid bot","idiot bot","garbage","junk","scam","fraud","nonsense","rubbish",
    "waste","problem","error","bug","lag","delay","broken system","shutdown","cancel",
    "block you","leave me","shut up","no sense","don't talk","idiotic","crazy talk",
    "disgusting","awful","terrible","ruined","bad","mess","mad at you","so angry",
    "very angry","hate this","pissed","furious again","rage quit","explode","collapse"
  ]

  // 😢 SAD (100+ expanded)
  const sad = [
    "sad","cry","miss","lonely","alone","hurt","pain","broken","depressed","sorry",
    "regret","lost","empty","hopeless","tears","crying","bad","abandoned","ignored",
    "help me","broken heart","suffering","anxiety","stress","drained","nobody",
    "miss you","i need you","why me","down","empty inside","lost hope","give up",
    "broken soul","pain inside","depression","heart pain","lost everything","hurt deeply",
    "silent pain","deep sadness","crying inside","empty heart","no future","too much pain",
    "no meaning","dark life","crying soul","broken dreams","lost hope again","i'm tired",
    "no energy","alone forever","life hurts","grief","heartbroken","lost love","broken trust",
    "emotional pain","sad life","very sad","so sad","painful life","cry again","tears fall",
    "broken mind","lost purpose","feeling empty","no hope left","life is hard","deep hurt"
  ]

  // ❤️ ROMANTIC (100+ expanded)
  const love = [
    "love","baby","babe","kiss","heart","sweet","romantic","wife","husband","girlfriend",
    "boyfriend","honey","sweetheart","crush","adore","miss you","forever","together",
    "hug","cuddle","beautiful","mine","marry","relationship","affection","passion",
    "angel","dream","lover","i love you","love you","bae","dear","baby girl","baby boy",
    "my love","true love","forever yours","always yours","my queen","my king","soulmate",
    "need you","want you","hold you","kiss you","my life","my world","my heart","deep love",
    "pure love","eternal love","forever love","romantic mood","loving you","soft love",
    "true feelings","passionate love","baby love","romantic heart","endless love",
    "beautiful love","sweet love","real love","deep emotions","love forever","cutie",
    "darling","sunshine","moonlight","angel eyes","heartbeat","true romance","affectionate",
    "loving heart","pure heart","beloved","my everything","only you","special one"
  ]

  if (angry.some(w => t.includes(w))) return "angry"
  if (sad.some(w => t.includes(w))) return "sad"
  if (love.some(w => t.includes(w))) return "romantic"

  return "normal"
}

// =========================
// 🔊 SOX FX
// =========================
function getFX(mode) {
  switch (mode) {

    case "angry":
      return "pitch -6 tempo 1.05 bass +6 reverb 2"

    case "sad":
      return "pitch -4 tempo 0.80 reverb 10 echo 0.6 0.8 40 0.3"

    case "romantic":
      return "pitch -1 tempo 0.90 reverb 12 echo 0.8 0.9 60 0.4"

    default:
      return "pitch -2 tempo 0.95 reverb 6"
  }
}

// =========================
// ⚡ MAIN COMMAND
// =========================
export async function run(sock, msg, args) {

  const jid = msg.key.remoteJid
  const text = args.join(" ")

  if (!text) {
    return sock.sendMessage(jid, {
      text: "Use: .say I love you"
    })
  }

  try {

    const mood = detectMood(text)
    const fx = getFX(mood)

    const sent = await sock.sendMessage(jid, {
      text: "Processing..."
    })

    await sleep(400)

    await sock.sendMessage(jid, {
      text: `Mood: ${mood}`,
      edit: sent.key
    })

    exec(`python tts.py "${text.replace(/"/g, '')}"`, (err) => {

      if (err) {
        return sock.sendMessage(jid, {
          text: "Voice error",
          edit: sent.key
        })
      }

      playAudio()
    })

    async function playAudio() {

      await sleep(400)

      await sock.sendMessage(jid, {
        text: "Generating audio...",
        edit: sent.key
      })

      exec(`sox voice.mp3 voice_fx.mp3 ${fx}`, async (err) => {

        if (err) {
          return sock.sendMessage(jid, {
            text: "Audio error",
            edit: sent.key
          })
        }

        const audio = fs.readFileSync("voice_fx.mp3")

        await sock.sendMessage(jid, {
          audio,
          mimetype: "audio/mp4",
          ptt: true
        })

        await sock.sendMessage(jid, {
          text: `
Done ✔
Mode: ${mood}

▒▒▒ˡᵉˣʸ⃝⃝༒💘
`,
          edit: sent.key
        })
      })
    }

  } catch (e) {

    console.log(e)

    await sock.sendMessage(jid, {
      text: "Error"
    })
  }
}
