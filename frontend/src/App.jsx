import { useState } from 'react'
import AppHeader from './components/AppHeader'
import WorkArea from './components/WorkArea'
import OutputArea from './components/OutputArea'
import './App.css';

const App = () => {
  const [assemblerOutput, setAssemblerOutput] = useState('')
  const [simulatorOutput, setSimulatorOutput] = useState('')
  const [code, setCode] = useState('')

  return (
    <div className="App">

      <AppHeader
        code={code}
        setAssemblerOutput={setAssemblerOutput}
        setSimulatorOutput={setSimulatorOutput}
      />
      <WorkArea
        code={code}
        setCode={setCode}
      />
      <OutputArea
        assemblerOutput={assemblerOutput}
        simulatorOutput={simulatorOutput}
      />

    </div>
  );
}

export default App;
