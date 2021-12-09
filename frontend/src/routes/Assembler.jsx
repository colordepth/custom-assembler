import WorkArea from '../components/WorkArea'
import OutputArea from '../components/OutputArea'

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
