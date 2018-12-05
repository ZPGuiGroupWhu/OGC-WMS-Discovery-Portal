import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home/Home.jsx';
import ThemeMap from './components/themeMap/themeMap.jsx';
import DataAnalysis from './components/dataAnalysis/dataAnalysis.jsx';
import * as serviceWorker from './serviceWorker';
import './style/_index.scss';

ReactDOM.render(  
    <Router>
        <div className="App">
            <Header className="App-header"></Header>
            <div className="App-container">
                <Route exact path="/" component={Home}/>
                <Route path="/themeMap" component={ThemeMap}/>
                <Route path="/dataAnalysis" component={DataAnalysis}/>
            </div>
            <Footer className="App-footer"></Footer>
        </div>
    </Router>  
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
