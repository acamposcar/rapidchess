
import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'

const Timer = ({ isTurn, timeRemaining, lastMoveDate, isGameOver }) => {
  const [timer, setTimer] = useState(timeRemaining)
  const [prevLastMoveDate, setPrevLastMoveDate] = useState()

  useEffect(() => {
    if (prevLastMoveDate !== lastMoveDate) {
      if (isTurn || isGameOver) {
        const dateDif = new Date().getTime() - new Date(lastMoveDate).getTime()
        setTimer(timeRemaining - dateDif / 1000)
      }
      setPrevLastMoveDate(lastMoveDate)
    }

    const timerInterval = setInterval(() => {
      if (isTurn && !isGameOver) {
        setTimer(prev => prev - 1)
      }
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [isTurn, timeRemaining, lastMoveDate, prevLastMoveDate, isGameOver])

  function format (time) {
    // Hours, minutes and seconds
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
