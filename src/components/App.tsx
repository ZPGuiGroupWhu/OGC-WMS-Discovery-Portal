import * as React from 'react';
import Header from './Header';
import Footer from './Footer';
import Home from './Home/Home';
import ServiceInfo from './Home/ServiceInfo';
import Distribution from './ThemeMap/Distribution';
import LayerStatis from './ThemeMap/LayerStatis';
import ServiceQuality from './ThemeMap/ServiceQuality';
import DataAnalysis from './DataAnalysis/DataAnalysis';
import {BrowserRouter, Route, Switch, withRouter} from 'react-router-dom';
import 'antd/dist/antd.css';
import '../style/_app.scss';
import { Layout} from 'antd';
const { Content } = Layout;

class App extends React.Component {
    public render() {
      return (
        <BrowserRouter forceRefresh={false}>
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
        </BrowserRouter>
      );
    }
}
  
export default withRouter(App as any);