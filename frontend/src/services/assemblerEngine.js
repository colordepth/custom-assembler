const REGISTER_MAP = {
  R0: '000',
  R1: '001',
  R2: '010',
  R3: '011',
  R4: '100',
  R5: '101',
  R6: '110',
  FLAGS: '111',
};

const TYPE_SETS = {
  typeA: ['add', 'sub', 'mul', 'xor', 'or', 'and'],
  typeB: ['mov', 'rs', 'ls'],
  typeC: ['mov', 'div', 'not', 'cmp'],
  typeD: ['ld', 'st'],
  typeE: ['jmp', 'jlt', 'je', 'jgt'],
  typeF: ['hlt'],
};

const INSTRUCTION_MAP = {
  add: '00000',
  sub: '00001',
  mov: ['00010', '00011'],
  ld: '00100',
  st: '00101',
  mul: '00110',
  div: '00111',
  rs: '01000',
  ls: '01001',
  xor: '01010',
  or: '01011',
  and: '01100',
  not: '01101',
  cmp: '01110',
  jmp: '01111',
  jlt: '10000',
  jgt: '10001',
  je: '10010',
  hlt: '10011',
};

const variableMap = {};
const labelsMap = {};
const codeGenMap = {};

function convertToBin(value, bits = 8) {
  return Number(value).toString(2).padStart(bits, '0');
}

function normalizeSource(sourceCode) {
  return String(sourceCode || '').replace(/\r\n/g, '\n');
}

function removeLabel(asmString) {
  if (!asmString.includes(':')) return asmString;
  return asmString.slice(asmString.indexOf(':') + 1).trimStart();
}

function validateRegisterName(register, type) {
  if (!(register in REGISTER_MAP)) {
    if (register && register.length >= 2 && register[0] === 'R' && /^\d+$/.test(register.slice(1))) {
      throw createCompileError('validateRegisterName', `Syntax Error: Unknown register '${register.toUpperCase()}'`);
    }
    throw createCompileError('validateRegisterName', `Syntax Error: Unexpected operand '${String(register).toUpperCase()}' for type${type} instruction`);
  }

  if (register === 'FLAGS') {
    throw createCompileError('validateRegisterName', 'Semantic Error: Illegal operation on FLAGS.');
  }
}

function createCompileError(origin, message, lineNumber = null, code = null) {
  const error = new Error(message);
  error.origin = origin;
  error.lineNumber = lineNumber;
  error.code = code;
  return error;
}

function validateTypeA(asmString) {
  const [, ...operands] = asmString.trim().split(/\s+/);
  if (operands.length !== 3) {
    throw createCompileError('validateTypeA', `Syntax Error: Expected 3 operands, received ${operands.length}`);
  }

  operands.forEach((register) => validateRegisterName(register, 'A'));
}

function validateTypeB(asmString) {
  const [, ...operands] = asmString.trim().split(/\s+/);
  if (operands.length !== 2) {
    throw createCompileError('validateTypeB', `Syntax Error: Expected 2 operands, received ${operands.length}`);
  }

  const [register, immediate] = operands;
  validateRegisterName(register, 'B');

  if (!immediate || !/^\$\d+$/.test(immediate)) {
    throw createCompileError('validateTypeB', `Syntax Error: Invalid immediate value '${immediate}'`);
  }

  if (Number(immediate.slice(1)) > 2 ** 8 - 1) {
    throw createCompileError('validateTypeB', 'Syntax Error: Immediate value greater than allowed value');
  }
}

function validateTypeC(asmString) {
  const [instruction, ...operands] = asmString.trim().split(/\s+/);

  if (operands.length !== 2) {
    throw createCompileError('validateTypeC', `Syntax Error: Expected 2 operands, received ${operands.length}`);
  }

  if (asmString.includes('FLAGS')) {
    if (instruction !== 'mov' || operands[0] === 'FLAGS') {
      throw createCompileError('validateTypeC', 'Syntax Error: Illegal operation on Flags register ');
    }
  }

  operands.forEach((register) => {
    if (!(register in REGISTER_MAP)) {
      if (register.length === 2 && register[0] === 'R' && /^\d+$/.test(register.slice(1))) {
        throw createCompileError('validateTypeC', `Syntax Error: Unknown register '${register}'`);
      }
      throw createCompileError('validateTypeC', `Syntax Error: Unexpected operand '${register}' for typeC instruction`);
    }
  });
}

