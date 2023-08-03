import { NextApiRequest, NextApiResponse } from 'next'
import detectCharacterEncoding from 'detect-character-encoding'
import fs from 'fs'
import path from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { Readable } from 'stream'
import { finished } from 'stream/promises'

export const config = {
  // runtime: 'edge',
}

const NEXT_PUBLIC_DATA_URL =
  process.env.NEXT_PUBLIC_DATA_URL ||
  'https://www.berlin.de/lb/psychiatrie/_assets/service/daten/datensatz_hilf-mir_berlin.csv'

const handler: (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> = async (_req, res) => {
  try {
    const response = await fetch(NEXT_PUBLIC_DATA_URL, {
      method: 'GET',
    })
    if (!response.ok) {
      res.status(500).json({
        message: `could not load data from "${NEXT_PUBLIC_DATA_URL}". Message is: ${await response.text()}`,
      })
    }

    res.status(200).json({
      success: true,
    })
  } catch (e: unknown) {
    console.error(e)
    if (e instanceof Error) {
      res.status(500).json({
        error: e.message,
      })
    }
    res.status(500).json({
      error: 'unknown error',
    })
  }
}

export default handler
