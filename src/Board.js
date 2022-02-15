import { useState, useRef} from 'react';
import './App.css'

const Board = () => {
  let [pieces, setPieces] = useState([
    { x: 0, y: 2, p: 'pw' },
    { x: 1, y: 2, p: 'pw' },
    { x: 2, y: 2, p: 'pw' },
    { x: 0, y: 0, p: 'pb' },
    // { x: 0, y: 0, p: '', capture:true},
    { x: 1, y: 0, p: 'pb' },
    // { x: 1, y: 0, p: '', selected:true },
    { x: 2, y: 0, p: 'pb' },
    // { x: 1, y: 1, p: '', available:true}
  ]);

  let [grab, setGrab] = useState(null);
  let [grabPos, setGrabPos] = useState({ x: -1, y: -1 });

  const boardRef = useRef(null);
  
  function setMovesGuide(a,b,c){
    // set move guides.
    let peri = [];
    let aval = pieces.find(el=>
      el.x===a && el.y===b+c &&(el.p==='pw' || el.p==='pb'));
    if (aval===undefined && b+c>=0 && b+c<3){peri.push({x:a, y:b+c, p:'', available:true})};
    console.log(aval)
    peri.push({x:a, y:b, p:'', selected:true})
    setPieces(pieces.concat(peri))
  }

  function delMovesGuide(){
    // remove move guides.
    let dupe = pieces.slice();
    let aval = dupe.find(elem => elem.available);
    let sel = dupe.find(elem => elem.selected);
    if (aval) {dupe.splice(dupe.indexOf(aval), 1)};
    if (sel) {dupe.splice(dupe.indexOf(sel), 1)};
    setPieces(dupe);
  }
  
  function grabPiece(e) {
    // when mouse clicks or starts dragging.
    const elem = e.target
    if (elem.className === 'piece ') {
      elem.style.left = `${e.clientX - 75 - boardRef.current.offsetLeft}px`;
      elem.style.top = `${e.clientY - 75 - boardRef.current.offsetTop}px`;
      const x = e.clientX - boardRef.current.offsetLeft;
      const y = e.clientY - boardRef.current.offsetTop;
      const a = (x - (x % 150)) / 150;
      const b = (y - (y % 150)) / 150;
      const c = elem.id==='pw' ? -1 : 1;
      
      setMovesGuide(a,b,c);

      elem.style.zIndex = "2";
      setGrab(elem);
      setGrabPos({ x: a, y: b })
    }
  }

  function movePiece(e) {
    // when mouse drags.
    const elem = e.target;
    if (elem.className === 'piece ' && elem === grab) {
      elem.style.left = `${e.clientX - 75 - boardRef.current.offsetLeft}px`;
      elem.style.top = `${e.clientY - 75 - boardRef.current.offsetTop}px`;
    }
  }

  function placePiece(e) {
    // when mouse drag ends.
    const elem = e.target;
    if (elem.className === 'piece ') {
      const x = e.clientX - boardRef.current.offsetLeft;
      const y = e.clientY - boardRef.current.offsetTop;
      const a = (x - (x % 150)) / 150;
      const b = (y - (y % 150)) / 150;

      if (a < 3 && a >= 0 && b < 3 && b >= 0) {
        let dupe = pieces.slice();
        let cur = dupe.find(elem =>
          elem.x === grabPos.x && elem.y === grabPos.y);
        cur.x = a; cur.y = b;
        setPieces(dupe);

        grab.style.top = `${b*150}px`;
        grab.style.left= `${a*150}px`;
      }
      else {
        grab.style.top = `${grabPos.y*150}px`;
        grab.style.left = `${grabPos.x*150}px`;
      }
      delMovesGuide();
      grab.style.zIndex = "1";
      setGrab(null);
    }
  }

  function makeBoard() {
    // makes the list of pieces.
    let b = [];
    for (let i = 0; i < pieces.length; i++) {
      b.push(
        <Piece key={i} id={pieces[i].p}
        pos={{ x: pieces[i].x, y: pieces[i].y }}
        piece={pieces[i].p}
        capture={pieces[i].capture? 'piece-capture' : ''}
        available={pieces[i].available? 'place-available' : ''}
        selected={pieces[i].selected? 'piece-selected' : ''}
        />
      );
    }
    return b;
  }

  return (
    // board div with a list of pieces and functionality.
    <div className='board'
      style={{ zIndex: 1, marginTop: '-450px' }}
      onMouseDown={(e) => { grabPiece(e) }}
      onMouseMove={(e) => { movePiece(e) }}
      onMouseUp={(e) => { placePiece(e) }}
      ref={boardRef}>
      {makeBoard()}
    </div>
  )
}


const Piece = (props) => {
  return (
    // piece div at respective positions and types.
    <div className={`piece ${props.capture}${props.available}${props.selected}`} id={props.piece}
      style={{ left: props.pos.x * 150, top: props.pos.y * 150 }}></div>
  )
}

export default Board;
