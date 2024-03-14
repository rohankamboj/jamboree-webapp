import { MenuItem } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { useState } from 'react'
import CustomTextField from '../mui/text-field'

type Props = {
  options: Array<{
    label: string
    value: string
  }>
  onOptionChange: (value: string) => void
  fieldLabel?: string
  defaultValue?: string
}

function Dropdown({ options, defaultValue, onOptionChange, fieldLabel }: Props) {
  const [dropdownOption, setDropdownOption] = useState<string | undefined>(defaultValue)
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setDropdownOption(event.target.value as string)
    onOptionChange(event.target.value)
  }

  return (
    <CustomTextField
      select
      fullWidth
      defaultValue={defaultValue ?? ''}
      label={fieldLabel}
      id='form-layouts-separator-multiple-select'
      SelectProps={{
        value: dropdownOption,
        onChange: e => handleSelectChange(e as SelectChangeEvent<string>),
        // IconComponent: 'audio',
      }}
    >
      {options.map(({ label, value }) => (
        <MenuItem value={value}>{label}</MenuItem>
      ))}
    </CustomTextField>
  )
}

export default Dropdown
