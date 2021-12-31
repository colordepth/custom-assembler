import InstructionSet from './InstructionSet'

const WorkArea = ({code, setCode}) => {

  return (
    <div className="work-area">
      <InstructionSet/>
      <textarea
        wrap="off"
        placeholder="Enter code here"
        autoCapitalize="none"
        onChange={(event) => setCode(event.target.value)}
        value={code}  
      />
    </div>
  );
}

export default WorkArea
