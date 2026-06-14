import React from 'react'
import CollectionPage from '../../src/components/kiosk/CollectionPage'
import { useRouter } from 'next/router'

const CollectionDetail = () => {
  const router = useRouter()
  const { collection_name } = router.query

  return <CollectionPage params={{ collection_name }} />
}
    
export default CollectionDetail
