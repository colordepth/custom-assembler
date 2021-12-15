import WorkArea from '../components/WorkArea'
import OutputArea from '../components/OutputArea'
import './Assembler.css'

const Assembler = props => {
  return (
    <>
      <WorkArea
        code={props.code}
        setCode={props.setCode}
      />
      <OutputArea
        assemblerOutput={props.assemblerOutput}
        simulatorOutput={props.simulatorOutput}
      />
    </>
  )
}

export default Assembler
