import * as React from 'react';
import Header from './Header';
import Footer from './Footer';
import Home from './Home/Home';
import ServiceInfo from './Home/ServiceInfo';
import LayerInfo from './Home/LayerInfo';
import Distribution from './ThemeMap/Distribution';
import LayerStatis from './ThemeMap/LayerStatis';
import ServiceQuality from './ThemeMap/ServiceQuality';
import DataAnalysis from './DataAnalysis/DataAnalysis';
import About from './About';
import {BrowserRouter, Route, Switch, withRouter} from 'react-router-dom';
import 'antd/dist/antd.css';
import '../style/_app.scss';
import { Layout} from 'antd';


const { Content } = Layout;

// the component supplying to Route return expect function, not object. 
class App extends React.Component {
    public render() {
      return (
            <BrowserRouter forceRefresh={false}>
              <Layout className="app">
                <Header/>
                <Content className="app_container">
                <Switch>
                    <Route exact={true} path="/" component={(props:any)=><Home {...props}/>} />
                    <Route path="/distribution" component={()=><Distribution/>}/>
                    <Route path="/layerStatis" component={()=><LayerStatis/>}/>
                    <Route path="/serviceQuality" component={()=><ServiceQuality/>}/>
                    <Route path="/dataAnalysis" component={()=><DataAnalysis/>}/>
                    <Route path="/about" component={()=><About/>} />
                    <Route path="/serviceInfo" component={(props:any)=><ServiceInfo {...props}/>}/>
                    <Route path="/layerInfo" component={()=><LayerInfo/>}/>
                </Switch>
                </Content>
                <Footer />
               </Layout>
             </BrowserRouter>
      );
    }
}
  
export default withRouter(App as any);