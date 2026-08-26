import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './DebugPanel.css';

import { Plus, X } from 'lucide-react';

const REGISTER_NAMES = ['PC', 'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'FLAGS'];
const MEMORY_CELL_BYTES = 2;
const EMPTY_VARIABLES = {};

const normalizeRegisterState = (state) => {
  if (!state) return {};
  if (Array.isArray(state)) {
    return {
      PC: state[0], R0: state[1], R1: state[2], R2: state[3],
      R3: state[4], R4: state[5], R5: state[6], FLAGS: state[7],
    };
  }
  return state;
};

const binToInt = (value) => {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  const trimmed = String(value).trim();
  if (/^[01]+$/.test(trimmed)) return parseInt(trimmed, 2);
  return Number(trimmed) || 0;
};

const formatMemoryValue = (value) => {
  if (value == null || value === '') return '0000000000000000';
  if (typeof value === 'string' && /^[01]+$/.test(value.trim())) {
    return value.trim().padStart(16, '0').slice(-16);
  }
  return (Number(value) || 0).toString(2).padStart(16, '0').slice(-16);
};

const decodeFlags = (value) => {
  const flags = binToInt(value);
  return {
    V: (flags >> 3) & 1,
    L: (flags >> 2) & 1,
    G: (flags >> 1) & 1,
    E: flags & 1,
  };
};

const DebugPanel = ({
  assemblerOutput,
  simulatorOutput,
  stepIndex,
  isDebugging,
  code,
}) => {
  const [activeTab, setActiveTab] = useState('debugger');
  const [watches, setWatches] = useState([]);
  const [watchInput, setWatchInput] = useState('');

  const timeline = simulatorOutput?.timeline || [];
  const snapshot = timeline[stepIndex] || null;
  const prevSnapshot = stepIndex > 0 ? timeline[stepIndex - 1] : null;

  const registers = normalizeRegisterState(snapshot?.after || simulatorOutput?.register_states?.at(-1));
  const prevRegisters = normalizeRegisterState(prevSnapshot?.after);

  const memory = snapshot?.memory || simulatorOutput?.memory_dump || [];
  const prevMemory = prevSnapshot?.memory || [];
  const variables = simulatorOutput?.variables || EMPTY_VARIABLES;
  const variablesByAddress = useMemo(() => Object.entries(variables).reduce((result, [name, binaryAddress]) => {
    const address = binToInt(binaryAddress);
    result[address] = result[address] ? `${result[address]}, ${name}` : name;
    return result;
  }, {}), [variables]);
  const memoryTrace = simulatorOutput?.memory_trace || [];
  const isCompilationSuccessful = Boolean(
    assemblerOutput?.length && !assemblerOutput.some((line) => /^>|~/.test(line))
  );
  const programMemorySize = isCompilationSuccessful ? assemblerOutput.length : 0;

  const flags = decodeFlags(registers.FLAGS);

  const sourceLines = useMemo(() => code.split('\n'), [code]);
  const currentSourceLine = snapshot?.sourceLine ? sourceLines[snapshot.sourceLine - 1]?.trim() : null;

  const addWatch = () => {
    const expression = watchInput.trim();
    if (!expression) return;
    if (!watches.includes(expression)) setWatches([...watches, expression]);
    setWatchInput('');
  };

  const evaluateWatch = (expression) => {
    const upper = expression.toUpperCase();
    if (upper in registers) {
      return { value: registers[upper], decimal: binToInt(registers[upper]) };
    }
    const variableName = Object.keys(variables).find((name) => name.toUpperCase() === upper);
    if (variableName) {
      const address = binToInt(variables[variableName]);
      const raw = memory[address];
      return { value: formatMemoryValue(raw), decimal: binToInt(raw) };
    }
    const memMatch = upper.match(/^MEM\[(\d+)\]$/);
    if (memMatch) {
      const address = Number(memMatch[1]);
      const raw = memory[address];
      return { value: formatMemoryValue(raw), decimal: binToInt(raw) };
    }
    return { value: 'Unknown symbol', decimal: null };
  };

  const tabs = [
    { id: 'debugger', label: 'Debugger' },
    { id: 'console', label: 'Console' },
    { id: 'memory', label: 'Memory' },
    { id: 'memory-graph', label: 'Memory Graph' },
  ];

  return (
    <div className="debug-tool-window">
      <div className="tool-window-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tool-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tool-window-body">
        {activeTab === 'debugger' && (
          <div className="debugger-layout">
            <div className="debugger-frames">
              <div className="pane-title">Frames</div>
              {snapshot ? (
                <div className="frame-entry">
                  <div className="frame-title">
                    main.asm:{snapshot.sourceLine ?? snapshot.pc + 1}
                  </div>
                  <div className="frame-detail">{currentSourceLine || snapshot.instruction}</div>
                  <div className="frame-detail muted">PC {snapshot.pc} → {snapshot.nextPc}</div>
                </div>
              ) : (
                <div className="pane-empty">
                  {isDebugging ? 'No frame selected' : 'Start a debug session to inspect frames'}
                </div>
              )}
            </div>

            <div className="debugger-variables">
              <div className="pane-title">Variables</div>
              <table className="variables-table">
                <tbody>
                  {REGISTER_NAMES.map((name) => {
                    const value = registers[name] || '0000000000000000';
                    const changed = prevRegisters[name] !== undefined && prevRegisters[name] !== registers[name];
                    return (
                      <tr key={name} className={changed ? 'value-changed' : ''}>
                        <td className="var-name">{name}</td>
                        <td className="var-value">{value}</td>
                        <td className="var-dec">{binToInt(value)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flags-strip">
                {Object.entries(flags).map(([name, bit]) => (
                  <span key={name} className={`flag-chip ${bit ? 'set' : ''}`}>{name}</span>
                ))}
              </div>

              <div className="pane-title watch-title">Watches</div>
              <div className="watch-input-row">
                  <input
                  className="watch-input"
                  placeholder="R0, output, or MEM[12]"
                  value={watchInput}
                  onChange={(event) => setWatchInput(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') addWatch(); }}
                />
                <button className="watch-add" title="Add watch" onClick={addWatch}><Plus size={14} /></button>
              </div>
              {watches.length === 0 && <div className="pane-empty small">No watches added</div>}
              {watches.map((expression) => {
                const result = evaluateWatch(expression);
                return (
                  <div key={expression} className="watch-entry">
                    <span className="var-name">{expression}</span>
                    <span className="var-value">{result.value}</span>
                    {result.decimal != null && <span className="var-dec">{result.decimal}</span>}
                    <button
                      className="watch-remove"
                      onClick={() => setWatches(watches.filter((w) => w !== expression))}
                    ><X size={14} /></button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="console-pane">
            {assemblerOutput && assemblerOutput.length ? (
              <>
                <ul className="console-list">
                  {assemblerOutput.map((line, i) => (
                    <li key={i} className={/^>|~/.test(line) ? 'console-error' : ''}>{line}</li>
                  ))}
                </ul>
                {isCompilationSuccessful && (
                  <div className="compile-success">Above is the generated binary of the compilation.</div>
                )}
              </>
            ) : (
              <div className="pane-empty">Run or debug the program to see assembler output</div>
            )}
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="memory-debug-layout">
            <section className="memory-registers">
              <div className="pane-title">Registers</div>
              <table className="memory-register-table">
                <tbody>
                  {REGISTER_NAMES.map((name) => {
                    const value = registers[name] || '0000000000000000';
                    const changed = prevRegisters[name] !== undefined && prevRegisters[name] !== value;
                    return (
                      <tr key={name} className={changed ? 'value-changed' : ''}>
                        <td className="var-name">{name}</td>
                        <td className="var-value">{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
            <section className="memory-pane">
              <div className="memory-summary">
                <div>256 positions · {MEMORY_CELL_BYTES} bytes per position · 512 bytes total</div>
                <div className="program-memory-summary">
                  Program memory: positions 0–{Math.max(programMemorySize - 1, 0)} · {programMemorySize * MEMORY_CELL_BYTES} bytes used
                </div>
                <div className="memory-legend"><span className="program-memory-swatch" /> Program memory</div>
              </div>
              <ol className="memory-grid" start={0}>
                {memory.map((cell, i) => {
                  const changed = prevMemory[i] !== undefined && prevMemory[i] !== cell;
                  const formattedValue = formatMemoryValue(cell);
                  const empty = formattedValue === '0000000000000000';
                  const isProgramMemory = i < programMemorySize;
                  return (
                    <li key={i} className={`memory-cell ${changed ? 'value-changed' : ''} ${empty ? 'empty' : ''} ${isProgramMemory ? 'program-memory' : ''}`}>
                      <span className="mem-location">{i}</span>
                      <span className="mem-value">{formattedValue}</span>
                      {variablesByAddress[i] && <span className="mem-variable">{variablesByAddress[i]}</span>}
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        )}

        {activeTab === 'memory-graph' && (
          <MemoryGraph memoryTrace={memoryTrace} timeline={timeline} />
        )}
      </div>
    </div>
  );
};

const MemoryGraph = ({ memoryTrace, timeline }) => {
  const graphData = useMemo(() => memoryTrace.map((point, index) => ({
    cycle: point.cycle,
    instructionAddress: point.address,
    memoryAccesses: (timeline[index]?.memoryChanges || []).map((change) => change.address),
  })), [memoryTrace, timeline]);
  const maxCycle = Math.max(...graphData.map((point) => point.cycle), 1);

  const accessData = graphData.flatMap((point) => point.memoryAccesses.map((address) => ({
    cycle: point.cycle,
    address,
  })));
  const maxAddress = Math.max(
    ...graphData.map((point) => point.instructionAddress),
    ...accessData.map((point) => point.address),
    1
  );

  return (
    <div className="memory-graph-pane">
      <div className="memory-graph-header">
        <span>Memory address by execution cycle</span>
        <div className="memory-graph-keys">
          <span className="memory-graph-key"><i className="fetch-swatch" /> Instruction fetch</span>
          <span className="memory-graph-key"><i className="access-swatch" /> Memory access</span>
        </div>
      </div>
      {memoryTrace.length ? (
        <div className="memory-graph-wrap">
          <div className="memory-graph-y-label">Address</div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={graphData} margin={{ top: 8, right: 12, bottom: 22, left: 4 }}>
              <CartesianGrid stroke="#45494a" strokeDasharray="3 3" />
              <XAxis dataKey="cycle" type="number" domain={[0, maxCycle]} allowDataOverflow={false} tickCount={Math.min(maxCycle + 1, 8)} tick={{ fill: '#6c737d', fontSize: 11 }} />
              <YAxis type="number" domain={[0, maxAddress]} tick={{ fill: '#6c737d', fontSize: 11 }} width={28} />
              <Tooltip
                contentStyle={{ background: '#3c3f41', border: '1px solid #60666b', color: '#d7dce2', fontSize: 12 }}
                labelFormatter={(cycle) => `Cycle ${cycle}`}
              />
              <Line
                type="linear"
                dataKey="instructionAddress"
                name="Instruction fetch"
                stroke="#3592c4"
                strokeWidth={2}
                dot={{ r: 3, fill: '#6fb3e0', stroke: '#2b2b2b', strokeWidth: 1 }}
                activeDot={{ r: 4, fill: '#6fb3e0' }}
                isAnimationActive={false}
              />
              <Scatter
                data={accessData}
                dataKey="address"
                name="Memory access"
                fill="#cc7832"
                shape="circle"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="memory-graph-x-label">Execution cycle</div>
        </div>
      ) : (
        <div className="pane-empty">Run or debug the program to plot memory access</div>
      )}
    </div>
  );
};

export default DebugPanel;
