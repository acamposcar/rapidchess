import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Chess } from 'chess.js'
import { toast } from 'react-toastify'
import { Chessboard } from 'react-chessboard'
import { updateGame } from '../../services/api'
import { useMutation, useQueryClient } from 'react-query'
import { useSocket } from '../../contexts/socketContext'
import { Center, Flex, Box, Text, VStack, Hide } from '@chakra-ui/react'
import Timer from './Timer'
import Result from './Result'
import useAuth from '../../contexts/authContext'

export default function GameBoard ({ boardWidth, savedGame, playerColor }) {
  const chessboardRef = useRef()
  const socket = useSocket()
  const authCtx = useAuth()
  const [game, setGame] = useState(new Chess(savedGame.fen))

  const [rightClickedSquares, setRightClickedSquares] = useState({})
  const [moveSquares, setMoveSquares] = useState({})
  const [optionSquares, setOptionSquares] = useState({})
  const [kingCheckSquare, setKingCheckSquare] = useState({})

  const queryClient = useQueryClient()
  const isOwnTurn = game.turn() === playerColor.slice(0, 1)
  // Check if server has updated the last move to show the correct time
  const isOwnTurnServer = savedGame.turn === playerColor.slice(0, 1)

  let remainingPlayerTime
  let remainingOpponentTime

  const MS_TO_SEC = 1000
  const MIN_TO_SEC = 60

  if (playerColor === 'white') {
    remainingPlayerTime = (savedGame.duration * MIN_TO_SEC - savedGame.whiteTime / MS_TO_SEC)
    remainingOpponentTime = (savedGame.duration * MIN_TO_SEC - savedGame.blackTime / MS_TO_SEC)
  } else {
    remainingPlayerTime = (savedGame.duration * MIN_TO_SEC - savedGame.blackTime / MS_TO_SEC)
    remainingOpponentTime = (savedGame.duration * MIN_TO_SEC - savedGame.whiteTime / MS_TO_SEC)
  }

  let isGameOver = false

  if (game.game_over() || savedGame.isOver) {
    isGameOver = true
  }

  const { mutate } = useMutation(updateGame, {
    // When mutate is called:
    onMutate: async updatedGame => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['game', savedGame._id])

      // Snapshot the previous value
      const previousGame = queryClient.getQueryData(['game', savedGame._id])

      // Optimistically update to the new value
      queryClient.setQueryData(['game', savedGame._id], old => {
        return { ...old, ...updatedGame }
      })

      // Return a context object with the snapshotted value
      return { previousGame }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, updatedGame, context) => {
      queryClient.setQueryData(['game', savedGame._id], context.previousGame)
      toast.error(error.message)
    },
    onSuccess: (savedGame) => {
      // socket.emit('move', savedGame._id, savedGame.fen)
      kingInCheck()
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(['game', savedGame._id])
    }
  })

  const getPiecePosition = useCallback((piece) => {
    return [].concat(...game.board()).map((p, index) => {
      if (p !== null && p.type === piece.type && p.color === piece.color) {
        return index
      }
      return p
    }).filter(Number.isInteger).map((pieceIndex) => {
      const row = 'abcdefgh'[pieceIndex % 8]
      const column = Math.ceil((64 - pieceIndex) / 8)
      return row + column
    })
  }, [game])

  const kingInCheck = useCallback(() => {
    if (!game.in_check()) {
      setKingCheckSquare({})
      return
    }

    const kingPosition = getPiecePosition({ type: 'k', color: game.turn() })
    setKingCheckSquare({
      [kingPosition]: {
        background: 'rgba(255, 0, 0, 0.4)'
      }
    })
  }, [game, getPiecePosition])

  useEffect(() => {
    setMoveSquares({
      [savedGame.lastMoveFrom]: { backgroundColor: 'rgba(0, 255, 0, 0.2)' },
      [savedGame.lastMoveTo]: { backgroundColor: 'rgba(0, 255, 0, 0.2)' }
    })

    kingInCheck()
  }, [])

  useEffect(() => {
    if (socket == null) return
    socket.on('invalidate-query', (fen, lastMoveFrom, lastMoveTo) => {
      setTimeout(() => {
        // Timeout to wait DB to update after socket emit
        queryClient.invalidateQueries(['game', savedGame._id])
      }, 500)
      safeGameMutate((game) => {
        game.load(fen)
      })
      kingInCheck()
      setMoveSquares({
        [lastMoveFrom]: { backgroundColor: 'rgba(0, 255, 0, 0.2)' },
        [lastMoveTo]: { backgroundColor: 'rgba(0, 255, 0, 0.2)' }
      })
    })

    socket.on('time-ended', () => {
      queryClient.invalidateQueries(['game', savedGame._id])
    })

    socket.on('game-start', () => {
      queryClient.invalidateQueries(['game', savedGame._id])
    })

    return () => {
      socket.off('invalidate-query')
      socket.off('time-ended')
      socket.off('game-start')
    }
  }, [socket, queryClient, savedGame._id, kingInCheck])

  function safeGameMutate (modify) {
    setGame((g) => {
      const update = { ...g }
      modify(update)
      return update
    })
  }

  function onDrop (sourceSquare, targetSquare) {
    if (!isOwnTurn) return
    if (isGameOver) return
    const gameCopy = { ...game }
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to a queen
    })
    setGame(gameCopy)
    // illegal move
    if (move === null) return false

    socket.emit('move', savedGame._id, gameCopy.fen(), sourceSquare, targetSquare, authCtx.token)
    mutate({ gameId: savedGame._id, fen: gameCopy.fen(), lastMoveFrom: sourceSquare, lastMoveTo: targetSquare, userId: authCtx.token })

    kingInCheck()
    setMoveSquares({
      [sourceSquare]: { backgroundColor: 'rgba(0, 255, 0, 0.2)' },
      [targetSquare]: { backgroundColor: 'rgba(0, 255, 0, 0.2)' }
    })
    return true
  }

  function onMouseOverSquare (square) {
    getMoveOptions(square)
  }

  // Only set squares to {} if not already set to {}
  function onMouseOutSquare () {
    if (Object.keys(optionSquares).length !== 0) setOptionSquares({})
  }

  function getMoveOptions (square) {
    if (isGameOver) return
    if (!isOwnTurn) return

    const moves = game.moves({
      square,
      verbose: true
    })
    if (moves.length === 0) {
      return
    }

    const newSquares = {}
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,70,0,.3) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,70,0,.3) 25%, transparent 25%)',
        borderRadius: '50%'
      }
      return move
    })
    newSquares[square] = {
      background: 'rgba(0, 100, 0, 0.4)'
    }
    setOptionSquares(newSquares)
  }

  function onSquareClick () {
    setRightClickedSquares({})
  }

  function onSquareRightClick (square) {
    const color = 'rgba(0, 0, 255, 0.4)'
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === color
          ? undefined
          : { backgroundColor: color }
    })
  }

  return (
    <Center>
      <Flex flexDirection={{ base: 'column', lg: 'row' }}>

        <Hide above='lg'>
          <Box>
            {isGameOver &&
              <Flex bgColor='blue.700' justifyContent='center' mb={5}>
                <Result
                  isGameOver={isGameOver}
                  isDraw={game.in_draw()}
                  isStalemate={game.in_stalemate()}
                  isRepetition={game.in_threefold_repetition()}
                  isInsufficientMaterial={game.insufficient_material()}
                  turn={game.turn()}
                />
              </Flex>}
            <Text fontSize={22}>Opponent</Text>
            <Timer timeRemaining={remainingOpponentTime} isTurn={!isOwnTurnServer} lastMoveDate={savedGame.lastMoveDate} isGameOver={isGameOver} gameId={savedGame._id} />
          </Box>
        </Hide>
        <Chessboard
          id="SquareStyles"
          arePremovesAllowed={false}
          boardOrientation={playerColor}
          animationDuration={200}
          boardWidth={boardWidth}
          position={game.fen()}
          onMouseOverSquare={onMouseOverSquare}
          onMouseOutSquare={onMouseOutSquare}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
          }}
          customDarkSquareStyle={{ backgroundColor: '#7f8da0' }}
          customLightSquareStyle={{ backgroundColor: '#e4edff' }}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
            ...kingCheckSquare
          }}
          ref={chessboardRef}
        />
        <Hide above='lg'>
          <Box>
            <Timer timeRemaining={remainingPlayerTime} isTurn={isOwnTurnServer} lastMoveDate={savedGame.lastMoveDate} isGameOver={isGameOver} gameId={savedGame._id} />
            <Text fontSize={22} >You</Text>
          </Box>
        </Hide>
        <Hide below='lg'>
          <Flex flexDirection='column' justifyContent='center' gap={12} marginLeft={5}>
            <VStack gap={2} >
              <Text fontSize={22}>Opponent</Text>
              <Timer timeRemaining={remainingOpponentTime} isTurn={!isOwnTurnServer} lastMoveDate={savedGame.lastMoveDate} isGameOver={isGameOver} gameId={savedGame._id} />
            </VStack>
            <Result
              isGameOver={isGameOver}
              isDraw={game.in_draw()}
              isStalemate={game.in_stalemate()}
              isRepetition={game.in_threefold_repetition()}
              isInsufficientMaterial={game.insufficient_material()}
              turn={game.turn()}
            />
            <VStack gap={2}>
              <Timer timeRemaining={remainingPlayerTime} isTurn={isOwnTurnServer} lastMoveDate={savedGame.lastMoveDate} isGameOver={isGameOver} gameId={savedGame._id} />
              <Text fontSize={22} >You</Text>
            </VStack>
          </Flex>
        </Hide>

      </Flex>
    </Center >
  )
}
