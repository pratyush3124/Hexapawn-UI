import { useState, useRef, useEffect } from 'react';
import './App.css'

const Board = () => {
  let [pieces, setPieces] = useState([
    { x: 0, y: 2, p: 'pw' },
    { x: 1, y: 2, p: 'pw' },
    { x: 2, y: 2, p: 'pw' },
    { x: 0, y: 0, p: 'pb' },
    { x: 1, y: 0, p: 'pb' },
    { x: 2, y: 0, p: 'pb' },
  ]);

  let [board, setBoard] = useState(makeBoard())

  let [grab, setGrab] = useState(null);
  let [grabPos, setGrabPos] = useState({ x: -1, y: -1 });

  const boardRef = useRef(null);

  function grabPiece(e) {
    const elem = e.target
    if (elem.className === 'piece') {
      elem.style.left = `${e.clientX - 75 - boardRef.current.offsetLeft}px`;
      elem.style.top = `${e.clientY - 75 - boardRef.current.offsetTop}px`;
      const x = e.clientX - boardRef.current.offsetLeft;
      const y = e.clientY - boardRef.current.offsetTop;
      const a = (x - (x % 150)) / 150;
      const b = (y - (y % 150)) / 150;
      // if (b-1<3 && b-1>=0){
      //   let t = boardRef.current.children[(b-1)*3+a].className;
      //   boardRef.current.children[(b-1)*3+a].className = `${t+' place-available'}`
      // }
      elem.style.zIndex = "2";
      setGrab(elem);
      setGrabPos({ x: a, y: b })
    }
  }

  function movePiece(e) {
    const elem = e.target;
    if (elem.className === 'piece' && elem === grab) {
      elem.style.left = `${e.clientX - 75 - boardRef.current.offsetLeft}px`;
      elem.style.top = `${e.clientY - 75 - boardRef.current.offsetTop}px`;
    }
  }

  function placePiece(e) {
    const elem = e.target;
    if (elem.className === 'piece') {
      const x = e.clientX - boardRef.current.offsetLeft;
      const y = e.clientY - boardRef.current.offsetTop;
      const a = (x - (x % 150)) / 150;
      const b = (y - (y % 150)) / 150;
      if (a < 3 && a >= 0 && b < 3 && b >= 0) {
        let dupe = pieces.slice();
        let cur = dupe.find(elem => elem.x === grabPos.x && elem.y === grabPos.y);
        cur.x = a; cur.y = b;
        setPieces(dupe);

        grab.style.top = `${b*150}px`;
        grab.style.left= `${a*150}px`;
      }
      else {
        grab.style.top = `${grabPos.y*150}px`;
        grab.style.left = `${grabPos.x*150}px`;
      }
      grab.style.zIndex = "1";
      setGrab(null);
    }
  }

  function makeBoard() {
    let b = [];
    for (let i = 0; i < pieces.length; i++) {
      b.push(
        <Piece key={i} id={pieces[i].p} pos={{ x: pieces[i].x, y: pieces[i].y }} piece={pieces[i].p} />
      );
    }
    return b;
  }

  return (
    <div className='board'
      style={{ zIndex: 1, marginTop: '-450px' }}
      onMouseDown={(e) => { grabPiece(e) }}
      onMouseMove={(e) => { movePiece(e) }}
      onMouseUp={(e) => { placePiece(e) }}
      ref={boardRef}>
      {board}
    </div>
  )
}


const Piece = (props) => {
  return (
    <div className='piece' id={props.piece}
      style={{ left: props.pos.x * 150, top: props.pos.y * 150 }}></div>
  )
}

export default Board;
