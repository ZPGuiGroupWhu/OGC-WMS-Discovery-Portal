import * as React from 'react';
import DataSearch from './DataSearch';
import LayerSearch from './LayerSearch';
import {NavLink as Link} from 'react-router-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Layout, Input, Radio, Select } from 'antd';
import 'antd/dist/antd.css';

const { Content} = Layout;
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class Home extends React.Component {
  public render() {
    return (
      <Router>
        <Content style={{ padding: '20px 0px' }}>
          <Search
              style={{ padding: '20px 0px'}}
              placeholder="input search text"
              enterButton={true}
          />
          <RadioGroup defaultValue="a" style={{margin:'0 20px'}}>
            <RadioButton value="a"><Link exact={true} to="/">Service Searching</Link></RadioButton>
            <RadioButton value="b"><Link to="/layerSearch">Map Layer Searching</Link></RadioButton>
          </RadioGroup>
          <Select defaultValue="lucy" style={{ width: 223, margin: '0 0' }}>
            <Option value="jack">Order By Quality Rank</Option>
            <Option value="lucy">Order By Name First Letter</Option>
            <Option value="disabled">Order By Response Time</Option>
            <Option value="Yiminghe">Order By Layer Number</Option>
          </Select>
          <Layout>
              <Route exact={true} path="/" component={DataSearch}/>
              <Route path="/layerSearch" component={LayerSearch}/>
          </Layout>
        </Content>
      </Router>
    );
  }
}

export default Home;
