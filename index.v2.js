const input = `4 4
4 8 7 3
2 5 9 3
6 3 2 5
4 4 1 6`

const [first, ...rest] = input.split('\n')
const data = rest.map(s => s.split(' ').map(i => parseInt(i)))


const results = []
for (let [i, row] of Object.entries(data)) {
  for (let [j, col] of Object.entries(row)) {
    const result = skii(data, parseInt(i), parseInt(j), 4, 1)
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

const maxDepth = Math.max(...results.map((i => i.depth)))
// We may have more than one result with the longest length, so we need to compute the depth difference and take only the steepest.
const longestLength = results.filter(i => i.depth === maxDepth)
const mostSteep = longestLength.map((i) => ({
    ...i,
    score: computeScore(i.moves.map(([i, j]) => data[i][j]))
  }))
  .sort((l, r) => {
    return r.score - l.score
  })

const bestResult = mostSteep[0].moves.forEach(([i, j]) => {
  console.log(`${visitKey(i,j)}: ${data[i][j]}`)
})

function visitKey(i, j) {
  return `(${i},${j})`
}


function skii(data, i, j, n, depth, visited = {}) {

  const isVisited = (i, j) =>
    visited[visitKey(i, j)]

  const prev = data[i] && data[i][j]
  const prevMove = [i, j]
  const isDownhill = (i, j) =>
    prev > (data[i] && data[i][j])

  const isWithinBoundary = (i, j) =>
    i >= 0 && i < n && j >= 0 && j < n

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
  if (!result.length) return {
    moves: [
      [i, j]
    ],
    depth
  }
  return result.sort((a, b) => b.depth - a.depth)[0]
}
