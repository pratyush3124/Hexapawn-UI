import './App.css';
import Board from './Board.js';
import BackBoard from './BackBoard.js';
import Graph from './Graph.js';
import { useRef, useState, useEffect } from 'react';

function App() {

  const [history, setHistory] = useState([
    {
      "parent": "",
      "color": "pw",
      "id": "CCC",
      "selected":true,
      "data": [
        { x: 0, y: 2, p: 'pw' },
        { x: 1, y: 2, p: 'pw' },
        { x: 2, y: 2, p: 'pw' },
        { x: 0, y: 0, p: 'pb' },
        { x: 1, y: 0, p: 'pb' },
        { x: 2, y: 0, p: 'pb' },
      ],
    }
  ]);

  const [pieces, setPieces] = useState(
    [
      { x: 0, y: 2, p: 'pw' },
      { x: 1, y: 2, p: 'pw' },
      { x: 2, y: 2, p: 'pw' },
      { x: 0, y: 0, p: 'pb' },
      { x: 1, y: 0, p: 'pb' },
      { x: 2, y: 0, p: 'pb' },
    ]
  );

  const [color, setColor] = useState("pw");
  const [pointer, setPointer] = useState("CCC");

  useEffect(() => { console.log("history", history )}, [history])
  // useEffect(() => { console.log("pieces", pieces) }, [pieces])

  // useEffect(() => {
  //   let curPieces = history.find(element => element.id === pointer)

  //   if (curPieces === undefined) {
  //     setHistory((pre) => {
  //       let a = pre.map((x) => x)
  //       a.push(
  //         {
  //           "parent": pointer.slice(0, -3),
  //           "color": color,
  //           "id": pointer,
  //           "selected":false,
  //           "data": pieces.map((a) => { return { ...a } })
  //         }
  //       );
  //       return a;
  //     });
  //     setColor(prev => prev === 'pw' ? 'pb' : 'pw')
  //   } else {
  //     setPieces(curPieces.data);
  //     setColor(curPieces.color==='pw'?'pb':'pw');
  //   }
  // }, [pointer]);

  useEffect(() => {
    pieces.forEach((piece, i) => {
      let elem = boardRef.current.children[1].children[i];
      elem.style.left = `${piece.x * 150}px`;
      elem.style.top = `${piece.y * 150}px`;
      elem.style.zIndex = "0";
    })
  }, [pieces]);

  const boardRef = useRef();

  function goPast(id) {
    console.log("going back")
    var dt;
    var cl;
    setHistory(prevHistory => {
      // making the past node selected
      let a = prevHistory.map(x=>x);
      for (let elem of a) {
        if (elem.id === id) {
          // console.log(elem)
          elem.selected = true;
          cl = elem.color;
          dt = elem.data;
        } else {
          elem.selected = false;          
        }
      }
      return a
    });
    setColor(cl==='pw'?'pb':'pw');
    setPieces(dt.map(x=>{return {...x}}));

    // setPointer(id);
  }

  function makeMove(data, cur) {
    setPieces(data); // make the pieces on the board

    if (cur !== undefined) {
      setHistory(prevHistory => {
        // add new move to history
        let prev = prevHistory.find(elem => elem.selected);
        let a = prevHistory.map(x=> x)
        for (let elem of a) {
          elem.selected = false;
        }
        a.push(
        {
          "parent": prev.id,
          "color": color,
          "id": prev.id+cur,
          "selected":true,
          "data":data.map(x=>{return{...x}}),
        })
        return a;
      });
      setColor(prev => prev === 'pw' ? 'pb' : 'pw')

      // setPointer(prev => prev + cur);
    }
  };

  return (
    <div className="container">
      <div className="App">
        <Graph pieces={pieces} history={history} goPast={goPast} />
        <div ref={boardRef} className="boardGroup">
          <BackBoard size={3} />
          <Board pieces={pieces} makeMove={makeMove} color={color} />
        </div>
      </div>
    </div>
  );
}

export default App;
