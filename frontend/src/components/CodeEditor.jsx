import { useMemo, useRef, useState } from 'react';
import './CodeEditor.css';

import { ArrowRight, Circle } from 'lucide-react';

const MNEMONICS = new Set([
  'add', 'sub', 'mul', 'div', 'mov', 'ld', 'st', 'rs', 'ls',
  'xor', 'or', 'and', 'not', 'cmp', 'jmp', 'jlt', 'jgt', 'je', 'hlt', 'var',
]);
const REGISTERS = new Set(['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'FLAGS']);

const escapeHtml = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const highlightLine = (line) => {
  const labelMatch = line.match(/^(\s*)([A-Za-z_][\w]*:)(.*)$/);
  let prefix = '';
  let rest = line;

  if (labelMatch) {
    prefix = escapeHtml(labelMatch[1]) + `<span class="tok-label">${escapeHtml(labelMatch[2])}</span>`;
    rest = labelMatch[3];
  }

  const highlighted = escapeHtml(rest).replace(
    /(\$?\b[\w]+\b)/g,
    (token) => {
      if (MNEMONICS.has(token)) return `<span class="tok-keyword">${token}</span>`;
      if (REGISTERS.has(token)) return `<span class="tok-register">${token}</span>`;
      if (/^\$\d+$/.test(token)) return `<span class="tok-number">${token}</span>`;
      if (/^\d+$/.test(token)) return `<span class="tok-number">${token}</span>`;
      return token;
    }
  );

  return prefix + highlighted || '&nbsp;';
};

const CodeEditor = ({
  code,
  setCode,
  breakpoints,
  onToggleBreakpoint,
  executionLine,
  isDebugging,
  editorRef,
  onScroll,
  binaryVisible,
}) => {
  const highlightRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const lines = useMemo(() => code.split('\n'), [code]);

  const highlightedHtml = useMemo(
    () => lines.map((line) => highlightLine(line)).join('\n'),
    [lines]
  );

  const syncScroll = (event) => {
    const { scrollTop, scrollLeft } = event.target;
    setScrollTop(scrollTop);
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
    if (onScroll) onScroll(event);
  };

  return (
    <div className={`ide-editor ${binaryVisible ? 'binary-mode' : ''}`}>
      <div className="ide-gutter">
        <div className="ide-gutter-lines" style={{ transform: `translateY(-${scrollTop}px)` }}>
          {lines.map((_, index) => {
            const lineNumber = index + 1;
            const hasBreakpoint = breakpoints.has(lineNumber);
            const isExecution = isDebugging && executionLine === lineNumber;
            return (
              <div
                key={lineNumber}
                className={`gutter-line ${hasBreakpoint ? 'has-breakpoint' : ''} ${isExecution ? 'execution' : ''}`}
                onClick={() => onToggleBreakpoint(lineNumber)}
                title={hasBreakpoint ? 'Remove breakpoint' : 'Add breakpoint'}
              >
                <span className="gutter-icon">
                  {isExecution ? <ArrowRight size={13} /> : hasBreakpoint ? <Circle size={9} fill="currentColor" /> : null}
                </span>
                <span className="gutter-number">{lineNumber}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ide-editor-body">
        <pre
          ref={highlightRef}
          className="ide-highlight"
          aria-hidden="true"
        >
          <code dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }} />
        </pre>
        <textarea
          ref={editorRef}
          className="ide-input"
          spellCheck={false}
          wrap="off"
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="Enter code here"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onScroll={syncScroll}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
