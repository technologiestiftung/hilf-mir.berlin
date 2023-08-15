import { TableRowType } from '@common/types/gristData'
import {
  urlSearchCategoriesToStateSearchCategories,
  useUrlState,
} from '@lib/UrlStateContext'
import { PageQueryType } from '@lib/mapRawQueryToState'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

interface SearchResultBase {
  params: Record<string, string>
}
interface SearchResultSuccess extends SearchResultBase {
  result: TableRowType[]
  total: number
}

interface SearchResultError extends SearchResultBase {
  error: string
}

export type SearchResult = SearchResultSuccess | SearchResultError

interface UseActiveIdsBySearchTermReturnType {
  ids: MinimalRecordType['id'][] | null
  total: number
  isLoading: boolean
  key: string
}

export const useActiveIdsBySearchTerm =
  (): UseActiveIdsBySearchTermReturnType => {
    const [urlState] = useUrlState()
    const [ids, setIds] = useState<MinimalRecordType['id'][] | null>(null)
    const [total, setTotal] = useState<number>(10000)
    const q = urlState.q ?? null
    const qCategories = urlState.qCategories ?? null
    const key = `search-${q || 'empty'}-${qCategories?.join('-') || 'empty'}`
    const { data, isLoading } = useSWR<SearchResult, Error>(key, async () =>
      searchRecords(q, qCategories, total)
    )

    useEffect(() => {
      if (isLoading || !data || 'error' in data) return
      setIds(data.result?.map((r) => r.id) || [])
      setTotal(data.total)
    }, [data, isLoading])

    return {
      ids,
      isLoading,
      total,
      key: ids?.join('-') || 'empty',
    }
  }

async function searchRecords(
  q: string | null,
  qCategories: PageQueryType['qCategories'] | null,
  total: number
): Promise<SearchResult> {
  if (q === null && qCategories === null)
    return { params: {}, result: [], total }
  const url = new URLSearchParams({
    query: q || '',
    filters: categoriesToFilterString(qCategories),
  })
  const response = await fetch(`/api/search?${url.toString()}`)
  if (!response.ok) throw new Error(await response.text())
  return (await response.json()) as SearchResult
}

function categoriesToFilterString(
  categories: PageQueryType['qCategories'] | null
): string {
  if (categories === null) return ''
  const categoriesState = urlSearchCategoriesToStateSearchCategories(categories)
  return [
    categoriesState.categoryAdvising && 'Beratung',
    categoriesState.categoryClinics && 'Klinik',
    categoriesState.categoryDistrictOfficeHelp && 'Amt',
    categoriesState.categoryOnlineOffers && 'Online',
    categoriesState.categorySelfHelp && 'Selbsthilfe',
  ]
    .filter(Boolean)
    .join(',')
}
