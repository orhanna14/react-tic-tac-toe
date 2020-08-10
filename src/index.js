import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {

  renderSquare(i) {
    const { winner, squares, onClick } = this.props;
    let className='square';
    if (winner) {
      if (winner[1].includes(i)) {
        className='square-winner'
      }
    }

    return (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onClick(i)}
      className={className}
    />
    );
  }

  createBoardOfSquares() {
    let boardOfSquares = [];
    let index=0;
    //outer loop to create parent
    for (let row = 0; row <3; row++) {
      let rowOfColumns = [];
      //inner loop to create children
      for (let col = 0; col < 3; col++) {
        rowOfColumns.push(this.renderSquare(index));
        index++;
      }
      boardOfSquares.push(<div className="board-row" key={index}>{rowOfColumns}</div>);
    }
    return boardOfSquares;
  }

  render() {
    return (
      <div> 
        {this.createBoardOfSquares()}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let position = getPosition(step.position)
      const desc = move ?
        'Go to move #' + move + ' located at [' + position +']':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}
          className={move === this.state.stepNumber ? "selected-move" : "button"}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let toggleButton;
    toggleButton = 'Change order to ' + (this.state.isAscending ? "Descending" : "Ascending");

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isAscending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.changeOrder()}>{toggleButton}</button>
        </div>
      </div>
    );
  }

}

function getPosition(location) {
  const row = (location >=0 && location <=2) ? 1 : (location >=3 && location <=5) ? 2 : 3;
  const col = ([0,3,6].includes(location)) ? 1 : ([1,4,7].includes(location)) ? 2 : 3;
  return ([col, row]);
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
); 

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}