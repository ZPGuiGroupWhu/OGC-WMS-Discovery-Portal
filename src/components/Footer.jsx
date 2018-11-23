import React, { Component } from 'react';
import logo from '../assets/img/logo.svg';
import '../style/_footer.scss';

class Footer extends Component {
  render() {
    return (
      <footer> 
        <div className="footer-logo">
          <img src={logo} alt="logo" />
          <span>Geographic Service catalogue</span>
        </div> 
        <a href="https://github.com/zpguigroupwhu" rel="noopener noreferrer" target="_blank">Copyright &copy; 2018 GeoAI & Spatial Visual Analytics Lab (GeoAI&SVAL) @ Wuhan University</a>
      </footer>
    );
  }
}

export default Footer;