function validateTypeD(asmString) {
  const tokens = asmString.trim().split(/\s+/);
  if (tokens.length !== 3) {
    throw createCompileError('validateTypeD', `Syntax Error: Expected 2 operands, received ${tokens.length - 1}`);
  }

  const [, ...operands] = tokens;
  const [register, memoryAddress] = operands;

  validateRegisterName(register, 'D');

  if (!(memoryAddress in variableMap)) {
    if (memoryAddress in labelsMap) {
      throw createCompileError('validateTypeD', `Syntax Error: Misuse of label '${memoryAddress}' as variable.`);
    }
    throw createCompileError('validateTypeD', `Syntax Error: Undefined variable reference '${memoryAddress}'`);
  }
}

function validateTypeE(asmString) {
  const [, ...operands] = asmString.trim().split(/\s+/);
  if (operands.length !== 1) {
    throw createCompileError('validateTypeE', `Syntax Error: Expected 1 operand, received ${operands.length}`);
  }

  const memoryAddress = operands[0];
  if (!(memoryAddress in labelsMap)) {
    if (memoryAddress in variableMap) {
      throw createCompileError('validateTypeE', `Syntax Error: Misuse of variable '${memoryAddress}' as label.`);
    }
    throw createCompileError('validateTypeE', `Syntax Error: Undefined label reference '${memoryAddress}'`);
  }
}

function validateTypeF(asmString) {
  if (asmString.trim().split(/\s+/).length > 1) {
    throw createCompileError('validateTypeF', 'Syntax Error: hlt should have 0 operands');
  }
}

function initializeInstructionCompiler() {
  Object.assign(codeGenMap, {
    typeA: generateCodeTypeA,
    typeB: generateCodeTypeB,
    typeC: generateCodeTypeC,
    typeD: generateCodeTypeD,
    typeE: generateCodeTypeE,
    typeF: generateCodeTypeF,
  });
}

function generateCodeTypeA(asmString) {
  validateTypeA(asmString);
  const [, ...operands] = asmString.trim().split(/\s+/);
  const instructionBinary = INSTRUCTION_MAP[asmString.trim().split(/\s+/)[0]];
  const unusedBits = '00';
  const registerBinary = operands.map((register) => REGISTER_MAP[register]).join('');
  return instructionBinary + unusedBits + registerBinary;
}

function generateCodeTypeB(asmString) {
  validateTypeB(asmString);
  const [instruction, ...operands] = asmString.trim().split(/\s+/);
  let instructionBinary = INSTRUCTION_MAP[instruction];
  if (instruction === 'mov') instructionBinary = INSTRUCTION_MAP[instruction][0];

  const registerBinary = REGISTER_MAP[operands[0]];
  const immediateValue = convertToBin(Number(operands[1].slice(1)), 8);
  return instructionBinary + registerBinary + immediateValue;
}

function generateCodeTypeC(asmString) {
  validateTypeC(asmString);
  const [instruction, ...operands] = asmString.trim().split(/\s+/);
  let instructionBinary = INSTRUCTION_MAP[instruction];
  if (instruction === 'mov') instructionBinary = INSTRUCTION_MAP[instruction][1];

  const registerBinary = operands.map((register) => REGISTER_MAP[register]).join('');
  return instructionBinary + '00000' + registerBinary;
}

function generateCodeTypeD(asmString) {
  validateTypeD(asmString);
  const [instruction, ...operands] = asmString.trim().split(/\s+/);
  const registerBinary = REGISTER_MAP[operands[0]];
  const memoryAddressBinary = variableMap[operands[1]];
  return INSTRUCTION_MAP[instruction] + registerBinary + memoryAddressBinary;
}

