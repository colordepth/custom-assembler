# Custom Assembler
Assembler and simulator for a custom instruction set

## Installing dependencies
`pip3 install -r requirements.txt` \
`npm install`

Pillow library may require the following packages to be installed first \
- libjpeg-dev (libjpeg62-turbo-dev or libjpeg8-dev)
- zlib1g-dev

## Running development server
`npm run dev-full`

## Running full build
`npm run build` \
`npm start`

## Automated Testing
* Go to the `automatedTesting` directory and execute the `run` file with appropiate options passed as arguments.
* Options available for automated testing:
	1. `--verbose`: Prints verbose output
	2. `--no-asm`: Does not evaluate the assembler
	3. `--no-sim`: Does not evaluate the simulator
