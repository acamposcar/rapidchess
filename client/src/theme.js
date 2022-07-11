import { extendTheme } from '@chakra-ui/react'

const activeLabelStyles = {
  transform: 'scale(0.7) translateY(-8px) translateX(3px) '

}

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: 'white'
      }
    }
  },
  colors: {
    bgDark: '#121212'
  },
  // fonts: {
  //   body: 'Roboto, sans-serif',
  //   heading: 'Roboto, serif',
  //   mono: 'Menlo, monospace'
  // },
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
