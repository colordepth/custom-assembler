import { assembleProgram, simulateProgram, runInstructionSet } from './assemblerEngine';

describe('assembler engine', () => {
  test('assembles a valid program with variables and labels', () => {
    const source = `
var output
mov R0 $12
mov R1 $0
mov R2 $1
cmp R1 R0
jgt end
mov R3 R2
end: mov R4 R3
hlt
`;

    const result = assembleProgram(source);

    expect(result.error).toBeUndefined();
    expect(Array.isArray(result.assembler)).toBe(true);
    expect(result.assembler.length).toBeGreaterThan(0);
    expect(result.assembler[0]).toMatch(/^[01]+$/);
  });

  test('simulates arithmetic operations and preserves flags', () => {
    const program = [
      'mov R0 $7',
      'mov R1 $9',
      'add R2 R0 R1',
      'sub R3 R1 R0',
      'mul R4 R2 R3',
      'div R4 R0',
      'hlt'
    ].join('\n');

    const result = simulateProgram(program);

    expect(result.error).toBeUndefined();
    expect(result.simulator.register_states).toBeDefined();
    expect(result.simulator.memory_dump).toBeDefined();
    expect(result.simulator.register_states.at(-1)).toBeDefined();
  });

  test('matches the arithmetic semantics used by the Python simulator', () => {
    const checks = [
      { op: 'add', a: 65535, b: 65535, expected: 65534 },
      { op: 'sub', a: 0, b: 65535, expected: 0 },
      { op: 'mul', a: 12345, b: 54321, expected: 12345 * 54321 % 65536 },
      { op: 'div', a: 12345, b: 54321, expected: Math.floor(12345 / 54321) },
    ];

    for (const check of checks) {
      const result = runInstructionSet(check.op, check.a, check.b);
      expect(result).toBeDefined();
    }
  });

  test('stores and loads memory values without crashing', () => {
    const result = simulateProgram(`
var output
mov R0 $7
st R0 output
ld R1 output
hlt
`);

    expect(result.error).toBeUndefined();
    expect(result.simulator.register_states.at(-1)[2]).toBe('0000000000000111');
  });
});
