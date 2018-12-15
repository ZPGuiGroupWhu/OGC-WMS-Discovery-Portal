import React, { Component } from 'react';
import {NavLink as Link} from 'react-router-dom';
import logo from '../assets/img/logo.svg';
import '../style/_header.scss';

class Header extends Component {
  render() {
    return (
      <header className="header"> 
        <div className="header-logo">     
          <img src={logo} className="header-logo-img" alt="logo" />
          <span className="header-logo-name">WMS Discovery Portal</span>
        </div> 
        <nav>
          <Link className="nav-item" exact activeClassName="selected" to="/">Data Search</Link>
          <Link className="nav-item" activeClassName="selected" to="/themeMap">Theme Map</Link>
          <Link className="nav-item" activeClassName="selected" to="/dataAnalysis">Data Analysis</Link>
        </nav>
      </header>
    );
  }
}

export default Header;
