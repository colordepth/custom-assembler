import runButtonSVG from '../run-button.svg';
import './RunButton.css';

const RunButton = ({onClick}) => {
  return (
    <button
      className="Run-button"
      onClick={onClick}
    >
      Run
      <img id="run-button-svg" src={runButtonSVG} alt=""></img>
    </button>
  )
}

export default RunButton
