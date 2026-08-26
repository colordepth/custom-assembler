import { useState } from 'react'
import Assembler from './routes/Assembler'
import AppHeader from './components/AppHeader'
import About from './routes/About'
import { Routes, Route } from 'react-router-dom'
import promiseService from './services/promises'
import './App.css';

let sample_code =
  "var output\n\n" +
  "mov R0 $12\n" +
  "mov R1 $0\n" +
  "mov R2 $1\n" +
  "mov R3 $2\n" +
  "mov R4 $1\n" +
  "mov R5 $0\n" +
  "\n" +
  "fibonacci:     cmp R3 R0\n" +
  "               jgt fibonacci_end\n" +
  "               mov R5 R2\n" +
  "               add R2 R2 R1\n" +
  "               mov R1 R5\n" +
  "               add R3 R3 R4\n" +
  "               jmp fibonacci\n" +
  "fibonacci_end: st R3 output\n" +
  "\n" +
  "hlt\n";

const App = () => {
  const [assemblerOutput, setAssemblerOutput] = useState('')
  const [simulatorOutput, setSimulatorOutput] = useState('')
  const [code, setCode] = useState(sample_code)
  const [compiledCode, setCompiledCode] = useState(null)
  const [compiledLineMap, setCompiledLineMap] = useState([])
  const [breakpoints, setBreakpoints] = useState(() => new Set())
  const [isDebugging, setIsDebugging] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const timeline = simulatorOutput?.timeline || []

  const toggleBreakpoint = (lineNumber) => {
    setBreakpoints((current) => {
      const next = new Set(current)
      if (next.has(lineNumber)) next.delete(lineNumber)
      else next.add(lineNumber)
      return next
    })
  }

  const execute = () => {
    return promiseService.sendCode(code).then((data) => {
      if (data.error) {
        setAssemblerOutput(data.error)
        setSimulatorOutput('')
        return null
      }
      setAssemblerOutput(data.assembler)
      setSimulatorOutput(data.simulator)
      setCompiledCode(code)
      setCompiledLineMap(data.lineMap || data.simulator?.lineMap || [])
      return data.simulator
    })
  }

  const handleCompile = () => {
    return promiseService.compileCode(code).then((data) => {
      setAssemblerOutput(data.error || data.assembler)
      if (!data.error) {
        setCompiledCode(code)
        setCompiledLineMap(data.lineMap || [])
      }
      return data
    })
  }

  const firstBreakpointHit = (steps, fromIndex) =>
    steps.findIndex((step, index) => index >= fromIndex && breakpoints.has(step.sourceLine))

  const handleRun = () => {
    setIsDebugging(false)
    execute().then((simulator) => {
      const steps = simulator?.timeline || []
      setStepIndex(steps.length ? steps.length - 1 : 0)
    })
  }

  const handleDebug = () => {
    execute().then((simulator) => {
      if (!simulator) return
      const steps = simulator.timeline || []
      const hit = firstBreakpointHit(steps, 0)
      setStepIndex(hit >= 0 ? hit : 0)
      setIsDebugging(true)
    })
  }

  const handleStepOver = () => {
    setStepIndex((current) => Math.min(timeline.length - 1, current + 1))
  }

  const handleStepBack = () => {
    setStepIndex((current) => Math.max(0, current - 1))
  }

  const handleResume = () => {
    const hit = firstBreakpointHit(timeline, stepIndex + 1)
    setStepIndex(hit >= 0 ? hit : Math.max(0, timeline.length - 1))
  }

  const handleRestart = () => {
    setStepIndex(0)
  }

  const handleStop = () => {
    setIsDebugging(false)
  }

  const debuggerControls = {
    onRun: handleRun,
    onDebug: handleDebug,
    onStepOver: handleStepOver,
    onStepBack: handleStepBack,
    onResume: handleResume,
    onRestart: handleRestart,
    onStop: handleStop,
    isDebugging,
    canStepBack: stepIndex > 0,
    canStepForward: stepIndex < timeline.length - 1,
  }

  return (
    <div className="App">

      <AppHeader
        debuggerControls={debuggerControls}
        onCompile={handleCompile}
        isEdited={compiledCode !== null && compiledCode !== code}
      />
      <Routes>
        <Route path='/' element={
          <Assembler
            code={code}
            setCode={setCode}
            assemblerOutput={assemblerOutput}
            simulatorOutput={simulatorOutput}
            compiledLineMap={compiledLineMap}
            breakpoints={breakpoints}
            onToggleBreakpoint={toggleBreakpoint}
            debuggerState={{ isDebugging, stepIndex }}
            isEdited={compiledCode !== null && compiledCode !== code}
          />
        } />
        <Route path='/about' element={<About />} />
        <Route path='/*' element={<div>404 Not Found</div>} />
      </Routes>

    </div>
  );
}

export default App;
