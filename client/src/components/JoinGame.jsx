import React from 'react'
import { Button, Flex, Text, Box } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { useQueryClient, useMutation } from 'react-query'
import { useSocket } from '../contexts/socketContext'
import { joinGame } from '../services/api'
import useAuth from '../contexts/authContext'

const JoinGame = ({ savedGame, color, duration }) => {
  const queryClient = useQueryClient()
  const socket = useSocket()
  const authCtx = useAuth()
  const { mutate, isLoading } = useMutation(joinGame, {
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (savedGame) => {
      socket.emit('join-game', savedGame._id)
      queryClient.invalidateQueries(['game', savedGame._id])
    }
  })

  const handleJoinGame = () => {
    mutate({ gameId: savedGame._id, userId: authCtx.token })
  }

  return (
    <Flex flexDirection='column' alignItems='center' textAlign='center'>
      <Text textTransform='capitalize' fontSize={{ base: 40, md: 50 }} fontWeight={300}>{color}</Text>
      <Text fontSize={{ base: 40, md: 50 }} lineHeight='1.1' my={2} fontWeight={700}>{duration} {duration > 1 ? 'minutes' : 'minute'}<Box as='span' fontWeight={300}> per player</Box></Text>

      <Button mt={12} bg='white' color='black' _hover={{ bg: 'whiteAlpha.800' }} isLoading={isLoading} onClick={handleJoinGame}>
        JOIN GAME
      </Button>
    </Flex>

  )
}

export default JoinGame