function generateCodeTypeE(asmString) {
  validateTypeE(asmString);
  const [instruction, operand] = asmString.trim().split(/\s+/);
  const memoryAddressBinary = labelsMap[operand];
  return INSTRUCTION_MAP[instruction] + '000' + memoryAddressBinary;
}

function generateCodeTypeF(asmString) {
  validateTypeF(asmString);
  const instruction = asmString.trim();
  return INSTRUCTION_MAP[instruction] + '0'.repeat(11);
}

function parseLine(asmString) {
  const trimmed = asmString.trim();
  if (!trimmed) return '';

  const [instruction, ...operands] = trimmed.split(/\s+/);
  if (instruction === 'mov') {
    if (operands.some((operand) => operand.startsWith('$'))) {
      return generateCodeTypeB(trimmed);
    }
    return generateCodeTypeC(trimmed);
  }

  for (const instructionType of Object.keys(TYPE_SETS)) {
    if (TYPE_SETS[instructionType].includes(instruction)) {
      const codeGenerator = codeGenMap[instructionType];
      return codeGenerator(trimmed);
    }
  }

  throw createCompileError('parseLine', `Syntax error: Invalid instruction "${instruction}"`);
}

function processLabels(sourceCode) {
  let trueLine = -1;
  const lines = normalizeSource(sourceCode).split('\n');

  lines.forEach((asmString, lineNumber) => {
    const trimmed = asmString.trim();
    if (!trimmed || trimmed.split(/\s+/)[0] === 'var') return;

    trueLine += 1;
    if (!trimmed.includes(':')) return;

    const label = trimmed.slice(0, trimmed.indexOf(':')).trim();
    if (!label) {
      throw createCompileError('processLabels', 'Syntax Error: Empty label name', lineNumber + 1, asmString);
    }
    if (label in labelsMap) {
      throw createCompileError('processLabels', 'Syntax Error: Label already exists', lineNumber + 1, asmString);
    }
    if (label in variableMap) {
      throw createCompileError('processLabels', 'Syntax Error: Label cannot share name with a variable.', lineNumber + 1, asmString);
    }
    if (Object.keys(INSTRUCTION_MAP).concat(Object.keys(REGISTER_MAP), ['var']).includes(label)) {
      throw createCompileError('processLabels', `Syntax Error: Reserved keyword '${label}' used as label name`, lineNumber + 1, asmString);
    }
    if (/^\d+$/.test(label)) {
      throw createCompileError('processLabels', 'Syntax Error: Label name cannot be purely numeric', lineNumber + 1, asmString);
    }
    if (label.startsWith('$') && /^\$\d+$/.test(label)) {
      throw createCompileError('processLabels', 'Syntax Error: Label name cannot be an immediate', lineNumber + 1, asmString);
    }
    if (trimmed.slice(trimmed.indexOf(':') + 1).trim() === '') {
      throw createCompileError('processLabels', 'Syntax Error: Label must be followed by an instruction on the same line', lineNumber + 1, asmString);
    }

    labelsMap[label] = convertToBin(trueLine, 8);
  });
}

