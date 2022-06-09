import { useState, useRef, useEffect } from 'react';
import './App.css'

const Board = (props) => {
  // props.pieces is in the parent component (App).
  // its a state been passed down as props.

  const [guides, setGuides] = useState([
    // { x: 0, y: 0, capture:true},
    // { x: 1, y: 0, selected:true },
    // { x: 1, y: 1, available:true},
  ]);

  var color = props.color;
  const [grab, setGrab] = useState(null);
  const [grabPos, setGrabPos] = useState({ x: -1, y: -1 });

  const boardRef = useRef(null);

  function findMoves(a, b, pieces) {
    let c = color === "pb" ? 1 : -1;
    let moves = [];
    let aval = pieces.find(el => el.x === a && el.y === b + c);
    let capt1 = pieces.find(el => el.x === a - 1 && el.y === b + c)
    let capt2 = pieces.find(el => el.x === a + 1 && el.y === b + c)
    if (aval === undefined && b + c >= 0 && b + c < 3) {
      moves.push({ x: a, y: b + c, available: true })
    };
    if (capt1 !== undefined && capt1.p!==color) {
      moves.push({ x: a - 1, y: b + c, capture: true })
    };
    if (capt2 !== undefined && capt2.p!==color) {
      moves.push({ x: a + 1, y: b + c, capture: true })
    };
    return moves;
  }

  function findAllMoves(pieces) {
    var moves = [];
    pieces.forEach(el => {
      if (el.p===color){
        moves.push(...findMoves(el.x, el.y, pieces))
      }
    })
    return moves;
  }

  function setMovesGuide(a, b) {
    // set move guides.
    let possibleMoves = findMoves(a,b, props.pieces);
    setGuides(possibleMoves);
  }

  function remGuides(dupe) {
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

  function checkWin(pieces) {
    // 1. no more moves possible
    // 2. all pieces captured of opponent.
    // 3. piece reaches last rank.
    let win = 0;

    if (findAllMoves(pieces).length===0){
      win = 1;
    }

    pieces.forEach(el => {
      if ((el.y === 0 && el.p === "pw") || (el.y === 2 && el.p === "pb")) {
        win = 1;
      }
    })

    if (pieces.find(el => el.p === 'pw') === undefined) {
      win = 1;
    }
    if (pieces.find(el => el.p === 'pb') === undefined) {
      win = 1;
    }

    if (win) {
      console.log("won", color);
    }

  }

  function grabPiece(e, a, b) {
    // when mouse clicks or starts dragging.
    const elem = e.target
    if (elem.className === 'piece') {
      elem.style.left = `${e.clientX - 75 - boardRef.current.offsetLeft}px`;
      elem.style.top = `${e.clientY - 75 - boardRef.current.offsetTop}px`;

      if (color === elem.id) {
        const c = elem.id === 'pb' ? 1 : -1;
        setMovesGuide(a, b);
      }

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
    let elem = e.target;
    const x = e.clientX - boardRef.current.offsetLeft;
    const y = e.clientY - boardRef.current.offsetTop;
    const c = (x - (x % 150)) / 150;
    const d = (y - (y % 150)) / 150;

    let dupe = props.pieces.map((x) => { return { ...x } });

    let valid = validMove(c, d);

    if (valid !== "") {
      var mv = String.fromCharCode(97 + grabPos.x) + String.fromCharCode(97 + c) + String(3 - d);
      // console.log(mv)
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

    checkWin(dupe);
    remGuides();
    // props.setPieces({"data":dupe});
    props.makeMove(dupe, mv);
    setGrab(null);
  }

  function makeBoard() {
    // makes the list of props.pieces.
    let bds = [];
    for (let i = 0; i < props.pieces.length; i++) {
      bds.push(
        <Piece
          key={i}
          id={props.pieces[i].p}
          pos={{ x: props.pieces[i].x, y: props.pieces[i].y }}
          piece={props.pieces[i].p}
          grabPiece={grabPiece}
          movePiece={movePiece}
          placePiece={placePiece}
        />
      );
    }
    return bds;
  }

  function makeGuides() {
    let gds = [];
    for (let i = 0; i < guides.length; i++) {
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
          type={type}
          pos={{ x: guides[i].x, y: guides[i].y }}
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
      className={`piece ${props.type}`}
      style={{ left: props.pos.x * 150, top: props.pos.y * 150 }}
    ></div>
  )
}

export default Board;
