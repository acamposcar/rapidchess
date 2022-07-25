import React, { useContext } from 'react'

export const AuthContext = React.createContext({
  token: ''
})

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token')

  return {
    token: storedToken
  }
}

export const AuthContextProvider = (props) => {
  const storedData = retrieveStoredToken()

  let token
  if (storedData.token) {
    token = storedData.token
  } else {
    token = (new Date()).toString()
    localStorage.setItem('token', token)
  }

  const contextValue = {
    token
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  return useContext(AuthContext)
}

export default useAuth
