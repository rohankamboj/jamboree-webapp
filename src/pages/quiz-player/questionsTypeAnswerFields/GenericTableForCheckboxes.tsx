import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useCallback, useMemo } from 'react'

type Props = {
  rows: Array<string>
  recordResponseRowWise?: boolean
  columns: Array<{ id: number; label: string }>
  numberOfCheckBoxToRender: number
  currentValue: Array<string> | undefined
  onChange: (
    prevValue: Array<string> | undefined | null | ((prevValue: Array<string> | undefined | null) => Array<string>),
  ) => Array<string>
}

function createData(name: string) {
  return { name }
}

const GenericTableWithCheckboxes = (props: Props) => {
  const { rows, columns, numberOfCheckBoxToRender, onChange, recordResponseRowWise = false } = props
  const rowsData = rows.map(name => createData(name))
  const handleOnCheckBoxSelect = (isNotChecked: boolean, rowIdx: number, columnIdx: number) => {
    onChange(prevValue => {
      // New logic that allows row wise recording of responses.
      if (recordResponseRowWise) {
        if (Array.isArray(prevValue)) {
          const currentUserResponseCopy = [...prevValue]
          currentUserResponseCopy[rowIdx] = !isNotChecked ? '' : (columnIdx + 1).toString()
          return currentUserResponseCopy
        } else {
          const emptyArray: Array<string> = new Array(rows.length)
          emptyArray[rowIdx] = !isNotChecked ? '' : ((columnIdx + 1).toString() as string)
          return emptyArray
        }
      } else {
        // Old logic with column wise recording of responses.
        if (Array.isArray(prevValue)) {
          const currentUserResponseCopy = [...prevValue]
          currentUserResponseCopy[columnIdx] = !isNotChecked ? '' : (rowIdx + 1).toString()
          return currentUserResponseCopy
        } else {
          const emptyArray = new Array(numberOfCheckBoxToRender)
          emptyArray[columnIdx] = !isNotChecked ? '' : ((rowIdx + 1).toString() as string)
          return emptyArray
        }
      }
    })
  }

  const isCheckBoxChecked = useCallback(
    (rowIdx: number, columnIdx: number) =>
      recordResponseRowWise
        ? // Row wise recording of responses.
          props.currentValue?.[rowIdx] === (columnIdx + 1).toString()
        : // Column wise recording of responses.
          props.currentValue?.[columnIdx] === (rowIdx + 1).toString(),
    [props.currentValue],
  )

  const checkboxesArray = useMemo(() => new Array(numberOfCheckBoxToRender).fill(''), [numberOfCheckBoxToRender])

  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.id} align='center'>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsData.map((row, rowIdx) => (
            <TableRow key={row.name + rowIdx}>
              {/* TODO: This needs to be added back */}
              {/* {columns[0].id === 'id' && (
                <TableCell component='th' scope='row' align='center'>
                  {getAlphabetAtIndex(rowIdx + 1)}
                </TableCell>
              )} */}
              {checkboxesArray.map((_, index) => (
                <TableCell key={rowIdx + '__' + index} align='center'>
                  <Checkbox
                    checked={isCheckBoxChecked(rowIdx, index)}
                    onChange={e => handleOnCheckBoxSelect(e.target.checked, rowIdx, index)}
                  />
                </TableCell>
              ))}
              <TableCell align='center'>{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default GenericTableWithCheckboxes
