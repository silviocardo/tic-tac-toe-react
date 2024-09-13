// TODO
// 1 - For the current move only, show “You are at move #…” instead of a button.
// 2 - Rewrite Board to use two loops to make the squares instead of hardcoding them.
// 3 - Add a toggle button that lets you sort the moves in either ascending or descending order.
// 4 - When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
// 5 - Display the location for each move in the format (row, col) in the move history list.


import { useState } from "react";
import { memo } from "react";

// OPTIMIZATION: do not re-render Square if its props are not changed
const Square = memo( 
  function Square({value, onSquareClick}) {
    return (
      <button className="square" onClick={onSquareClick}>{value}</button>
    )
  }
)

function Board({xIsNext,squares,onPlay}) {
  // This component manages the current board setting
  // based on the next player that has to play (xIsNext)
  // on the current configuration of the board (squares)
  // on what to do in case of a player playing
  function handleClick(i){
    // function to handle activities when clicked on a cell
    // check that cell is not already filled or there's a winner
    if(squares[i] || calculateWinner(squares)) {
      return
    }

    const nextSquares = squares.slice() // copy the squares board instead of modify directly
    xIsNext? nextSquares[i] = 'X' : nextSquares[i] = 'O' // change value in clicked cell (play)
    onPlay(nextSquares) // call from Game component: consolidates the play in history and changes turn
  }
  
  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = "Winner: " + winner
  } else{
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

export default function Game(){ 
  // main component: default (first to load)
  // it has a Board component and a list of buttons to move on previous moves
  const [xIsNext, setXIsNext] = useState(true) // CAN BE REMOVED - if currentMove is even => X is next
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)

  // retreive the currently selected game
  // if no previous move is selected then it will be the last one
  // if a previus move is selected then it will be here put as current
  const currentSquares = history[currentMove] 

  function handlePlay(nextSquares){
    // function to be called by the Board to handle playing
    // based on the squares that the Board has in that moment
    // if we jumped to a previous move we need to store the boards up to that move only
    // and manage the next player
    // if we did not jump, thent the current move will be updated with the last one                             
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    //                                                          ^ add as last item the next board quares
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext)
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove) // set the current move to the one we want to jump to
    setXIsNext(nextMove % 2 === 0) // change player turn: if even then next player is X turn (as if it was the first move - at index 0)
  }

  const moves = history.map(
    (squares, move) => {
      let description
      if (move > 0) {
        description = "Go to move #" + move
      } else {
        description = "Go to game start"
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      )
    }
  )

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ul>{moves}</ul>
      </div>
    </div>
  )
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
