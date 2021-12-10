import promiseService from '../services/promises'
import RunButton from './RunButton'
import './AppHeader.css';
import {useMatch, Link} from 'react-router-dom'

const AppHeader = props => {
  const match = useMatch('/')

  return (
    <header className="App-header">
      <nav> 
        <div className="page-title-block">
          <Link className="page-heading" to="/">Custom Assembler</Link>
          <div className="header-underline"></div>
        </div>
        <Link className="about-button" to="/about">About</Link>
      </nav>
      { match ? 
        <RunButton
          onClick={() => postAssemblerCode(props)}
        />
        : null
      }
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
