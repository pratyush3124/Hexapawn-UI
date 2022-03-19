import './App.css';
import Board from './Board.js';
import BackBoard from './BackBoard.js';
import Graph from './Graph.js';
import { useRef, useState, useEffect } from 'react';

function App() {

  const [history, setHistory] = useState([
    {
      "parent":"",
      "color":"#1e7055",
      "id": "center",
      "data": [
        { x: 0, y: 2, p: 'pw' },
        { x: 1, y: 2, p: 'pw' },
        { x: 2, y: 2, p: 'pw' },
        { x: 0, y: 0, p: 'pb' },
        { x: 1, y: 0, p: 'pb' },
        { x: 2, y: 0, p: 'pb' },
      ],
    }
  ])

  const [pieces, setPieces] = useState([
    { x: 0, y: 2, p: 'pw' },
    { x: 1, y: 2, p: 'pw' },
    { x: 2, y: 2, p: 'pw' },
    { x: 0, y: 0, p: 'pb' },
    { x: 1, y: 0, p: 'pb' },
    { x: 2, y: 0, p: 'pb' },
  ]);

  const [color, setColor] = useState("w");

  let move = useRef(null);

  useEffect(() => {
    let b = history[history.length - 1]
    let same = b.data.length === pieces.length && pieces.every((val, ind) => val.x === b.data[ind].x && val.y === b.data[ind].y && val.p === b.data[ind].p)
    if (!same) {
      setHistory((prev) => {
        let a = prev.map((x) => x)
        a.push(
          {
            "color":color,
            "name":move.current,
            "data":pieces.map((a)=>{return{...a}})
          } 
        );
        return a;
      })
    }
    setColor(color==="white"?"black":"white")

    pieces.forEach((piece, i) => {
      let elem = boardRef.current.children[1].children[i];
      elem.style.left = `${piece.x * 150}px`;
      elem.style.top = `${piece.y * 150}px`;
      elem.style.zIndex = "0";
    })

    // console.log(history);

  }, [pieces])

  const boardRef = useRef();

  return (
    <div className="container">
      <div className="App">
        <Graph pieces={pieces} history={history} />
        <div ref={boardRef} className="boardGroup">
          <BackBoard size={3} />
          <Board pieces={pieces} setPieces={setPieces} move={move}/>
        </div>
      </div>
    </div>
  );
}

export default App;
