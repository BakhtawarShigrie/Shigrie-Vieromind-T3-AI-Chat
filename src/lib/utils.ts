export function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function normalizeTo50_60Words(input: string) {
  const min = 50;
  const max = 60;
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length >= min && words.length <= max) return input.trim();
  if (words.length > max) {
    return words.slice(0, max).join(" ") + "...";
  }
  const fillerBase = "Also, consider the practical steps and supportive strategies that align with this perspective.";
  let resultWords = [...words];
  const fillerWords = fillerBase.split(/\s+/);
  let idx = 0;
  while (resultWords.length < min) {
    resultWords = resultWords.concat(fillerWords.slice(idx, idx + (min - resultWords.length)));
    idx = (idx + (min - resultWords.length)) % fillerWords.length;
    if (idx === 0) break;
  }
  return resultWords.slice(0, min).join(" ");
}

export const speedOptions = [
    { label: "0.5x", delay: 12000 },
    { label: "0.75x", delay: 9000 },
    { label: "1x", delay: 7000 },
    { label: "1.5x", delay: 5000 },
    { label: "2x", delay: 3000 },
];