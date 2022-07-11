import React from 'react'
import { Image, Box, Heading, Grid, Center } from '@chakra-ui/react'
import piecesImg from '../assets/pieces.png'
import CreateGame from '../components/CreateGame'
const Home = () => {
  return (
    <Grid gridTemplateColumns='1fr 1fr' columnGap='130px' rowGap={12}>
      <Box>
        <Heading textAlign='right' fontSize={90} fontWeight={300}>Let's Play</Heading>
        <Heading textAlign='right' fontSize={90}>Chess</Heading>
      </Box>
      <CreateGame />
      <Center gridColumn='span 2'>
        <Image height='300px' src={piecesImg} alt='Chess Pieces' />
      </Center>
    </Grid>
  )
}

export default Home
