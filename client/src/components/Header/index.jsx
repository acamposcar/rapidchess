import React, { useContext } from 'react'
import { Flex, Text, Image, Box } from '@chakra-ui/react'
import HeaderLink from './HeaderLink'
import logo from '../../assets/logo.png'
import { useLocation, NavLink } from 'react-router-dom'
const Header = () => {
  const location = useLocation()
  const textColor = location.pathname === '/' ? 'black' : 'white'

  return (
    <Flex justifyContent='space-between' alignItems='center' py={10} px={24}>

      <NavLink to='/'>
        <Flex alignItems='center'>
          <Image height='60px' src={logo} alt='Logo' />
          <Text fontFamily='mono' fontSize={24}>rapidchess</Text>
        </Flex>
      </NavLink >

      <Flex as='ul' listStyleType='none' gap={4} justifyContent='space-around' color={textColor} >
        <HeaderLink text='Home' to='/' />
        <HeaderLink text='History' to='/history' />
      </Flex>
    </Flex >
  )
}

export default Header
