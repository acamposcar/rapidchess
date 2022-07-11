import React from 'react'
import { Center, Spinner } from '@chakra-ui/react'

const CenteredSpinner = () => {
  return (
    <Center height='60vh'>
      <Spinner size='lg' />
    </Center>

  )
}

export default CenteredSpinner
