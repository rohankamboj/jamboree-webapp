import { Box } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'

const currentDateTimeInSeconds = new Date().getTime() / 1000

const ExamDate = ({
  examDate = currentDateTimeInSeconds,
  openSetExamDateModal,
}: {
  examDate: number
  openSetExamDateModal: () => void
}) => {
  const examDateObject = new Date(examDate * 1000)
  const examDay = examDateObject.getDate()
  const examMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(examDateObject)
  const daysToGo = Math.floor((examDate - currentDateTimeInSeconds) / 86400) + 1
  return (
    <>
      <div
        className='linear-gradient-blue'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '24px',
          paddingTop: '20px',
          paddingBottom: '12px',
          paddingRight: '24px',
        }}
      >
        <Typography color='white' variant='h5'>
          Exam Date
        </Typography>
        <Typography
          color='#96B2FE'
          sx={{
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={openSetExamDateModal}
        >
          Edit
        </Typography>
      </div>
      <Box
        bgcolor='#E7F5FF'
        padding={'24px'}
        sx={{
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
        display='flex'
        alignItems='center'
        gap={4}
      >
        <Box
          padding='14px'
          bgcolor='white'
          display='flex'
          flexDirection='column'
          alignItems='center'
          borderRadius={1}
          boxShadow={10}
        >
          <Typography variant='h4'>{examDay}</Typography>
          <Typography variant='h6'>{examMonth}</Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={1}>
          {/* Days left from current date */}
          <Typography
            variant='h5'
            color='#31A9FF'
            sx={{
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
          >
            {daysToGo} days
          </Typography>
          <Typography variant='h5'>to go...</Typography>
        </Box>
      </Box>
    </>
  )
}

export default ExamDate
