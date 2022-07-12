export async function getGame (gameId) {
  const response = await fetch(`/api/v1/games/${gameId}`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Could not fetch the game.')
  }
  return data
}

export async function updateGame ({ fen, gameId, lastMoveFrom, lastMoveTo, userId }) {
  const response = await fetch(`/api/v1/games/${gameId}`, {
    method: 'PUT',
    body: JSON.stringify({
      fen,
      lastMoveFrom,
      lastMoveTo,
      user: userId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Could not update the game.')
  }

  return data
}

export async function joinGame ({ userId, gameId }) {
  const response = await fetch(`/api/v1/games/${gameId}`, {
    method: 'POST',
    body: JSON.stringify({
      user: userId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Could not join the game.')
  }

  return data
}
