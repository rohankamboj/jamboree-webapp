import { Box, Grid, Typography, useTheme } from '@mui/material'
import { RightSideArrow } from 'src/assets/Icons/Icons'
import themeConfig from 'src/configs/themeConfig'
import { EbookChapterType, SelectedEbookChapterType } from '..'

type Props = {
  id: string | undefined
  chapterList: EbookChapterType[] | undefined
  handleOnChapterClick: (selectedChapter: SelectedEbookChapterType) => void
}

const EbookWithLeftChapterList = (props: Props) => {
  const theme = useTheme()
  const { chapterList, handleOnChapterClick, id: selectedChapterId } = props

  return (
    <>
      {/* Table of content */}
      <Grid item xs={12} md={4} xl={3}>
        <Typography variant='h5'>Table of Content</Typography>
        <Box
          sx={{
            height: '80vh',
            overflow: 'scroll',
          }}
        >
          {chapterList?.map(({ id, title }) => {
            return (
              <Box
                key={id}
                onClick={() =>
                  handleOnChapterClick({
                    id,
                    title,
                  })
                }
                border={themeConfig.border}
                padding={4}
                mt={2}
                borderRadius={1}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                sx={{
                  cursor: 'pointer',
                  bgcolor: selectedChapterId === id ? theme.palette.primary.main : undefined,
                  color: selectedChapterId === id ? 'white' : theme.palette.grey[50],
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                  },
                  '& .hidden-button': {
                    display: 'none',
                  },
                  '&:hover .hidden-button ': { display: 'block' },
                }}
              >
                <Typography color='inherit'>{title}</Typography>
                <Box className='hidden-button'>
                  <RightSideArrow />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Grid>
    </>
  )
}

export default EbookWithLeftChapterList
