import React from 'react'
import CollectionPage from '../../src/components/kiosk/CollectionPage'
import { useRouter } from 'next/router'
import KioskRoot from '../../src/pageComponents/kiosk/KioskRoot'

const CollectionDetail = () => {
  const router = useRouter()
  const { collection_name } = router.query
  // params={{ collection_name }}

  return <KioskRoot isKioskCollectionPage  />
}
    
export default CollectionDetail
