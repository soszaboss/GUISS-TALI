/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createResponseContext, stringifyRequestQuery } from '@/helpers/crud-helper/helpers'
import { initialQueryResponse, initialQueryState, type PaginationState } from '@/types/_models'
import type { User } from '@/types/userModels'
import type { WithChildren } from '@/utils/react18MigrationHelpers'
import {type FC, useContext, useState, useEffect, useMemo} from 'react'
import { useQueryRequest } from '../_QueryRequestProvider'
import {useQuery} from '@tanstack/react-query'
import { QUERIES } from '@/helpers/crud-helper/consts'
import { getUsers } from '@/services/usersService'

const QueryResponseContext = createResponseContext<User>(initialQueryResponse)

const UserQueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
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
      queryKey:[QUERIES.USERS_LIST, query],
      queryFn:() => {
      return getUsers(query)
    },
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  return (
    <QueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query}}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const {response} = useQueryResponse()
  if (!response) {
    return []
  }
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

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState<User> = {
    ...initialQueryState,
  }

  const {response} = useQueryResponse()

  if (!response || !('results' in response)) {
    return defaultPaginationState
  }

  return response
}

const useQueryResponseLoading = (): boolean => {
  const {isLoading} = useQueryResponse()
  return isLoading
}

export {
  UserQueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
