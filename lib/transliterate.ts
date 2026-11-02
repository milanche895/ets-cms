import type { SiteScript } from "@/lib/site-script";

const TO_LATIN: Record<string, string> = {
  А: "A", а: "a", Б: "B", б: "b", В: "V", в: "v", Г: "G", г: "g", Д: "D", д: "d",
  Ђ: "Đ", ђ: "đ", Е: "E", е: "e", Ж: "Ž", ж: "ž", З: "Z", з: "z", И: "I", и: "i",
  Ј: "J", ј: "j", К: "K", к: "k", Л: "L", л: "l", Љ: "Lj", љ: "lj", М: "M", м: "m",
  Н: "N", н: "n", Њ: "Nj", њ: "nj", О: "O", о: "o", П: "P", п: "p", Р: "R", р: "r",
  С: "S", с: "s", Т: "T", т: "t", Ћ: "Ć", ћ: "ć", У: "U", у: "u", Ф: "F", ф: "f",
  Х: "H", х: "h", Ц: "C", ц: "c", Ч: "Č", ч: "č", Џ: "Dž", џ: "dž", Ш: "Š", ш: "š",
};

const CYRILLIC = /[А-Яа-яЂ-џ]/;

function isUpperCyrillic(char: string) {
  return /[А-ЯЂЈЉЊЋЏ]/.test(char);
}

/** Ћирилица остаје извор. Латиница се добија пресловљавањем. */
export function toLatin(value: string): string {
  const chars = Array.from(value);
  let result = "";

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    const next = chars[index + 1];

    if ((char === "Љ" || char === "Њ" || char === "Џ") && next && isUpperCyrillic(next)) {
      result += char === "Љ" ? "LJ" : char === "Њ" ? "NJ" : "DŽ";
      continue;
    }

    result += TO_LATIN[char] ?? char;
  }

  return result;
}

export function hasCyrillic(value: string) {
  return CYRILLIC.test(value);
}

export function applyScript(value: string, script: SiteScript) {
  return script === "lat" ? toLatin(value) : value;
}

/** Упоређује ћирилицу, латиницу и унос без квачица. */
export function normalizeForSearch(value: string) {
  return toLatin(value)
    .toLocaleLowerCase("sr-Latn")
    .replaceAll("dž", "dz")
    .replaceAll("đ", "dj")
    .replaceAll("ž", "z")
    .replaceAll("č", "c")
    .replaceAll("ć", "c")
    .replaceAll("š", "s");
}
