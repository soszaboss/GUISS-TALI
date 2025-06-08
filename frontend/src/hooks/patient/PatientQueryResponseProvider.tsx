/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createResponseContext, stringifyRequestQuery } from '@/helpers/crud-helper/helpers'
import { initialQueryResponse, initialQueryState, type PaginationState } from '@/types/_models'
import type { Conducteur } from '@/types/patientsModels'
import type { WithChildren } from '@/utils/react18MigrationHelpers'
import { type FC, useContext, useState, useEffect, useMemo } from 'react'
import { useQueryRequest } from '../_QueryRequestProvider'
import { useQuery } from '@tanstack/react-query'
import { getConducteurs } from '@/services/patientsService'

const QueryResponseContext = createResponseContext<Conducteur>(initialQueryResponse)

const ConducteurQueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery({
    queryKey: ['CONDUCTEURS_LIST', query],
    queryFn: () => getConducteurs(query),
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  return (
    <QueryResponseContext.Provider value={{ isLoading: isFetching, refetch, response, query }}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useConducteurQueryResponse = () => useContext(QueryResponseContext)

const useConducteurQueryResponseData = () => {
  const { response } = useConducteurQueryResponse()
  if (!response) return []
  return response?.data || []
}

const useConducteurQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  }
  const { response } = useConducteurQueryResponse()
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState
  }
  return response.payload.pagination
}

const useConducteurQueryResponseLoading = (): boolean => {
  const { isLoading } = useConducteurQueryResponse()
  return isLoading
}

export {
  ConducteurQueryResponseProvider,
  useConducteurQueryResponse,
  useConducteurQueryResponseData,
  useConducteurQueryResponsePagination,
  useConducteurQueryResponseLoading,
}