import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  // NOTE: the need for manual JSON encoding of the filters is annoying: {"e-bez": ["Mitte"]}
  // NOTE: It's not exactly clear what is the tableId. I managed to find it through trial and error.

  try {
    const response = await fetch(
      `${process.env.NEXT_SECRET_GRIST_DOMAIN}/api/docs/33F9uWYkjdaz/tables/Kindertagesstatten/records`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_SECRET_GRIST_API_KEY}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: unknown) {
    // @ts-ignore
    return res.status(error.status || 500).end(error.message);
  }
}
