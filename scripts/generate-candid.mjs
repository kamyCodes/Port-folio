import sharp from "sharp";
import fs from "fs";
import path from "path";

// ---- Palette (sampled from the real app: ink sidebar #171a1f, copper accent #b4531f, paper bg #f5f6f8)
const INK = "#171a1f";
const INK_SOFT = "#2a2e35";
const PAPER = "#f5f6f8";
const COLUMN_BG = "#e9ebee";
const CARD = "#ffffff";
const COPPER = "#b4531f";
const COPPER_SOFT = "#f4ebe4";
const TEXT = "#23272e";
const MUTED = "#6b7280";
const BORDER = "#e2e5e9";
const STAR_ON = "#b4531f";
const STAR_OFF = "#d9dce1";

const W = 1536;
const H = 864;
const HEADER_H = 64;
const SIDEBAR_W = 208;

const STAGES = [
  { name: "Applied", color: "#64748b", candidates: 4 },
  { name: "Screen", color: "#d97706", candidates: 3 },
  { name: "Interview", color: "#7c3aed", candidates: 2 },
  { name: "Offer", color: "#059669", candidates: 1 },
  { name: "Hired", color: "#0d9488", candidates: 2 },
  { name: "Rejected", color: "#dc2626", candidates: 2 },
];

const AVATAR_COLORS = [
  "#8a5a3b", "#4a5568", "#3b5c4a", "#5b4a6e", "#a34a2f",
  "#3f5f6e", "#7a4a6b", "#4c6b3f", "#6b4a4a", "#446a7a",
];

const CANDIDATES = [
  // Applied
  { stage: 0, name: "Chidera Okafor", role: "Product Designer", stars: 4, tag: "Figma", note: "Strong portfolio" },
  { stage: 0, name: "Tunde Bakare", role: "Backend Engineer", stars: 5, tag: "Python", note: "Good fit, reach out" },
  { stage: 0, name: "Amara Nwosu", role: "Data Analyst", stars: 3, tag: "SQL", note: "Applied via referral" },
  { stage: 0, name: "Ibrahim Suleiman", role: "DevOps Engineer", stars: 4, tag: "AWS" },
  // Screen
  { stage: 1, name: "Funke Adeyemi", role: "Frontend Developer", stars: 4, tag: "React" },
  { stage: 1, name: "Emeka Obi", role: "Mobile Developer", stars: 5, tag: "Expo", note: "Screens Thu 14:00" },
  { stage: 1, name: "Zainab Bello", role: "QA Engineer", stars: 3, tag: "Playwright" },
  // Interview
  { stage: 2, name: "Kelechi Umeh", role: "AI Engineer", stars: 5, tag: "PyTorch", note: "Interview Fri 10:00" },
  { stage: 2, name: "Ngozi Eze", role: "Product Manager", stars: 4, tag: "Strategy" },
  // Offer
  { stage: 3, name: "Segun Alabi", role: "Security Engineer", stars: 5, tag: "Offer sent" },
  // Hired
  { stage: 4, name: "Blessing Etim", role: "UI Designer", stars: 5, tag: "Started Mon" },
  { stage: 4, name: "Yusuf Musa", role: "Cloud Engineer", stars: 4, tag: "AWS" },
  // Rejected
  { stage: 5, name: "Ada Obi", role: "Data Engineer", stars: 2, tag: "No reply", rejected: true },
  { stage: 5, name: "Tolu Akande", role: "Growth Marketer", stars: 3, tag: "Not a fit", rejected: true },
];

const FONT = "Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

let avatarIdx = 0;

function stars(x, y, count) {
  let out = "";
  for (let i = 0; i < 5; i++) {
    const c = i < count ? STAR_ON : STAR_OFF;
    out += `<text x="${x + i * 15}" y="${y}" font-size="12" fill="${c}" font-family="${FONT}">★</text>`;
  }
  return out;
}

