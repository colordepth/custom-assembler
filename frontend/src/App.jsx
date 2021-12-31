import { useState } from 'react'
import Assembler from './routes/Assembler'
import AppHeader from './components/AppHeader'
import About from './routes/About'
import { Routes, Route } from 'react-router-dom'
import './App.css';

let sample_code = "\
var output\n\
\n\
mov R0 $12\n\
mov R1 $0\n\
mov R2 $1\n\
mov R3 $2\n\
mov R4 $1\n\
mov R5 $0\n\
\n\
fibonacci:     cmp R3 R0\n\
               jgt fibonacci_end\n\
               mov R5 R2\n\
               add R2 R2 R1\n\
               mov R1 R5\n\
               add R3 R3 R4\n\
               jmp fibonacci\n\
fibonacci_end: st R3 output\n\
\n\
hlt\n";

const App = () => {
  const [assemblerOutput, setAssemblerOutput] = useState('')
  const [simulatorOutput, setSimulatorOutput] = useState('')
  const [code, setCode] = useState(sample_code)

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
