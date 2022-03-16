import './App.css';
import Board from './Board.js';
import BackBoard from './BackBoard.js';
import Graph from './Graph.js';
import * as d3 from 'd3';
import {useRef} from 'react';

function App() {
  return (
    <div className="container">
      <div className="App">
        <Graph/>
        <div className="boardGroup">
          <BackBoard size={3} />
          <Board/>
        </div>
      </div>
    </div>
  );
}

export default App;
