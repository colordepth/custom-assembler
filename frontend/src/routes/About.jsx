import './About.css';
import deepProfile from '../assets/deep-profile.jpg'
import karanProfile from '../assets/karan-profile.png'
import dhruvProfile from '../assets/dhruv-profile.jpg'

const About = () => {

  return (
    <div id="about">
      <h1 id='about-title'>Our Project</h1>
      <p id="about-description">
        An assembler and simulator for a custom instruction set which works in multiple stages, worked with a system that employs 2 different programming languages together
      </p>
      <ul id="profiles">
        <li className='profile-card'>
          <img className='profile-image' src={karanProfile} />
          <div className='profile-details'  >
            <h1 className='profile-name'>Karan Singh</h1>
            <a className='profile-link' href='https://github.com/KaranMano'>https://github.com/KaranMano</a>
          </div>
        </li>
        <li className='profile-card'>
          <img className='profile-image' src={dhruvProfile} />
          <div className='profile-details' >
            <h1 className='profile-name'>Dhruv Malik</h1>
            <a className='profile-link' href='https://github.com/dhruvmalik25'>https://github.com/dhruvmalik25</a>
          </div>
        </li>
        <li className='profile-card'>
          <img className='profile-image' src={deepProfile} />
          <div className='profile-details'>
            <h1 className='profile-name'>Deep Sharma</h1>
            <a className='profile-link' href='https://github.com/colordepth'>https://github.com/colordepth</a>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default About;
