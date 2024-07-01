import React, { ReactNode } from 'react'
import Empty from './Empty'
import Error from './Error'
import { Loader } from './Loader'

const StatusComponent = ({
  children,
  loading,
  loadingComponent,
  empty,
  emptyComponent,
  error,
  errorComponent
}: {
  children: ReactNode
  loading: boolean
  loadingComponent?: ReactNode
  empty?: boolean
  emptyComponent?: ReactNode
  error?: string
  errorComponent?: ReactNode
}) => {
  if (loading) {
    return loadingComponent ? <>{loadingComponent}</> : <Loader />
  }

  if (error) {
    return errorComponent ? <>{errorComponent}</> : <Error />
  }

  if (empty) {
    return emptyComponent ? <>{emptyComponent}</> : <Empty />
  }

  return <>{children}</>
}

export default StatusComponent
