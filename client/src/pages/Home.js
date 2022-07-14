import React from 'react'
import { Image, Box, Heading, Grid, Center, Hide, Flex } from '@chakra-ui/react'
import piecesImg from '../assets/pieces.png'
import CreateGame from '../components/CreateGame'
const Home = () => {
  return (
    <Grid gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} justifyItems={{ base: 'center', lg: 'stretch' }} columnGap='130px' rowGap={12}>
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
  )
}

export default Home
