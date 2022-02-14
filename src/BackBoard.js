
const BackBoard = (props) => {
  let length = props.size;
  let board = [];

  for (let i = 0; i < length; i++) {
    board.push([]);
    for (let j = 0; j < length; j++) {
      board[i].push(
        <div key={i*3+j} className={(i+j)%2===0 ? 'tw':'tb'}></div>
      )
    }
  }

  return (
    <div className='board'> 
      { board }
    </div>
  )
}

export default BackBoard;
