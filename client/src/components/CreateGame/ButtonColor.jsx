
import React from 'react'
import { Button } from '@chakra-ui/react'
const ButtonColor = ({ children, color, selectedColor, onClick }) => {
  return (

    <Button
      onClick={onClick}
      _focus={{}}
      borderColor='blackAlpha.800'
      borderWidth={selectedColor === color ? '2px' : '1px'}
      height={14}
      variant='outline'
      transform={selectedColor === color ? 'scale(1.15)' : ''}
      transition='transform 100ms ease'
      _hover={{ transform: 'scale(1.2)' }}
    >
      {children}
    </Button >

  )
}

export default ButtonColor
