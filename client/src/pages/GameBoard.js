import React, { useRef, useState, useEffect, useContext } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import io from 'socket.io-client'
import { Container } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import AuthContext from '../store/auth-context'
import Waiting from '../components/Waiting'

let socket
const GameBoard = ({ boardWidth }) => {
  const chessboardRef = useRef()
  const authCtx = useContext(AuthContext)

  const [game, setGame] = useState(new Chess())
  const [fen, setFen] = useState('')
  const [moveFrom, setMoveFrom] = useState('')

  const [rightClickedSquares, setRightClickedSquares] = useState({})
  const [moveSquares, setMoveSquares] = useState({})
  const [optionSquares, setOptionSquares] = useState({})
  const [kingCheckSquare, setKingCheckSquare] = useState({})
  // const [boardOrientation, setBoardOrientation] = useState('white')
  const { gameId } = useParams()

  useEffect(() => {
    fetch(`/api/v1/games/${gameId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setFen(data.game.fen)

        safeGameMutate((game) => {
          if (game.validate_fen(data.game.fen).valid) {
            game.load(data.game.fen)
          }
        })
      })
  }, [])

  useEffect(() => {
    const ENDPOINT = '/'
    socket = io(ENDPOINT)
    socket.on('move', movement => {
      const gameCopy = { ...game }
      gameCopy.move({
        from: movement.from,
        to: movement.to,
        promotion: 'q' // always promote to a queen for example simplicity
      })
      setGame(gameCopy)
      setMoveSquares({
        [movement.from]: { backgroundColor: 'rgba(255, 200, 0, 0.4)' },
        [movement.to]: { backgroundColor: 'rgba(255, 200, 0, 0.4)' }
      })
    })
    socket.on('undo', () => {
      safeGameMutate((game) => {
        game.undo()
      })
      chessboardRef.current.clearPremoves()
      const history = game.history({ verbose: true })
      const prevMove = history[history.length - 1]
      setMoveSquares({
        [prevMove.from]: { backgroundColor: 'rgba(255, 200, 0, 0.4)' },
        [prevMove.to]: { backgroundColor: 'rgba(255, 200, 0, 0.4)' }
      })
    })

    return () => socket.disconnect()
  }, [])

  const safeGameMutate = (modify) => {
    setGame((g) => {
      const update = { ...g }
      modify(update)
      return update
    })
  }

  const getMoveOptions = (square) => {
    const moves = game.moves({
      square,
      verbose: true
    })
    if (moves.length === 0 && game.turn() !== game.get(square)?.color) {
      setOptionSquares({})
      return
    }

    const newSquares = {}
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.3) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.3) 25%, transparent 25%)',
        borderRadius: '50%'
      }
      return move
    })
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.5)'
    }
    setOptionSquares(newSquares)
  }

  // function makeRandomMove() {
  //   const possibleMoves = game.moves()

  //   // exit if the game is over
  //   if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return

  //   const randomIndex = Math.floor(Math.random() * possibleMoves.length)
  //   safeGameMutate((game) => {
  //     game.move(possibleMoves[randomIndex])
  //   })
  //   kingInCheck()
  // }

  const getPiecePosition = (piece) => {
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
  }

  const kingInCheck = () => {
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
  }

  const validateMove = async (from, to, prevFen) => {
    const response = await fetch(`/api/v1/games/${gameId}`, {
      method: 'PUT',
      body: JSON.stringify({ from, to, prevFen }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCtx.token}`
      }
    })
    const result = await response.json()
    console.log(result.valid)
    return result.valid
  }

  const onSquareClick = async (square) => {
    setRightClickedSquares({})

    const resetFirstMove = (square) => {
      setMoveFrom(square)
      getMoveOptions(square)
    }

    // from square
    if (!moveFrom) {
      resetFirstMove(square)
      return
    }
    const prevFen = game.fen()
    // attempt to make move
    const gameCopy = { ...game }
    console.log(game)
    const move = gameCopy.move({
      from: moveFrom,
      to: square,
      promotion: 'q' // always promote to a queen for example simplicity
    })
    // game.load(new Chess().fen())
    setGame(gameCopy)
    // if invalid, setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square)
      return
    }
    setMoveSquares({
      [moveFrom]: { backgroundColor: 'rgba(255, 200, 0, 0.4)' },
      [square]: { backgroundColor: 'rgba(255, 200, 0, 0.4)' }
    })
    kingInCheck()
    const isValidMove = await validateMove(moveFrom, square, prevFen)
    if (!isValidMove) {
      game.undo()
      return
    }
    socket.emit('move', { from: moveFrom, to: square })

    // setTimeout(makeRandomMove, 300)
    setMoveFrom('')
    setOptionSquares({})
  }

  const onSquareRightClick = (square) => {
    const colour = 'rgba(0, 0, 255, 0.4)'
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    })
  }

  return (
    <Container centerContent mt={5}>
      <Waiting />
      <Chessboard
        id='ClickToMove'
        animationDuration={200}
        arePiecesDraggable={false}
        boardWidth={boardWidth}
        // boardOrientation={boardOrientation}
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
          ...kingCheckSquare
        }}
        ref={chessboardRef}
      />
      <button
        className='rc-button'
        onClick={() => {
          safeGameMutate((game) => {
            game.reset()
          })
          chessboardRef.current.clearPremoves()
          setMoveSquares({})
          setRightClickedSquares({})
        }}
      >
        reset
      </button>
      <button
        className='rc-button'
        onClick={() => {
          safeGameMutate((game) => {
            game.undo()
          })
          chessboardRef.current.clearPremoves()
          const history = game.history({ verbose: true })
          const prevMove = history[history.length - 1]
          setMoveSquares({
            [prevMove.from]: { backgroundColor: 'rgba(255, 200, 0, 0.4)' },
            [prevMove.to]: { backgroundColor: 'rgba(255, 200, 0, 0.4)' }
          })
          socket.emit('undo', true)
        }}
      >
        undo
      </button>
      <button
        className='rc-button'
        onClick={() => {
          safeGameMutate((game) => {
            if (game.validate_fen(fen).valid) {
              game.load(fen)
            }
          })
          chessboardRef.current.clearPremoves()
        }}
      >
        load
      </button>
    </Container>
  )
}

export default GameBoard
