// ** Type Imports
import { Palette } from '@mui/material'
import { Skin } from 'src/@core/layouts/types'

const DefaultPalette = (mode: Palette['mode'], skin: Skin): Palette => {
  // ** Vars
  const whiteColor = '#FFF'
  // Updated
  // const lightColor = '115, 103, 240'
  const lightColor = '75, 70, 92'
  const darkColor = '134, 146, 208'
  const darkPaperBgColor = '#2F3349'
  const mainColor = mode === 'light' ? lightColor : darkColor

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return whiteColor
    } else if (skin === 'bordered' && mode === 'dark') {
      return darkPaperBgColor
    } else if (mode === 'light') {
      return whiteColor
    } else return '#25293C'
  }

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#F8F7FA' : '#25293C', // Same as palette.background.default but doesn't consider bordered skin
      trackBg: mode === 'light' ? '#F1F0F2' : '#363B54',
      avatarBg: mode === 'light' ? '#DBDADE' : '#4A5072',
      tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#4A5072',
    },
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor,
    },
    primary: {
      light: 'rgba(0, 121, 81, 0.2)',
      // main: '#fffff',
      main: '#00875A',
      dark: 'rgba(0, 121, 81, 1)',
      contrastText: whiteColor,
      100: 'rgba(255, 255, 255, 0.40) 100%)',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#00875A',
      600: 'rgba(0, 0, 0, 0.1)',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    secondary: {
      light: '#B2B4B8',
      main: '#A8AAAE',
      dark: '#949699',
      contrastText: whiteColor,
    },
    error: {
      light: '#fbdddd',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: whiteColor,
    },
    warning: {
      light: '#FFAB5A',
      main: '#FF9F43',
      dark: '#E08C3B',
      contrastText: whiteColor,
    },
    info: {
      light: '#1FD5EB',
      main: '#00CFE8',
      dark: '#00B6CC',
      contrastText: whiteColor,
    },
    success: {
      light: '#42CE80',
      main: '#28C76F',
      dark: '#23AF62',
      contrastText: whiteColor,
    },
    grey: {
      50: '#839588',
      100: '#A5A3AE',
      200: '#5D596C',
      300: '#E6EAE7',
      400: '#DBDADE',
      500: '#9E9E9E',
      600: '#6F6B7D',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161',
    },
    text: {
      primary: `#4B465C`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.42)`,
    },
    divider: `rgba(${mainColor}, 0.16)`,
    background: {
      paper: mode === 'light' ? whiteColor : darkPaperBgColor,
      default: defaultBgColor(),
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.06)`,
      selectedOpacity: 0.06,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`,
    },
  } as unknown as Palette
}

export default DefaultPalette
