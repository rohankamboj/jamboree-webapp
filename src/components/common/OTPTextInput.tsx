import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import Cleave from 'cleave.js/react'

import { Link } from '@mui/material'
import { ChangeEvent, useState, KeyboardEvent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Logo from '/logo.svg'

import 'cleave.js/dist/addons/cleave-phone.us'

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: '',
}

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750,
  },
}))

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 48,
  textAlign: 'center',
  height: '48px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2),
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none',
  },
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
}))

const OTPTextField = ({
  onSubmit,
  phoneNumber,
  handleClose,
}: {
  onSubmit: (data: any) => void
  phoneNumber: string
  handleClose: () => void
}) => {
  const [isBackspace, setIsBackspace] = useState<boolean>(false)
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  const errorsArray = Object.keys(errors)

  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace) {
      onChange(event)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index].value && form[index].value.length) {
        form.elements[index + 1].focus()
      }
      event.preventDefault()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }
  return (
    <StyledBox>
      <Box
        sx={{
          p: [6, 12],
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <img src={Logo} alt='Jamboree' width={200} />
          <Box sx={{ my: 6 }}>
            <Typography variant='h3' sx={{ mb: 1.5 }}>
              Two-Step Verification 💬
            </Typography>
            <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
              We sent a verification code to your mobile. Enter the code from the mobile in the field below.
            </Typography>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='h6'>******{phoneNumber?.slice(-4)}</Typography>
              <Typography
                variant='h6'
                color='primary.main'
                sx={{
                  cursor: 'pointer',
                }}
                onClick={handleClose}
              >
                Change no.
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Type your 6 digit security code</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CleaveWrapper
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...(errorsArray.length && {
                  '& .invalid:focus': {
                    borderColor: theme => `${theme.palette.error.main} !important`,
                    boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`,
                  },
                }),
              }}
            >
              {renderInputs()}
            </CleaveWrapper>
            {errorsArray.length ? (
              <FormHelperText sx={{ color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}>
                Please enter a valid OTP
              </FormHelperText>
            ) : null}
            <Button fullWidth type='submit' variant='contained' sx={{ mt: 2 }}>
              Verify My Account
            </Button>
          </form>
          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>Didn't get the code?</Typography>
            <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
              Resend
            </Typography>
          </Box>
        </Box>
      </Box>
    </StyledBox>
  )
}

export default OTPTextField
