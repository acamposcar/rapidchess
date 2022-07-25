
import React from 'react'
import { Flex, Box, Text } from '@chakra-ui/react'

const Result = ({ isGameOver, isDraw, isStalemate, isRepetition, isInsufficientMaterial, turn }) => {
  return (
    <Flex fontSize={20} minHeight='50px' alignItems='center'>

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
    </Flex>
  )
}

export default Result
