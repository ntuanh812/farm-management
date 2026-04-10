/**
 * Domain constants & helpers — field names map cleanly to MySQL (snake_case in DB).
 * Frontend uses camelCase.
 */

export const PigCategory = {
  SOW: "sow",
  BOAR: "boar",
  PIGLET: "piglet",
  FATTENING: "fattening",
};

export const categoryLabels = {
  [PigCategory.SOW]: "Lợn nái",
  [PigCategory.BOAR]: "Lợn đực",
  [PigCategory.PIGLET]: "Lợn con",
  [PigCategory.FATTENING]: "Lợn thịt",
};

/** Giai đoạn sinh sản (hiển thị) */
export const sowReproductiveLabels = [
  "Chờ phối",
  "Đã phối",
  "Đẻ con",
  "Cai sữa",
  "Sảy thai",
  "Bán loại",
  "Hậu bị",
];

export const LifecycleStatus = {
  ACTIVE: "active",
  SOLD: "sold",
  DEAD: "dead",
};

export const BreedingStatus = {
  READY: "ready",
  PREGNANT: "pregnant",
};

export const FatteningPhase = {
  RAISING: "raising",
  READY: "ready",
};

export function addDaysISO(isoDate, days) {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function barnLabel(barns, barnId) {
  const b = barns.find((x) => x.id === barnId);
  return b ? `${b.code} — ${b.name}` : "";
}

export function isoToDisplay(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function displayToISO(ddmmyyyy) {
  if (!ddmmyyyy) return null;
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}
