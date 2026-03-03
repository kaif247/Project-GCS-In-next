import { getImperialFounders } from "../../utils/imperialFoundersStore";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const founders = await getImperialFounders();
    const wall = founders.map((founder) => ({
      id: founder.id,
      name: founder.name,
      tier: founder.tier,
      gateway: founder.gateway,
      activatedAt: founder.activatedAt,
    }));
    return res.status(200).json({ founders: wall });
  } catch (error) {
    console.error("Imperial founders fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch founders wall" });
  }
}
