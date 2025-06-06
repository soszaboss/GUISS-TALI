import {type FC, useState, createContext, useContext, useMemo} from 'react'

import type { WithChildren } from '@/utils/react18MigrationHelpers'
import { initialListView, type ID, type ListViewContextProps } from '@/types/_models'
import { useQueryResponse, useQueryResponseData } from './user/UserQueryResponseProvider'
import { calculatedGroupingIsDisabled, calculateIsAllDataSelected, groupingOnSelect, groupingOnSelectAll } from '@/helpers/crud-helper/helpers'

const ListViewContext = createContext<ListViewContextProps>(initialListView)

const ListViewProvider: FC<WithChildren> = ({children}) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const {isLoading} = useQueryResponse()
  const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])

  return (
    <ListViewContext.Provider
      value={{
        selected,
        itemIdForUpdate,
        setItemIdForUpdate,
        disabled,
        isAllSelected,
        onSelect: (id: ID) => {
          groupingOnSelect(id, selected, setSelected)
        },
        onSelectAll: () => {
          groupingOnSelectAll(isAllSelected, setSelected, data)
        },
        clearSelected: () => {
          setSelected([])
        },
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)

// eslint-disable-next-line react-refresh/only-export-components
export {ListViewProvider, useListView}
