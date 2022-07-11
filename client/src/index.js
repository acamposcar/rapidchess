import { ColorModeScript, ChakraProvider } from '@chakra-ui/react'
import React, { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import { AuthContextProvider } from './contexts/authContext'
import { BrowserRouter } from 'react-router-dom'
import theme from './theme'
const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <StrictMode>
    <AuthContextProvider>
      <ColorModeScript />
      <BrowserRouter>
        <ChakraProvider theme={theme} resetCSS>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
)
