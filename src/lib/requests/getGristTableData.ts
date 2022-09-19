export async function getGristTableData<ResponseType = unknown>(
  docId: string,
  table: string
): Promise<ResponseType> {
  const response = await fetch(
    `${
      process.env.NEXT_SECRET_GRIST_DOMAIN || ''
    }/api/docs/${docId}/tables/${table}/records`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_SECRET_GRIST_API_KEY || ''}`,
      },
    }
  )
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const data = (await response.json()) as ResponseType
  return data
}
