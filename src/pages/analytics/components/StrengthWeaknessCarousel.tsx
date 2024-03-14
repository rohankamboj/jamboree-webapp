import { useState } from 'react'

import { Box, Button, IconButton, Theme, Typography } from '@mui/material'
import { Carousel } from 'react-responsive-carousel'

import Tooltip from '@mui/material/Tooltip'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import IconifyIcon from 'src/@core/components/icon'
import studentStrengthWeakness from './StrengthWeakness.json'

function convertToPercentage(value: number) {
  return `${(value * 100).toFixed(2)}`
}

type contentType = {
  conceptid?: number
  concept?: string
  accuracy?: number
  attemptedQuestionCount?: number
  predictedAccuracy?: number
  totalQuestionCount?: number
}

const renderTooltipContent = (data: any) => (
  <>
    <div>Accuracy: {convertToPercentage(data.accuracy)}%</div>
    <div>Qs Attempted: {data.attemptedQuestionCount}</div>
    <div>Predicted Accuracy: {convertToPercentage(data.predictedAccuracy)}%</div>
    <div>No. of Qs in Topic: {data.totalQuestionCount}</div>
  </>
)
// TODO: add types instead of any
const StrengthWeaknessCarousel = () => {
  const [selectedLabels, setSelectedLabels] = useState<{
    slide1: any[]
    slide2: any[]
  }>({
    slide1: [],
    slide2: [],
  })
  const [currentSlide, setCurrentSlide] = useState('slide1')
  const [carouselIndex, setCarouselIndex] = useState(0)

  const shouldDisableLeftArrow = () => {
    if (currentSlide === 'slide1') return true
    return false
  }

  const shouldDisableRightArrow = () => {
    if (currentSlide === 'slide1' && selectedLabels.slide1.length === 0) return true
    if (currentSlide === 'slide2') return true
    return false
  }

  const handleCarouselChange = (index: number) => {
    setCarouselIndex(index)
  }

  const goToPrevSlide = () => {
    if (currentSlide === 'slide2') {
      setCurrentSlide('slide1')
    }
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1)
    }
  }

  const goToNextSlide = () => {
    if (currentSlide === 'slide1') {
      setCurrentSlide('slide2')
    }
    if (carouselIndex < 1) {
      setCarouselIndex(carouselIndex + 1)
    }
  }

  const handleSelectedLabels = (primaryTopic: string, topic: string) => {
    setSelectedLabels(prevValue => ({
      ...prevValue,
      slide1: [primaryTopic, topic],
    }))
    setCarouselIndex(1)
    setCurrentSlide('slide2')
  }

  const getDataForSlide1 = () => {
    if (!studentStrengthWeakness) {
      return {
        strengths: [],
        weaknesses: [],
        unattempted: [],
      }
    }

    const extractData = (dataArr: any[]) => {
      return dataArr.map(dataItem => ({
        topic: dataItem.topic,
        accuracy: dataItem.accuracy,
        pace: dataItem.pace,
        predictedAccuracy: dataItem.predicted_accuracy,
        attemptedQuestionCount: dataItem.attempted_question_count,
        totalQuestionCount: dataItem.total_question_count,
      }))
    }

    return {
      strengths: extractData(studentStrengthWeakness.strengths),
      weaknesses: extractData(studentStrengthWeakness.weaknesses),
      unattempted: extractData(studentStrengthWeakness.unattempted || []),
    }
  }

  const getDataForSlide2 = () => {
    if (!studentStrengthWeakness || selectedLabels.slide1.length === 0) {
      return {
        strengths: [],
        weaknesses: [],
        unattempted: [],
      }
    }

    const [primaryTopic, topic] = selectedLabels.slide1
    // TODO: ts ignore and add type to studentStrengthWeakness[primaryTopic]
    // @ts-ignore
    const topicObject = studentStrengthWeakness[primaryTopic].find((item: { topic: string }) => item.topic === topic)

    if (!topicObject) {
      return {
        strengths: [],
        weaknesses: [],
        unattempted: [],
      }
    }

    const extractData = (dataArr: any[]) => {
      return dataArr.map(
        (dataItem: {
          concept: string
          accuracy: number
          pace: number
          predicted_accuracy: number
          attempted_question_count: number
        }) => ({
          concept: dataItem.concept,
          accuracy: dataItem.accuracy,
          pace: dataItem.pace,
          predictedAccuracy: dataItem.predicted_accuracy,
          attemptedQuestionCount: dataItem.attempted_question_count,
        }),
      )
    }

    return {
      strengths: extractData(topicObject.concepts.strengths),
      weaknesses: extractData(topicObject.concepts.weaknesses),
      unattempted: extractData(topicObject.concepts.unattempted || []),
    }
  }

  const uniqueDataSlide1 = getDataForSlide1()
  const uniqueDataSlide2 = getDataForSlide2()

  return (
    <>
      <Carousel
        showThumbs={false}
        showArrows={false}
        showIndicators={false}
        autoPlay={false}
        showStatus={false}
        transitionTime={300}
        swipeable={false}
        selectedItem={carouselIndex}
        onChange={handleCarouselChange}
        dynamicHeight={true}
      >
        {/* Slide 1 */}
        <div key='cardStrengthWeaknessSlide1'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 5 }}>
              <Box sx={{ borderRadius: '50%', width: '12px', height: '12px', bgcolor: 'primary.main' }} />
              <Typography>Strength</Typography>
            </div>

            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 5 }}>
              <Box sx={{ borderRadius: '50%', width: '12px', height: '12px', bgcolor: 'warning.main' }} />
              <Typography>Weakness</Typography>
            </div>

            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 5 }}>
              <Box sx={{ borderRadius: '50%', width: '12px', height: '12px', bgcolor: 'secondary.main' }} />
              <Typography>Undefined</Typography>
            </div>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mt: 2,
              gap: 2,
              overflowX: 'auto',
            }}
          >
            <Box sx={{ display: 'column', alignItems: 'center', width: '100%', gap: 10 }}>
              <Typography
                sx={{
                  borderLeft: '14px solid',
                  borderColor: (theme: Theme) => theme.palette.primary.main,
                  backgroundColor: '#f6f6fa',
                  p: 1,
                  mb: 1,
                }}
              >
                Strengths
              </Typography>
              {uniqueDataSlide1?.strengths.length > 0 &&
                uniqueDataSlide1.strengths.map(strength => (
                  <Tooltip key={strength.topic} title={renderTooltipContent(strength)} arrow>
                    <Button
                      sx={{
                        p: 1,
                        border: 'solid .4px #69eb90',
                        bgcolor: '#69eb900a',
                        mb: 1,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                      }}
                      onClick={() => handleSelectedLabels('strengths', strength.topic)}
                    >
                      {strength.topic}
                    </Button>
                  </Tooltip>
                ))}
            </Box>

            <Box sx={{ display: 'column', alignItems: 'center', width: '100%', gap: 1 }}>
              <Typography
                sx={{
                  borderLeft: '14px solid',
                  borderColor: (theme: Theme) => theme.palette.warning.light,
                  backgroundColor: '#f6f6fa',
                  p: 1,
                  mb: 1,
                }}
              >
                Weakness
              </Typography>
              {uniqueDataSlide1?.weaknesses.length > 0 &&
                uniqueDataSlide1.weaknesses.map(weakness => (
                  <Tooltip key={weakness.topic} title={renderTooltipContent(weakness)} arrow>
                    <Button
                      sx={{
                        p: 1,
                        border: 'solid .4px #ffc38e',
                        bgcolor: '#ffc38e0a',
                        mb: 1,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                      }}
                      onClick={() => handleSelectedLabels('weaknesses', weakness.topic)}
                    >
                      {weakness.topic}
                    </Button>
                  </Tooltip>
                ))}
            </Box>

            <Box sx={{ display: 'column', alignItems: 'center', width: '100%', gap: 1 }}>
              <Typography
                sx={{
                  borderLeft: '14px solid',
                  borderColor: (theme: Theme) => theme.palette.grey[400],
                  backgroundColor: '#f6f6fa',
                  p: 1,
                  mb: 1,
                }}
              >
                Undefined
              </Typography>
              {uniqueDataSlide1?.unattempted.length > 0 &&
                uniqueDataSlide1.unattempted.map(unattempted => (
                  <Tooltip key={unattempted.topic} title={renderTooltipContent(unattempted)} arrow>
                    <Button
                      sx={{
                        p: 1,
                        border: 'solid .4px #b8c2cc',
                        bgcolor: '#f6f6fa',
                        mb: 1,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                      }}
                      onClick={() => handleSelectedLabels('unattempted', unattempted.topic)}
                    >
                      {unattempted.topic}
                    </Button>
                  </Tooltip>
                ))}
            </Box>
          </Box>
        </div>

        {/* Slide 2 */}
        {selectedLabels.slide1.length > 0 && carouselIndex === 1 ? (
          <div key='cardStrengthWeaknessSlide2'>
            {uniqueDataSlide2.strengths.length > 0 &&
              uniqueDataSlide2.strengths.map((strength: contentType) => (
                <Tooltip key={strength.conceptid} title={renderTooltipContent(strength)} arrow>
                  <Typography
                    sx={{
                      p: 1,
                      border: 'solid .4px #69eb90',
                      bgcolor: '#69eb900a',
                      mb: 1,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'start',
                    }}
                  >
                    {strength.concept}
                  </Typography>
                </Tooltip>
              ))}
            {uniqueDataSlide2?.weaknesses.length > 0 &&
              uniqueDataSlide2.weaknesses.map((weakness: contentType) => (
                <Tooltip key={weakness.conceptid} title={renderTooltipContent(weakness)} arrow>
                  <Typography
                    sx={{
                      p: 1,
                      border: 'solid .4px #ffc38e',
                      bgcolor: '#ffc38e0a',
                      mb: 1,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'start',
                    }}
                  >
                    {weakness.concept}
                  </Typography>
                </Tooltip>
              ))}
            {uniqueDataSlide2?.unattempted.length > 0 &&
              uniqueDataSlide2.unattempted.map((unattempted: contentType) => (
                <Tooltip key={unattempted.conceptid} title={renderTooltipContent(unattempted)} arrow>
                  <Typography
                    sx={{
                      p: 1,
                      border: 'solid .4px #b8c2cc',
                      bgcolor: '#f6f6fa',
                      mb: 1,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'start',
                    }}
                  >
                    {unattempted.concept}
                  </Typography>
                </Tooltip>
              ))}
          </div>
        ) : (
          <></>
        )}
        <></>
      </Carousel>

      <Box p={0} m={0} display='flex' flexDirection='row' justifyContent='end'>
        <IconButton disabled={shouldDisableLeftArrow()} onClick={goToPrevSlide}>
          <IconifyIcon icon='ep:arrow-left' />
        </IconButton>
        <IconButton disabled={shouldDisableRightArrow()} onClick={goToNextSlide}>
          <IconifyIcon icon='ep:arrow-right' />
        </IconButton>
      </Box>
    </>
  )
}

export default StrengthWeaknessCarousel
