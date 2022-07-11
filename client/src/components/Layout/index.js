import React, { useLayoutEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Header'
const Layout = () => {
  const location = useLocation()
  const bgColor = location.pathname === '/' ? 'linear-gradient(90deg, rgba(18,18,18,1) 50%, rgba(255,255,255,1) 50%)' : 'rgba(18, 18, 18, 1)'
  useLayoutEffect(() => {
    // Scroll to top position on page change
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <Box
      minH='100vh'
      background={bgColor}
      width='100%'
      height='100%'
    >
      <Header />
      <Outlet />
    </Box>
  )
}

export default Layout
