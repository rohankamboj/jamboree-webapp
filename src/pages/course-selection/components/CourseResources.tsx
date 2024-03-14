import { Box, MenuItem, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { Product } from 'src/apis/type'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { get } from 'src/@core/utils/request'
import { GET_COURSE_RESOURCES_LIST } from 'src/apis/user'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { getProductCodeForProductName } from 'src/pages/planner/helpers'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

type CourseResoursesAPIResponse = {
  data: Array<CourseResource>
}

type CourseResource = {
  file: string
  topic: string
}

type Props = {
  products: Product[]
}

function generateDropDownOptionsFromUserProducts(products: Product[]) {
  const resOList: Set<string> = new Set()
  products.forEach(element => {
    if (['sat', 'gmat', 'gre', 'ielts'].includes(getProductCodeForProductName(element.name))) {
      resOList.add(getProductCodeForProductName(element.name))
    }
  })
  return Array.from(resOList)
}

const CourseResources = ({ products }: Props) => {
  const userCourseDropdownOptions = generateDropDownOptionsFromUserProducts(products)
  const [userSelectedCourse, setUserSelectedCourse] = useState(userCourseDropdownOptions[0])

  const courseResourcesQuery = useQuery({
    queryKey: ['courseResources', userSelectedCourse],
    queryFn: () =>
      get(GET_COURSE_RESOURCES_LIST, {
        queryParams: {
          course: userSelectedCourse,
        },
      }) as Promise<CourseResoursesAPIResponse>,
    onError: showAPIErrorAsToast,
  })

  return (
    <Box
      sx={{
        '@media (max-width:900px)': { width: '100%' },
        '@media (min-width:900px)': { width: '40%' },
      }}
    >
      <Box
        border={border}
        p={4}
        my={4}
        borderRadius={1}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography variant='h4'>Resources</Typography>
        <CustomTextField
          label=''
          value={userSelectedCourse}
          onChange={e => {
            setUserSelectedCourse(e.target.value)
          }}
          select
        >
          {userCourseDropdownOptions.map(item => (
            <MenuItem key={item} value={item}>
              {item.toUpperCase()}
            </MenuItem>
          ))}
        </CustomTextField>
      </Box>
      {Array.isArray(courseResourcesQuery?.data?.data) && (
        <Box border={border} p={4} borderRadius={1}>
          {courseResourcesQuery?.data?.data?.map(resource => (
            <Box key={resource.file} mb={2} display='flex' sx={{ cursor: 'pointer' }}>
              <Typography
                border={border}
                width={'100%'}
                p={3}
                borderRadius={1}
                sx={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                {resource.topic}
              </Typography>
              <Box
                border='1px solid #59D076'
                borderRadius={1}
                display='flex'
                justifyContent='center'
                alignItems='center'
                width={'50px'}
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <a style={{ textDecoration: 'none' }} href={resource.file} target='_blank'>
                  <Icon icon={'system-uicons:download'} color='#59D076' />
                </a>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CourseResources