function processVariables(sourceCode) {
  const lines = normalizeSource(sourceCode).split('\n');
  const nonVariableLines = [];
  lines.forEach((asmLine) => {
    const trimmed = asmLine.trim();
    if (trimmed && trimmed.split(/\s+/)[0] !== 'var') nonVariableLines.push(asmLine);
  });

  lines.forEach((asmString, lineNumber) => {
    const trimmed = asmString.trim();
    if (!trimmed) return;
    const { 0: instruction } = trimmed.split(/\s+/);
    const withoutLabel = removeLabel(trimmed).trim();
    if (withoutLabel && withoutLabel.split(/\s+/)[0] === 'var' && trimmed !== withoutLabel) {
      throw createCompileError('processVariables', 'Syntax Error: Invalid use of labels during variable declaration', lineNumber + 1, asmString);
    }

    if (instruction !== 'var') return;

    const operands = withoutLabel.split(/\s+/).slice(1);
    if (operands.length === 0) {
      throw createCompileError('processVariables', 'Syntax Error: blank name for variable', lineNumber + 1, asmString);
    }
    if (operands.length > 1) {
      throw createCompileError('processVariables', 'Syntax Error: Cannot declare multiple variables in one line', lineNumber + 1, asmString);
    }

    const [name] = operands;
    if (name in variableMap) {
      throw createCompileError('processVariables', `Compile Error: Variable "${name}" has already been declared before.`, lineNumber + 1, asmString);
    }
    if (name in labelsMap) {
      throw createCompileError('processVariables', 'Syntax Error: Variable cannot share name with a Label.', lineNumber + 1, asmString);
    }
    if (Object.keys(INSTRUCTION_MAP).concat(Object.keys(REGISTER_MAP), ['var']).includes(name)) {
      throw createCompileError('processVariables', `Syntax Error: Reserved keyword '${name}' used as variable name`, lineNumber + 1, asmString);
    }
    if (/^\d+$/.test(name)) {
      throw createCompileError('processVariables', 'Syntax Error: Variable name cannot be purely numeric', lineNumber + 1, asmString);
    }
    if (name.startsWith('$') && /^\$\d+$/.test(name)) {
      throw createCompileError('processVariables', 'Syntax Error: Variable name cannot be an immediate', lineNumber + 1, asmString);
    }

    variableMap[name] = convertToBin(nonVariableLines.length + Object.keys(variableMap).length, 8);
  });
}

function verifySourceCode(sourceCode) {
  const lines = normalizeSource(sourceCode).rstrip ? normalizeSource(sourceCode).rstrip() : String(normalizeSource(sourceCode)).replace(/\s+$/, '');
  const sourceLines = lines.split('\n');
  let variableBlockFlag = 0;
  let instruction = null;

  sourceLines.forEach((asmString, lineNumber) => {
    const normalized = removeLabel(asmString).trim();
    if (!normalized) return;

    instruction = normalized.split(/\s+/)[0];

    if (instruction === 'hlt' && lineNumber !== sourceLines.length - 1) {
      throw createCompileError('verifySourceCode', 'Syntax error: hlt is not the last instruction', lineNumber + 1, asmString);
    }

    if (instruction === 'var') {
      if (variableBlockFlag === 1) {
        throw createCompileError('verifySourceCode', 'Syntax error: Variable declared after an instruction', lineNumber + 1, asmString);
      }
    } else {
      variableBlockFlag = 1;
    }
  });

  if (instruction !== 'hlt') {
    throw createCompileError('verifySourceCode', 'Syntax error: hlt is not the last instruction', sourceLines.length, sourceLines[sourceLines.length - 1]);
  }
}

function preprocess(sourceCode) {
  processLabels(sourceCode);
  processVariables(sourceCode);
}

function parseCode(sourceCode) {
  initializeInstructionCompiler();
  let bytecode = '';
  const lineMap = [];
  const lines = normalizeSource(sourceCode).split('\n');

  lines.forEach((asmString, lineNumber) => {
    const cleanAsmString = removeLabel(asmString).trim();
    if (!cleanAsmString) return;

    const [instruction] = cleanAsmString.split(/\s+/);
    if (instruction === 'var') return;

    try {
      bytecode += parseLine(cleanAsmString) + '\n';
      lineMap.push(lineNumber + 1);
    } catch (error) {
      error.lineNumber = lineNumber + 1;
      error.code = asmString;
      throw error;
    }
  });

  return { bytecode: bytecode.trim(), lineMap };
}

function assembleProgram(sourceCode) {
  const cleanedSource = normalizeSource(sourceCode || '');
  Object.keys(variableMap).forEach((key) => delete variableMap[key]);
  Object.keys(labelsMap).forEach((key) => delete labelsMap[key]);
  Object.keys(codeGenMap).forEach((key) => delete codeGenMap[key]);

  try {
    verifySourceCode(cleanedSource);
    preprocess(cleanedSource);
    const { bytecode, lineMap } = parseCode(cleanedSource);
    return { assembler: bytecode.split('\n').filter(Boolean), lineMap, variables: { ...variableMap } };
  } catch (error) {
    const lines = [
      '\n~~~~~~~~~~~~~~~~~~~~ ASSEMBLER REPORT ~~~~~~~~~~~~~~~~~~~~\n',
      `> ${error.message}`,
      `> "${error.code || ''}", Line ${error.lineNumber || 1}`,
      '\n~~~~~~~~~~~~~~~~~~ END ASSEMBLER REPORT ~~~~~~~~~~~~~~~~~~\n',
    ];
    return { error: lines };
  }
}

function typeAExtract(instruction) {
  return [instruction.slice(7, 10), instruction.slice(10, 13), instruction.slice(13, 16)];
}

function typeBExtract(instruction) {
  return [instruction.slice(5, 8), instruction.slice(8, 16)];
}

function typeCExtract(instruction) {
  return [instruction.slice(10, 13), instruction.slice(13, 16)];
}

function typeDExtract(instruction) {
  return [instruction.slice(5, 8), instruction.slice(8, 16)];
}

function typeEExtract(instruction) {
  return [instruction.slice(8, 16)];
}

function typeFExtract() {
  return 'placeholder to maintain same syntax';
}

const FUNCTIONS = {
  '00000': (operands, registerValue) => { return add(operands, registerValue); },
  '00001': (operands, registerValue) => { return sub(operands, registerValue); },
  '00110': (operands, registerValue) => { return mul(operands, registerValue); },
  '01010': (operands, registerValue) => { return xor(operands, registerValue); },
  '01011': (operands, registerValue) => { return bitwiseOr(operands, registerValue); },
  '01100': (operands, registerValue) => { return bitwiseAnd(operands, registerValue); },
  '00010': (operands, registerValue) => { return movi(operands, registerValue); },
  '01000': (operands, registerValue) => { return rs(operands, registerValue); },
  '01001': (operands, registerValue) => { return ls(operands, registerValue); },
  '00111': (operands, registerValue) => { return div_(operands, registerValue); },
  '00011': (operands, registerValue) => { return movr(operands, registerValue); },
  '01101': (operands, registerValue) => { return invert(operands, registerValue); },
  '01110': (operands, registerValue) => { return comp(operands, registerValue); },
  '00100': (operands, registerValue, memory) => { return ld(operands, registerValue, memory); },
  '00101': (operands, registerValue, memory) => { return st(operands, registerValue, memory); },
  '01111': (operands, registerValue) => { return jmp_(operands, registerValue); },
  '10000': (operands, registerValue) => { return jlt(operands, registerValue); },
  '10001': (operands, registerValue) => { return jgt(operands, registerValue); },
  '10010': (operands, registerValue) => { return jeq(operands, registerValue); },
  '10011': (operands, registerValue) => { return hlt(operands, registerValue); },
};

const TYPES = {
  '00000': typeAExtract,
  '00001': typeAExtract,
  '00110': typeAExtract,
  '01010': typeAExtract,
  '01011': typeAExtract,
  '01100': typeAExtract,
  '00010': typeBExtract,
  '01000': typeBExtract,
  '01001': typeBExtract,
  '00111': typeCExtract,
  '00011': typeCExtract,
  '01101': typeCExtract,
  '01110': typeCExtract,
  '00100': typeDExtract,
  '00101': typeDExtract,
  '01111': typeEExtract,
  '10000': typeEExtract,
  '10001': typeEExtract,
  '10010': typeEExtract,
  '10011': typeFExtract,
};

function resetFlag(registerValue) {
  registerValue['111'] = registerValue['111'] ^ registerValue['111'];
}

function setOverflow(registerValue) {
  registerValue['111'] |= 1 << 3;
}

function setLt(registerValue) {
  registerValue['111'] |= 1 << 2;
}

function setGt(registerValue) {
  registerValue['111'] |= 1 << 1;
}

