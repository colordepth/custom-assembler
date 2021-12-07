import runButtonSVG from './run-button.svg';
import './App.css';

const App = () => {

  return (
    <div className="App">
      <header className="App-header">
        Basic Assembler
        <button className="Run-button">Run<img id="run-button-svg" src={runButtonSVG} alt=""></img></button>
      </header>

      <div className="work-area">
        <div className="instruction-set">
          <h2 className="section-header">Instruction set</h2>  
          <ul>
            <li>
              <div className="instruction-syntax">sample</div>
              <div className="instruction-description"></div>
            </li>
          </ul>
        </div>
        <textarea
          wrap="off"
          placeholder="Enter code here"
          name="name"
          autoCapitalize="none"
          onChange={(event) => setCode(event.target.value)}
          value={code}  
        />
        
      </div>

      
      <div className="output-area">
        <div className="assembler-output-container">
          <h2 className="section-header">Assembler</h2>
        </div>
        {/* {"Simulator:"}<br/>
        <ul>
          {simulatorOutput}
        </ul> */}
        
        <div className="memory-trace-graph-container">  
          <h2 className="section-header">Memory access graph</h2>
          <img className="memory-trace-image"></img>
        </div>
        <div className="registers-container">
          <h2 className="section-header">Registers</h2>  
        </div>
        <div className="variables-container">  
          <h2 className="section-header">Variables</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
