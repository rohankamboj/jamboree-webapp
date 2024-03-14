// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import { Button } from '@mui/material'
import { GetPastAttemptsForUserResponseType, pastAttemptsList } from 'src/apis/type'
import { getDayMonthAndYearFromTimestamp } from 'src/utils'

type Order = 'asc' | 'desc'

interface HeadCell {
  disablePadding: boolean
  id: keyof pastAttemptsList
  label: string
  numeric: boolean
}

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof pastAttemptsList) => void
  order: Order
  orderBy: string
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }

  return 0
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order

    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

const headCells: readonly HeadCell[] = [
  {
    id: 'testID',
    numeric: false,
    disablePadding: true,
    label: 'Sr. No',
  },
  {
    id: 'testName',
    numeric: false,
    disablePadding: true,
    label: 'Test Name',
  },
  {
    id: 'attemptID',
    numeric: true,
    disablePadding: false,
    label: 'Attempted Date',
  },
  {
    id: 'score',
    numeric: true,
    disablePadding: false,
    label: 'Subject',
  },
  {
    id: 'accuracy',
    numeric: true,
    disablePadding: false,
    label: 'Accuracy',
  },
  {
    id: 'type',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
]

function EnhancedTableHead(props: EnhancedTableProps) {
  // ** Props
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof pastAttemptsList) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead sx={{ bgcolor: 'rgba(219, 218, 222, 1)' }}>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              onClick={createSortHandler(headCell.id)}
              direction={orderBy === headCell.id ? order : 'asc'}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const EnhancedTable = ({
  data,
  onClickViewAttemptButton,
}: {
  data: pastAttemptsList[] | undefined
  onClickViewAttemptButton: (attemptInfo: GetPastAttemptsForUserResponseType['data'][number]) => void
}) => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof pastAttemptsList>('testName')

  const handleRequestSort = (_: MouseEvent<unknown>, property: keyof pastAttemptsList) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(data!, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <TableRow hover tabIndex={-1} key={row.attemptID}>
                  <TableCell component='th' id={labelId} padding='normal'>
                    {index + 1}.
                  </TableCell>
                  <TableCell align='left'>{row.testName}</TableCell>
                  <TableCell align='left'>{getDayMonthAndYearFromTimestamp(row.lastUpdatedOn)}</TableCell>
                  <TableCell align='left'>{row.type}</TableCell>
                  <TableCell align='left' id={labelId} scope='row'>
                    {row.score}
                  </TableCell>
                  <TableCell align='left' padding='normal'>
                    <Button onClick={() => onClickViewAttemptButton(row)} variant='outlined' color='primary'>
                      View Attempts
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default EnhancedTable
