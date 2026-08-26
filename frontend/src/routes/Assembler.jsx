import WorkArea from '../components/WorkArea'
import './Assembler.css'

const Assembler = props => {
  return (
    <WorkArea
      code={props.code}
      setCode={props.setCode}
      assemblerOutput={props.assemblerOutput}
      simulatorOutput={props.simulatorOutput}
      compiledLineMap={props.compiledLineMap}
      breakpoints={props.breakpoints}
      onToggleBreakpoint={props.onToggleBreakpoint}
      debuggerState={props.debuggerState}
      isEdited={props.isEdited}
    />
  )
}

export default Assembler