function card(x, y, w, c) {
  const av = AVATAR_COLORS[avatarIdx++ % AVATAR_COLORS.length];
  const rejected = c.rejected ? " opacity=\"0.55\"" : "";
  const noteY = y + 88;

  return `
  <g${rejected}>
    <rect x="${x}" y="${y}" width="${w}" height="${c.note ? 112 : 100}" rx="10" fill="${CARD}" filter="url(#shadow)"/>
    <circle cx="${x + 24}" cy="${y + 24}" r="16" fill="${rejected ? "#9ca3af" : av}"/>
    <text x="${x + 24}" y="${y + 29}" text-anchor="middle" font-size="12" font-weight="600" fill="#ffffff" font-family="${FONT}">${initials(c.name)}</text>
    <text x="${x + 48}" y="${y + 20}" font-size="13" font-weight="600" fill="${TEXT}" font-family="${FONT}">${c.name}</text>
    <text x="${x + 48}" y="${y + 36}" font-size="12" fill="${MUTED}" font-family="${FONT}">${c.role}</text>
    ${stars(x + 48, y + 54, c.stars)}
    <rect x="${x + 12}" y="${y + 66}" width="${10 + c.tag.length * 6.6}" height="20" rx="10" fill="${COPPER_SOFT}"/>
    <text x="${x + 12 + 5 + c.tag.length * 3.3}" y="${y + 80}" text-anchor="middle" font-size="11" font-weight="600" fill="${COPPER}" font-family="${FONT}">${c.tag}</text>
    ${c.note ? `<text x="${x + 12}" y="${noteY}" font-size="11.5" fill="${MUTED}" font-family="${FONT}">${c.note}</text>` : ""}
  </g>`;
}

