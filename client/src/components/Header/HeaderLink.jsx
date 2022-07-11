import React from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Text } from '@chakra-ui/react'

const HeaderLink = ({ text, to }) => {
  return (
    <Box as='li'>
      <NavLink to={to}>
        {({ isActive }) => (
          <Text fontWeight={isActive ? 700 : 400}>{text}</Text>
        )}
      </NavLink>
    </Box>
  )
}

export default HeaderLink
