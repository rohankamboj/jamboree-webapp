import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Fragment } from 'react'
import { formatSecondsToDateString } from 'src/@core/utils/helpers'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig
const TableView = ({
  tableHeaderRows,
  pastAttemptsQuery,
}: {
  tableHeaderRows: {
    label: string
  }[]
  pastAttemptsQuery: GetattemptRecordItem[]
}) => {
  return (
    <Grid margin={4} sx={{ border, borderRadius: 1 }}>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              {tableHeaderRows.map(({ label }, i, arr) => (
                <TableCell key={label} align='center' width={arr.length - 1 === i ? '205px' : undefined}>
                  <Typography>{label}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pastAttemptsQuery.map((attemptInfo, idx) => (
              <Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell component='th' scope='row'>
                    <Typography align='center'>#{idx + 1}</Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography>{attemptInfo.quizname}</Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography>NA</Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography>
                      {formatSecondsToDateString(attemptInfo.addedOn, {
                        showTime: false,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography textTransform='capitalize'>
                      {attemptInfo.quizSubject ? JSON.parse(attemptInfo.quizSubject) : 'NA'}
                    </Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Button variant='outlined' sx={{ width: '100%' }}>
                      {attemptInfo.status === '3'
                        ? 'Open Summary'
                        : attemptInfo.status === '1'
                        ? 'Resume Quiz'
                        : 'Processing..'}
                    </Button>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}

export default TableView
