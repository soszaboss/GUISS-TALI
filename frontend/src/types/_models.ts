import type { Dispatch, SetStateAction } from 'react'

// ID type
export type ID = undefined | null | number

// DRF Pagination Structure
export type PaginationState = {
  count: number
  next: string | null
  previous: string | null
  links?: Array<{
    label: string
    active: boolean
    url: string | null
    page: number | null
  }>
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

// Generic Response matching DRF
export type Response<T> = {
  data?: T
  payload?: {
    message?: string
    errors?: {
      [key: string]: string[]
    }
    pagination?: PaginationState
  }
}

// Unified Query State
export type QueryState = {
  page?: number
  limit?: number
  offset?: number
  items_per_page?: 10 | 30 | 50 | 100
  sort?: string
  order?: 'asc' | 'desc'
  filter?: unknown
  search?: string
}

// Query Request Context
export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

// Default Query State
export const initialQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
}

// Default Query Context
export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
}

// Query Response Context adapted to DRF
export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined
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
