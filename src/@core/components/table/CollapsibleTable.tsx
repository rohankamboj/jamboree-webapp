// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { userData } from 'src/apis/type'
import { formatSecondsToDateString } from 'src/@core/utils/helpers'

const formatToTableView = (timeStampInSeconds: string) =>
  formatSecondsToDateString(timeStampInSeconds, {
    month: 'short',
    showTime: false,
  })

function formatTimePreferencesForTableRow(appointment: userData.appointmentList) {
  return [appointment.preference1, appointment.preference2, appointment.preference3].map(formatToTableView).join(', ')
}

const AWARow = (props: {
  row: userData.awaList
  renderScore?: boolean
  handleActionButton?: (row: userData.awaList) => void
}) => {
  const { row, renderScore, handleActionButton } = props

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component='th' scope='row'>
          <Typography textTransform='capitalize'>{row.id}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{row.awaPrompt}</Typography>
        </TableCell>

        <TableCell align='left'>
          <Typography>{formatSecondsToDateString(row.addedOn)} </Typography>
        </TableCell>
        <TableCell>
          <Typography>{'To be defined'}</Typography>
        </TableCell>
        {renderScore && (
          <TableCell>
            <Typography>{'renderScore'}</Typography>
          </TableCell>
        )}
        <TableCell align='right'>
          <IconButton aria-label='expand row' size='small' onClick={() => handleActionButton?.(row)}>
            <Icon icon={'tabler:plus'} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }}></TableCell>
      </TableRow>
    </Fragment>
  )
}
const Row = (props: { row: userData.appointmentList; renderPickedDate?: boolean }) => {
  const { row, renderPickedDate } = props

  const [open, setOpen] = useState<boolean>(false)

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset', cursor: 'pointer' } }} onClick={() => setOpen(!open)}>
        <TableCell component='th' scope='row'>
          <Typography textTransform='capitalize'>{row.faculty}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{formatTimePreferencesForTableRow(row)}</Typography>
        </TableCell>
        {renderPickedDate && row.requestDate && (
          <TableCell align='left'>
            <Typography>{formatToTableView(row.requestDate)}</Typography>
          </TableCell>
        )}
        <TableCell align='left'>
          <Typography>{row.duration} minutes</Typography>
        </TableCell>
        <TableCell align='right'>
          <IconButton aria-label='expand row' size='small'>
            <Icon icon={open ? 'tabler:minus' : 'tabler:plus'} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box display={'flex'} gap={10} paddingY={6}>
              <Box display={'flex'} flexDirection={'column'} gap={4}>
                <Typography>Contact</Typography>
                <Typography>Message</Typography>
              </Box>
              <Box display={'flex'} flexDirection={'column'} gap={4}>
                <Typography>not define</Typography>
                <Typography>{row.message}</Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

type ITableProps = {
  headerRow: Array<{
    label: string
    icon?: string
  }>
  data: userData.appointmentList[] | userData.awaList[]
  renderPickedDate?: boolean
  isAWARow?: boolean
  handleActionButton?: (row: userData.awaList) => void
}

const TableCollapsible = ({ headerRow, data, renderPickedDate, isAWARow, handleActionButton }: ITableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            {headerRow.map(({ icon, label }) =>
              icon ? (
                <TableCell key={label}>
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <Icon icon={icon} />
                    <Typography>{label}</Typography>
                  </Box>
                </TableCell>
              ) : (
                <TableCell align='right' key={label}>
                  <Typography>Action</Typography>
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row =>
            isAWARow ? (
              // @ts-ignore
              <AWARow key={row.id} row={row} handleActionButton={handleActionButton} />
            ) : (
              // @ts-ignore
              <Row key={row.id} row={row} renderPickedDate={renderPickedDate} />
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableCollapsible
