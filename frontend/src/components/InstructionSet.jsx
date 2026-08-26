import './InstructionSet.css';

const instructionList = [
  { name: 'add Rd Rs Rt', description: 'Add two registers and store result in destination.' },
  { name: 'sub Rd Rs Rt', description: 'Subtract Rt from Rs and store in destination.' },
  { name: 'mul Rd Rs Rt', description: 'Multiply two registers and keep result modulo 2^16.' },
  { name: 'div Rd Rs', description: 'Divide the register pair and store quotient/remainder.' },
  { name: 'mov Rd $imm', description: 'Load an immediate into a register.' },
  { name: 'mov Rd Rs', description: 'Copy one register value into another.' },
  { name: 'ld Rd var', description: 'Load a value from memory into a register.' },
  { name: 'st Rs var', description: 'Store a register value into the memory variable.' },
  { name: 'rs Rd $n', description: 'Logical right shift by n bits.' },
  { name: 'ls Rd $n', description: 'Logical left shift by n bits.' },
  { name: 'xor Rd Rs Rt', description: 'Bitwise XOR between two registers.' },
  { name: 'or Rd Rs Rt', description: 'Bitwise OR between two registers.' },
  { name: 'and Rd Rs Rt', description: 'Bitwise AND between two registers.' },
  { name: 'not Rd Rs', description: 'Bitwise NOT of a register value.' },
  { name: 'cmp Rs Rt', description: 'Compare two registers and update FLAGS.' },
  { name: 'jmp label', description: 'Jump unconditionally to a label address.' },
  { name: 'jlt label', description: 'Jump if less-than flag is active.' },
  { name: 'jgt label', description: 'Jump if greater-than flag is active.' },
  { name: 'je label', description: 'Jump if equal flag is active.' },
  { name: 'hlt', description: 'Stop execution and end the program.' },
];

const renderSyntax = (syntax) => syntax.split(/(\s+)/).map((token, index) => {
  if (/^\s+$/.test(token)) return token;
  if (index === 0) return <span className="syntax-keyword" key={index}>{token}</span>;
  if (token.startsWith('$')) return <span className="syntax-number" key={index}>{token}</span>;
  if (/^R[dst]$|^Rs$|^Rt$|^Rd$/.test(token)) return <span className="syntax-register" key={index}>{token}</span>;
  return <span className="syntax-label" key={index}>{token}</span>;
});

const InstructionSet = ({ compact = false }) => {
  return (
    <div className={`instruction-set ${compact ? 'compact' : ''}`}>
      <div className="panel-header">
        <h2 className="section-header">Instruction set</h2>
      </div>
      <ul className="instruction-list">
        {instructionList.map((instruction) => (
          <li key={instruction.name} className="instruction-item">
            <div className="instruction-syntax">{renderSyntax(instruction.name)}</div>
            <div className="instruction-description">{instruction.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructionSet;
