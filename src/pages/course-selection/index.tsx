import { Box, BoxProps, Button, Grid, InputLabel, Typography, styled } from '@mui/material'
import { ChangeEvent, useMemo, useRef, useState } from 'react'
import Toast, { LoaderIcon } from 'react-hot-toast'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import { useUserContext } from 'src/@core/context/UserContext'
import { ASSETS_BASE_URL, showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get, post } from 'src/@core/utils/request'
import { Product } from 'src/apis/type'
import { GET_WEBINAR_AND_BLOG_DATA, UPLOAD_CV_API } from 'src/apis/user'
import BookNowModel from 'src/components/modal/BookNow'
import { ActiveProducts } from './components/ActiveProducts'
import CourseResources from './components/CourseResources'
import { ProfileEvaluationCard } from './components/ProfileEvaluationCard'
import { SuggestedProducts } from './components/SuggestedProducts'
import { WatchNowCard } from './components/WatchNowCard'
import GirlWithOpenHand from '/images/GirlWithOpenHand.png'
import GirlWithPhone from '/images/GirlWithPhone.png'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import Icon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

const StyledUploadBox = styled(Box)<BoxProps>({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #B7B5BE',
  padding: 1,
  minHeight: '2.5em',
  height: 'auto',
  borderRadius: '6px',
  color: '#B7B5BE',
  marginTop: 10,
})

// type UserTasksAndSectionsAPIResponse = {
//   data: any
//   sections: Array<{
//     description: string
//     id: string
//     tagName: string
//     taskgroupIDs: Array<string>
//   }>
// }
type UserWebinarAndBlogsAPIResponse = {
  webinar: Array<{
    id: string
    title: string
    description: string
    course: string
    hostedby: string
    images: string
    onclickURL: string
    start_date: string
    webinarrecording: string
  }>
  blog: Record<string, Blog>
}

type Blog = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  'dz-path': string
  'dz-path1': string
  date: string
  tag: string
  keyword: string
  meta: string
  course: string
  status: string
  updatedBy: string
}

function getBlogLink(blog: Blog) {
  return ASSETS_BASE_URL + 'blogs/' + blog.slug
}

