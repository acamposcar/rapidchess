import React, { useContext } from 'react'
import { Flex, Text, Image, Box } from '@chakra-ui/react'
import HeaderLink from './HeaderLink'
import logo from '../../assets/logo.png'
import { useLocation, NavLink } from 'react-router-dom'
const Header = () => {
  const location = useLocation()
  const textColor = location.pathname === '/' ? 'black' : 'white'

  return (
    <Flex justifyContent={{ base: 'center', lg: 'space-between' }} alignItems='center' py={5} px={{ base: 8, md: 16, lg: 24 }} background={{ base: 'bgDark', lg: 'transparent' }}>

      <NavLink to='/'>
        <Flex alignItems='center'>
          <Image height='60px' src={logo} alt='Logo' />
          <Text fontFamily='mono' fontSize={24}>rapidchess</Text>
        </Flex>
      </NavLink >
      {/*
      <Flex as='ul' listStyleType='none' gap={4} justifyContent='space-around' color={{ base: 'white', lg: textColor }} >
        <HeaderLink text='Home' to='/' />
      </Flex> */}
    </Flex >
  )
}

export default Header
