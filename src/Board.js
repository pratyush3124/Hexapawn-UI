import { useState, useRef, useEffect } from 'react';
import './App.css'

const Board = () => {
  const [pieces, setPieces] = useState([
    { x: 0, y: 2, p: 'pw' },
    { x: 1, y: 2, p: 'pw' },
    { x: 2, y: 2, p: 'pw' },
    { x: 0, y: 0, p: 'pb' },
    { x: 1, y: 0, p: 'pb' },
    { x: 2, y: 0, p: 'pb' },
  ]);
  
  const [guides, setGuides] = useState([
    // { x: 0, y: 0, capture:true},
    // { x: 1, y: 0, selected:true },
    // { x: 1, y: 1, available:true},
  ]);

  useEffect(() => {
    pieces.forEach((piece,i)=>{
        let elem = boardRef.current.children[i];
        elem.style.left = `${piece.x*150}px`;
        elem.style.top  = `${piece.y*150}px`;
        elem.style.zIndex = "0";
    })
  }, [pieces])


  let [grab, setGrab] = useState(null);
  let [grabPos, setGrabPos] = useState({ x: -1, y: -1 });

  const boardRef = useRef(null);

  function setMovesGuide(a, b, c) {
    // set move guides.
    let gds = [];
    let aval = pieces.find(el => el.x === a && el.y === b + c);
    let capt1 = pieces.find(el => el.x === a - 1 && el.y === b + c)
    let capt2 = pieces.find(el => el.x === a + 1 && el.y === b + c)

    if (aval === undefined && b + c >= 0 && b + c < 3) {
      gds.push({ x: a, y: b + c, available: true })
    };
    if (capt1 !== undefined) {
      gds.push({ x: a - 1, y: b + c, capture: true })
    };
    if (capt2 !== undefined) {
      gds.push({ x: a + 1, y: b + c, capture: true })
    };

    gds.push({ x: a, y: b, selected: true })
    setGuides(gds);
  }

  function remMovesGuide(dupe) {
    // remove move guides.
    setGuides([]);
  }

  function validMove(a, b) {

    let dest = guides.find(elem =>
      elem.x === a && elem.y === b
    );

    if (dest !== undefined) {
      if (dest.capture) { return 'c' }
      else if (dest.available) { return 'a' }
    }
    return '';
  }

  function grabPiece(e, a, b) {
    // when mouse clicks or starts dragging.
    const elem = e.target
    if (elem.className === 'piece') {
      
      elem.style.left = `${e.clientX - 75 - boardRef.current.offsetLeft}px`;
      elem.style.top = `${e.clientY - 75 - boardRef.current.offsetTop}px`;
      
      const c = elem.id === 'pb' ? 1 : -1;
      setMovesGuide(a, b, c);
      
      elem.style.zIndex = "2";
      setGrab(elem);
      setGrabPos({ x: a, y: b })
    }
  }

  function movePiece(e) {
    // moving grabbed piece.
    const elem = e.target
    if (elem === grab) {
      elem.style.left = `${e.clientX - 75 - boardRef.current.offsetLeft}px`;
      elem.style.top = `${e.clientY - 75 - boardRef.current.offsetTop}px`;
    }
  }

  function placePiece(e, a, b) {
    // placing grabbed piece.
    const x = e.clientX - boardRef.current.offsetLeft;
    const y = e.clientY - boardRef.current.offsetTop;
    const c = (x - (x % 150)) / 150;
    const d = (y - (y % 150)) / 150;

    let dupe = pieces.slice();
    let valid = validMove(c, d);

    if (valid!==""){
      if (valid === 'c') {
        let dest = dupe.find(elem =>
          elem.x === c && elem.y === d
        );
        dupe.splice(dupe.indexOf(dest), 1);
      }

      let cur = dupe.find(elem =>
        elem.x === grabPos.x && elem.y === grabPos.y
      );
  
      cur.x = c; cur.y = d;
    }
    
    remMovesGuide();
    setPieces(dupe);
    setGrab(null);

  }

  function makeBoard() {
    // makes the list of pieces.
    let b = [];
    for (let i = 0; i < pieces.length; i++) {
      b.push(
        <Piece 
          key={i}
          id={pieces[i].p}
          pos={{ x: pieces[i].x, y: pieces[i].y }}
          piece={pieces[i].p}
          grabPiece={grabPiece}
          movePiece={movePiece}
          placePiece={placePiece}
        />
      );
    }
    return b;
  }

  function makeGuides() {
    let gds = [];
    for (let i=0; i<guides.length; i++) {
      let type;
      if (guides[i].available) {
        type = 'place-available';
      } else if (guides[i].capture) {
        type = 'piece-capture';
      } else {
        type = 'piece-selected';
      }

      gds.push(
        <Guide 
          key={i}
          type = {type}
          pos = {{ x:guides[i].x, y:guides[i].y }}
        />
      )
    }
    return gds;
  }

  return (
    // board div with a list of pieces and functionality.
    <div className='board'
      style={{ zIndex: 1, marginTop: '-450px' }}
      ref={boardRef}>
      {makeBoard()}
      {makeGuides()}
    </div>
  )
}

const Piece = (props) => {
  return (
    // piece div at respective positions and types.
    <div
      className={'piece'}
      id={props.piece}
      onMouseDown={(e) => { props.grabPiece(e, props.pos.x, props.pos.y) }}
      onMouseMove={(e) => { props.movePiece(e) }}
      onMouseUp={(e) => { props.placePiece(e, props.pos.x, props.pos.y) }}
      style={{ left: props.pos.x * 150, top: props.pos.y * 150 }}
    ></div>
  )
}

const Guide = (props) => {
  return (
    // guide div with respective image.
    <div
      className = {`piece ${props.type}`}
      style = {{ left: props.pos.x*150, top: props.pos.y*150 }}
    ></div>
  )
}

export default Board;
