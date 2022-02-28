import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  // NOTE: the need for manual JSON encoding of the filters is annoying: {"e-bez": ["Mitte"]}
  // NOTE: It's not exactly clear what is the tableId. I managed to find it through trial and error.
  fetch(
    `${process.env.NEXT_SECRET_GRIST_DOMAIN}/api/docs/33F9uWYkjdaz/tables/Kindertagesstatten/records?limit=100`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_SECRET_GRIST_API_KEY}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => res.status(200).json(response));
}
