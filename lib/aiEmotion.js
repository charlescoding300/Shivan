import { EMO_WORDS } from "./words.js"

export function detectEmotion(text = "") {

  const t = text.toLowerCase()

  let score = {
    anger: 0,
    sad: 0,
    hype: 0,
    happy: 0,
    heartbreak: 0
  }

  for (const [emo, words] of Object.entries(EMO_WORDS)) {
    words.forEach(w => {
      if (t.includes(w)) score[emo]++
    })
  }

  if (t.includes("!!!")) score.hype += 1
  if (t.includes("...")) score.sad += 1

  let best = "normal"
  let max = 0

  for (const [k, v] of Object.entries(score)) {
    if (v > max) {
      max = v
      best = k
    }
  }

  return best
}
