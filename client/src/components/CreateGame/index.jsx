
import React, { useState } from 'react'
import { Box, Button, Flex, Image } from '@chakra-ui/react'
import TimeSlider from '../TimeSlider'
import whitePiece from '../../assets/whitePiece.png'
import blackPiece from '../../assets/blackPiece.png'
import randomPiece from '../../assets/randomPiece.png'
import ButtonColor from './ButtonColor'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import useAuth from '../../contexts/authContext'

const CreateGame = () => {
  const [duration, setDuration] = useState(20)
  const [selectedColor, setSelectedColor] = useState('random')
  const { loading, sendRequest } = useFetch()
  const navigate = useNavigate()
  const authCtx = useAuth()

  const timeChangeHandler = (value) => {
    setDuration(value)
  }

  const selectColorHandler = (color) => {
    switch (color) {
      case 'white':
        setSelectedColor('white')
        break
      case 'random':
        setSelectedColor('random')
        break
      case 'black':
        setSelectedColor('black')
        break
      default:
        break
    }
  }

  const createGameHandler = async (event) => {
    event.preventDefault()
    const createGame = (gameObj) => {
      navigate(`/games/${gameObj.game._id}`, { replace: false })
    }
    sendRequest({
      url: '/api/v1/games/',
      method: 'POST',
      body: JSON.stringify({ color: selectedColor, duration, token: authCtx.token }),
      headers: {
        'Content-Type': 'application/json'

      }
    }, createGame)
  }
  return (
    <Box as='form' maxW='350px' width='100%' textAlign='center' >
      <TimeSlider onTimeChange={timeChangeHandler} sliderValue={duration} />
      <Flex justifyContent='space-around' marginY={7}>
        <ButtonColor color='white' onClick={() => selectColorHandler('white')} selectedColor={selectedColor} >
          <Image height='100%' src={whitePiece} alt='White Piece' />
        </ButtonColor>
        <ButtonColor color='random' onClick={() => selectColorHandler('random')} selectedColor={selectedColor} >
          <Image height='100%' src={randomPiece} alt='Random Piece' />
        </ButtonColor>
        <ButtonColor color='black' onClick={() => selectColorHandler('black')} selectedColor={selectedColor} >
          <Image height='100%' src={blackPiece} alt='Black Piece' />
        </ButtonColor>
      </Flex>
      <Button
        type='submit'
        isLoading={loading}
        onClick={createGameHandler}
        p={6}
        fontSize={18}
        boxShadow='md'
        borderRadius={12}
        background='bgDark'
        color='white'
        _hover={{ bgColor: 'blackAlpha.800' }}
      >
        CREATE GAME
      </Button>
    </Box>
  )
}

export default CreateGame
