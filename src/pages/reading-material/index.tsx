import TabPanel from '@mui/lab/TabPanel'
import { useState } from 'react'
import { useQuery } from 'react-query'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { useUserContext } from 'src/@core/context/UserContext'
import { get } from 'src/@core/utils/request'
import { GET_READING_MATERIAL } from 'src/apis/user'
import CustomizedTab from 'src/components/common/CustomizedTab'
import ReadingMaterialTabContent from './components/ReadingTabConent'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'

export type TaskType = {
  taskID: string
  taskname: string
  duration: string
  type: 'link' | 'pdflink' | 'ebook'
  resourceid: string
  materialType: string
  tasknameshow: string
  status: string
  id: string
  parentID: string
  course: string
}

export type TaskPrePos = { post: Array<TaskType>; pre: Array<TaskType> }

type ReadingMaterialResponse = {
  data: Record<string, TaskPrePos>
}

const ReadingMaterial = () => {
  const { userInit } = useUserContext()

  const [selectedTab, setSelectedTab] = useState<string>()

  const userActiveCourse = userInit?.data.course

  const readingMaterialQuery = useQuery({
    onSuccess(data) {
      !selectedTab && setSelectedTab(Object.keys(data.data)[0])
    },
    queryKey: ['reading material', userActiveCourse],
    enabled: !!userActiveCourse,
    queryFn: () => get(GET_READING_MATERIAL + userActiveCourse) as Promise<ReadingMaterialResponse>,
  })

  if (readingMaterialQuery.isLoading) return <FallbackSpinner />

  const tabLabels = Object.keys(readingMaterialQuery.data?.data || {}).map(material => ({
    label: `${material} Class Material`,
    value: material,
  }))

  const tabsDataToRender = readingMaterialQuery.data?.data?.[selectedTab as string]

  if (!userActiveCourse) return <p>No active course for user...</p>

  if (!tabsDataToRender) return <p>No data found for {selectedTab}</p>

  return (
    <div>
      <CustomHelmet title='Reading Material' />
      <CustomBreadcrumbs />
      <CustomizedTab handleActiveTabChange={setSelectedTab} tabs={tabLabels}>
        {tabLabels?.map(item => (
          <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
            <ReadingMaterialTabContent prePostData={tabsDataToRender} userActiveCourse={userActiveCourse} />
          </TabPanel>
        ))}
      </CustomizedTab>
    </div>
  )
}

export default ReadingMaterial
