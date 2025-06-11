/* eslint-disable react-refresh/only-export-components */
import { createResponseContext, stringifyRequestQuery } from '@/helpers/crud-helper/helpers'
import { initialQueryResponse, initialQueryState, type PaginationState } from '@/types/_models'
import type { Vehicule } from '@/types/patientsModels'
import type { WithChildren } from '@/utils/react18MigrationHelpers'
import { type FC, useContext, useState, useEffect, useMemo } from 'react'
import { useQueryRequest } from '../_QueryRequestProvider'
import { useQuery } from '@tanstack/react-query'
import { getVehicules } from '@/services/vehiculesService'
import { QUERIES } from '@/helpers/crud-helper/consts'

const QueryResponseContext = createResponseContext<Vehicule>(initialQueryResponse)

const VehiculeQueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [query, updatedQuery])

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERIES.VEHICULES_LIST, query],
    queryFn: () => getVehicules(query),
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

const useVehiculeQueryResponse = () => useContext(QueryResponseContext)

const useVehiculeQueryResponseData = () => {
  const { response } = useVehiculeQueryResponse()
  if (!response) return []
  if ('results' in response && Array.isArray(response.results)) {
    return response.results
  }
  if ('data' in response && Array.isArray(response.data)) {
    return response.data
  }
  return []
}

const useVehiculeQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState<Vehicule> = {
    ...initialQueryState,
  }
  const { response } = useVehiculeQueryResponse()
  if (!response || !('results' in response)) {
    return defaultPaginationState
  }
  return response
}

const useVehiculeQueryResponseLoading = (): boolean => {
  const { isLoading } = useVehiculeQueryResponse()
  return isLoading
}

export {
  VehiculeQueryResponseProvider,
  useVehiculeQueryResponse,
  useVehiculeQueryResponseData,
  useVehiculeQueryResponsePagination,
  useVehiculeQueryResponseLoading,
}