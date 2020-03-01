const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf-8')

function solve (input) {
  const [first, ...rest] = input
    .split('\n')
    .map(i => i.trim())
    .filter(Boolean)
  const data = rest.map(s =>
    s
      .split(' ')
      .map(s => s.trim())
      .filter(Boolean)
      .map(i => parseInt(i))
  )
  const [x, y] = first.split(' ').map(s => parseInt(s))
  const minDimension = Math.min(x, y)

  const results = []
  for (let [i, row] of Object.entries(data)) {
    if (row.length !== minDimension)
      throw new Error(`invalid dimension: ${i} ${row.length}`)
    for (let [j] of Object.entries(row)) {
      const result = skii(data, parseInt(i), parseInt(j), minDimension, 1)
      results.push(result)
    }
  }

  const computeScore = (scores = []) => {
    return scores.reduce((left, right, i) => {
      const next = i + 1
      if (next >= scores.length) return left
      return left + (right - scores[i + 1])
    }, 0)
  }

  const maxDepth = results.sort((l, r) => r.depth - l.depth)[0].depth
  // We may have more than one result with the longest length, so we need to compute the depth difference and take only the steepest.
  const longestLength = results.filter(i => i.depth === maxDepth)
  const mostSteep = longestLength
    .map(i => ({
      ...i,
      score: computeScore(i.moves.map(([i, j]) => data[i][j]))
    }))
    .sort((l, r) => {
      return r.score - l.score
    })

  const bestResult = mostSteep[0].moves.forEach(([i, j]) => {
    console.log(`${visitKey(i, j)}: ${data[i][j]}`)
  })
  return mostSteep[0]
}
const sol = solve(input)
console.log(
  `length=${sol.depth} drop=${sol.score} ${sol.depth}${sol.score}@redmart.com`
)

function visitKey (i, j) {
  return `(${i},${j})`
}

function skii (data, i, j, n, depth, visited = {}) {
  const isVisited = (i, j) => !!visited[visitKey(i, j)]

  const prev = data[i] && data[i][j]
  const prevMove = [i, j]
  const isDownhill = (i, j) => prev > (data[i] && data[i][j])

  const isWithinBoundary = (i, j) => i >= 0 && i < n && j >= 0 && j < n

  const canMove = (i, j) =>
    isWithinBoundary(i, j) && !isVisited(i, j) && isDownhill(i, j)

  const moves = [
    [i - 1, j],
    [i + 1, j],
    [i, j - 1],
    [i, j + 1]
  ]

  let result = []
  for (let [i, j] of moves) {
    if (!canMove(i, j)) continue
    const newVisited = {
      ...visited,
      [visitKey(i, j)]: true
    }
    const next = skii(data, i, j, n, depth + 1, newVisited)
    result.push({
      moves: [prevMove, ...next.moves],
      depth: next.depth
    })
  }
  if (!result.length)
    return {
      moves: [[i, j]],
      depth
    }
  return result.sort((a, b) => b.depth - a.depth)[0]
}
