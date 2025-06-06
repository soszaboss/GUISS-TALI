import type { Dispatch, SetStateAction } from 'react'

// ID type
export type ID = undefined | null | number

// DRF Pagination Structure
export type PaginationState<T> = {
  count?: number
  next?: string | null
  previous?: string | null
  results?: T[]
}

// Sorting
export type SortState = {
  sort?: string
  order?: 'asc' | 'desc'
}

// Filtering
export type FilterState = {
  filter?: unknown
}

// Searching
export type SearchState = {
  search?: string
}

export type ErrorDetail = {
  detail?: string
}

type Error = {
  code?: string
  detail?: string | ErrorDetail | ErrorDetail[]
  attr?: string
}

// Structure commune à toutes les réponses
type BaseResponse = {
  detail?: string
  type?: string
  errors?: Array<Error>
}

// Réponse simple
export type Response<T> = BaseResponse & {
  data?: T
}

// Réponse paginée
export type PaginationResponse<T> = PaginationState<T> & PaginationState<T>

// Unified Query State
export type QueryState = {
  limit?: 10 | 20 | 50 | 100
  offset?: number
  sort?: string
  order?: 'asc' | 'desc'
  filter?: unknown
  search?: string
  count?: 0,
  next?: null,
  previous?: null,
  results?: []
}

// Query Request Context
export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

// Default Query State
export const initialQueryState: QueryState = {
  limit: 10,
}

// Default Query Context
export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
}

// Query Response Context adapted to DRF
export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined | PaginationResponse<T>
  refetch: () => void
  isLoading: boolean
  query: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initialQueryResponse: QueryResponseContextProps<any> = {
  refetch: () => {},
  isLoading: false,
  query: ''
}

// List view context for selection and modal editing
export type ListViewContextProps = {
  selected: Array<ID>
  onSelect: (selectedId: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  itemIdForUpdate?: ID
  setItemIdForUpdate: Dispatch<SetStateAction<ID>>
  isAllSelected: boolean
  disabled: boolean
}

export const initialListView: ListViewContextProps = {
  selected: [],
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  setItemIdForUpdate: () => {},
  isAllSelected: false,
  disabled: false,
}
