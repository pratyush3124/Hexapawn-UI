import './App.css';
import Board from './Board.js';
import BackBoard from './BackBoard.js'

function App() {
  return (
    <div className="container">
      <div className="App">
        <BackBoard size={3}/>
        <Board/>
      </div>
    </div>
  );
}

export default App;
