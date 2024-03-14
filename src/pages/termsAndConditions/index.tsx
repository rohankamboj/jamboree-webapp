import { Typography } from '@mui/material'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import { useUserContext } from 'src/@core/context/UserContext'

const TermsAndConditions = () => {
  const { termsAndConditions, loading } = useUserContext()

  if (loading) return <FallbackSpinner />

  return (
    <>
      <CustomHelmet title='Terms & Conditions' />
      <Typography
        sx={{
          padding: 4,
        }}
        dangerouslySetInnerHTML={{ __html: termsAndConditions?.data[0].content! }}
      />
    </>
  )
}

export default TermsAndConditions
