import { ColorModeScript, ChakraProvider, theme } from '@chakra-ui/react'
import React, { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import { AuthContextProvider } from './store/auth-context'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <StrictMode>
    <AuthContextProvider>
      <ColorModeScript />
      <BrowserRouter>

        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </BrowserRouter>

    </AuthContextProvider>
  </StrictMode>
)
