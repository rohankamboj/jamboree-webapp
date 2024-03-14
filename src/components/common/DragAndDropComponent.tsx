import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import StyledBorderedBox from 'src/@core/components/mui/StyledBorderedBox'

export type Sections = {
  section: string
  sequence: string
}

const DragAndDropComponent = ({
  sections,
  onClick,
}: {
  sections: Sections[] | undefined
  onClick: (values: Sections[]) => void
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [values, setValues] = useState<Sections[]>(sections || [])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('index', index.toString())
    setDraggingIndex(index)
  }

  const handleDragOver = (index: number) => {
    if (draggingIndex === null) return
    const newValues = [...values]
    const draggedItem = newValues.splice(draggingIndex, 1)[0]
    newValues.splice(index, 0, draggedItem)
    setValues(newValues)
    setDraggingIndex(index)
  }

  const handleDragEnd = () => {
    setDraggingIndex(null)
  }

  return (
    <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' height='100vh'>
      {values.map(({ section, sequence }, idx) => (
        <StyledBorderedBox
          key={section + sequence}
          draggable
          onDragStart={e => handleDragStart(e, idx)}
          onDragOver={() => handleDragOver(idx)}
          onDragEnd={handleDragEnd}
          margin={2}
          padding={2}
          display='flex'
          width={300}
          borderRadius={1}
          gap={2}
          sx={{
            cursor: 'pointer',
          }}
        >
          <IconifyIcon icon='ci:hamburger-md' />
          <Typography
            sx={{
              textTransform: 'uppercase',
            }}
          >
            {section}
          </Typography>
        </StyledBorderedBox>
      ))}
      <Button variant='contained' onClick={() => onClick(values)}>
        Next
      </Button>
    </Box>
  )
}

export default DragAndDropComponent
