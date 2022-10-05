import fetch from 'node-fetch'

export async function getGristTableData<ResponseType = unknown>(
  docId: string,
  table: string
): Promise<ResponseType> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const response = (await fetch(
    `${
      process.env.NEXT_SECRET_GRIST_DOMAIN || ''
    }/api/docs/${docId}/tables/${table}/records`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_SECRET_GRIST_API_KEY || ''}`,
      },
    }
  )) as unknown as Response
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const data = (await response.json()) as ResponseType
  return data
}
