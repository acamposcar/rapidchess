import React, { useContext, useState } from 'react'
import TimeSlider from './TimeSlider'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../store/auth-context'
import useFetch from '../hooks/useFetch'
import AlertError from '../components/AlertError'

const CreateGameModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { loading, sendRequest, error } = useFetch()
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  const [time, setTime] = useState(50)

  const timeChangeHandler = (value) => {
    setTime(value)
  }

  const createGameHandler = async (event) => {
    event.preventDefault()
    const createGame = (gameObj) => {
      navigate(`/games/${gameObj.game._id}`, { replace: false })
    }
    sendRequest({
      url: '/api/v1/games/',
      method: 'POST',
      body: JSON.stringify({ color: event.target.value, time }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCtx.token}`

      }
    }, createGame)
  }
  return (
    <>
      <Button onClick={onOpen}>Create Game</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent textAlign='center'>
          <ModalHeader>Play against a friend</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Minutes per player
            <TimeSlider onTimeChange={timeChangeHandler} sliderValue={time} />
          </ModalBody>

          <ModalFooter mt={5} display='flex' justifyContent='center'>
            <Button value='white' onClick={createGameHandler} isLoading={loading} variant='outline' mr={3}>
              White
            </Button>
            <Button
              value='random'
              onClick={createGameHandler}
              isLoading={loading}
              background='linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 47%, rgba(255,255,255,1) 100%)'
              color='white'
              mr={3}
            >Random
            </Button>
            <Button value='black' onClick={createGameHandler} isLoading={loading} background='black' color='white'>Black</Button>
          </ModalFooter>
          {error && <AlertError error={error} />}

        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateGameModal
