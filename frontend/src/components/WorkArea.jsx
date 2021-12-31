import InstructionSet from './InstructionSet'

let sample_code = "\
var output\
\
mov R0 $12\
mov R1 $0\
mov R2 $1\
mov R3 $2\
mov R4 $1\
mov R5 $0\
\
fibonacci:     cmp R3 R0\
               jgt fibonacci_end\
               mov R5 R2\
               add R2 R2 R1\
               mov R1 R5\
               add R3 R3 R4\
               jmp fibonacci\
fibonacci_end: st R3 output\
\
hlt";

const WorkArea = ({code, setCode}) => {

  return (
    <div className="work-area">
      <InstructionSet/>
      <textarea
        wrap="off"
        placeholder={sample_code}
        autoCapitalize="none"
        onChange={(event) => setCode(event.target.value)}
        value={code}  
      />
    </div>
  );
}

export default WorkArea
