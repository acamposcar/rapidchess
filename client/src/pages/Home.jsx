import React from 'react'
import { Image, Box, Heading, Grid, Center, Hide } from '@chakra-ui/react'
import piecesImg from '../assets/pieces.webp'
import CreateGame from '../components/CreateGame'
const Home = () => {
  return (
    <Center h={{ base: '', lg: '90vh' }}>
      <Grid gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} justifyItems={{ base: 'center', lg: 'stretch' }} columnGap='130px' rowGap={12} w='100%' >
        <Box bgColor='bgDark' width='100%' paddingBottom={4}>
          <Heading textAlign={{ base: 'center', lg: 'right' }} fontSize={{ base: 80, lg: 90 }} fontWeight={300}>Let's Play</Heading>
          <Heading textAlign={{ base: 'center', lg: 'right' }} fontSize={{ base: 80, lg: 90 }}>Chess</Heading>
        </Box>
        <CreateGame />
        <Hide below='lg'>
          <Center gridColumn='span 2'>
            <Image height='300px' src={piecesImg} alt='Chess Pieces' />
          </Center>
        </Hide>
      </Grid>
    </Center>

  )
}

export default Home
