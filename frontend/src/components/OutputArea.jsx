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
      <img className="memory-trace-image" alt="memory trace graph"></img>
    </div>
  )
}

const Registers = () => {
  return (
    <div className="registers-container">
      <h2 className="section-header">Registers</h2>  
      <ol className="register-list">
        <li className="register-text">
          r0 : 10001111
        </li>
        <li className="register-text">
          r1 : 10001111
        </li>
        <li className="register-text">
          r2 : 10001111
        </li>
        <li className="register-text">
          r3 : 10001111
        </li>
        <li className="register-text">
          r4 : 10001111
        </li>
        <li className="register-text">
          r5 : 10001111
        </li>
        <li className="register-text">
          r6 : 10001111
        </li>
        <li className="register-text">
          r7 : 10001111
        </li>
      </ol>
    </div>
  )
}

const Variables = () => {
  return (
    <div className="variables-container">  
      <h2 className="section-header">Variables</h2>
      <ul className="varaible-list">
        <li className="variable-text">
          a : 11110000
        </li >
      </ul>
    </div>
  )
}

export default OutputArea
