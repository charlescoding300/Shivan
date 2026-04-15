import fs from "fs"
import { exec } from "child_process"

export const name = "say"

export async function run(sock, m, args) {
    try {

        if (!args.length) {
            return sock.sendMessage(m.key.remoteJid, {
                text: "🗣️ Use: .say your text"
            })
        }

        const text = args.join(" ")

        // =========================
        // 🧠 AI EMOTION DETECTION
        // =========================
        function detectMood(t) {
            t = t.toLowerCase()

            const moods = {
                romantic: ["love","baby","kiss","hug","heart","sweet","darling","mine","forever","crush","wife","husband","romance","affection","adore","soulmate","miss you","want you","hold you","cute","beautiful","passion","together","cuddle","valentine","emotion","bond","care","trust","connection","my queen","my king","my world","my life","deep love","true love","real love","devotion","attachment","spark","attraction","feelings","warmth","heartbeat","obsession","soft love","endless love","sweetheart","baby girl","baby boy","love you","i need you","my everything","special one","always you","only you","romantic","love story","heartfelt","lovely","loving","romantic vibe","gentle love","deep feelings","emotional bond","love energy","romantic mood","sweet mood","pure love","lasting love","eternal love","romantic heart","soft heart","true feelings","love forever","deep affection","warm feelings","emotional love","heart connection","love emotion","romantic touch","sweet emotion","affectionate","lovable","love life","love energy strong","romantic soul","heart love","romantic tone","love voice","romantic words","love expression","soft romance","deep romance","romantic emotion"
                ],

                angry: ["angry","mad","hate","stupid","idiot","fool","trash","useless","annoying","rage","fight","attack","destroy","kill","burn","stupid","fake","liar","cheater","toxic","betray","shut up","go away","enough","worst","broken","error","bug","fail","loser","garbage","nonsense","disgusting","monster","evil","corrupt","waste","pain","frustrated","upset","storm","chaos","violence","attack","block","cancel","insult","enemy","conflict","argument","rageful","madness","explosion","temper","furious","annoyed","triggered","irritated","disrespect","mock","hate you","done with you","leave me","stop","crazy","wild anger","rage mode","mad energy","dark anger","anger inside","rage inside","boiling","explosive","anger burst","furious mood","mad reaction","rage emotion","anger emotion","aggressive","hostile","anger tone","mad tone","violent mood","hate emotion","rage voice","anger voice","mad voice","rageful energy","furious energy","anger vibes","mad vibes"
                ],

                hype: ["fire","energy","hype","win","victory","success","grind","focus","boss","legend","power","strong","rise","boost","unstoppable","beast","champion","level up","goal","dream","motivation","drive","fast","speed","action","elite","alpha","dominate","crush","push","hard","train","fight","powerful","win big","never stop","keep going","go hard","stay strong","super","hyper","electric","charged","boosted","next level","peak","maximum","limitless","unstoppable force","winning streak","big win","top","first","best","legendary","greatness","achievement","success energy","high energy","power mode","grind mode","focus mode","victory mode","champ mode","beast mode","energy mode","fire mode","power up","level up energy","strong mindset","winning mindset","growth","progress","upgrade","domination","take over","rise up","break limits","no limits","hard work","smart work","future","goals","dream big","believe","achieve","focus energy","hype energy","super energy","explosive energy","fast energy","high vibe","winning vibe"
                ],

                sad: ["sad","cry","hurt","pain","lonely","alone","broken","tears","miss","regret","sorry","lost","empty","hopeless","depressed","down","upset","weak","failure","dark","cold","hurt me","crying","suffering","grief","heartbroken","low","bad","unhappy","melancholy","sorrow","painful","broken heart","lost hope","no joy","no energy","tired","drained","abandoned","ignored","forgotten","hurt inside","cry alone","silent tears","deep pain","emotional pain","sad mood","sad heart","sad life","sad story","empty heart","empty soul","broken soul","crying inside","pain inside","deep sadness","mental pain","emotional hurt","lonely heart","lonely soul","lonely night","sad night","broken dreams","lost love","missing you","miss you so much","feel empty","feel low","no strength","give up","hopeless feeling","dark thoughts","sad emotion","cry emotion","hurt emotion","pain emotion","sad vibe","low vibe","dark vibe","broken vibe","tearful","cry voice","sad voice","hurt voice","pain voice","emotional sadness","deep sorrow","heavy heart","sad energy","broken energy","lost energy","cry energy"
                ]
            }

            for (const mood in moods) {
                if (moods[mood].some(w => t.includes(w))) {
                    return mood
                }
            }

            return "normal"
        }

        const mood = detectMood(text)

        const filename = `voice_${Date.now()}.mp3`
        const safeText = text.replace(/"/g, '\\"')

        exec(`python tts.py "${safeText}" ${mood} ${filename}`, async (err) => {
            if (err) {
                console.log(err)
                return sock.sendMessage(m.key.remoteJid, {
                    text: "❌ TTS error"
                })
            }

            if (!fs.existsSync(filename)) {
                return sock.sendMessage(m.key.remoteJid, {
                    text: "❌ Audio not generated"
                })
            }

            await sock.sendMessage(m.key.remoteJid, {
                audio: fs.readFileSync(filename),
                mimetype: "audio/mp4",
                ptt: true
            })

            fs.unlinkSync(filename)
        })

    } catch (e) {
        console.log(e)
    }
}
