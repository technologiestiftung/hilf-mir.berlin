import { getGristTexts, TextsMapType } from '@lib/requests/getGristTexts'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<TextsMapType>
): Promise<void> {
  try {
    const data = await getGristTexts()
    res.status(200).json(data)
  } catch (error: unknown) {
    res.status(500).end((error as Error).message)
  }
}
