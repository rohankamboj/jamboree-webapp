import { Box, Grid } from '@mui/material'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  StyledBreadcrumbLink,
  CustomizedBreadcrumb,
  StyledLastBreadcrumb,
  StyledTitle,
} from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { FIVE_MINUTES } from 'src/@core/constants'
import { showAPIErrorAsToast } from 'src/@core/utils/ApiHelpers'
import { get } from 'src/@core/utils/request'
import { GET_EBOOK_API } from 'src/apis/user'
import { addBaseUrlBeforeImageSrc } from 'src/utils'
import ChapterContent from './components/ChapterContent'
import EbookChapterWithTab from './components/EbookChapterWithTab'
import EbookWithLeftChapterList from './components/EbookWithLeftChapterList'

export type EbookChapterContent = {
  sequence: string
  content: string
}

export type EbookChapterType = {
  id: string
  title: string
  description: string | null
}

type EbookChapterResponseType = {
  data: Array<EbookChapterContent>
  count: string
}

type EbookResponseType = {
  data: Array<EbookChapterType>
  count: string
  page: Array<EbookChapterContent>
}

export type SelectedEbookChapterType = Omit<EbookChapterType, 'description'>

const Ebook = () => {
  const { id: ebookId } = useParams()

  const [selectedEbookChapter, setSelectedEbookChapter] = useState<SelectedEbookChapterType>()
  // TODO: Handle varios pages
  const [currentlyViewingChapterPage, setCurrentlyViewingChapterPage] = useState<number>(1)

  const getBreadcrumbsTitle = () => {
    return `${Number(ebookId) === 5 ? 'Verbal Tips' : 'Formula List'}`
  }

  const breadcrumbs = [
    <StyledBreadcrumbLink underline='hover' key='1' to='/'>
      Dashboard
    </StyledBreadcrumbLink>,
    <StyledLastBreadcrumb key='2'>{getBreadcrumbsTitle()}</StyledLastBreadcrumb>,
  ]

  const { data: ebookData, isLoading: isEbookDataLoading } = useQuery<EbookResponseType>({
    queryKey: ['ebook', ebookId],
    queryFn: () =>
      get(GET_EBOOK_API + ebookId, {
        queryParams: {
          count: 'true',
          type: 'ebook',
          page: '1',
        },
      }),
    retry: false,
    onSuccess({ data }) {
      if (data?.length)
        setSelectedEbookChapter({
          id: data[0].id,
          title: data[0].title,
        })
    },
    onError: showAPIErrorAsToast,
    refetchOnWindowFocus: false,
    staleTime: FIVE_MINUTES,
  })

  const { data: chapterData, isLoading: isChapterDataLoading } = useQuery<EbookChapterResponseType>({
    queryKey: ['ebook-chapter', selectedEbookChapter?.id, currentlyViewingChapterPage],
    queryFn: () =>
      get(GET_EBOOK_API + selectedEbookChapter?.id, {
        queryParams: {
          count: 'true',
          type: 'chapter',
          page: currentlyViewingChapterPage.toString(),
        },
      }),
    enabled: !!selectedEbookChapter,
    onError: showAPIErrorAsToast,
    refetchOnWindowFocus: false,
    staleTime: FIVE_MINUTES,
  })

  const handleOnChapterClick = (selectedChapter: SelectedEbookChapterType) => {
    setSelectedEbookChapter(selectedChapter)
    // Reset to first page.
    setCurrentlyViewingChapterPage(1)
  }

  const chapterToRender = useMemo(() => {
    const chapter = selectedEbookChapter?.id ? chapterData?.data : ebookData?.page

    if (chapter?.length) return addBaseUrlBeforeImageSrc(chapter[0].content)
    return ''
  }, [selectedEbookChapter, currentlyViewingChapterPage, isChapterDataLoading, isEbookDataLoading])

  if (isEbookDataLoading) return <FallbackSpinner />

  return (
    <Grid>
      <CustomHelmet title='EBook' />
      <Box display='flex' alignItems='center' gap={4} paddingBottom={4}>
        <StyledTitle>{getBreadcrumbsTitle()}</StyledTitle>
        <CustomizedBreadcrumb>{breadcrumbs}</CustomizedBreadcrumb>
      </Box>

      {Number(ebookId) === 5 ? (
        <Grid container spacing={6}>
          <EbookChapterWithTab
            pageCount={chapterData?.count}
            chapterData={chapterToRender}
            chapterList={ebookData?.data}
            selectedEbookChapter={selectedEbookChapter}
            isChapterDataLoading={isChapterDataLoading}
            setSelectedEbookChapter={setSelectedEbookChapter}
            currentlyViewingChapterPage={currentlyViewingChapterPage}
            changeCurrentlyViewingChapterPage={setCurrentlyViewingChapterPage}
          />
        </Grid>
      ) : (
        <Grid container spacing={6}>
          <EbookWithLeftChapterList
            chapterList={ebookData?.data}
            handleOnChapterClick={handleOnChapterClick}
            id={selectedEbookChapter?.id}
          />
          <Grid item xs={12} md={8} xl={9}>
            <ChapterContent
              pageCount={chapterData?.count}
              chapterData={chapterToRender}
              title={selectedEbookChapter?.title}
              isChapterDataLoading={isChapterDataLoading}
              currentlyViewingChapterPage={currentlyViewingChapterPage}
              changeCurrentlyViewingChapterPage={setCurrentlyViewingChapterPage}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default Ebook
