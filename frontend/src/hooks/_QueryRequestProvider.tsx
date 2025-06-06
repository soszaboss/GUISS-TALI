/* eslint-disable react-refresh/only-export-components */
import { initialQueryRequest, type QueryRequestContextProps, type QueryState } from '@/types/_models'
import type { WithChildren } from '@/utils/react18MigrationHelpers'
import {type FC, useState, createContext, useContext} from 'react'


const QueryRequestContext = createContext<QueryRequestContextProps>(initialQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<QueryState>(initialQueryRequest.state)

  const updateState = (updates: Partial<QueryState>) => {
    const updatedState = {...state, ...updates} as QueryState
    setState(updatedState)
  }

  return (
    <QueryRequestContext.Provider value={{state, updateState}}>
      {children}
    </QueryRequestContext.Provider>
  )
}

const useQueryRequest = () => useContext(QueryRequestContext)

export {QueryRequestProvider, useQueryRequest}