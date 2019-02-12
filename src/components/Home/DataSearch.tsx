import * as React from 'react';
// import * as L from 'leaflet';
import { Layout, Menu, Icon } from 'antd';

import 'antd/dist/antd.css';
import '../../style/_home.scss';

const { SubMenu } = Menu;
const { Content, Sider} = Layout;

class DataSearch extends React.Component {
    // public componentDidMount(){
    //     const map = L.map('map').setView([0,0],3);
    //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }).addTo(map);
    // }
    public render() {
      return (
        <Layout className="main_container">
            <Sider width={300} className="main_container_sider">
                <Icon className="main_container_sider_icon" type="global"/><span>Geo Range</span>
                <div className="main_container_sider_map"/>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    className="main_container_sider_menu"
                >   
                    <SubMenu key="sub1" title={<span><Icon type="user" />Topic</span>}>
                        <Menu.Item key="1">Agriculture (111)</Menu.Item>
                        <Menu.Item key="2">Biodiversity (222)</Menu.Item>
                        <Menu.Item key="3">Climate (111)</Menu.Item>
                        <Menu.Item key="4">Disaster (111)</Menu.Item>
                        <Menu.Item key="5">Ecosystem (111)</Menu.Item>
                        <Menu.Item key="6">Energy (111)</Menu.Item>
                        <Menu.Item key="7">Geology (111)</Menu.Item>
                        <Menu.Item key="8">Health (111)</Menu.Item>
                        <Menu.Item key="9">Water (111)</Menu.Item>
                        <Menu.Item key="10">Weather (111)</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub5" title={<span><Icon type="key" />Keyword</span>}>
                        <Menu.Item key="27">Rock (111)</Menu.Item>
                        <Menu.Item key="28">Geochemical (222)</Menu.Item>
                        <Menu.Item key="29">Fire (111)</Menu.Item>
                        <Menu.Item key="30">Fish (111)</Menu.Item>
                        <Menu.Item key="31">Carbon (111)</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="laptop" />Public Organization</span>}>
                        <Menu.Item key="11">Earth Data Analysis Center (3203)</Menu.Item>
                        <Menu.Item key="12">NOAA (2866)</Menu.Item>
                        <Menu.Item key="13">FAO (295)</Menu.Item>
                        <Menu.Item key="14">NCEI (131)</Menu.Item>
                        <Menu.Item key="22">Arizona Geological Survey (98)</Menu.Item>
                        <Menu.Item key="23">Geological Survey Mineral Resources Program (95)</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="notification" />Continent</span>}>
                        <Menu.Item key="15">Asia (469)</Menu.Item>
                        <Menu.Item key="16">Europea (23896)</Menu.Item>
                        <Menu.Item key="17">Africa (4987)</Menu.Item>
                        <Menu.Item key="18">North America (19834)</Menu.Item>
                        <Menu.Item key="19">South America (5612)</Menu.Item>
                        <Menu.Item key="20">Oceania (3245)</Menu.Item>
                        <Menu.Item key="21">Antarctica (317)</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" title={<span><Icon type="bulb" />Public Time</span>}>
                        <Menu.Item key="22">1995-2000 (100)</Menu.Item>
                        <Menu.Item key="23">2000-2005 (100)</Menu.Item>
                        <Menu.Item key="24">2005-2010 (100)</Menu.Item>
                        <Menu.Item key="25">2010-2015 (100)</Menu.Item>
                        <Menu.Item key="26">2015-2020 (100)</Menu.Item>
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
  