const CourseSelection = () => {
  const ref = useRef(null)

  const { userInit, changeActiveProduct } = useUserContext()
  const [openBuyNowModal, setOpenBuyNowModal] = useState(false)
  const [cvFile, setCvFile] = useState<FormData>()

  const navigate = useNavigate()

  const scroll = (scrollOffset: number) => {
    // @ts-ignore
    ref.current!.scrollLeft += scrollOffset
  }

  const webinarAndBlogsDataQuery = useQuery({
    queryKey: ['webinarAndBlogsDataQuery'],
    queryFn: () =>
      get(GET_WEBINAR_AND_BLOG_DATA, {
        queryParams: {
          count: '100',
          course: userInit?.data?.course as string,
        },
      }) as Promise<UserWebinarAndBlogsAPIResponse>,
    onError: showAPIErrorAsToast,
    enabled: !!userInit?.data?.course,
  })

  const uploadCVMutation = useMutation({
    onSuccess: () => {
      Toast.success('CV file uploaded successfully')
    },
    mutationFn: (variables: { data: FormData }) =>
      post(UPLOAD_CV_API, variables.data, {
        headers: {
          enctype: 'multipart/form-data',
          'content-type': 'multipart/form-data',
        },
      }),
    onError: (error: any) => {
      Toast.error(error.errorMessage)
    },
  })

  const handleInputFormData = async (e: ChangeEvent<any>) => {
    if (e.target.files) {
      const cvData = e.target.files[0]
      const formBodyData = new FormData()
      formBodyData.append('cv', cvData)
      setCvFile(formBodyData)
    }
  }

  const uploadCvFile = async () => {
    await uploadCVMutation.mutateAsync({ data: cvFile! })
  }

  const handleOnClickActiveProduct = (product: Product) => {
    changeActiveProduct.mutate({
      data: {
        productId: product.id,
      },
      handleSuccess: () => navigate('/app'),
    })
  }

  const flattenedBlogs = useMemo(
    () => ([] as Blog[]).concat(...(Object.values(webinarAndBlogsDataQuery.data?.blog || {}) || [])),
    [webinarAndBlogsDataQuery?.data],
  )

  if (!userInit?.data) return null

  const suggestedProducts = getSuggestedProductsForCourse(userInit.data.course)

  return (
    <>
      <CustomHelmet title='Course Selection' />
      <Grid>
        <Typography variant='h4'>Active Products</Typography>
        <Box display='flex' gap={4} flexWrap='wrap' width='100%'>
          <Box
            sx={{
              '@media (max-width:900px)': { width: '100%' },
              '@media (min-width:900px)': { width: '58%' },
            }}
          >
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              border={border}
              p={4}
              my={4}
              borderRadius={1}
            >
              <Typography variant='h4'>Active Products</Typography>
              <Box
                display='flex'
                gap={2}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Icon icon='tabler:chevron-left' onClick={() => scroll(-260)} />
                <Icon icon='tabler:chevron-right' onClick={() => scroll(+260)} />
              </Box>
            </Box>
            <Box display='flex' gap={4} sx={{ overflowX: 'scroll', scrollBehavior: 'smooth' }} ref={ref}>
              {userInit?.data.products.map(product => (
                <ActiveProducts key={product.id} product={product} onClickActiveProduct={handleOnClickActiveProduct} />
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              '@media (max-width:900px)': { width: '100%' },
              '@media (min-width:900px)': { width: '40%' },
            }}
          >
            <Typography variant='h4' borderBottom={border} p={4} my={4} borderRadius={1}>
              Suggested Products
            </Typography>
            <Box display='flex' gap={4} sx={{ overflowX: 'scroll' }}>
              {suggestedProducts.map((product, idx) => (
                <SuggestedProducts key={product.heading} {...product} bgColor={idx % 2 ? '#B66840' : '#10678F'} />
              ))}
            </Box>
          </Box>
        </Box>

        <Box display='flex' gap={4} flexWrap='wrap' width='100%'>
          <Box
            sx={{
              '@media (max-width:900px)': { width: '100%' },
              '@media (min-width:900px)': { width: '58%' },
            }}
          >
            <Typography variant='h4' border={border} p={4} my={4} borderRadius={1}>
              Upcoming Webinars
            </Typography>
            <Box display='flex' gap={4} sx={{ overflowX: 'scroll' }}>
              {webinarAndBlogsDataQuery?.data?.webinar?.map(webinar => (
                <WatchNowCard
                  key={webinar.id}
                  image={webinar.images}
                  heading={webinar.title}
                  startDateAndTime={webinar.start_date}
                  href={webinar?.webinarrecording ? webinar.webinarrecording : webinar.onclickURL}
                  linkText={webinar?.webinarrecording ? 'Watch Now' : 'Register Now'}
                />
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              '@media (max-width:900px)': { width: '100%' },
              '@media (min-width:900px)': { width: '40%' },
            }}
          >
            <Typography variant='h4' border={border} p={4} my={4} borderRadius={1}>
              Profile evaluations
            </Typography>
            <Box display='flex' gap={4} sx={{ overflowX: 'scroll' }}>
              <ProfileEvaluationCard
                heading='Upload your updated CV for complete your profile.'
                image={GirlWithPhone}
                content={
                  <InputLabel htmlFor='cv'>
                    <Box display='flex' width='100%' sx={{ cursor: 'pointer' }}>
                      <StyledUploadBox>
                        Upload CV
                        <input
                          hidden
                          type='file'
                          accept='.txt,.text,.doc,.docx,.odt,.pdf,.ppt,.pptx,.rtf,text/plain,text/rtf,application/rtf,application/msword'
                          onChange={e => handleInputFormData(e)}
                          id='cv'
                        />
                      </StyledUploadBox>
                    </Box>
                  </InputLabel>
                }
                button={
                  uploadCVMutation.isLoading ? (
                    <Button variant='outlined' color='primary' fullWidth sx={{ marginTop: 2 }}>
                      <LoaderIcon />
                    </Button>
                  ) : (
                    <Button
                      variant='outlined'
                      color='primary'
                      fullWidth
                      sx={{ marginTop: 3 }}
                      onClick={uploadCvFile}
                      disabled={!cvFile}
                    >
                      Upload File
                    </Button>
                  )
                }
              />
              <ProfileEvaluationCard
                heading='Counseling Session'
                image={GirlWithOpenHand}
                content={<Typography sx={{ marginTop: 6 }}>Book another counselling session today!</Typography>}
                button={
                  <Button
                    variant='outlined'
                    color='primary'
                    fullWidth
                    sx={{ marginTop: 3 }}
                    onClick={() => setOpenBuyNowModal(true)}
                  >
                    Book Now
                  </Button>
                }
              />
            </Box>
          </Box>
        </Box>

        <Box display='flex' gap={4} flexWrap='wrap' width='100%'>
          <Box
            sx={{
              '@media (max-width:900px)': { width: '100%' },
              '@media (min-width:900px)': { width: '58%' },
            }}
          >
            <Typography variant='h4' border={border} p={4} my={4} borderRadius={1}>
              Important Blogs
            </Typography>
            <Box display='flex' gap={4} sx={{ overflowX: 'scroll' }}>
              {flattenedBlogs.map(blog => (
                <WatchNowCard
                  key={blog.id}
                  image={blog['dz-path']}
                  heading={blog.title}
                  startDateAndTime={blog.date}
                  href={getBlogLink(blog)}
                  linkText='Read Now'
                />
              ))}
            </Box>
          </Box>
          <CourseResources products={userInit.data.products} />
        </Box>
      </Grid>
      <BookNowModel open={openBuyNowModal} setOpen={setOpenBuyNowModal} />
    </>
  )
}

export default CourseSelection

// React Code
// Need to transform to use correct structure
type SuggestedProducts = {
  heading: string
  description: string
  jamboreeCoursePath: string
}

const getSuggestedProductsForCourse = (course: string): SuggestedProducts[] => {
  switch (course) {
    case 'gmat':
    case 'gmatqf':
    case 'gmatvf':
    case 'gmatv2':
    case 'gmatqfv2':
    case 'gmatp':
      return [
        {
          heading: 'IELTS-Academic Test Ready',
          description: "Achieving 7+ band just got easier with Jamboree's 'IELTS-like'  testing portal.",
          jamboreeCoursePath: 'ielts',
        },
      ]
    case 'gre':
    case 'grep':
      return [
        {
          heading: 'IELTS-Academic Test Ready',
          description: "Achieving 7+ band just got easier with Jamboree's 'IELTS-like'  testing portal.",
          jamboreeCoursePath: 'ielts',
        },
      ]
    case 'ielts':
    case 'sat':
      return [
        {
          heading: 'Gmat Live',
          description:
            "Achieving 700+ score just got easier with Jamboree's 'GMAT-like' testing portal and live classes.",
          jamboreeCoursePath: 'gmat/live',
        },
        {
          heading: 'Gre Live',
          description:
            "Achieving 300+ score just got easier with Jamboree's 'GRE-like' testing portal and live classes.",
          jamboreeCoursePath: 'gre/live',
        },
      ]
    default:
      return []
  }
}
