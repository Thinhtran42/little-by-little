const scenes = {
  everyday: "home",
  home: "home",
  travel: "hotel",
  work: "work",
  interview: "interview",
  shopping: "shop",
  food: "cafe",
  friends: "friends",
  feelings: "feelings",
  learning: "learning",
  phone: "phone",
  plans: "plans",
  tech: "tech",
  help: "help",
  health: "health",
  entertainment: "entertainment",
};
export const sceneFor = (id) => scenes[id] || "cafe";
export const typeNames = {
  sentence: "Câu giao tiếp",
  phrasal: "Phrasal verb",
  expression: "Cách nói tự nhiên",
};
