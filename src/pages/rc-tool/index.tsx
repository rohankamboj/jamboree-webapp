import { Box, BoxProps, Button, Card, CardContent, Grid, Typography, styled } from '@mui/material'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { CustomBreadcrumbs } from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'
import { get } from 'src/@core/utils/request'
import { GET_RESOURCE } from 'src/apis/user'
import themeConfig from 'src/configs/themeConfig'

const { border } = themeConfig

const cardData = [
  {
    id: 1,
    content: 'Read sentence by sentence looking for keywords such as contrast indicators, tone indicators, etc.',
    img: '/images/card/rctool1.png',
  },
  {
    id: 2,
    content: 'Read sentence by sentence looking for keywords such as contrast indicators, tone indicators, etc.',
    img: '/images/card/rctool2.png',
  },
  {
    id: 3,
    content: 'Read sentence by sentence looking for keywords such as contrast indicators, tone indicators, etc.',
    img: '/images/card/rctool3.png',
  },
  {
    id: 4,
    content: 'Read sentence by sentence looking for keywords such as contrast indicators, tone indicators, etc.',
    img: '/images/card/rctool4.png',
  },
]

export type RCToolResource = {
  taskID: string
  taskName: string
  duration: string
  type: string
  resourceID: string
  testStatus: string
  totalquestion: number
}

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: 8,
  margin: '0px !important',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md')]: {
    flexWrap: 'wrap',
  },
}))

const RCTool = () => {
  const navigate = useNavigate()

  const { data: rcToolResources, isLoading } = useQuery<{ data: RCToolResource[] }>({
    queryKey: ['getRCToolResource'],
    queryFn: () =>
      get(GET_RESOURCE, {
        queryParams: {
          type: 'rctool',
          resourceID: '*',
        },
      }),
  })

  function navigateToPassage(taskId: string) {
    navigate(`/app/rctool/${taskId}`)
  }

  if (isLoading) return <FallbackSpinner />

  return (
    <Grid>
      <CustomHelmet title='RC Tool' />
      <CustomBreadcrumbs title='RC Tool' />
      <Typography sx={{ color: 'text.secondary', my: 2 }}>
        Reading an RC passage is not the same as reading an article or a book. You have an average of 3 minutes per
        passage. So, you have to develop the skill of skimming the passage to retain its layout and the tone so that you
        will know which part of the passage you have to read to solve a question. Jamboree’s method of skimming a
        passage involves identifying specific keywords in a passage.
        <br /> <br /> Use this RC Tool to learn how to read a passage within 3 minutes and identify the keywords in it.
      </Typography>

      <Box display='flex' flexDirection='column' gap={6}>
        <Typography variant='h4'>How to use this RC tool?</Typography>
        <Grid container spacing={5}>
          {cardData.map(item => (
            <Grid key={item.id} item xs={12} sm={6} md={4} xl={3}>
              <Card sx={{ boxShadow: 0, border, borderRadius: 1 }}>
                <div
                  style={{
                    backgroundColor: '#CCE7DE',
                  }}
                >
                  <img
                    style={{ height: '12.5625rem', width: '100%', objectFit: 'fill' }}
                    src={item.img}
                    alt='card-image'
                  />
                </div>
                <CardContent>
                  <Typography sx={{ color: 'text.secondary' }}>{item.content}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box display='flex' flexDirection='column' gap={6} marginY={10}>
        <Typography variant='h4'>Start RC Tool</Typography>
        <StyledBorderedBox padding={5} borderRadius={1}>
          <StyledBox>
            {rcToolResources?.data?.map(resource => (
              <Button
                key={resource.taskID}
                variant='tonal'
                color='primary'
                sx={{ px: 23 }}
                onClick={() => navigateToPassage(resource.taskID)}
              >
                {resource.taskName}
              </Button>
            ))}
          </StyledBox>
        </StyledBorderedBox>
      </Box>
    </Grid>
  )
}

export default RCTool
