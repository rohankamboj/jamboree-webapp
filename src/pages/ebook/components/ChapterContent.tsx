import { Box, Pagination, Typography } from '@mui/material'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import themeConfig from 'src/configs/themeConfig'

type Props = {
  chapterData: string
  title: string | undefined
  isChapterDataLoading: boolean
  pageCount: string | undefined
  currentlyViewingChapterPage: number
  changeCurrentlyViewingChapterPage: (page: number) => void
}

const ChapterContent = (props: Props) => {
  const {
    chapterData,
    title,
    isChapterDataLoading,
    pageCount,
    currentlyViewingChapterPage,
    changeCurrentlyViewingChapterPage,
  } = props

  if (isChapterDataLoading) {
    return (
      <Box display='flex' alignItems='center' flexDirection='column' justifyContent='center'>
        <FallbackSpinner height='800px' />
      </Box>
    )
  }

  const handleSetPage = (_: unknown, pageNumber: number) => {
    changeCurrentlyViewingChapterPage(pageNumber)
  }

  return (
    <Box>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h4'>{title}</Typography>
        <Pagination
          count={Number(pageCount)}
          variant='text'
          shape='rounded'
          color='primary'
          onChange={handleSetPage}
          page={currentlyViewingChapterPage}
        />
      </Box>
      <Box border={themeConfig.border} padding={8} mt={2} borderRadius={1}>
        <Typography
          dangerouslySetInnerHTML={{
            __html: chapterData,
          }}
        ></Typography>
      </Box>
    </Box>
  )
}

export default ChapterContent
