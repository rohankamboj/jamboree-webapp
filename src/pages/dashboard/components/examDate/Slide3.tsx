import { Box } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'

// ** MUI Imports
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiRadio, { RadioProps } from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
// TODO: User hasAttempted.
const Slide3 = ({ hasAttempted, courseName }: { hasAttempted: 0 | 1; courseName: string }) => {
  console.log({ hasAttempted })
  return (
    <>
      <Box bgcolor='#F6F6F7' padding={4}>
        <Typography variant='h5'>Have you attempted {courseName} before?</Typography>
      </Box>
      <Box display='flex' flexDirection='column' gap={4} padding={4}>
        <Typography variant='paragraphMedium'>
          This information is passed to your faculty, to help them guide you in the best possible way.
        </Typography>
        <RadioCustomized courseName={courseName} />
      </Box>
    </>
  )
}

const Radio = (props: RadioProps) => {
  return (
    <MuiRadio
      {...props}
      disableRipple={true}
      sx={{ '& svg': { height: 18, width: 18 } }}
      checkedIcon={
        <svg width='28' height='28' viewBox='0 0 24 24'>
          <path fill='currentColor' d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z' />
        </svg>
      }
      icon={
        <svg width='28' height='28' viewBox='0 0 24 24'>
          <path
            fill='currentColor'
            d='M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
          />
        </svg>
      }
    />
  )
}

const RadioCustomized = ({ courseName }: { courseName: string }) => {
  return (
    <FormControl>
      <RadioGroup
        row
        defaultValue='yes'
        aria-label='attempted GMAT Exam'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          margin: 4,
        }}
      >
        <FormControlLabel
          sx={{
            border,
            width: '100%',
            borderRadius: 1,
            padding: 4,
          }}
          value='yes'
          control={<Radio />}
          label={
            <Box>
              <Typography>Yes</Typography>
              <Typography>Yes, I have attempted a {courseName} exam before.</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{
            border,
            width: '100%',
            borderRadius: 1,
            padding: 4,
          }}
          value='no'
          control={<Radio />}
          label={
            <Box>
              <Typography>No</Typography>
              <Typography>No, I haven't attempted a {courseName} exam before.</Typography>
            </Box>
          }
        />
      </RadioGroup>
    </FormControl>
  )
}

export default Slide3
