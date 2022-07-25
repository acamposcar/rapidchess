
import React, { useEffect, useState, useCallback } from 'react'
import { Box } from '@chakra-ui/react'
import { useSocket } from '../../contexts/socketContext'

const Timer = ({ isTurn, timeRemaining, lastMoveDate, isGameOver, gameId }) => {
  const calculateRemainingTime = useCallback((now) => {
    if (isTurn && !isGameOver && lastMoveDate) {
      const dateDif = now.getTime() - new Date(lastMoveDate).getTime()
      return timeRemaining - dateDif / 1000
    }
    return timeRemaining
  }, [isGameOver, isTurn, lastMoveDate, timeRemaining])

  const [timer, setTimer] = useState(() => calculateRemainingTime(new Date()))
  const [endTimeSent, setEndTimeSent] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    if (socket == null) return

    socket.on('time-now', (dateNowServer) => {
      setTimer(calculateRemainingTime(new Date(dateNowServer)))
    })
    return () => {
      socket.off('time-now')
      socket.off('time-now')
    }
  }, [calculateRemainingTime, socket])

  function format (time) {
    // Format time to XX:XX

    const hrs = Math.floor(time / 3600)
    const mins = Math.floor((time % 3600) / 60)
    const secs = Math.floor(time % 60)

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = ''
    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
    }
    ret += '' + String(mins).padStart(2, '0') + ':' + (secs < 10 ? '0' : '')
    ret += '' + secs
    if (time <= 0) return '00:00'
    return ret
  }

  if (timer <= 0 && socket != null && !endTimeSent) {
    socket.emit('check-time-end', gameId)
    setEndTimeSent(true)
  }

  let bgColor

  if (isGameOver && timer <= 0) {
    bgColor = 'red.700'
  } else if (isTurn && !isGameOver) {
    bgColor = 'blue.700'
  } else {
    bgColor = 'whiteAlpha.400'
  }

  return (
    <Box textAlign='center' background={bgColor} fontSize={35} py={2} px={5}>
      <Box>{format(timer)} </Box>
    </Box>
  )
}

export default Timer
