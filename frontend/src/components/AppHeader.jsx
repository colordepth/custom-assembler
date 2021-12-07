import promiseService from '../services/promises.js'
import RunButton from './RunButton'

const AppHeader = props => {
  return (
    <header className="App-header">
      Basic Assembler
      <RunButton
        onClick={() => postAssemblerCode(props)}
      />
    </header>
  )
}

const postAssemblerCode = IO => {
  const {setAssemblerOutput, setSimulatorOutput, code} = IO

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
}

export default AppHeader
