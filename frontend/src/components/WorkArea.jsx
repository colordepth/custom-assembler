import InstructionSet from './InstructionSet'
import './WorkArea.css';

const WorkArea = ({code, setCode}) => {

  return (
    <div className="work-area">
      <InstructionSet/>
      <textarea
        spellCheck={false}
        wrap="off"
        placeHolder="Enter code here"
        autoCapitalize={null}
        onChange={(event) => setCode(event.target.value)}
        value={code}  
      />
    </div>
  );
}

export default WorkArea