function build() {
  const parts = [];

  // ---- Top header (white)
  parts.push(`<rect x="0" y="0" width="${W}" height="${HEADER_H}" fill="#ffffff"/>
  <rect x="0" y="${HEADER_H - 1}" width="${W}" height="1" fill="${BORDER}"/>
  <rect x="24" y="18" width="28" height="28" rx="8" fill="${INK}"/>
  <g stroke="${COPPER}" stroke-width="3.2" stroke-linecap="round" fill="none">
    <path d="M32 23v18"/><path d="M34.5 32 41 23.5"/><path d="M34.5 32 41 40.5"/>
  </g>
  <text x="62" y="36" font-size="17" font-weight="700" fill="${INK}" font-family="${FONT}">Candid</text>
  <text x="122" y="36" font-size="12" fill="${MUTED}" font-family="${FONT}">local hiring pipeline</text>`);

  // Search box
  const sbx = W - 420;
  parts.push(`<rect x="${sbx}" y="15" width="260" height="34" rx="17" fill="#eef0f2"/>
  <circle cx="${sbx + 24}" cy="32" r="5.5" fill="none" stroke="${MUTED}" stroke-width="1.8"/>
  <path d="M${sbx + 28.5} 36.5 l5 5" stroke="${MUTED}" stroke-width="1.8" stroke-linecap="round"/>
  <text x="${sbx + 42}" y="36" font-size="12.5" fill="#9aa1ab" font-family="${FONT}">Search candidates…</text>`);

  // Add candidate button
  parts.push(`<rect x="${W - 140}" y="15" width="116" height="34" rx="8" fill="${COPPER}"/>
  <path d="M${W - 122} 32 h14 M${W - 115} 25 v14" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <text x="${W - 98}" y="36" text-anchor="middle" font-size="12.5" font-weight="600" fill="#ffffff" font-family="${FONT}">Add candidate</text>`);

  // ---- Sidebar (ink)
  parts.push(`<rect x="0" y="${HEADER_H}" width="${SIDEBAR_W}" height="${H - HEADER_H}" fill="${INK}"/>
  <text x="20" y="${HEADER_H + 40}" font-size="11" font-weight="600" letter-spacing="1" fill="#6f7680" font-family="${FONT}">PIPELINE</text>
  <rect x="12" y="${HEADER_H + 56}" width="184" height="38" rx="9" fill="${INK_SOFT}"/>
  <rect x="20" y="${HEADER_H + 69}" width="12" height="12" rx="3" fill="none" stroke="${COPPER}" stroke-width="2"/>
  <rect x="24" y="${HEADER_H + 73}" width="4" height="4" fill="${COPPER}"/>
  <text x="44" y="${HEADER_H + 79}" font-size="13.5" font-weight="600" fill="#ffffff" font-family="${FONT}">Board</text>
  <rect x="20" y="${HEADER_H + 107}" width="12" height="12" rx="2" fill="none" stroke="#6f7680" stroke-width="2"/>
  <text x="44" y="${HEADER_H + 117}" font-size="13.5" fill="#aab1ba" font-family="${FONT}">Table</text>
  <rect x="12" y="${HEADER_H + 152}" width="184" height="1" fill="#262a31"/>
  <rect x="20" y="${HEADER_H + 178}" width="14" height="14" fill="none" stroke="#6f7680" stroke-width="2"/>
  <text x="44" y="${HEADER_H + 189}" font-size="13.5" fill="#aab1ba" font-family="${FONT}">Settings</text>
  <g>
    <circle cx="20" cy="${H - 46}" r="14" fill="#8a5a3b"/>
    <text x="20" y="${H - 41}" text-anchor="middle" font-size="11" font-weight="600" fill="#ffffff" font-family="${FONT}">KE</text>
    <text x="42" y="${H - 50}" font-size="12.5" font-weight="600" fill="#e8eaee" font-family="${FONT}">Kamy Ewang</text>
    <text x="42" y="${H - 36}" font-size="11" fill="#6f7680" font-family="${FONT}">Stored in this browser</text>
  </g>`);

  // ---- Kanban board
  const boardX = SIDEBAR_W + 24;
  const boardW = W - SIDEBAR_W - 48;
  const gap = 16;
  const colW = (boardW - gap * (STAGES.length - 1)) / STAGES.length;
  const colTop = HEADER_H + 24;
  const colH = H - HEADER_H - 48;

  parts.push(`<rect x="${SIDEBAR_W}" y="${HEADER_H}" width="${W - SIDEBAR_W}" height="${H - HEADER_H}" fill="${PAPER}"/>`);

  STAGES.forEach((stage, i) => {
    const x = boardX + i * (colW + gap);
    const cands = CANDIDATES.filter((c) => c.stage === i);
    parts.push(`
    <rect x="${x}" y="${colTop}" width="${colW}" height="${colH}" rx="12" fill="${COLUMN_BG}"/>
    <circle cx="${x + 16}" cy="${colTop + 26}" r="4.5" fill="${stage.color}"/>
    <text x="${x + 30}" y="${colTop + 30}" font-size="13" font-weight="600" fill="${TEXT}" font-family="${FONT}">${stage.name}</text>
    <rect x="${x + colW - 42}" y="${colTop + 14}" width="28" height="22" rx="11" fill="#ffffff"/>
    <text x="${x + colW - 28}" y="${colTop + 30}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${MUTED}" font-family="${FONT}">${cands.length}</text>`);

    cands.forEach((c, j) => {
      const y = colTop + 50 + j * 128;
      parts.push(card(x + 10, y, colW - 20, c));
    });

    parts.push(`
    <text x="${x + colW / 2}" y="${colTop + colH - 18}" text-anchor="middle" font-size="12" fill="${MUTED}" font-family="${FONT}">+ Add candidate</text>`);
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#171a1f" flood-opacity="0.07"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  ${parts.join("\n")}
</svg>`;
}

const svg = build();
const out = path.resolve("public/resources/candid/candid-board.png");
await sharp(Buffer.from(svg)).resize(W, H).png({ compressionLevel: 9 }).toFile(out);
fs.writeFileSync(path.resolve("scripts/candid-mockup.svg"), svg);
console.log(`Wrote ${out} (${W}x${H})`);