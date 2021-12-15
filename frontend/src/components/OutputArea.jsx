import './OutputArea.css';

const OutputArea = ({assemblerOutput, simulatorOutput}) => {
  const lastRegisterState = simulatorOutput && simulatorOutput.register_states.at(-1)
  const lastMemoryState = simulatorOutput && simulatorOutput.memory_dump

  if (!assemblerOutput)
    return null

  return (
    <div className="output-area">

      <AssemblerOutput output={assemblerOutput}/>
      <MemoryTrace />
      <Registers state={lastRegisterState}/>
      <Variables state={lastMemoryState}/>

    </div>
  )
}

const AssemblerOutput = ({output}) => {
  return (
    <div className="assembler-output-container">
      <h2 className="section-header">Assembler</h2>
        <ul>
          {output && output.map((line, i) => <li key={line + i.toString()}><code>{line}</code></li>)}
        </ul>
    </div>
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

const Registers = ({state}) => {
  return (
    <div className="registers-container">
      <h2 className="section-header">Registers</h2>  
        <RegistersList state={state}/>
    </div>
  )
}

const RegistersList = ({state}) => {
  const registerNames = ['PC', 'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'FLAGS']

  const registersList = state && registerNames.map((name, i) => 
    <tr className="register-text" key={name}>
      <td style={{border: "solid 1px white", padding: "6px"}}>{name}</td>
      <td style={{border: "solid 1px white", padding: "6px"}}>{state[i]}</td>
    </tr>
  )

  return (
    <table className="register-list">
      <tbody>
        <tr>
          <th style={{border: "solid 1px white", padding: "6px"}}>Register</th>
          <th style={{border: "solid 1px white", padding: "6px"}}>Data</th>
        </tr>
        {registersList}
      </tbody>
    </table>
  )
}

const Variables = ({state}) => {
  console.log(state)
  const variablesList = state && state.map((block, i) => 
    <li className="variable-text" key={block + i}>
      {block}
    </li >
  )

  return (
    <div className="variables-container">  
      <h2 className="section-header">Memory Dump</h2>
      <ol className="variable-list">
        {variablesList}
      </ol>
    </div>
  )
}

export default OutputArea
