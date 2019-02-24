import * as React from 'react';
import DataSearch from './DataSearch';
import LayerSearch from './LayerSearch';
import {NavLink as Link} from 'react-router-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Layout, Input, Radio, Select } from 'antd';
import 'antd/dist/antd.css';
import '../../style/_home.scss';

const { Content} = Layout;

class Home extends React.Component {
  public render() {
    return (
      <Router>
        <Content className="content">
          <div className="content_tool">
            <Input.Search
                className="content_tool_search"
                placeholder="Input something to search services"
                enterButton={true}
            />
            <Radio.Group defaultValue="service" buttonStyle="solid" className="content_tool_radio" >
              <Radio.Button className="content_tool_radio_btn" value="service"><Link to="/" onClick={this.handleRatioServ}>Service Searching</Link></Radio.Button>
              <Radio.Button className="content_tool_radio_btn" value="layer"><Link to="/layerSearch" onClick={this.handleRatioLayer}>Map Layer Searching</Link></Radio.Button>
            </Radio.Group>
            <Select defaultValue="firstLetter" className="content_tool_select">
              <Select.Option value="qualityRank">Order By Quality Rank</Select.Option>
              <Select.Option value="firstLetter">Order By Name First Letter</Select.Option>
              <Select.Option value="ResTime">Order By Response Time</Select.Option>
              <Select.Option value="LayerNum">Order By Layer Number</Select.Option>
            </Select>
          </div> 
          <Layout>
              <Route exact={true} path="/" component={DataSearch}/>
              <Route path="/layerSearch" component={LayerSearch}/>
          </Layout>
        </Content>
      </Router>
    );
  }

  // switch to service data search page, handle the radio button background color
  public handleRatioServ(){
    const servDom = document.getElementsByClassName('content_tool_radio_btn')[0]; 
    const layerDom = document.getElementsByClassName('content_tool_radio_btn')[1];
    servDom.className="content_tool_radio_btn ant-radio-button-wrapper ant-radio-button-wrapper-checked";
    layerDom.className = "content_tool_radio_btn ant-radio-button-wrapper";
  }

  // switch to layer img search page, handle the radio button background color
  public handleRatioLayer(){
    const servDom = document.getElementsByClassName('content_tool_radio_btn')[0]; 
    const layerDom = document.getElementsByClassName('content_tool_radio_btn')[1];
    servDom.className="content_tool_radio_btn ant-radio-button-wrapper";
    layerDom.className = "content_tool_radio_btn ant-radio-button-wrapper ant-radio-button-wrapper-checked";
  }

}

export default Home;
