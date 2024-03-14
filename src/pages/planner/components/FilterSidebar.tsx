// ** MUI Imports
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

import { Drawer, Theme, useMediaQuery } from '@mui/material'
import { ThemeColor } from 'src/@core/layouts/types'
import { plannerEventTypesToColorMap } from '..'

type EventsFilterBar = {
  filtersWithColors: Record<string, ThemeColor>
  selectedFilters: string[]
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>
  isFilterSidebarOpen: boolean
  handleFilterSidebarToggle: () => void
}

const FilterSidebar = ({
  selectedFilters,
  setSelectedFilters,
  filtersWithColors,
  isFilterSidebarOpen,
  handleFilterSidebarToggle,
}: EventsFilterBar) => {
  const colorsArr = Object.entries(filtersWithColors)
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const handleAddFilter = (filter: string) => setSelectedFilters(curFilters => [...curFilters, filter])
  const handleRemoveFilter = (filter: string) =>
    setSelectedFilters(curFilters => curFilters.filter(curFilter => curFilter !== filter))

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]: string[]) => {
        return (
          <FormControlLabel
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
            control={
              <Checkbox
                color={value as ThemeColor}
                checked={selectedFilters.includes(key)}
                onChange={(_, checked) => {
                  checked ? handleAddFilter(key) : handleRemoveFilter(key)
                }}
              />
            }
          />
        )
      })
    : null

  if (renderFilters) {
    return (
      <Drawer
        open={isFilterSidebarOpen}
        onClose={handleFilterSidebarToggle}
        variant={isLg ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          zIndex: 3,
          display: 'block',
          position: isLg ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            borderRadius: 1,
            boxShadow: 'none',
            width: 300,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderBottomRightRadius: 0,
            zIndex: isLg ? 2 : 'drawer',
            position: isLg ? 'static' : 'absolute',
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
          },
        }}
      >
        <Box sx={{ p: 6, display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Typography variant='body2' sx={{ mb: 2, color: 'text.disabled', textTransform: 'uppercase' }}>
            Filters
          </Typography>
          <FormControlLabel
            label='View All'
            sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
            control={
              <Checkbox
                checked={selectedFilters?.length === colorsArr.length}
                onChange={(_, checked) =>
                  !checked ? setSelectedFilters([]) : setSelectedFilters(Object.keys(plannerEventTypesToColorMap))
                }
              />
            }
          />
          {renderFilters}
        </Box>
      </Drawer>
    )
  } else {
    return null
  }
}

export default FilterSidebar
