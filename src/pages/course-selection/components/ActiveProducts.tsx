import { Box, Button, Typography } from '@mui/material'
import { Product } from 'src/apis/type'
import themeConfig from 'src/configs/themeConfig'

type Props = {
  product: Product
  onClickActiveProduct: (product: Product) => void
}

const { border } = themeConfig

export const ActiveProducts = (props: Props) => {
  const { name, expiry: dateInSeconds } = props.product

  const parsedDate = !dateInSeconds ? ' ∞ ' : new Date(dateInSeconds * 1000).toLocaleDateString()

  return (
    <Box border={border} p={4} minWidth={'250px'} minHeight={'200px'} borderRadius={1}>
      <Typography variant='h6' borderBottom={border} pb={4} minHeight='60px'>
        {name}
      </Typography>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={4}>
        <Typography
          color='#FF2E2E'
          /* @ts-ignore */
          variant='paragraphMedium'
        >
          EXPIRY
        </Typography>
        {/* @ts-ignore */}
        <Typography variant='paragraphMedium'>{parsedDate}</Typography>
      </Box>
      <Box display='flex' justifyContent='end' sx={{ marginTop: 7 }}>
        <Button onClick={() => props.onClickActiveProduct(props.product)} variant='contained' color='primary'>
          Resume
        </Button>
      </Box>
    </Box>
  )
}
