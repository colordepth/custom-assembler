import AppHeader from './components/AppHeader'
import WorkArea from './components/WorkArea'
import OutputArea from './components/OutputArea'
import './About.css';

const App = () => {

  return (
    <div className="About">
      <header>
        <nav>
          <a className="page-heading" href="#">Basic Assembler</a>
        </nav>
      </header>
      <h1>Our Project</h1>
      <p>Lorem ipsum dolor bolor folor golor</p>
      <ul className="profiles">
        <li>
          <div>
            </div>
            <h1></h1>
            <h4></h4>
        </li>
        <li>
          <div>
            </div>
            <h1></h1>
            <h4></h4>
        </li>
        <li>
          <div>
            </div>
            <h1></h1>
            <h4></h4>
        </li>
      </ul>
    </div>
  );
}

export default App;
