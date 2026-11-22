/** @typedef {{id: string, name: string, keywords: string, kind: "section" | "study" | "external" | "download" | "theme", target: string, disabledReason?: string}} PaletteCommand */
/** @type {PaletteCommand[]} */
export const paletteCommands = [
  {
    id: "projects",
    name: "Go to Projects",
    keywords: "work featured portfolio",
    kind: "section",
    target: "#projects",
  },
  {
    id: "experience",
    name: "Go to Experience",
    keywords: "career timeline roles",
    kind: "section",
    target: "#experience",
  },
  {
    id: "case-studies",
    name: "Go to Case Studies",
    keywords: "engineering architecture explorer",
    kind: "section",
    target: "#case-studies",
  },
  {
    id: "sneaky",
    name: "View Sneaky",
    keywords: "fashion recommendations full stack",
    kind: "study",
    target: "sneaky-platform",
  },
  {
    id: "plinko",
    name: "View Plinko Case Study",
    keywords: "real time websocket worker pipeline",
    kind: "study",
    target: "plinko-ui",
  },
  {
    id: "toast",
    name: "View Toast Architecture",
    keywords: "messages notifications pub sub playground",
    kind: "study",
    target: "toast-messages",
  },
  {
    id: "github",
    name: "Open GitHub",
    keywords: "code repositories source",
    kind: "external",
    target: "https://github.com/BINIT-Nayak",
  },
  {
    id: "linkedin",
    name: "Open LinkedIn",
    keywords: "social professional profile",
    kind: "external",
    target: "https://www.linkedin.com/in/binitnayak2002/",
  },
  {
    id: "resume",
    name: "Download Resume",
    keywords: "cv pdf",
    kind: "download",
    target: "/assests/Binit_s_Resume.pdf",
    disabledReason: "Resume PDF has not been provided yet.",
  },
  {
    id: "contact",
    name: "Contact Me",
    keywords: "email message hire",
    kind: "section",
    target: "#contact",
  },
  {
    id: "theme",
    name: "Toggle Theme",
    keywords: "dark light appearance mode",
    kind: "theme",
    target: "",
  },
];
/** @param {unknown} value @returns {string[]} */
export function validRecents(value) {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id) => typeof id === "string" && paletteCommands.some((command) => command.id === id)
          )
        ),
      ].slice(0, 5)
    : [];
}
/** @param {string[]} recent @param {string} id */
export const rememberCommand = (recent, id) => validRecents([id, ...recent]);
/** Ordered character matching rewards contiguous matches without requiring exact words.
 * @param {string} text @param {string} query */
function score(text, query) {
  const direct = text.indexOf(query);
  if (direct >= 0) return 1000 - direct;
  let cursor = 0;
  let previous = -1;
  let total = 0;
  for (const char of query) {
    const found = text.indexOf(char, cursor);
    if (found < 0) return -1;
    total += found === previous + 1 ? 8 : 2;
    total -= found - cursor;
    previous = found;
    cursor = found + 1;
  }
  return Math.max(0, total);
}
/** @param {string} query @param {string[]} recent @returns {PaletteCommand[]} */
export function searchCommands(query, recent = []) {
  const normalized = query.toLowerCase().trim().replace(/\s+/g, " ");
  const recents = validRecents(recent);
  if (!normalized)
    return [...paletteCommands].sort((a, b) => {
      const rank = (id) => (recents.includes(id) ? recents.indexOf(id) : recents.length);
      return rank(a.id) - rank(b.id);
    });
  return paletteCommands
    .map((command) => ({
      command,
      score: Math.max(
        score(command.name.toLowerCase(), normalized) * 2,
        score(command.keywords, normalized)
      ),
    }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.command);
}
