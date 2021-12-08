import './OutputArea.css';

const OutputArea = ({assemblerOutput, simulatorOutput}) => {
  return (
    <div className="output-area">

      <AssemblerOutput output={assemblerOutput}/>
      <SimulatorOutput output={simulatorOutput}/>
      <MemoryTrace/>
      <Registers/>
      <Variables/>

    </div>
  )
}

const AssemblerOutput = ({output}) => {
  return (
    <div className="assembler-output-container">
      <h2 className="section-header">Assembler</h2>
        <ul>
          {output}
        </ul>
    </div>
  )
}

const SimulatorOutput = ({output}) => {
  return (
    <>
      {output && "Simulator:"}<br/>
      <ul>
        {output}
      </ul>
    </>
  )
}

const MemoryTrace = () => {
  return (
    <div className="memory-trace-graph-container">  
      <h2 className="section-header">Memory access graph</h2>
      <img className="memory-trace-image"></img>
    </div>
  )
}

const Registers = () => {
  return (
    <div className="registers-container">
      <h2 className="section-header">Registers</h2>  
    </div>
  )
}

const Variables = () => {
  return (
    <div className="variables-container">  
      <h2 className="section-header">Variables</h2>
    </div>
  )
}

export default OutputArea
