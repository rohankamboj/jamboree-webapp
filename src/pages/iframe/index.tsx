import { Grid } from '@mui/material'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'

const IFramePagesMap: Record<string, { title: string; iFrameSrc: string }> = {
  sampleessay: {
    title: 'Sample AWA Essays',
    iFrameSrc: 'https://drive.google.com/file/d/1gaRrcJHRoD1aT9b7uM9boGKgEgw5wt-n/preview',
  },
  gmatawatip: {
    title: 'AWA Tips',
    iFrameSrc: 'https://drive.google.com/file/d/1K-RcfdZFvbVsfza-50uD4SXhDrCKgRzI/preview',
  },
  'gmat-post-class-plan': {
    title: 'GMAT Post Class Plan',
    iFrameSrc: 'https://drive.google.com/file/d/15MPWLQcNowdILzGPiUoXngeUsYI_Znjz/preview',
  },
}

const IFrame = () => {
  const location = useLocation()
  const pageKey = location.pathname.split('app/')[1]
  const [isLoading, setIsLoading] = useState(true)

  const pageContent = pageKey in IFramePagesMap ? IFramePagesMap[pageKey] : undefined

  if (!pageContent) return <Navigate to={'404'} replace />

  return (
    <Grid>
      <CustomHelmet title={pageContent.title} />
      <CustomBreadcrumbs title={pageContent.title} />
      {isLoading && <FallbackSpinner />}
      <iframe
        src={pageContent.iFrameSrc}
        style={{ width: '100%', height: '1200px', border: 'none' }}
        onLoad={() => setIsLoading(false)}
      ></iframe>
    </Grid>
  )
}

export default IFrame
