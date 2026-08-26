import engine from './assemblerEngine'

const { assembleProgram, simulateProgram } = engine

const compileCode = code => {
  return Promise.resolve(assembleProgram(code))
}

const sendCode = code => {
  return Promise.resolve(simulateProgram(code))
}

const promises = { compileCode, sendCode }

export default promises
