import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QueryClient, QueryClientProvider, QueryCache } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Layout from './components/Layout'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1
    }
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // show error for background refetches
      if (query.state.data !== undefined) {
        toast.error(`Something went wrong: ${error.message}`)
      }
    }
  })
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Routes>
        <Route
          path='/' element={
            <Layout />
          }
        >
          <Route index element={<Home />} />
          <Route path='/games/:gameId' element={<Game />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider >

  )
}

export default App
