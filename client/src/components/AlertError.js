
import React from 'react'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'

const AlertError = (props) => {
  return (
    <Alert marginY={6} status='error' variant='left-accent'>
      <AlertIcon />
      <AlertDescription>{props.error}</AlertDescription>
    </Alert>
  )
}

export default AlertError
