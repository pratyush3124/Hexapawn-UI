import './App.css';
import Board from './Board.js';
import BackBoard from './BackBoard.js';
import Graph from './Graph.js';
import { useRef, useState, useEffect } from 'react';

// Always use copies of 2d arrays or arrays of objects when changing.
// Pointers\refrences and stuff messes things up.

function App() {

  const [history, setHistory] = useState([
    {
      "parent": "",
      "color": "pb",
      "id": "CCC",
      "selected": true,
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
  
  const appRef = useRef();

  useEffect(() => {
    let a = document.getElementsByClassName("App")[0];
    a.addEventListener("keydown", (e)=>{
      if(e.key==="ArrowLeft"){goBack()}
      else if(e.key==="ArrowRight"){goForward()}
      else{console.log(e)}
    });
  }, [])

  // useEffect(() => { console.log("history", history) }, [history])s
  // useEffect(() => { console.log("pieces", pieces) }, [pieces])

  useEffect(() => {
    update();
  }, [history])

  useEffect(() => {
    pieces.forEach((piece, i) => {
      let elem = appRef.current.children[1].children[1].children[i];
      elem.style.left = `${piece.x * 150}px`;
      elem.style.top = `${piece.y * 150}px`;
      elem.style.zIndex = "0";
    })
  }, [pieces]);

  function update(){
    // sets pieces and colors.
    let current = history.find(elem => elem.selected);
    setColor(current.color === "pw" ? "pb" : "pw");
    setPieces(current.data.map(x => { return { ...x } }));
  }

  function goPast(id) {
    // console.log("going back")
    setHistory(prevHistory => {
      // making the past node selected
      let a = prevHistory.map(x => x);
      for (let elem of a) {
        if (elem.id === id) {
          elem.selected = true;
        } else {
          elem.selected = false;
        }
      }
      return a
    });
  }

  function makeMove(data, childId) {
    if (childId !== undefined) {
      let parent = history.find(elem => elem.selected);
      let child = history.find(elem => elem.id === parent.id + childId);

      if (child !== undefined) {
        goPast(parent.id + childId)
        return;
      }

      setHistory(prevHistory => {
        // add new move to history
        let parent = prevHistory.find(elem => elem.selected);
        let a = prevHistory.map(x => x)

        for (let elem of a) {
          elem.selected = false;
        }
        a.push(
          {
            "parent": parent.id,
            "color": color,
            "id": parent.id + childId,
            "selected": true,
            "data": data.map(x => { return { ...x } }),
          })
        return a;
      });
    } else {
      update();
    }
  };

  function press(e){
    console.log(e);
  }

  function goBack(){
    for (let elem of history){
      let child = history.find(el => el.id===elem.parent);
      if (child!==undefined && elem.selected){
        goPast(elem.parent);
      }
    }
  };

  function goForward(){
    for (let elem of history){
      let child = history.find(el => el.parent===elem.id);
      if (child!==undefined && elem.selected){
        goPast(child.id)
      }
    }
  }

  return (
    <div className="container">
      <div className="App" ref={appRef} tabIndex="0">
        <Graph pieces={pieces} history={history} goPast={goPast} />
        <div className="boardGroup">
          <BackBoard size={3} />
          <Board pieces={pieces} makeMove={makeMove} color={color} />
        </div>
        <div className="movement">
          <button className="moveButtons" onClick={goBack}>Prev</button>
          <button className="moveButtons" onClick={goForward}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default App;
