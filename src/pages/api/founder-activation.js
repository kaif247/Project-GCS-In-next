import { addImperialFounder } from "../../utils/imperialFoundersStore";

const SOVEREIGN_AMOUNT = 1849;
const SUPPORTED_GATEWAYS = ["stripe_business", "daic_web3_verified"];
const stripeRefPattern = /^(cs|pi)_[A-Za-z0-9_]+$/;
const ethHashPattern = /^0x[a-fA-F0-9]{64}$/;
const walletPattern = /^0x[a-fA-F0-9]{40}$/;

function isTokenValid(req) {
  const requiredToken = process.env.FOUNDER_ACTIVATION_TOKEN;
  if (!requiredToken) return true;
  return req.headers["x-activation-token"] === requiredToken;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isTokenValid(req)) {
    return res.status(401).json({ error: "Activation authorization failed" });
  }

  const {
    name,
    email,
    tier,
    amountUSD,
    gateway,
    transactionRef,
    walletAddress,
  } = req.body || {};

  if (!name || !email || !tier || !gateway || !transactionRef) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (tier !== "Sovereign") {
    return res
      .status(400)
      .json({ error: "Founder activation is only available for Sovereign tier" });
  }

  if (Number(amountUSD) !== SOVEREIGN_AMOUNT) {
    return res.status(400).json({ error: "Amount must be exactly 1849 USD" });
  }

  if (!SUPPORTED_GATEWAYS.includes(gateway)) {
    return res.status(400).json({ error: "Unsupported high-security gateway" });
  }

  if (gateway === "stripe_business" && !stripeRefPattern.test(String(transactionRef))) {
    return res.status(400).json({
      error: "Invalid Stripe reference. Expected Checkout or Payment Intent reference.",
    });
  }

  if (gateway === "daic_web3_verified") {
    if (!ethHashPattern.test(String(transactionRef))) {
      return res.status(400).json({ error: "Invalid Web3 transaction hash" });
    }
    if (!walletPattern.test(String(walletAddress || ""))) {
      return res.status(400).json({ error: "Invalid verified wallet address" });
    }
  }

  try {
    const founder = await addImperialFounder({
      name: String(name).trim(),
      email: String(email).trim(),
      gateway,
      transactionRef: String(transactionRef).trim(),
      walletAddress: String(walletAddress || "").trim(),
      activatedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      ok: true,
      founder: {
        id: founder.id,
        name: founder.name,
        tier: founder.tier,
        gateway: founder.gateway,
        activatedAt: founder.activatedAt,
      },
      accessGranted: true,
    });
  } catch (error) {
    console.error("Founder activation error:", error);
    return res.status(500).json({ error: "Failed to verify founder activation" });
  }
}
