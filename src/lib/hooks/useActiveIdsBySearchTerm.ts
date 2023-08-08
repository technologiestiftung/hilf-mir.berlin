import { TableRowType } from '@common/types/gristData'
import {
  urlSearchCategoriesToStateSearchCategories,
  useUrlState,
} from '@lib/UrlStateContext'
import { PageQueryType } from '@lib/mapRawQueryToState'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

interface SearchResult {
  result?: TableRowType[]
  error?: string
  params: Record<string, string>
}

interface UseActiveIdsBySearchTermReturnType {
  ids: MinimalRecordType['id'][] | null
  isLoading: boolean
  key: string
}

export const useActiveIdsBySearchTerm =
  (): UseActiveIdsBySearchTermReturnType => {
    const [urlState] = useUrlState()
    const [ids, setIds] = useState<MinimalRecordType['id'][] | null>(null)
    const q = urlState.q || null
    const qCategories = urlState.qCategories || null
    const key = `search-${q || 'empty'}-${qCategories?.join('-') || 'empty'}`
    const { data, isLoading } = useSWR<SearchResult, Error>(key, async () =>
      searchRecords(q, qCategories)
    )

    useEffect(() => {
      if (!data?.result) return
      setIds(data.result.map((r) => r.id))
    }, [data])

    return {
      ids,
      isLoading,
      key: ids?.join('-') || 'empty',
    }
  }

async function searchRecords(
  q: string | null,
  qCategories: PageQueryType['qCategories'] | null
): Promise<SearchResult> {
  if (q === null && qCategories === null) return { params: {} }
  const url = new URLSearchParams({
    query: q || '',
    filters: qCategories ? categoriesToFilterString(qCategories) : '',
  })
  const response = await fetch(`/api/search?${url.toString()}`)
  if (!response.ok) throw new Error(await response.text())
  return (await response.json()) as SearchResult
}

function categoriesToFilterString(
  categories: PageQueryType['qCategories']
): string {
  const categoriesState = urlSearchCategoriesToStateSearchCategories(categories)
  return [
    categoriesState.categoryAdvising && 'Beratung',
    categoriesState.categoryClinics && 'Klinik',
    categoriesState.categoryDisctrictOfficeHelp && 'Amt',
    categoriesState.categoryOnlineOffers && 'Online',
    categoriesState.categorySelfHelp && 'Selbsthilfe',
  ]
    .filter(Boolean)
    .join(',')
}
