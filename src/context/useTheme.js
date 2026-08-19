import { useContext } from 'react'
import { ThemeContext } from './themeContextCore'

export const useTheme = () => useContext(ThemeContext)
