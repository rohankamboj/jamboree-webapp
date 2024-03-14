// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useUserContext } from 'src/@core/context/UserContext'
import { ZapIcon } from 'src/assets/Icons/Icons'
import Avatar from 'src/assets/Images/Avatar2.png'
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { AccountAboutType } from 'src/types/type'
import { capitalizeFirstLetter, getUrlPath } from 'src/utils'

const { border } = themeConfig

const renderList = (aboutData: AccountAboutType[]) => {
  if (aboutData?.length <= 0) return null
  return aboutData.map(item => {
    return (
      <Box
        key={item.value}
        sx={{
          display: 'flex',
          '&:not(:last-of-type)': { mb: 3 },
          '& svg': { color: 'text.secondary' },
        }}
      >
        <Box sx={{ display: 'flex', mr: 2 }}>
          <Icon fontSize='1.25rem' icon={item.icon} />
        </Box>

        <Box
          sx={{
            columnGap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            backgroundColor: 'primary[500]',
          }}
        >
          <Typography variant='h6' color='text.secondary'>
            {capitalizeFirstLetter(item.property)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{item.value}</Typography>
        </Box>
      </Box>
    )
  })
}

const ImgStyled = styled('img')(() => ({
  width: 100,
  height: 100,
  marginBottom: 4,
}))

const AccountsProfileCardSection = () => {
  const { userDetailsWithBio, userInit } = useUserContext()
  const theme = useTheme()
  const about = [
    {
      icon: 'tabler:user',
      property: 'Full Name',
      value: userDetailsWithBio?.data.name,
    },
    {
      icon: 'tabler:check',
      property: 'Email',
      value: userDetailsWithBio?.data.email,
    },
    {
      icon: 'tabler:crown',
      property: 'Phone Number',
      value: userDetailsWithBio?.meta.phone,
    },
    {
      icon: 'tabler:file-description',
      property: 'About',
      value: 'English',
    },
  ]

  const activeProductForUser = userInit?.data?.products?.find(p => p.isActive)?.name || 'No valid product'

  const imgToRender = userDetailsWithBio?.meta.avatar ? getUrlPath(userDetailsWithBio?.meta.avatar) : Avatar

  return (
    <Grid spacing={6}>
      <Grid xs={12}>
        <Card sx={{ border, boxShadow: 0 }}>
          <Box>
            <Box sx={{ py: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <ImgStyled src={imgToRender} alt='Profile Pic' />
            </Box>
            <Divider variant='fullWidth' />

            <Box display={'flex'} gap={4} flexDirection={'column'} padding={5}>
              <Box display={'flex'} gap={4} flexDirection={'column'}>
                <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                  About
                </Typography>
                <div>{renderList(about)}</div>
              </Box>
              <Box>
                <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase', pb: 2 }}>
                  Active Product
                </Typography>
                <Button
                  fullWidth
                  variant='outlined'
                  color='secondary'
                  sx={{ display: 'flex', justifyContent: 'start', gap: 2, borderColor: theme.palette.grey[400] }}
                >
                  <ZapIcon color={'#5BADFB'} />
                  <Typography variant='body1'>{activeProductForUser}</Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AccountsProfileCardSection
