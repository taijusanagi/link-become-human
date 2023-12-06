import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const address = req.query.address;
  const url = "https://api.scorer.gitcoin.co/registry/submit-passport";
  const apiKey = process.env.GITCOIN_PASSPORT_API;
  const data = {
    address: address,
    scorer_id: "6149",
  };
  const { score } = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    } as any,
  }).then((response) => response.json());
  const humanityScore = score;
  res.status(200).send(humanityScore);
}
