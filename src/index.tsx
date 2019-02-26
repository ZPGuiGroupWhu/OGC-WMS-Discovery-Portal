import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home/Home';
import ServiceInfo from './components/Home/ServiceInfo';
import Distribution from './components/ThemeMap/Distribution';
import LayerStatis from './components/ThemeMap/LayerStatis';
import ServiceQuality from './components/ThemeMap/ServiceQuality';
import DataAnalysis from './components/DataAnalysis/DataAnalysis';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'antd/dist/antd.css';
import './style/_index.scss';
import { Layout} from 'antd';
const { Content } = Layout;

ReactDOM.render(
  <Router forceRefresh={true}>
        <Layout className="app">
            <Header/>
            <Content className="app_container">
              <Switch>
                <Route exact={true} path="/" component={Home}/>
                <Route path="/distribution" component={Distribution}/>
                <Route path="/layerStatis" component={LayerStatis}/>
                <Route path="/serviceQuality" component={ServiceQuality}/>
                <Route path="/dataAnalysis" component={DataAnalysis}/>
                <Route path="/serviceInfo" component={ServiceInfo}/>
              </Switch>
            </Content>
            <Footer />
        </Layout>
    </Router> ,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
