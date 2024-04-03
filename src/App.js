import { useState } from "react";

/** 井字棋方形按钮 */
function Square({ value, colorStyle, index, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={colorStyle}
    >{ value }</button>
  )
}

/** 计算赢家 */
function calculateWinner(squares) {
  const lines = [ // 横竖斜线能赢得坐标
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    // 满足三个坐标要求，且值一致，则赢
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i]
    }
  }

  return null
}

/** 井字棋画板 */
function Board({ xIsNext, squares, onPlay, onPosition }) {
  function handleClick(index, rowIndex) {
    if (squares[index] || calculateWinner(squares)) { return }


    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[index] = 'X'
    } else {
      nextSquares[index] = 'O'
    }

    onPlay(nextSquares)
    onPosition(rowIndex, index)
  }

  const winnerInfoPosition = calculateWinner(squares)
  let status = ''
  let winnerHitPosition = []
  if (winnerInfoPosition) {
    winnerHitPosition = winnerInfoPosition
    status = '🎉获胜者是：' + squares[winnerInfoPosition[0]]
  } else if (squares.length === squares.filter(Boolean).length) {
    status = '😄双方平局啦~'
  } else {
    status = '下一个玩家下棋：' + (xIsNext ? 'X' : 'O')
  }

  const boardRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ].map((row, rowIndex) => (
    <div className="board-row" key={rowIndex}>
      {row.map((index) => (
        <Square
          key={index}
          value={squares[index]}
          colorStyle={{
            backgroundColor: winnerHitPosition.includes(index) ? 'red' : 'transparent'
          }}
          onSquareClick={() => handleClick(index, rowIndex)}
        />
      ))}
    </div>
  ))

  return (
    <>
      <div className="status">{ status }</div>
      <div>{ boardRows }</div>
    </>
  );
}

/** 游戏入口 */
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]
  const [sortAscending, setSortAscending] = useState(true)
  const [stepPosition, setStepPosition] = useState([[0, 0]])

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function handlePosition(rowIndex, colIndex) {
    const nextStepPosition = [...stepPosition, [rowIndex, colIndex]]
    setStepPosition(nextStepPosition)
  }

  function getStepDescription(step) {
    if (step === 0) { return '' }

    const [rowIndex, colIndex] = stepPosition[step]
    const row = rowIndex + 1
    const col = (colIndex + 1) % 3 === 0 ? 3 : (colIndex + 1) % 3
    return `(第${row}行，第${col}列)`
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
    let description = ''
    if (move > 0) {
      description = '切换到步骤 #' + move + ' ' + getStepDescription(move)
    } else {
      description = '回到开始'
    }

    return (
      <li key={move}>
        { move === currentMove ? '当前步骤为 #' + move + ' ' + getStepDescription(move) : <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    )
  })

  function sortBtn() {
    return (
      <button
        onClick={() => {
          setSortAscending(!sortAscending)
        }}
      >
        排序
      </button>
    )
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onPosition={handlePosition} />
      </div>
      <div className="game-info">
        <div>{sortBtn()}</div>
        <ol>{sortAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  )
}