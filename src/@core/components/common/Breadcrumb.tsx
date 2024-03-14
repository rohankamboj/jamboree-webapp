import { Box, styled } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link, { LinkProps } from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { TypographyProps } from '@mui/system'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { breadcrumbNameMap } from 'src/@core/constants'
import IconifyIcon from '../icon'
import { ReactNode } from 'react'

interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}

function LinkRouter(props: LinkRouterProps) {
  return <Link {...props} component={RouterLink as any} />
}

export const StyledTitle = styled(Typography)<TypographyProps>(() => ({
  fontFamily: 'Inter',
  fontSize: '24px',
  lineHeight: '32.77px',
  fontWeight: '500',
  paddingRight: '1rem',
  borderRight: '2px solid #d6dce1',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
}))

export const StyledLastBreadcrumb = styled(Typography)<TypographyProps>(() => ({
  color: '#4B465C',
  fontWeight: '500',
  fontSize: '15px',
  lineHeight: '22px',
  fontFamily: 'Inter',
  whiteSpace: 'nowrap',
}))

export const StyledBreadcrumbLink = styled(LinkRouter)<LinkRouterProps>(() => ({
  color: '#6F6B7D',
  fontWeight: '400',
  fontSize: '15px',
  lineHeight: '22px',
  fontFamily: 'Inter',
}))

export function CustomBreadcrumbs({ title }: { title?: string }) {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  const breadcrumbTitle = title ?? pathnames[pathnames.length - 1].split('-').join(' ')
  return (
    <Box display='flex' overflow='scroll' alignItems={'center'} gap={4} paddingBottom={4}>
      <StyledTitle>{breadcrumbTitle}</StyledTitle>
      <CustomizedBreadcrumb>
        {pathnames.map((_, index) => {
          const last = index === pathnames.length - 1
          const to = `/${pathnames.slice(0, index + 1).join('/')}`

          return last ? (
            <StyledLastBreadcrumb key={to}>{breadcrumbNameMap[to]}</StyledLastBreadcrumb>
          ) : (
            <StyledBreadcrumbLink underline='hover' to={to} key={to}>
              {breadcrumbNameMap[to]}
            </StyledBreadcrumbLink>
          )
        })}
      </CustomizedBreadcrumb>
    </Box>
  )
}

export const CustomizedBreadcrumb = ({ children }: { children: ReactNode }) => {
  const StyledBreadcrumbs = styled(Breadcrumbs)`
    .MuiBreadcrumbs-ol {
      flex-wrap: nowrap;
    }
  `
  return (
    <StyledBreadcrumbs separator={<IconifyIcon icon='material-symbols-light:chevron-right' />} aria-label='breadcrumb'>
      {children}
    </StyledBreadcrumbs>
  )
}
