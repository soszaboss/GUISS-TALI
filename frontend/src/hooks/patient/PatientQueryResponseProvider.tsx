/* eslint-disable react-refresh/only-export-components */
import { createResponseContext, stringifyRequestQuery } from '@/helpers/crud-helper/helpers'
import { initialQueryResponse, initialQueryState, type PaginationState } from '@/types/_models'
import type { Conducteur } from '@/types/patientsModels'
import type { WithChildren } from '@/utils/react18MigrationHelpers'
import { type FC, useContext, useState, useEffect, useMemo } from 'react'
import { useQueryRequest } from '../_QueryRequestProvider'
import { useQuery } from '@tanstack/react-query'
import { getPatients } from '@/services/patientsService'
import { QUERIES } from '@/helpers/crud-helper/consts'

const QueryResponseContext = createResponseContext<Conducteur>(initialQueryResponse)

const PatientQueryResponseProvider: FC<WithChildren> = ({ children }) => {
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
    queryKey: [QUERIES.PATIENTS_LIST, query],
    queryFn: () => getPatients(query),
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

const usePatientQueryResponse = () => useContext(QueryResponseContext)

const usePatientQueryResponseData = () => {
  const { response } = usePatientQueryResponse()
  if (!response) return []
  // Si response a results (DRF paginé), retourne-les
  if ('results' in response && Array.isArray(response.results)) {
    return response.results
  }
  // Sinon, si response a data (réponse simple), retourne-la
  if ('data' in response && Array.isArray(response.data)) {
    return response.data
  }
  return []
}

const usePatientQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState<Conducteur>  = {
    ...initialQueryState,
  }
  const { response } = usePatientQueryResponse()
  if (!response || !('results' in response)) {
    return defaultPaginationState
  }

  return response
}

const usePatientQueryResponseLoading = (): boolean => {
  const { isLoading } = usePatientQueryResponse()
  return isLoading
}

export {
  PatientQueryResponseProvider,
  usePatientQueryResponse,
  usePatientQueryResponseData,
  usePatientQueryResponsePagination,
  usePatientQueryResponseLoading,
}