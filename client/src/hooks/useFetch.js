import { useState, useCallback } from 'react'

const useFetch = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? requestConfig.body : null
      })

      const data = await response.json()
      if (!response.ok) {
        if (data?.error) throw new Error(data.error)
        throw new Error('Request failed')
      }
      applyData(data)
    } catch (err) {
      setError(err.message || 'Something went wrong!')
    }
    setLoading(false)
  }, [])

  return {
    loading,
    error,
    sendRequest
  }
}

export default useFetch