function setEq(registerValue) {
  registerValue['111'] = 1;
}

function getLt(registerValue) {
  return (registerValue['111'] & (1 << 2)) >> 2;
}

function getGt(registerValue) {
  return (registerValue['111'] & (1 << 1)) >> 1;
}

function getEq(registerValue) {
  return registerValue['111'] & 1;
}

function add(operands, registerValue) {
  resetFlag(registerValue);
  const register2 = Number(registerValue[operands[1]] || 0);
  const register3 = Number(registerValue[operands[2]] || 0);

  let result = 0;
  let carry = 0;

  for (let shift = 0; shift < 16; shift += 1) {
    const bit2 = (register2 >> shift) & 1;
    const bit3 = (register3 >> shift) & 1;
    const sum = bit2 ^ bit3;
    result |= ((sum ^ carry) << shift);
    carry = (sum & carry) | (bit2 & bit3);

    if (shift === 15 && carry) {
      setOverflow(registerValue);
    }
  }

  registerValue[operands[0]] = result & 65535;
  return null;
}

function sub(operands, registerValue) {
  resetFlag(registerValue);
  const destination = operands[0];
  const minuend = Number(registerValue[operands[1]] || 0);
  const subtrahend = Number(registerValue[operands[2]] || 0);

  let result = 0;
  if (minuend < subtrahend) {
    result = 0;
    setOverflow(registerValue);
  } else {
    result = minuend - subtrahend;
  }

  registerValue[destination] = result & 65535;
  return null;
}

function mul(operands, registerValue) {
  resetFlag(registerValue);
  const [, multiplicand1, multiplicand2] = operands.map((operand) => Number(registerValue[operand] || 0));
  let bitShifter = 0;
  let result = 0;

  while (bitShifter < 16) {
    const x = (multiplicand2 & (1 << bitShifter));
    if (x >> bitShifter) {
      result = (result + (multiplicand1 << bitShifter)) & 65535;
    }
    bitShifter += 1;
  }

  if (result > 65535) {
    setOverflow(registerValue);
    result &= 65535;
  }

  registerValue[operands[0]] = result & 65535;
  return null;
}

function div_(operands, registerValue) {
  resetFlag(registerValue);
  const dividend = Number(registerValue[operands[0]] || 0);
  const divisor = Number(registerValue[operands[1]] || 0);
  if (divisor === 0) {
    registerValue['000'] = 0;
    registerValue['001'] = dividend;
    return null;
  }

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  registerValue['000'] = quotient;
  registerValue['001'] = remainder;
  return null;
}

function movi(operands, registerValue) {
  resetFlag(registerValue);
  const destination = operands[0];
  const immediate = operands[1];
  registerValue[destination] = parseInt(immediate, 2) || 0;
  return null;
}

function movr(operands, registerValue) {
  const source = operands[1];
  const destination = operands[0];
  registerValue[destination] = Number(registerValue[source] || 0);
  resetFlag(registerValue);
  return null;
}

function ld(operands, registerValue, memory) {
  resetFlag(registerValue);
  const destination = operands[0];
  const memoryAddress = operands[1];
  const result = Number(memory[parseInt(memoryAddress, 2)] || 0);
  registerValue[destination] = result;
  return null;
}

function st(operands, registerValue, memory) {
  resetFlag(registerValue);
  const source = operands[0];
  const destination = operands[1];
  const memoryAddress = parseInt(destination, 2);
  memory[memoryAddress] = Number(registerValue[source] || 0);
  return null;
}

function rs(operands, registerValue) {
  resetFlag(registerValue);
  const destination = operands[0];
  const immediate = parseInt(operands[1], 2) || 0;
  registerValue[destination] = (Number(registerValue[destination] || 0) >> immediate) & 65535;
  return null;
}

function ls(operands, registerValue) {
  resetFlag(registerValue);
  const destination = operands[0];
  const immediate = parseInt(operands[1], 2) || 0;
  registerValue[destination] = (Number(registerValue[destination] || 0) << immediate) & 65535;
  return null;
}

