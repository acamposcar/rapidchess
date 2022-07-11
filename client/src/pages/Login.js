import React, { useRef, useContext } from 'react'
import useFetch from '../hooks/useFetch'
import { Heading, VStack, Button, Center, FormControl, FormLabel, Input, Container } from '@chakra-ui/react'
import AlertError from '../components/AlertError'
import { UnlockIcon } from '@chakra-ui/icons'
import useAuth from '../contexts/authContext'
const Login = () => {
  const usernameRef = useRef()
  const passwordRef = useRef()
  const authCtx = useAuth()
  const { loading, sendRequest, error } = useFetch()

  const submitHandler = async (event) => {
    event.preventDefault()
    const loginUser = (userObj) => {
      // expiresIn is in seconds. Convert to miliseconds
      const expirationTime = new Date(
        new Date().getTime() + userObj.data.expiresIn * 1000
      )
      authCtx.login(userObj.data.token, expirationTime.toISOString(), userObj.data.user)
    }

    sendRequest({
      url: '/api/v1/users/login',
      method: 'POST',
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }, loginUser)
  }

  return (
    <Container maxW={350}>
      <Center flexDirection='column' marginTop='10vh'>
        <VStack gap={3} marginBottom={10}>
          <UnlockIcon w={8} h={8} />
          <Heading size='xl' fontWeight='400' as='div'>
            Sign in
          </Heading>
        </VStack>
        <form style={{ width: '100%' }} onSubmit={submitHandler}>
          <VStack width='100%' gap={5}>
            {error && <AlertError error={error} />}
            <FormControl isRequired>
              <FormLabel htmlFor='username'>Username</FormLabel>
              <Input autoFocus autoComplete='username' ref={usernameRef} id='username' type='text' name='username' />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <Input ref={passwordRef} autoComplete='current-password' id='password' type='password' name='password' minLength={4} />
            </FormControl>
            <Button width='100%' type='submit' isLoading={loading} colorScheme='teal' variant='solid'>
              Sign in
            </Button>
          </VStack>
        </form>

      </Center>
    </Container>
  )
}

export default Login
