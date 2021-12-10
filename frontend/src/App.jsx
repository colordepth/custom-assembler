import { useState } from 'react'
import Assembler from './routes/Assembler'
import AppHeader from './components/AppHeader'
import About from './routes/About'
import { Routes, Route } from 'react-router-dom'
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
      <Routes>
        <Route path='/' element={
          <Assembler
            code={code}
            setCode={setCode}
            assemblerOutput={assemblerOutput}
            simulatorOutput={simulatorOutput}
          />
        }/>
        <Route path='/about' element={<About/>} />
      </Routes>

    </div>
  );
}

export default App;