function xor(operands, registerValue) {
  resetFlag(registerValue);
  const destination = operands[0];
  const source1 = operands[1];
  const source2 = operands[2];
  registerValue[destination] = (Number(registerValue[source1] || 0) ^ Number(registerValue[source2] || 0)) & 65535;
  return null;
}

function bitwiseOr(operands, registerValue) {
  resetFlag(registerValue);
  const destination = operands[0];
  const source1 = operands[1];
  const source2 = operands[2];
  registerValue[destination] = (Number(registerValue[source1] || 0) | Number(registerValue[source2] || 0)) & 65535;
  return null;
}

function bitwiseAnd(operands, registerValue) {
  resetFlag(registerValue);
  const destination = operands[0];
  const source1 = operands[1];
  const source2 = operands[2];
  registerValue[destination] = (Number(registerValue[source1] || 0) & Number(registerValue[source2] || 0)) & 65535;
  return null;
}

function invert(operands, registerValue) {
  resetFlag(registerValue);
  const destination = operands[0];
  const source = operands[1];
  registerValue[destination] = (~Number(registerValue[source] || 0)) & 65535;
  return null;
}

function comp(operands, registerValue) {
  resetFlag(registerValue);
  const operand1 = Number(registerValue[operands[0]] || 0);
  const operand2 = Number(registerValue[operands[1]] || 0);

  if (operand1 === operand2) {
    setEq(registerValue);
  } else if (operand1 < operand2) {
    setLt(registerValue);
  } else {
    setGt(registerValue);
  }

  return null;
}

function jmp_(operands, registerValue) {
  const memoryAddress = parseInt(operands[0], 2);
  resetFlag(registerValue);
  return [memoryAddress, 0];
}

function jlt(operands, registerValue) {
  const memoryAddress = parseInt(operands[0], 2);
  const result = getLt(registerValue) === 1 ? [memoryAddress, 0] : null;
  resetFlag(registerValue);
  return result;
}

function jgt(operands, registerValue) {
  const memoryAddress = parseInt(operands[0], 2);
  const result = getGt(registerValue) === 1 ? [memoryAddress, 0] : null;
  resetFlag(registerValue);
  return result;
}

function jeq(operands, registerValue) {
  const memoryAddress = parseInt(operands[0], 2);
  const result = getEq(registerValue) === 1 ? [memoryAddress, 0] : null;
  resetFlag(registerValue);
  return result;
}

function hlt() {
  return [true, 1];
}

function executeInstruction(instruction, registerValue, memory) {
  const opcode = instruction.slice(0, 5);
  const extractor = TYPES[opcode] || typeFExtract;
  const operands = extractor(instruction);
  const handler = FUNCTIONS[opcode];

  if (!handler) {
    return [null, false];
  }

  const result = handler(operands, registerValue, memory);

  if (result == null) {
    return [null, false];
  }
  if (result[1] === 1) {
    return [null, true];
  }
  if (result[1] === 0) {
    return [result[0], false];
  }

  return [null, false];
}

function format16(value) {
  return Number(value || 0).toString(2).padStart(16, '0');
}

