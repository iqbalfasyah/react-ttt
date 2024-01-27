import { useState } from "react";

function Square({ value, onSquareClick, isHighlight }) {

  const nameClass = isHighlight ? "square highlight" : "square";

  return <button
    className={nameClass}
    onClick={onSquareClick}
  >
    {value}
  </button>
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {

    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    const row = i < 3 ? 1 : (i < 6? 2 : 3);
    const col =(i + 1) - (3 * (row - 1));
    const historyMove = <p className="inline-text">({nextSquares[i]}: {row}, {col})</p>;
    onPlay(nextSquares, historyMove);

  }

  const resultWinner = calculateWinner(squares);
  const winner = resultWinner?.winner;
  const lineWinner = resultWinner?.lines;

  let status;
  if (winner) {
    status = "Winner: " + winner;
  }
  else if (!squares.filter(x => x === null).length) {
    status = "Game is Draw";
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const getBoardRows = () => {

    let boardRows = [];

    for (let i = 0; i < 3; i++) {

      let squareRows = [];
      for (let row = 0; row < 3; row++) {
        let rowIndex = i * 3 + row;
        let isHighlight = lineWinner?.length ? lineWinner.filter((x) => x == rowIndex).length : false;
     
        squareRows.push(<Square
          key={rowIndex}
          value={squares[rowIndex]}
          onSquareClick={() => handleClick(rowIndex)}
          isHighlight={isHighlight}
        />)

      }

      boardRows.push(<div key={i} className="board-row">{squareRows}</div>);
    }

    return boardRows;
  };



  return (<>
    <div className="status">{status}</div>
    {getBoardRows()}
  </>)
    ;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAsc, setSortAsc] = useState(true);
  const [historyMove, setHistoryMove] = useState([]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, newHistoryMove) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setHistoryMove([...historyMove.slice(0, currentMove), newHistoryMove]);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  console.log(historyMove);

  const moves = history.map((squres, move) => {
    console.log(`squres`, squres);
    
    let description;
    if (move > 0) {
      description = 'Go';
    } else {
      description = 'Game Start';
    }
    return (
      <li key={move}>
        {historyMove[move]} {move == currentMove ? <label className="inline-text">Here</label> : <button onClick={() => jumpTo(move)} className="inline-text">{description}</button>} 
      </li>
    )
  })

  const sortedMoves = sortAsc ? moves.slice().sort((a, b) => a.key - b.key) : moves.slice().sort((a, b) => b.key - a.key);

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <h4>History</h4>
        <button onClick={() => setSortAsc(!sortAsc)}>{sortAsc ? "Sort Asc" : "Sort Desc"}</button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
      const returnObject = {
        winner: squares[a],
        lines: lines[i]
      };
      return returnObject;
    }
  }
  return null;
}
