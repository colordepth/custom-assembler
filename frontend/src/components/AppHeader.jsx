import { useMatch, Link } from 'react-router-dom'
import './AppHeader.css';

import { ArrowLeft, ArrowRight, Bug, FastForward, FileCode2, Play, RotateCcw, Square } from 'lucide-react';

const AppHeader = ({ debuggerControls, onCompile, isEdited }) => {
  const match = useMatch('/')

  return (
    <header className="App-header">
      <nav>
        <div className="page-title-block">
          <Link className="page-heading" to="/">Custom Assembler</Link>
        </div>
        <Link className="about-button" to="/about">About</Link>
      </nav>

      {match && debuggerControls ? (
        <DebugToolbar controls={debuggerControls} onCompile={onCompile} isEdited={isEdited} />
      ) : null}
    </header>
  )
}

const DebugToolbar = ({ controls, onCompile, isEdited }) => {
  const {
    onRun, onDebug, onStepOver, onStepBack, onResume, onStop, onRestart,
    isDebugging, canStepBack, canStepForward,
  } = controls

  return (
    <div className="debug-toolbar">
      <button className="toolbar-btn compile" title="Compile only" onClick={onCompile}>
        <FileCode2 size={14} aria-hidden="true" />
        Compile
      </button>
      <button className="toolbar-btn run" title="Run (assemble + simulate)" onClick={onRun}>
        <Play size={14} fill="currentColor" aria-hidden="true" /> Run
      </button>
      <button className="toolbar-btn debug" title="Debug" onClick={onDebug}>
        <Bug size={14} aria-hidden="true" /> Debug
      </button>

      <span className="toolbar-separator" />

      <button className="toolbar-btn icon" title="Step back" onClick={onStepBack}
        disabled={!isDebugging || !canStepBack}><ArrowLeft size={15} /></button>
      <button className="toolbar-btn icon" title="Step over" onClick={onStepOver}
        disabled={!isDebugging || !canStepForward}><ArrowRight size={15} /></button>
      <button className="toolbar-btn icon" title="Resume to next breakpoint" onClick={onResume}
        disabled={!isDebugging || !canStepForward}><FastForward size={15} /></button>
      <button className="toolbar-btn icon" title="Restart debug session" onClick={onRestart}
        disabled={!isDebugging}><RotateCcw size={15} /></button>
      <button className="toolbar-btn icon stop" title="Stop" onClick={onStop}
        disabled={!isDebugging}><Square size={14} fill="currentColor" /></button>
    </div>
  )
}

export default AppHeader
