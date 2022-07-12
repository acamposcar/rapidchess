
import React from 'react'
import { Box, Text } from '@chakra-ui/react'

const Result = ({ isGameOver, isDraw, isStalemate, isRepetition, isInsufficientMaterial, turn }) => {
  console.log(isGameOver, turn, isDraw)
  return (
    <Box fontSize={20} minHeight='50px'>

      {isGameOver && !isDraw && turn === 'w' &&
        <Text>
          <Box as='span' fontWeight='bold'>Black </Box>Wins
        </Text>
      }

      {isGameOver && !isDraw && turn === 'b' &&
        <Text>
          <Box as='span' fontWeight='bold'>White </Box>Wins
        </Text>
      }

      {isDraw && <Text>Draw!</Text>}
      {isStalemate && <Text fontWeight='bold'>Stalemate</Text>}
      {isRepetition && <Text fontWeight='bold'>Threefold Repetition</Text>}
      {isInsufficientMaterial && <Text fontWeight='bold'>Insufficient Material</Text>}
    </Box>
  )
}

export default Result
