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
      </header>
    </div>
  );
}

export default App;
