const scenes = {
  everyday: "home",
  home: "home",
  travel: "bus",
  work: "work",
  interview: "work",
  shopping: "shop",
  food: "cafe",
  friends: "friends",
  feelings: "friends",
  learning: "work",
  phone: "friends",
  plans: "bus",
  tech: "work",
  help: "friends",
  health: "home",
  entertainment: "friends",
};
export const sceneFor = (id) => scenes[id] || "cafe";
export const typeNames = {
  sentence: "Câu giao tiếp",
  phrasal: "Phrasal verb",
  expression: "Cách nói tự nhiên",
};
