export function normalizeAnswer(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\bcan't\b/g, "cannot")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bshan't\b/g, "shall not")
    .replace(/n't\b/g, " not")
    .replace(/\bi'm\b/g, "i am")
    .replace(/\blet's\b/g, "let us")
    .replace(/\b(you|we|they)'re\b/g, "$1 are")
    .replace(/\b(i|you|we|they)'ve\b/g, "$1 have")
    .replace(/\b(i|you|he|she|it|we|they)'ll\b/g, "$1 will")
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function checkAnswer(input, expected, alternatives = []) {
  const actual = normalizeAnswer(input);
  return (
    !!actual &&
    [expected, ...alternatives].some((x) => normalizeAnswer(x) === actual)
  );
}
export function wordDiff(input, expected) {
  const entered = normalizeAnswer(input).split(" "),
    target = normalizeAnswer(expected).split(" ");
  return target.map((word, i) => ({ word, match: word === entered[i] }));
}
export function choiceOptions(phrase, all) {
  const candidates = all.filter(
    (p) => p.id !== phrase.id && p.topic === phrase.topic && p.vi !== phrase.vi,
  );
  const salt = [...phrase.id].reduce((s, c) => s + c.charCodeAt(0), 0),
    offset = salt % Math.max(1, candidates.length);
  const result = [
    ...candidates.slice(offset),
    ...candidates.slice(0, offset),
  ].slice(0, 3);
  result.splice(salt % 4, 0, phrase);
  return result;
}
