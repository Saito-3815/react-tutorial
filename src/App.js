import { useState } from "react";
import {Square} from "./components";

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // 早期リターンでマスが埋まってたら入力を無効
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // 配列のコピー作成
    const nextSquares = squares.slice();
    // xIsNextの真偽で次のXOを決める
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  // 勝敗とゲームが終了したことを知らせる
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    // <React.Fragment>の省略
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
    // </React.Fragment>
  );
}


export default function Game() {
  // [Array(9).fill(null)] は要素数が 1 の配列であり、その要素は9つのnullが入った配列
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // 現在ユーザが見ているのが何番目の着手であるのかを管理
  const [currentMove, setCurrentMove] = useState(0);
  // 順番でOXを変えるための定数
  //currentMoveを変更する数値が偶数の場合は、xIsNextをtrueに設定
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  
  // ゲーム内容を更新
  function handlePlay(nextSquares) {
    // nextSquaresを履歴の一部であるhistory.slice(0, currentMove + 1)の後に追加
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 過去の着手に「ジャンプ」できるボタン
  //squares引数がhistoryの各要素を順に受け取り、move引数が配列のインデックスを順に受け取る
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
      <ol>{moves}</ol>
      </div>
    </div>
  );
}



// 勝敗の判定をする
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
      return squares[a];
    }
  }
  return null;
}
