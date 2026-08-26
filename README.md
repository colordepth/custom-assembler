# Custom Assembler

An assembler, simulator, and browser-based playground for a custom 16-bit instruction set.

## Project layout

- `Simple-Assembler/`: Python assembler. It reads assembly source from standard input and writes machine code to standard output.
- `SimpleSimulator/`: Python simulator for the generated machine code.
- `frontend/`: React application for assembling and simulating programs in the browser.
- `automatedTesting/`: Grading scripts and reference programs for the assembler and simulator.

## Prerequisites

- Python 3
- Node.js and npm
- On Linux, Pillow may require `libjpeg-dev` and `zlib1g-dev`.

## Installing dependencies

From the repository root:

```bash
pip3 install -r requirements.txt
cd frontend
npm ci
```

## Running the web application

```bash
cd frontend
npm start
```

The development server opens the React application at `http://localhost:3000`.

To create a production build:

```bash
cd frontend
npm run build
```

The compiled files are written to `frontend/build/`. The available `npm start` script runs the development server.

## Running the Python tools

Assemble a source file and write the resulting machine code to a file:

```bash
cd Simple-Assembler
python3 assembler.py < ../path/to/program.asm > program.bin
```

Run the simulator by piping the generated machine code into it:

```bash
cd SimpleSimulator
python3 simulator.py < ../Simple-Assembler/program.bin
```

## Automated Testing

From the repository root, run:

```bash
cd automatedTesting
./run
```

Available options:

- `--verbose`: print verbose output.
- `--no-asm`: skip assembler tests.
- `--no-sim`: skip simulator tests.

For example:

```bash
./run --verbose --no-sim
```

Run the frontend unit tests with:

```bash
cd frontend
npm test
```
