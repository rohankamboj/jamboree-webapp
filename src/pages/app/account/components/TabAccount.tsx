// ** React Imports
import { ElementType, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'

// ** Icon Imports

import { TabList, TabListProps } from '@mui/lab'
import { BoxProps } from '@mui/system'
import { ZapIcon } from 'src/assets/Icons/Icons'
import Avatar from 'src/assets/Images/Avatar2.png'
import { getUrlPath } from 'src/utils'
import { useUserContext } from 'src/@core/context/UserContext'
import { Product } from 'src/apis/type'

interface Data {
  email: string
  fullName: string
  phoneNumber: number | string
  bio: string
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
  },
  color: theme.palette.success.main,
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
}))

const BoxStyled = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
}))

const IconButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  background: 'linear-gradient(97.78deg, #64B3FB 1.2%, #0075FF 101.38%)',
  color: theme.palette.customColors.lightPaperBg,
  // [theme.breakpoints.down('md')]: {
  //     width: 300
  // },
  // [theme.breakpoints.up('lg')]: {
  //     width: 'auto'
  // },
}))

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  gap: 8,
  margin: '0px !important',
  [theme.breakpoints.up('md')]: {
    flexWrap: 'wrap',
  },
}))

const StyledTabList = styled(TabList)<TabListProps>(({ theme }) => ({
  border: '0 !important',
  margin: '0 !important',
  // ":hover": '0 !important',
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiTab-root': { p: 0, minWidth: 0, borderRadius: '10px', '&:not(:last-child)': { mr: 4 } },
  [theme.breakpoints.up('md')]: {
    display: 'hidden',
  },
}))

const TabAccount = () => {
  const [inputValue, setInputValue] = useState<FormData>()
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  const { userDetailsWithBio, updateUserInfo, updateUserAvatar, userInit, changeActiveProduct } = useUserContext()

  const { control, handleSubmit, reset } = useForm<Data>({
    defaultValues: {
      fullName: userDetailsWithBio?.data.name || '',
      bio: userDetailsWithBio?.meta?.bio || '',
    },
  })

  const onSubmit = async (formData: Data) => {
    let uploadedImage
    if (inputValue) {
      uploadedImage = await updateUserAvatar.mutateAsync({
        data: inputValue!,
        handleError: alert,
      })
    }

    updateUserInfo.mutate({
      data: {
        meta: { ...(formData.bio && { bio: formData.bio }), ...(inputValue && { avatar: uploadedImage.path }) },
        ...(formData.fullName && { name: formData.fullName }),
      },
      handleError: alert,
    })
  }

  const handleInputImageReset = () => {
    // setInputValue('')
    setImgSrc(Avatar)
  }

  // TODO: Currently the errors from BE are not showing up in forms need to fix this.

  const handleActiveProductChange = (productId: Product['id']) => {
    changeActiveProduct.mutate({
      data: { productId },
    })
  }

  const renderProducts = useMemo(() => {
    const productsToRender: React.ReactNode[] = []
    // Bring active item at the from
    userInit?.data.products?.forEach(item => {
      if (item.isActive)
        productsToRender.unshift(
          <div key={item.id}>
            <IconButtonStyled color='info' sx={{ display: 'flex', gap: 2, cursor: 'not-allowed' }}>
              <ZapIcon color={'white'} />
              {item.name}
            </IconButtonStyled>
          </div>,
        )
      else {
        productsToRender.push(
          <div key={item.id}>
            <Button
              sx={{ cursor: changeActiveProduct.isLoading ? 'progress' : undefined }}
              onClick={() => handleActiveProductChange(item.id)}
              variant='tonal'
              color='secondary'
            >
              {item.name}
            </Button>
          </div>,
        )
      }
    })
    return productsToRender
  }, [userInit, changeActiveProduct.isLoading])

  const handleImageChange = (file: any) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])
      const imageFormData = new FormData()
      imageFormData.append('avatar', files[0])
      setInputValue(imageFormData)
    }
  }

  const imgToRender = imgSrc
    ? imgSrc
    : userDetailsWithBio?.meta.avatar
    ? getUrlPath(userDetailsWithBio?.meta?.avatar!)
    : Avatar

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 0 }}>
          <CardHeader title='Profile Details' />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent sx={{ pt: 0 }}>
              <BoxStyled display='flex'>
                <ImgStyled src={imgToRender} alt='Profile Pic' />
                <div style={{ marginTop: 10 }}>
                  <ButtonStyled component='label' variant='tonal' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      accept='image/png, image/jpeg'
                      onChange={file => handleImageChange(file)}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                    Reset
                  </ResetButtonStyled>
                  <Typography marginTop={4} color='text.disabled'>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </div>
              </BoxStyled>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='fullName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label='Name'
                        placeholder='Full Name'
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    type='email'
                    label='Email'
                    value={userDetailsWithBio?.data.email || ''}
                    placeholder='utsab.mittal@example.com'
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    type='number'
                    label='Phone Number'
                    disabled
                    value={userDetailsWithBio?.meta.phone || ''}
                    // placeholder='+91 123 456 789'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Active Product</Typography>
                  <StyledTabList variant='scrollable' scrollButtons={false}>
                    <StyledBox>{renderProducts}</StyledBox>
                  </StyledTabList>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name='bio'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        minRows={8}
                        label='Bio Data'
                        value={value}
                        onChange={onChange}
                        placeholder='Write something about yourself'
                        sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                  <Button
                    variant='contained'
                    sx={{ mr: 4 }}
                    type='submit'
                    //  disabled={!formState.isDirty}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={() => reset()} type='reset' variant='tonal' color='secondary'>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TabAccount
