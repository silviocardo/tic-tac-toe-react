// TODO
// [done] 1 - For the current move only, show “You are at move #…” instead of a button.
// [done] 2 - Rewrite Board to use two loops to make the squares instead of hardcoding them.
// [done] 3 - Add a toggle button that lets you sort the moves in either ascending or descending order.
// [done] 4 - When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
// 5 - Display the location for each move in the format (row, col) in the move history list.


import { useState } from "react";
import { memo } from "react";

// OPTIMIZATION "memo": do not re-render Square if its props are not changed
const Square = memo( 
  function Square({value, color, onSquareClick}) {
    return (
      <button className="square" style={{ background: color}} onClick={onSquareClick}>{value}</button>
    )
  }
)

function Board({xIsNext,squares,onPlay}) {
  // This component manages the current board setting
  // based on the next player that has to play (xIsNext)
  // on the current configuration of the board (squares)
  // on what to do in case of a player playing (onPlay)
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
    if (winner.length > 0) {
      status = "Winner: " + squares[winner[0]]
    } else {
      status = "It's a draw!"
    }
  } else{
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  // [TODO 2] create the board programmatically
  let board, elemSquares = Array(0)
  let color
  for (let i = 0; i < 9; i++) {
    color = (winner && winner.length > 0 && winner.includes(i)) ? '#93ff787c' : '#fff'
    elemSquares.push(<Square value={squares[i]} color={color} onSquareClick={() => handleClick(i)} />)
    if (elemSquares.length === 3) {
      board =   <>
                  {board}
                  <div className="board-row">
                    {elemSquares}
                  </div>
                </>
      elemSquares = Array(0)
    }
  }
  
  return ( // print the status on top of the board
    <>
      <div className="status">{status}</div>
      {board}
    </>
  )
}

export default function Game(){ 
  // main component: default (first to load)
  // it has a Board component and a list of buttons to move on previous moves
  const [xIsNext, setXIsNext] = useState(true) // CAN BE REMOVED - if currentMove is even => X is next
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [order, setOrder] = useState(true) // order of moves: true = ascending, false = descending

  // retreive the currently selected game
  // if no previous move is selected then it will be the last one
  // if a previus move is selected then it will be here put as current
  const currentSquares = history[currentMove] 

  let moves = createMoveButtons() // not a const because can be changed with changing moves order button

  function handlePlay(nextSquares){
    // function to be called by the Board to handle playing
    // based on the squares that the Board has in that moment
    // if we jumped to a previous move we need to store the boards up to that move only
    // and manage the next player
    // if we did not jump, then the current move will be updated with the last one                             
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

  function createMoveButtons(){
    return history.map(
      (squares, move) => {
        let description
        let idx = order ?  move : Math.abs(move - (history.length - 1))
        if (idx === 0) { // [TODO 1]
          description = "Go to game start"
        } else if (currentMove != idx) {
          description = "Go to move #" + idx
        } else {
          description = "You are at move #" + idx
        }
        return (
          <li key={idx}>
            <button onClick={() => jumpTo(idx)}>{description}</button>
          </li>
        )
      }
    )
  }
  
  function sortMoves(){ // [TODO 3] to be called when button to change moves order is clicked
    setOrder(!order)
    moves = createMoveButtons()
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={() => sortMoves()}>{order? "Ascending" : "Descending"}</button>
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
  let fullBoard = true
  for (let i = 0; i < lines.length; i++) {
    if (!squares[i]) {
      fullBoard = false
    }
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return Array(a,b,c); // return winner and winning cells
    }
  }
  return fullBoard ? Array() : null;
}
