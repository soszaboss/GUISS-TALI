/* eslint-disable react-refresh/only-export-components */
import { createResponseContext, stringifyRequestQuery } from '@/helpers/crud-helper/helpers'
import { initialQueryResponse, initialQueryState, type PaginationState } from '@/types/_models'
import type { WithChildren } from '@/utils/react18MigrationHelpers'
import { type FC, useContext, useState, useEffect, useMemo } from 'react'
import { useQueryRequest } from '../_QueryRequestProvider'
import { useQuery } from '@tanstack/react-query'
import { QUERIES } from '@/helpers/crud-helper/consts'
import type { HealthRecord } from '@/types/medicalRecord'
import { getMedicalRecords } from '@/services/medicalRecord'

const QueryResponseContext = createResponseContext<HealthRecord>(initialQueryResponse)

const MedicalRecordQueryResponseProvider: FC<WithChildren> = ({ children }) => {
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
    queryKey: [QUERIES.MEDICAL_RECORDS_LIST, query],
    queryFn: () => getMedicalRecords(query),
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

const useMedicalRecordQueryResponse = () => useContext(QueryResponseContext)

const useMedicalRecordQueryResponseData = () => {
  const { response } = useMedicalRecordQueryResponse()
  if (!response) return []
  if ('results' in response && Array.isArray(response.results)) {
    return response.results
  }
  if ('data' in response && Array.isArray(response.data)) {
    return response.data
  }
  return []
}

const useMedicalRecordQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState<HealthRecord> = {
    ...initialQueryState,
  }
  const { response } = useMedicalRecordQueryResponse()
  if (!response || !('results' in response)) {
    return defaultPaginationState
  }
  return response
}

const useMedicalRecordQueryResponseLoading = (): boolean => {
  const { isLoading } = useMedicalRecordQueryResponse()
  return isLoading
}

export {
  MedicalRecordQueryResponseProvider,
  useMedicalRecordQueryResponse,
  useMedicalRecordQueryResponseData,
  useMedicalRecordQueryResponsePagination,
  useMedicalRecordQueryResponseLoading,
}