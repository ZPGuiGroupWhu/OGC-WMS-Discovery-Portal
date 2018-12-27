import * as React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Icon } from 'antd';
  
const { SubMenu } = Menu;
const { Content, Sider} = Layout;

class DataSearch extends React.Component {
    public render() {
      return (
        <Layout style={{ padding: '20px 0', background: '#fff' }}>
            <Sider width={250} style={{ background: '#fff' }}>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%' }}
            >
                <SubMenu key="sub1" title={<span><Icon type="user" />Topic</span>}>
                <Menu.Item key="1">Agriculture</Menu.Item>
                <Menu.Item key="2">Biodiversity</Menu.Item>
                <Menu.Item key="3">Climate</Menu.Item>
                <Menu.Item key="4">Disaster</Menu.Item>
                <Menu.Item key="5">Ecosystem</Menu.Item>
                <Menu.Item key="6">Energy</Menu.Item>
                <Menu.Item key="7">Geology</Menu.Item>
                <Menu.Item key="8">Health</Menu.Item>
                <Menu.Item key="9">Water</Menu.Item>
                <Menu.Item key="10">Weather</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="laptop" />Public organization</span>}>
                <Menu.Item key="11">GEOSS</Menu.Item>
                <Menu.Item key="12">USGS</Menu.Item>
                <Menu.Item key="13">NOAA</Menu.Item>
                <Menu.Item key="14">NASA</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="notification" />Continent</span>}>
                <Menu.Item key="15">Asia</Menu.Item>
                <Menu.Item key="16">Europea</Menu.Item>
                <Menu.Item key="17">Africa</Menu.Item>
                <Menu.Item key="18">North America</Menu.Item>
                <Menu.Item key="19">South America</Menu.Item>
                <Menu.Item key="20">Oceania</Menu.Item>
                <Menu.Item key="21">Antarctica</Menu.Item>
                </SubMenu>
            </Menu>
            </Sider>
            <Content style={{ padding: '0 20px', minHeight: 280 }}>
            Content
            </Content>
        </Layout>
      );
    }
  }
  
  export default DataSearch;
  