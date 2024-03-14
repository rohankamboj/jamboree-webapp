import { Box, Link, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'

const Links = [
  {
    id: 1,
    name: 'Notes',
    link: '/app/notes',
  },
  {
    id: 2,
    name: 'Help',
    link: 'https://helpcentre.jamboree.online/hc/',
  },
  {
    id: 3,
    name: 'Contact Admin',
    link: 'app/contact-admin',
  },
  {
    id: 4,
    name: 'Contact Faculty',
    link: '/app/account/appointment/create',
  },
]

const QuickLinks = () => {
  return (
    <StyledBorderedBox borderRadius={1} padding='24px'>
      <Typography variant='h5'>Quick Links</Typography>

      <Box display='flex' flexDirection='column' gap={3} mt={4}>
        {Links.map(item => (
          <Link
            href={item.link}
            key={item.id}
            display='flex'
            gap={2}
            alignItems='center'
            sx={{
              color: 'grey.200',
              '&:hover': {
                color: 'info.main',
              },
            }}
          >
            <Box borderRadius={1} color='info.main' bgcolor='#EBFBFD' padding={2}>
              <IconifyIcon icon='tabler:link' color='inherit' />
            </Box>
            <Typography color='inherit'>{item.name}</Typography>
          </Link>
        ))}
      </Box>
    </StyledBorderedBox>
  )
}

export default QuickLinks
