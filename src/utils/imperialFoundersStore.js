import fs from "fs/promises";
import path from "path";
import { generateFounderSerial } from "./founderSerial";

const foundersFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "imperialFounders.json"
);

let inMemoryFounders = [];

async function readFileFounders() {
  try {
    const raw = await fs.readFile(foundersFilePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return inMemoryFounders;
  }
}

async function writeFileFounders(founders) {
  inMemoryFounders = founders;
  try {
    await fs.mkdir(path.dirname(foundersFilePath), { recursive: true });
    await fs.writeFile(foundersFilePath, JSON.stringify(founders, null, 2), "utf8");
  } catch {
    // Fallback remains in-memory if filesystem write is unavailable.
  }
}

export async function getImperialFounders() {
  const founders = await readFileFounders();
  return founders.sort(
    (a, b) => new Date(b.activatedAt).getTime() - new Date(a.activatedAt).getTime()
  );
}

export async function addImperialFounder(payload) {
  const founders = await readFileFounders();
  const existing = founders.find((item) => item.transactionRef === payload.transactionRef);
  if (existing) return existing;

  const founder = {
    id: payload.id || generateFounderSerial(),
    name: payload.name,
    email: payload.email,
    tier: "Sovereign",
    gateway: payload.gateway,
    transactionRef: payload.transactionRef,
    walletAddress: payload.walletAddress || "",
    activatedAt: payload.activatedAt || new Date().toISOString(),
  };

  founders.push(founder);
  await writeFileFounders(founders);
  return founder;
}
