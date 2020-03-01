// One way is to brute-force your way through.
// Here's how I approach this problem.
// - perform recursion until it reaches the termination condition.
// - termination condition is defined as no valid moves - note we don't need to worry about sliding backwards, because the condition is that you can only go downhill!
// - once we have a list of results, just sort it by depth, and the drop value.

const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf-8')
// const input = `4 4
// 4 8 7 3
// 2 5 9 3
// 6 3 2 5
// 4 4 1 6`

const trim = str => str.trim()
const splitLine = str => str.split('\n')
const splitSpace = str => str.split(' ')
const toInt = str => parseInt(str, 10)

function solve (input) {
  const [first, ...rest] = splitLine(input)
    .map(trim)
    .filter(Boolean)
  const data = rest.map(str =>
    splitSpace(str)
      .map(trim)
      .filter(Boolean)
      .map(toInt)
  )
  const [rows, columns] = first.split(' ').map(toInt)
  const isSquare = rows === columns
  if (!isSquare) throw new Error('must be square')

  const dimension = rows
  const depth = 1

  const output = {
    paths: [],
    maxDepth: 0
  }
  
  for (let i = 0; i < dimension; i += 1) {
    for (let j = 0; j < dimension; j += 1) {
      skii({
        data,
        i,
        j,
        n: dimension,
        depth,
        output
      })
    }
  }

  const computeScore = (scores = []) => {
    return scores.reduce((left, right, i) => {
      const next = i + 1
      if (next >= scores.length) return left
      return left + (right - scores[i + 1])
    }, 0)
  }
  const results = output.paths.map(({ path, depth }) => ({
    path,
    depth,
    score: computeScore(path.map(([i, j]) => data[i][j]))
  }))
  
  // Sort by the length of the longest path, then by the deepest drop.
  return results.sort((left, right) =>
    right.depth - left.depth === 0
      ? right.score - left.score
      : right.depth - left.depth
  )[0]
}

console.log(solve(input))

function skii ({ data, i, j, n, depth, output = {}, path = [] }) {
  const prev = data[i] && data[i][j]
  const prevMove = [i, j]

  const isDownhill = (i, j) => prev > (data[i] && data[i][j])
  const isWithinBoundary = (i, j) => i >= 0 && i < n && j >= 0 && j < n

  const canMove = (i, j) => isWithinBoundary(i, j) && isDownhill(i, j)
  const currentPath = path.concat([prevMove])

  const moves = [
    [i - 1, j],
    [i + 1, j],
    [i, j - 1],
    [i, j + 1]
  ]

  // Termination condition.
  const quit = moves.map(([i, j]) => !canMove(i, j)).every(Boolean)
  if (quit) {
    // Prune results.
    if (currentPath.length < output.maxDepth) return

    output.maxDepth = currentPath.length
    output.paths.push({ path: currentPath, depth })

    return
  }

  for (let [i, j] of moves) {
    if (!canMove(i, j)) continue

    // Go down the hill!
    skii({
      data,
      i,
      j,
      n,
      depth: depth + 1,
      path: currentPath,
      output
    })
  }
}
