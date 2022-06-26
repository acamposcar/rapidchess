import React, { useContext } from 'react'
import {
  Box
} from '@chakra-ui/react'
import GameBoard from './pages/GameBoard'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AuthContext from './store/auth-context'
import Header from './components/Header'
import Register from './pages/Register'
import Home from './pages/Home'

const App = () => {
  const authCtx = useContext(AuthContext)
  return (

    <Box textAlign='center' fontSize='xl'>
      <Header />
      <Routes>
        {!authCtx.isLoggedIn && (
          <>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
          </>
        )}
        {authCtx.isLoggedIn && (
          <>
            <Route path='/login' element={<Navigate to='/' replace />} />
            <Route path='/register' element={<Navigate to='/' replace />} />
            <Route path='/logout' element={<Navigate to='/' replace />} />
            <Route path='/' element={<Home />} />
            <Route path='/games/:gameId' element={<GameBoard boardWidth='500' />} />
          </>
        )}
      </Routes>
    </Box>
  )
}

export default App