function simulateProgram(sourceCode) {
  const cleanedProgram = normalizeSource(sourceCode || '');
  let assembledProgram = [];
  let lineMap = null;
  let variables = {};

  if (!/^[01\s\n]+$/.test(cleanedProgram.trim())) {
    const assemblyResult = assembleProgram(cleanedProgram);
    if (assemblyResult.error) return assemblyResult;
    assembledProgram = assemblyResult.assembler;
    lineMap = assemblyResult.lineMap;
    variables = assemblyResult.variables;
  } else {
    assembledProgram = cleanedProgram.split('\n').map((line) => line.trim()).filter(Boolean);
    lineMap = assembledProgram.map((_, index) => index + 1);
  }

  const memory = new Array(256).fill(0);
  const registerValue = {
    '000': 0,
    '001': 0,
    '010': 0,
    '011': 0,
    '100': 0,
    '101': 0,
    '110': 0,
    '111': 0,
  };

  assembledProgram.forEach((instruction, index) => {
    memory[index] = String(instruction).trim();
  });

  let pc = 0;
  let halted = false;
  const registerStates = [];
  const memoryTrace = [];
  const timeline = [];
  let cycleCounter = 0;

  while (!halted && pc >= 0 && pc < memory.length) {
    const instruction = memory[pc] || '00000000';
    const priorMemory = Array.from(memory);
    const priorRegisters = {
      PC: convertToBin(pc, 8),
      R0: format16(registerValue['000']),
      R1: format16(registerValue['001']),
      R2: format16(registerValue['010']),
      R3: format16(registerValue['011']),
      R4: format16(registerValue['100']),
      R5: format16(registerValue['101']),
      FLAGS: format16(registerValue['111']),
    };

    memoryTrace.push({ cycle: cycleCounter, address: pc, instruction });
    const [newPc, stop] = executeInstruction(String(instruction), registerValue, memory);

    const registersAfter = {
      PC: convertToBin(pc, 8),
      R0: format16(registerValue['000']),
      R1: format16(registerValue['001']),
      R2: format16(registerValue['010']),
      R3: format16(registerValue['011']),
      R4: format16(registerValue['100']),
      R5: format16(registerValue['101']),
      FLAGS: format16(registerValue['111']),
    };

    const memoryChanges = [];
    for (let index = 0; index < memory.length; index += 1) {
      const beforeValue = priorMemory[index];
      const afterValue = memory[index];
      if (beforeValue !== afterValue) {
        memoryChanges.push({
          address: index,
          before: beforeValue,
          after: afterValue,
        });
      }
    }

    registerStates.push([
      convertToBin(pc, 8),
      format16(registerValue['000']),
      format16(registerValue['001']),
      format16(registerValue['010']),
      format16(registerValue['011']),
      format16(registerValue['100']),
      format16(registerValue['101']),
      format16(registerValue['111']),
    ]);

    timeline.push({
      step: cycleCounter,
      instruction: String(instruction),
      pc,
      nextPc: newPc == null ? pc + 1 : newPc,
      sourceLine: lineMap && pc < lineMap.length ? lineMap[pc] : null,
      before: priorRegisters,
      after: registersAfter,
      memoryChanges,
      memory: Array.from(memory),
    });

    cycleCounter += 1;
    if (stop) {
      halted = true;
      break;
    }

    pc = newPc == null ? pc + 1 : newPc;
  }

  const memoryDump = memory.map((item) => {
    if (item === 0 || item === '0') return '0000000000000000';
    if (typeof item === 'string' && /^[01]+$/.test(item.trim())) return item.trim();
    return format16(item);
  });

  return {
    assembler: assembledProgram,
    simulator: {
      register_states: registerStates,
      memory_dump: memoryDump,
      memory_trace: memoryTrace,
      timeline,
      lineMap,
      variables,
      currentStep: timeline.length > 0 ? timeline.length - 1 : 0,
    },
  };
}

function runInstructionSet(op, a, b) {
  const registerValue = { '000': 0, '001': 0, '010': 0, '011': 0, '100': 0, '101': 0, '110': 0, '111': 0 };
  const operations = {
    add: () => add(['100', '010', '011'], { ...registerValue, '010': a, '011': b, '100': 0 }),
    sub: () => sub(['100', '010', '011'], { ...registerValue, '010': a, '011': b, '100': 0 }),
    mul: () => mul(['100', '010', '011'], { ...registerValue, '010': a, '011': b, '100': 0 }),
    div: () => div_(['010', '011'], { ...registerValue, '010': a, '011': b }),
    cmp: () => comp(['010', '011'], { ...registerValue, '010': a, '011': b }),
  };

  return operations[op] ? operations[op]() : null;
}

const engine = {
  assembleProgram,
  simulateProgram,
  runInstructionSet,
};

export { assembleProgram, simulateProgram, runInstructionSet };
export default engine;
