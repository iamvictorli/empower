import type { NextApiRequest, NextApiResponse } from "next";
import { registerPhoneNumber } from "@/datastore";

async function registerPost(req: NextApiRequest, res: NextApiResponse) {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: "Missing phone number" });
  }

  try {
    await registerPhoneNumber(phoneNumber);
    return res.status(200).json({ success: true });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).json({ error: e.message });
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return await registerPost(req, res);
  } else {
    // Handle any other HTTP method
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
