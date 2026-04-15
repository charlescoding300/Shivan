import fs from "fs"
import { exec } from "child_process"

export const name = "say"

export async function run(sock, m, args) {
    try {
        if (!args.length) {
            return sock.sendMessage(m.key.remoteJid, {
                text: "🗣️ Provide text to speak."
            })
        }

        const text = args.join(" ")

        function detectMood(text) {
            text = text.toLowerCase()

            const romantic = [ "love","baby","darling","sweetheart","honey","beautiful","handsome","kiss","hug","forever","mine","romance","passion","affection","adore","cherish","together","marry","wife","husband","girlfriend","boyfriend","crush","heart","soulmate","angel","cutie","sweet","princess","prince","my world","my life","need you","want you","hold you","cuddle","missing you","i miss you","obsessed","my everything","sunshine","moonlight","dream girl","dream boy","perfect","true love","eternal","bond","emotion","desire","longing","attraction","devotion","loyal","romantic night","date","flowers","roses","valentine","promise","future","warm","soft","gentle","care","protect you","sweet love","lovely","loving","kiss me","hug me","only you","deep love","connection","chemistry","spark","special one","intimate","falling for you","blush","affectionate","treasure","romantic vibes","sweet kiss","my queen","my king","romantic mood","my soul","heartbeat","deep feelings","forever yours","romantic energy","lovely eyes","sweet voice","my darling","endless love","my heart belongs","romantic touch","passionate love" ]

            const angry = [ "angry","mad","furious","rage","hate","stupid","idiot","trash","useless","annoying","irritating","fool","clown","loser","garbage","nonsense","fake","liar","cheater","toxic","betray","scam","fraud","disgusting","shut up","go away","enough","damn","worst","broken","attack","destroy","fight","burn","explode","temper","madness","triggered","insane","wild","problem","error","bug","cancel","block","worthless","pathetic","evil","monster","corrupt","waste","painful","terrible","frustrated","upset","storm","violence","chaos","threat","aggressive","horrible","offended","disrespect","insult","enemy","conflict","argument","resent","angry at you","stop it","leave me","tantrum","hostile","rough","break it","crash","smash","rage mode","heated","madness rising","anger rising","boiling","furious mood","shouting","screaming","temper loss","annoyed badly","frustration","rage inside","anger inside","mad energy","wild anger","fight mode","dark anger","aggression","intense anger","anger vibes","rageful tone","explosive anger","mad reaction","angry reaction" ]

            const hype = [ "hype","energy","fire","lit","crazy","power","beast","grind","focus","win","victory","success","level up","boss","unstoppable","champion","legend","warrior","rise","boost","dominate","strong","fearless","confidence","push","hardcore","beast mode","limitless","speed","charge","super","hyper","winning","never quit","drive","ambition","goal","dream big","hustle","motivation","inspire","alpha","powerful","maximum","peak","explosive","fast","intense","extreme","master","upgrade","elite","momentum","shock","game time","next level","ultimate","superstar","winning streak","break limits","strong mind","peak performance","crush it","mega","boost mode","high energy","strong vibes","champ mode","victory mode","big moves","top tier","greatness","hustle hard","rise up","never stop","go hard","super energy","domination","winning mood","grind mode","beast energy","hyped up","on fire","energy boost","go crazy","push harder","dream chaser","grind forever","mindset strong","focus mode","battle ready","winning vibes","champ vibes","victory vibes","legend vibes","power vibes" ]

            const sexy = [ "attractive","hot","fine","smooth","slow","soft lips","desire","chemistry","vibes","sensual","flirt","tease","tempt","alluring","magnetic","spark","charming","seductive","whisper","slow motion","close to me","warm touch","romantic mood","desirable","elegant","confident","body language","blush","eye contact","sweet smile","mysterious","midnight vibes","romantic tension","dreamy","intimate vibe","private moment","gentle touch","romantic whisper","slow dance","close embrace","heart race","sensual vibe","temptation","passionate look","private vibe","hot vibe","romantic desire","deep connection","emotional chemistry","electric vibe","romantic energy","irresistible","strong attraction","sweet tension","heat","warm energy","midnight energy","romantic spark","deep attraction","seductive tone","softly spoken","intense eyes","magnetic vibe","slow vibes","sweet temptation","private vibes","romantic heat","gentle passion","slow romance","intimate energy","close energy","desire vibe","attraction vibe","romantic closeness","sensual energy","allure","magnetism","romantic feeling","warm romance","romantic closeness","intense connection","romantic vibe strong","slow energy","gentle vibe","sweet attraction","deep romance","intense romance","romantic aura","soft romance","slow whisper","sweet energy","romantic spark strong","midnight romance","deep emotional attraction" ]

            const calm = [ "calm","relax","peace","peaceful","breathe","soft","gentle","quiet","still","chill","cool","comfort","safe","steady","rest","easy","slow","mindful","balance","breeze","light","smooth","nature","serene","soothing","tranquil","clarity","zen","harmony","sunset","sunrise","deep breath","silent","mellow","steady heart","calm vibes","soft energy","grounded","ease","flow","centered","relaxed state","warm calm","soft silence","cool breeze","light heart","healing","comfort zone","inner peace","relief","light mood","no stress","smooth vibes","soft feeling","calm down","gentle flow","easy mind","stillness","clear mind","serenity","balance life","soft life","peaceful night","relaxed mood","gentle tone","steady rhythm","calm spirit","relaxed energy","soft night","safe place","gentle peace","light breeze","quiet energy","soft calm","calm thoughts","relaxed mind","peaceful vibe","soft relaxation","gentle balance","calm life","slow rhythm","steady peace","comfort vibe","light peace","calm aura","easy breathing","calm presence","gentle presence","soft harmony","relaxation mode","inner calm","outer peace","calm inside","peaceful inside","calm outside","gentle outside" ]

            const dramatic = [ "dramatic","revenge","dark","fear","danger","night","shadow","mystery","intense","epic","legendary","tragic","battle","storm","chaos","fate","destiny","twist","plot twist","suspense","tension","climax","crisis","villain","hero","final battle","dark night","dramatic pause","serious","heavy","grand","theatrical","impact","cinematic","scene","epic moment","dramatic entrance","spotlight","mysterious tone","legend","epic energy","dark mood","tragic story","big moment","storm coming","dark energy","battle mode","danger zone","fearless night","epic speech","grand finale","shadow vibe","cinema mode","ominous","deep tension","serious vibe","intense moment","dark scene","dramatic energy","intense voice","power speech","dramatic vibe","final showdown","mystic","shadow mode","danger rising","epic battle","dark tension","epic vibe","legendary moment","serious tone","deep impact","mysterious energy","dark presence","dramatic speech","cinematic tone","storm rising","dramatic aura","intense aura","epic rise","dark rise","tragic fall","epic fall","dramatic twist","dark climax","shadow energy","dramatic force","epic power","dramatic power","legend rise","legend fall","dramatic legend","dark legend","mysterious legend","intense legend" ]

            const sad = [ "sad","cry","tears","hurt","pain","broken","alone","lonely","heartbroken","miss you","missing","regret","sorry","depressed","down","upset","lost","empty","darkness","grief","mourning","weak","tired","crying","sadness","bad day","hurt inside","broken heart","low mood","feeling low","blue","melancholy","sorrow","unhappy","disappointed","bad feeling","painful","cold heart","lost love","cry alone","tears falling","sad night","deep pain","emotional pain","sad story","heart pain","lonely night","feeling empty","low energy","no hope","hopeless","crying alone","dark thoughts","hurt feelings","sad vibes","heavy heart","bad memory","lost hope","sad mood","deep sadness","inner pain","hurt badly","emotional hurt","lost soul","sad inside","cry inside","deep cry","lonely vibes","broken dreams","regret it","sorry for everything","hurt me","pain inside","tears inside","cry softly","sad energy","deep loneliness","lost forever","sad heart","painful memory","crying heart","lonely soul","broken feelings","dark sadness","sad reaction","hurt reaction","deep regret","sad regret","cry tonight","lonely tonight","broken tonight","deep hurt","heavy sadness","lost connection","emotional tears","crying vibes","sad presence","deep sorrow","heart in pain","tears of pain","painful heart" ]

            if (romantic.some(w => text.includes(w))) return "romantic"
            if (angry.some(w => text.includes(w))) return "angry"
            if (hype.some(w => text.includes(w))) return "hype"
            if (sexy.some(w => text.includes(w))) return "sexy"
            if (calm.some(w => text.includes(w))) return "calm"
            if (dramatic.some(w => text.includes(w))) return "dramatic"
            if (sad.some(w => text.includes(w))) return "sad"

            return "normal"
        }

        const mood = detectMood(text)
        const filename = `voice_${Date.now()}.mp3`

        const safeText = text.replace(/"/g, '\\"')

        exec(`python3 tts.py "${safeText}" ${mood} ${filename}`, async (err) => {
            if (err) return console.log(err)

            if (!fs.existsSync(filename)) {
                return sock.sendMessage(m.key.remoteJid, { text: "TTS failed." })
            }

            await sock.sendMessage(m.key.remoteJid, {
                audio: fs.readFileSync(filename),
                mimetype: "audio/mpeg",
                ptt: true
            })

            fs.unlinkSync(filename)
        })

    } catch (e) {
        console.log(e)
    }
}
