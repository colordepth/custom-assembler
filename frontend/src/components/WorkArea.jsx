import { useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import DebugPanel from './DebugPanel';
import InstructionSet from './InstructionSet';
import './WorkArea.css';

import { Binary, Circle, ListTree, PanelLeft, Pause } from 'lucide-react';

const WorkArea = ({
  code,
  setCode,
  assemblerOutput,
  simulatorOutput,
  compiledLineMap,
  breakpoints,
  onToggleBreakpoint,
  debuggerState,
  isEdited,
}) => {
  const [activeTool, setActiveTool] = useState('project');
  const [toolWindowVisible, setToolWindowVisible] = useState(true);
  const [binaryVisible, setBinaryVisible] = useState(false);
  const editorScrollRef = useRef(null);
  const binaryScrollRef = useRef(null);

  const { isDebugging, stepIndex } = debuggerState;
  const timeline = simulatorOutput?.timeline || [];
  const executionLine = isDebugging && timeline[stepIndex]
    ? timeline[stepIndex].sourceLine
    : null;

  const toolButtons = [
    { id: 'project', label: 'ISA Reference', icon: PanelLeft },
    { id: 'structure', label: 'Program stats', icon: ListTree },
  ];

  const lineCount = code.split('\n').length;

  const syncEditorScroll = (event) => {
    if (binaryScrollRef.current) binaryScrollRef.current.scrollTop = event.target.scrollTop;
  };

  const syncBinaryScroll = (event) => {
    if (editorScrollRef.current) editorScrollRef.current.scrollTop = event.target.scrollTop;
  };

  return (
    <div className="ide-workspace">
      <div className="ide-main-row">
        <aside className="ide-activity-bar">
          {toolButtons.map((tool) => (
            <button
              key={tool.id}
              className={`activity-button ${activeTool === tool.id && toolWindowVisible ? 'active' : ''}`}
              title={tool.label}
              onClick={() => {
                if (activeTool === tool.id) {
                  setToolWindowVisible((value) => !value);
                } else {
                  setActiveTool(tool.id);
                  setToolWindowVisible(true);
                }
              }}
            >
              <tool.icon size={17} aria-hidden="true" />
            </button>
          ))}
        </aside>

        {toolWindowVisible && (
          <aside className="ide-tool-window">
            <div className="ide-tool-title">
              {toolButtons.find((tool) => tool.id === activeTool)?.label}
            </div>
            <div className="ide-tool-body">
              {activeTool === 'project' && <InstructionSet compact />}
              {activeTool === 'structure' && (
                <div className="program-stats">
                  <div className="stat-row"><span>Lines</span><strong>{lineCount}</strong></div>
                  <div className="stat-row"><span>Breakpoints</span><strong>{breakpoints.size}</strong></div>
                  <div className="stat-row">
                    <span>Instructions executed</span>
                    <strong>{timeline.length || '—'}</strong>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        <div className="ide-editor-column">
          <div className="ide-breadcrumbs">
            <button
              className={`crumb file-tab ${isEdited ? 'edited' : ''}`}
              onClick={() => setBinaryVisible((visible) => !visible)}
              title="Toggle generated binary"
            >
              <Circle className="file-status" size={8} aria-hidden="true" />
              main.asm
            </button>
            <button
              className={`crumb binary-toggle ${binaryVisible ? 'active' : ''}`}
              onClick={() => setBinaryVisible((visible) => !visible)}
              title={binaryVisible ? 'Hide generated binary' : 'Show generated binary'}
              aria-label={binaryVisible ? 'Hide generated binary' : 'Show generated binary'}
              aria-pressed={binaryVisible}
            >
              <Binary size={15} aria-hidden="true" />
            </button>
            {isDebugging && executionLine != null && (
              <span className="crumb execution"><Pause size={12} fill="currentColor" aria-hidden="true" /> paused at line {executionLine}</span>
            )}
          </div>
          <div className="editor-and-binary">
            <CodeEditor
              code={code}
              setCode={setCode}
              breakpoints={breakpoints}
              onToggleBreakpoint={onToggleBreakpoint}
              executionLine={executionLine}
              isDebugging={isDebugging}
              editorRef={editorScrollRef}
              onScroll={syncEditorScroll}
              binaryVisible={binaryVisible}
            />
            {binaryVisible && (
              <BinaryInspector
                code={code}
                assemblerOutput={assemblerOutput}
                lineMap={compiledLineMap}
                scrollRef={binaryScrollRef}
                onScroll={syncBinaryScroll}
              />
            )}
          </div>
          <DebugPanel
            assemblerOutput={assemblerOutput}
            simulatorOutput={simulatorOutput}
            stepIndex={stepIndex}
            isDebugging={isDebugging}
            code={code}
          />
        </div>
      </div>

      <footer className="ide-status-bar">
        <span className="status-item">main.asm</span>
        <span className="status-item">{lineCount} lines</span>
        <span className="status-item spacer" />
        {isDebugging && (
          <span className="status-item debug-status">
            Debugging — step {stepIndex + 1} / {timeline.length}
          </span>
        )}
        <span className="status-item">UTF-8</span>
        <span className="status-item">Custom-ISA</span>
      </footer>
    </div>
  );
};

export default WorkArea;

const getBinaryParts = (binary) => {
  const opcode = binary.slice(0, 5);
  if (['00000', '00001', '00110', '01010', '01011', '01100'].includes(opcode)) {
    return { segments: [
      { value: binary.slice(0, 5), className: 'tok-keyword' },
      { value: binary.slice(5, 7), className: 'binary-filler' },
      { value: binary.slice(7, 10), className: 'tok-register' },
      { value: binary.slice(10, 13), className: 'tok-register' },
      { value: binary.slice(13, 16), className: 'tok-register' },
    ] };
  }
  if (['00010', '01000', '01001'].includes(opcode)) {
    return { segments: [
      { value: binary.slice(0, 5), className: 'tok-keyword' },
      { value: binary.slice(5, 8), className: 'tok-register' },
      { value: binary.slice(8), className: 'tok-number' },
    ] };
  }
  if (['00011', '00111', '01101', '01110'].includes(opcode)) {
    return { segments: [
      { value: binary.slice(0, 5), className: 'tok-keyword' },
      { value: binary.slice(5, 10), className: 'binary-filler' },
      { value: binary.slice(10, 13), className: 'tok-register' },
      { value: binary.slice(13, 16), className: 'tok-register' },
    ] };
  }
  if (['00100', '00101'].includes(opcode)) {
    return { segments: [
      { value: binary.slice(0, 5), className: 'tok-keyword' },
      { value: binary.slice(5, 8), className: 'tok-register' },
      { value: binary.slice(8), className: 'tok-label' },
    ] };
  }
  if (['01111', '10000', '10001', '10010'].includes(opcode)) {
    return { segments: [
      { value: binary.slice(0, 5), className: 'tok-keyword' },
      { value: binary.slice(5, 8), className: 'binary-filler' },
      { value: binary.slice(8), className: 'tok-label' },
    ] };
  }
  return { segments: [
    { value: binary.slice(0, 5), className: 'tok-keyword' },
    { value: binary.slice(5), className: 'binary-filler' },
  ] };
};

const BinaryInspector = ({ code, assemblerOutput, lineMap = [], scrollRef, onScroll }) => {
  const sourceLines = code.split('\n');
  const binaryLines = Array.isArray(assemblerOutput) ? assemblerOutput : [];
  const binaryBySourceLine = binaryLines.reduce((result, binary, index) => {
    if (/^[01]{16}$/.test(binary) && lineMap[index] != null) result[lineMap[index]] = binary;
    return result;
  }, {});

  return (
    <aside className="binary-inspector">
      <div className="binary-inspector-title">Generated Binary</div>
      <div className="binary-scroll" ref={scrollRef} onScroll={onScroll}>
      {sourceLines.map((_, index) => {
        const sourceLineNumber = index + 1;
        const binary = binaryBySourceLine[sourceLineNumber];
        const parts = binary ? getBinaryParts(binary) : null;
        return (
          <div className="binary-row" key={sourceLineNumber}>
            <div className="binary-line">
              <span className="binary-address">{binary ? sourceLineNumber : ''}</span>
              <span className="binary-value">
                {parts ? parts.segments.map((segment, segmentIndex) => (
                  <span key={`${segment.value}-${segmentIndex}`}>
                    {segmentIndex > 0 && ' '}
                    <span className={segment.className}>{segment.value}</span>
                  </span>
                )) : <span className="binary-placeholder">----------------</span>}
              </span>
            </div>
          </div>
        );
      })}
      {!binaryLines.length && <div className="binary-empty">Compile successfully to inspect binary.</div>}
      </div>
    </aside>
  );
};
