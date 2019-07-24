const fs = require('fs')
const path = require('path')

fs.readFile(path.join(__dirname, 'map.txt'), 'utf8', function (err, data) {
  if (err) throw err

  const rows = data
    .split('\n')
    .filter(i => i.length)
    .slice(1)
  const parsed = rows.map(row =>
    row
      .split(' ')
      .filter(s => s.length)
      .map(i => parseInt(i))
  )
  console.log(parsed.length, parsed[0].length)
  console.log(solve(parsed))
})
// const data = [[4, 8, 7, 3], [2, 5, 9, 3], [6, 3, 2, 5], [4, 4, 1, 6]]

function solve (data) {
  const ROWS = data.length
  const COLS = data[0].length

  let solutions = []

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const points = [[i, j]]

      let graph = {}

      let score = 0

      while (points.length) {
        const start = points.pop()

        const [row, col] = start
        if (!graph[[row, col]]) graph[[row, col]] = []
        const curr = data[row][col]

        if (col - 1 > -1) {
          const left = data[row][col - 1]
          if (curr > left) {
            points.push([row, col - 1])
            graph[[row, col]].push([row, col - 1])
          }
        }

        if (col + 1 < COLS) {
          const right = data[row][col + 1]
          if (curr > right) {
            points.push([row, col + 1])
            graph[[row, col]].push([row, col + 1])
          }
        }

        if (row + 1 < ROWS) {
          const down = data[row + 1][col]
          if (curr > down) {
            points.push([row + 1, col])
            graph[[row, col]].push([row + 1, col])
          }
        }
      }

      solutions.push(traverseGraph(graph, [i, j]))
    }
  }

  function traverseGraph (graph, key, steps = 1) {
    const choices = graph[key]
    let bestStep = steps
    let bestDepth = 0
    for (let choice of choices) {
      const [step, depth] = traverseGraph(graph, choice, steps + 1)
      if (step > bestStep) {
        bestStep = step
        bestDepth = Math.abs(data[choice[0]][choice[1]] - data[key[0]][key[1]])
      }
    }
    return [bestStep, bestDepth]
  }
  const top = solutions
    .sort((a, b) => (a[0] === b[0] ? b[1] - a[1] : b[0] - a[0]))
    .slice(0, 3)
  return top
}
