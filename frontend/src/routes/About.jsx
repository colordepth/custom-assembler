import './About.css';
import deepProfile from '../assets/deep-profile.jpg'
import karanProfile from '../assets/karan-profile.jpeg'
import dhruvProfile from '../assets/dhruv-profile.jpg'
import { Code2, Cpu, GitBranch, Users } from 'lucide-react';

const contributors = [
  { name: 'Karan Singh', handle: 'KaranMano', image: karanProfile },
  { name: 'Dhruv Malik', handle: 'dhruvmalik25', image: dhruvProfile },
  { name: 'Deep Sharma', handle: 'colordepth', image: deepProfile },
];

const About = () => {
  return (
    <div id="about">
      <div className="about-breadcrumb"><Code2 size={14} /> about.md</div>
      <main className="about-content">
        <section className="about-intro">
          <div className="about-kicker">Custom ISA developer tools</div>
          <h1 id="about-title">Assembler workspace</h1>
          <p id="about-description">
            Created as a college project, this browser-based assembler and simulator explores a custom instruction set through compilation, execution, and debugging.
          </p>
          <div className="about-meta">
            <span><Cpu size={14} /> 16-bit instruction words</span>
            <span><GitBranch size={14} /> Assemble and simulate</span>
            <span><Users size={14} /> 3 contributors</span>
          </div>
        </section>

        <section className="contributors-section">
          <div className="section-heading">
            <span>Contributors</span>
            <span className="section-count">03</span>
          </div>
          <ul id="profiles">
            {contributors.map((contributor) => (
              <li className="profile-card" key={contributor.handle}>
                <img className="profile-image" src={contributor.image} alt={`${contributor.name} profile`} />
                <div className="profile-details">
                  <h2 className="profile-name">{contributor.name}</h2>
                  <a className="profile-link" href={`https://github.com/${contributor.handle}`}>
                    github.com/{contributor.handle}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default About;
