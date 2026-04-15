import fs from "fs"
import { exec } from "child_process"

export async function run(sock, msg, args) {

  const jid = msg.key.remoteJid
  const text = args.join(" ")

  if (!text) {
    return sock.sendMessage(jid, { text: "Use: .say hello" })
  }

  // =========================
  // 🧠 FULL EMOTION SYSTEM (300+ WORD STYLE INLINE)
  // =========================
  const EMO = {
    angry: [
      "angry","mad","furious","rage","hate","stupid","idiot","trash","fight",
      "attack","curse","fail","worst","evil","toxic","scam","fraud","nonsense",
      "clown","monster","shut up","go away","destroy","burn","annoyed","pissed"
    ],

    sad: [
      "sad","cry","lonely","alone","hurt","pain","broken","depressed","hopeless",
      "empty","lost","stress","grief","miss","abandoned","ignored","tired",
      "broken heart","no hope","darkness","dead inside","failure","down","trauma"
    ],

    hype: [
      "fire","lit","wow","legend","goat","boss","win","epic","crazy","insane",
      "amazing","best","power","energy","boost","hyped","strong","boom","rise",
      "king","queen","top","massive","success","victory","unstoppable","grind"
    ],

    happy: [
      "happy","joy","smile","laugh","excited","good","great","nice","cool","fun",
      "peace","calm","blessed","thankful","love life","positive","good vibes",
      "grateful","fresh","bright","relaxed","enjoy","smiling"
    ],

    heartbreak: [
      "heartbreak","broken heart","dumped","breakup","cheated","betrayed",
      "lost love","miss you","still love","never again","used me","left me",
      "fake love","love loss","hurt love","love ended","goodbye","cry for you"
    ]
  }

  // =========================
  // 🧠 AI EMOTION DETECTOR
  // =========================
  let scores = {
    angry: 0,
    sad: 0,
    hype: 0,
    happy: 0,
    heartbreak: 0
  }

  const t = text.toLowerCase()

  for (const [emo, words] of Object.entries(EMO)) {
    words.forEach(w => {
      if (t.includes(w)) scores[emo]++
    })
  }

  if (t.includes("!!!")) scores.hype += 2
  if (t.includes("...")) scores.sad += 2
  if (t.length > 80) scores.heartbreak += 1

  let emotion = "normal"
  let max = 0

  for (const [k, v] of Object.entries(scores)) {
    if (v > max) {
      max = v
      emotion = k
    }
  }

  // =========================
  // 🎙 GENERATE VOICE
  // =========================
  await sock.sendMessage(jid, {
    text: `🎙 AI Voice generating...\nEmotion: ${emotion}`
  })

  try {

    const file = await new Promise((resolve, reject) => {
      exec(`python3 tts.py "${text}" ${emotion}`, (err, stdout) => {
        if (err) return reject(err)
        resolve(stdout.trim())
      })
    })

    const audio = fs.readFileSync(file)

    await sock.sendMessage(jid, {
      audio,
      mimetype: "audio/mp4",
      ptt: true
    })

    fs.unlinkSync(file)

  } catch (e) {
    console.log(e)
    sock.sendMessage(jid, { text: "❌ Voice failed" })
  }
}
