import React, { useEffect } from 'react'
import { Text, Input, Box, Flex, Button, VStack } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { useSocket } from '../contexts/socketContext'
import { useQueryClient } from 'react-query'

const WaitingRoom = ({ duration, gameId, color }) => {
  const queryClient = useQueryClient()
  const socket = useSocket()

  const url = new URL(window.location.href)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    toast.success('Copied to clipboard!')
  }

  useEffect(() => {
    if (socket == null) return

    socket.on('game-start', () => {
      queryClient.invalidateQueries(['game', gameId])
    })

    return () => socket.off('invalidate-query')
  }, [socket, queryClient, gameId])

  return (
    <Flex flexDirection='column' alignItems='center' textAlign='center'>
      <Text textTransform='capitalize' fontSize={{ base: 40, md: 50 }} fontWeight={300}>{color}</Text>
      <Text fontSize={{ base: 40, md: 50 }} lineHeight='1.1' my={2} fontWeight={700}>{duration} minutes <Box as='span' fontWeight={300}>per player</Box></Text>
      <Text marginTop={12}>To invite someone to play, share this link:</Text>
      <Flex gap={2} width='100%' justifyContent='center' my={1}>
        <Input textAlign='center' readOnly value={url} autoFocus maxWidth='450px' fontFamily='mono' bg='whiteAlpha.400' border='none' />
        <Button bg='white' color='black' onClick={copyToClipboard} _hover={{ bg: 'whiteAlpha.800' }}>
          COPY
        </Button>
      </Flex>
      <Text>The first person to enter this link will play with you.</Text>
    </Flex >)
}

export default WaitingRoom
