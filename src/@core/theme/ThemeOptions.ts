// ** MUI Theme Provider
import { PaletteMode, ThemeOptions } from '@mui/material'
import { deepmerge } from '@mui/utils'

// ** User Theme Options
import UserThemeOptions from 'src/@core/layouts/UserThemeOptions'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Theme Override Imports
import breakpoints from './breakpoints'
import overrides from './overrides'
import palette from './palette'
import shadows from './shadows'
import spacing from './spacing'
import typography from './typography'

const themeOptions = (settings: Settings, overrideMode: PaletteMode): ThemeOptions => {
  // ** Vars
  const { skin, mode, themeColor } = settings

  // ** Create New object before removing user component overrides and typography objects from userThemeOptions
  const userThemeConfig: ThemeOptions = Object.assign({}, UserThemeOptions())

  const mergedThemeConfig: ThemeOptions = deepmerge(
    {
      breakpoints: breakpoints(),
      // direction,
      components: {
        ...overrides(settings),
      },
      palette: palette(mode === 'semi-dark' ? overrideMode : mode, skin),
      ...spacing,
      shape: {
        borderRadius: 6,
      },
      mixins: {
        toolbar: {
          minHeight: 64,
        },
      },
      shadows: shadows(mode === 'semi-dark' ? overrideMode : mode),
      typography: {
        ...typography,
        fontFamily: 'Public Sans',
      },
      border: '1px solid rgba(219, 218, 222, 1)',
    },
    userThemeConfig,
  )

  return deepmerge(mergedThemeConfig, {
    palette: {
      primary: {
        ...(mergedThemeConfig.palette
          ? // TODO: Fix this
            // @ts-ignore
            mergedThemeConfig.palette[themeColor]
          : palette(mode === 'semi-dark' ? overrideMode : mode, skin).primary),
      },
    },
  })
}

export default themeOptions
