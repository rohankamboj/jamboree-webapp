// ** MUI Components
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'

// ** Styled Components
const TwoStepsIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500,
  },
}))

const TwoSteps = () => {
  // ** Hooks
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // const onSubmit = (formData: any) => {
  //   const otp = Object.values(formData).join('')
  //   console.log({ otp })
  // }

  return (
    <>
      <CustomHelmet title='Two steps verification' />
      <Box
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          overflowX: 'hidden',
          position: 'relative',
          minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`,
        }}
      >
        {!hidden ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              borderRadius: '20px',
              justifyContent: 'center',
              backgroundColor: 'customColors.bodyBg',
              margin: theme => theme.spacing(8, 0, 8, 8),
            }}
          >
            <TwoStepsIllustration alt='two-steps-illustration' src={`/images/pages/two-step-illustration.png`} />
          </Box>
        ) : null}
        {/* <OTPTextField onSubmit={onSubmit} /> */}
      </Box>
    </>
  )
}

export default TwoSteps
