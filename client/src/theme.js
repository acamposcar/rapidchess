import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: 'white'
      }
    }
  },
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '850px',
    xl: '1200px',
    '2xl': '1536px'
  },
  colors: {
    bgDark: '#1C1C1C',
    lightSquare: '#808080',
    darkSquare: '#1C1C1C'
  },
  components: {
    Button: {
      variants: {
        outline: {
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'
        }
      },
      defaultProps: {
        colorScheme: 'blue'
      }
    },
    Link: {
      variants: {
        primary: ({ colorScheme = 'blue' }) => ({
          color: `${colorScheme}.400`,
          _hover: {
            color: `${colorScheme}.500`,
            textDecoration: 'none'
          }
        })
      },
      defaultProps: {
        variant: 'primary'
      }
    }
  }
})

export default theme
