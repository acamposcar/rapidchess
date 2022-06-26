import React from 'react'
import { Box } from '@chakra-ui/react'

const Waiting = () => {
  return (
    <Box pt={6} pb={2}>
      Waiting for a player to join
      Send this url: {window.location.href}
    </Box>
  )
}

export default Waiting
