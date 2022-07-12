import { Container, Center, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import GameBoard from '../components/Gameboard'
import { getGame } from '../services/api'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import CustomSpinner from '../components/CustomSpinner'
import CustomAlert from '../components/CustomAlert'
import { useParams } from 'react-router-dom'
import { SocketProvider } from '../contexts/socketContext'
import useAuth from '../contexts/authContext'
import JoinGame from '../components/JoinGame'
import WaitingRoom from '../components/WaitingRoom'

const Game = () => {
  const { gameId } = useParams()
  const authCtx = useAuth()
  const { isError, data: game, error } = useQuery(['game', gameId], () => getGame(gameId))

  if (game) {
    const isWhite = game.white === authCtx.token
    const isBlack = game.black === authCtx.token
    const gameIsFull = game.white && game.black
    let playerColor
    if (isWhite || isBlack) {
      playerColor = isWhite ? 'white' : 'black'
    }

    return (

      <SocketProvider gameId={gameId}>
        {!playerColor && !gameIsFull &&
          <JoinGame savedGame={game} duration={game.duration} color={game.colorMode} />}
        {!playerColor && gameIsFull &&
          <Center>
            <Text marginTop={12} fontSize={50} fontWeight={300}>The game has already started</Text>
          </Center>}
        {playerColor && !gameIsFull &&
          <WaitingRoom duration={game.duration} gameId={gameId} color={game.colorMode} />}
        {playerColor && gameIsFull &&
          <GameBoard boardWidth='550' savedGame={game} playerColor={playerColor} />}
      </SocketProvider>
    )
  }

  if (isError) {
    return <CustomAlert status='error' title='Fetch error!' message={error.message} />
  }

  return (
    // Loading
    <CustomSpinner />

  )
}

export default Game
