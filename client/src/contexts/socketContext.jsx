import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket () {
  return useContext(SocketContext)
}

export function SocketProvider ({ gameId, children }) {
  const [socket, setSocket] = useState()

  useEffect(() => {
    const newSocket = io(
      '/',
      { query: { gameId } }
    )
    setSocket(newSocket)

    return () => newSocket.close()
  }, [gameId])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
