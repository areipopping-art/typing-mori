import { loadData } from "./storage";

/**
 * 効果音（Web Audio API で その場で音を作る。音のファイルは使わない）
 * - ok：正しく打った（ピコッ）
 * - ng：まちがえた（ブブッ）
 * - word：ことばを1こ打ち終えた（ピロン）
 * - clear：ぜんぶ おわった（ファンファーレ）
 */
export type SoundKind = "ok" | "ng" | "word" | "clear";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** 1つの音を鳴らす（start と dur は秒） */
function tone(ac: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, vol: number) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + start;
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur); // だんだん小さく
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur);
}

export function playSound(kind: SoundKind) {
  if (!loadData().sound) return;
  const ac = audio();
  if (!ac) return;
  switch (kind) {
    case "ok":
      tone(ac, 1046, 0, 0.06, "triangle", 0.08);
      break;
    case "ng":
      // はじめて モードは やわらかい「ポン」、チャレンジ モードは「ブブッ」
      if (loadData().mode === "a") tone(ac, 392, 0, 0.15, "sine", 0.08);
      else tone(ac, 150, 0, 0.18, "square", 0.06);
      break;
    case "word":
      tone(ac, 784, 0, 0.08, "triangle", 0.1);
      tone(ac, 1175, 0.07, 0.12, "triangle", 0.1);
      break;
    case "clear":
      [523, 659, 784, 1046].forEach((f, i) => tone(ac, f, i * 0.12, i === 3 ? 0.5 : 0.14, "triangle", 0.12));
      break;
  }
}
