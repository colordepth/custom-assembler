import { useState } from 'react'
// import logo from './logo.svg';
import './App.css';
import promiseService from './services/promises.js'

const App = () => {
  const [assemblerOutput, setAssemblerOutput] = useState('')
  const [simulatorOutput, setSimulatorOutput] = useState('')
  const [code, setCode] = useState('')

  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}

        <div className="code">
          <h2>Code</h2>
          <textarea
            wrap="off"
            placeholder="Enter code here"
            rows="40"
            cols="100"
            name="name"
            autoCapitalize="none"
            onChange={(event) => setCode(event.target.value)}
            value={code}
          />
        </div>

        <button
          onClick={event => {
            event.preventDefault()
            promiseService
              .sendCode(code)
              .then(data => {
                console.log(data)
                if (data.error)
                {
                  setAssemblerOutput(data.error.map((line, i) => <li key={line + i.toString()}><code>{line}</code></li>))
                  setSimulatorOutput("")
                }
                else
                {
                  setAssemblerOutput(data.assembler.map((line, i) => <li key={line + i.toString()}><code>{line}</code></li>))
                  setSimulatorOutput(data.simulator.register_states.map((line, i) => <li key={line + i.toString()}><code>{line}</code></li>))
                }
              })
          }}
          style={{fontSize: "20px", margin: "20px"}}
        >Run</button>

        {assemblerOutput && "Assembler:"}<br/>
        <ul style={{listStyleType : "none"}}>
          {assemblerOutput}
        </ul>
        {simulatorOutput && "Simulator:"}<br/>
        <ul style={{listStyleType : "none"}}>
          {simulatorOutput}
        </ul>
        <div className="instruction-set">
          <h2>Instruction set</h2>  
        </div>
        <div className="memory-access-graph">  
          <h2>Memory access graph</h2>
        </div>
        <div className="registers">
          <h2>Registers</h2>  
        </div>
        <div className="variables">  
          <h2>Variables</h2>
        </div>
      </header>
    </div>
  );
}

export default App;
