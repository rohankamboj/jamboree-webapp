import { TabPanel } from '@mui/lab'
import { Grid } from '@mui/material'
import { useMemo } from 'react'
import CustomizedTab from 'src/components/common/CustomizedTab'
import { EbookChapterType, SelectedEbookChapterType } from '..'
import ChapterContent from './ChapterContent'

type Props = {
  chapterList: Array<EbookChapterType> | undefined
  selectedEbookChapter: SelectedEbookChapterType | undefined
  setSelectedEbookChapter: (ebookChapter: SelectedEbookChapterType) => void
  isChapterDataLoading: boolean
  chapterData: string
  pageCount: string | undefined
  currentlyViewingChapterPage: number
  changeCurrentlyViewingChapterPage: (page: number) => void
}

const EbookChapterWithTab = (props: Props) => {
  const {
    chapterList,
    selectedEbookChapter,
    chapterData,
    isChapterDataLoading,
    setSelectedEbookChapter,
    pageCount,
    currentlyViewingChapterPage,
    changeCurrentlyViewingChapterPage,
  } = props

  const chapterTabsWithContent = useMemo(() => {
    return chapterList
      ? chapterList?.map((item: { id: string; title: string }) => ({
          value: item.id,
          label: item.title,
          icon: '',
          component: (
            <ChapterContent
              pageCount={pageCount}
              chapterData={chapterData}
              title={item.title}
              isChapterDataLoading={isChapterDataLoading}
              currentlyViewingChapterPage={currentlyViewingChapterPage}
              changeCurrentlyViewingChapterPage={changeCurrentlyViewingChapterPage}
            />
          ),
        }))
      : []
  }, [chapterData, chapterList, isChapterDataLoading])

  const handleOnChapterTab = (chapterId: string) => {
    setSelectedEbookChapter(chapterList?.find(chapter => chapter.id === chapterId)!)
    changeCurrentlyViewingChapterPage(1)
  }

  return (
    <Grid item xs={12}>
      {chapterTabsWithContent && chapterTabsWithContent.length && (
        <CustomizedTab
          tabs={chapterTabsWithContent}
          defaultActiveTab={selectedEbookChapter?.id}
          handleActiveTabChange={handleOnChapterTab}
        >
          {chapterTabsWithContent?.map((item: any) => (
            <TabPanel key={item.value} value={item.value} sx={{ pl: 0 }}>
              {item.component}
            </TabPanel>
          ))}
        </CustomizedTab>
      )}
    </Grid>
  )
}

export default EbookChapterWithTab
