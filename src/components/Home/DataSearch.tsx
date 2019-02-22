import * as React from 'react';
import 'antd/dist/antd.css';
// import * as L from 'leaflet';
import '../../style/_home.scss';
import stringFilter from '../../util/util';
import { Layout, Menu, Icon, List, Rate } from 'antd';
import * as menuListData from '../../assets/data/filterCondition.json';
import * as servListData from '../../assets/data/testServList.json';

const { SubMenu } = Menu;
const { Content, Sider} = Layout;

// 条件选择菜单一级目录变量类型
export interface IMenu{
    name: string;
    icon: string;
    children: object[];
}

// 条件选择菜单二级目录变量类型
export interface ISubMenu{
    name: string;
    count: number;
}

// 生成菜单二级目录条目
function addSubMenuItem(subMenu: ISubMenu){
    return (
        <Menu.Item key={subMenu.name}>{subMenu.name} ({subMenu.count})</Menu.Item>                
    )
}

// 生成条件选择菜单
function addMenuItem(menu: IMenu){
    return (
        <SubMenu 
            className="main_container_sider_menu_item" 
            key={menu.name} 
            title={<span><Icon className="icon" type={menu.icon} />{menu.name}</span>}
        >
            {menu.children.map((item:ISubMenu)=>{
                return addSubMenuItem(item); 
            })}
        </SubMenu>               
    );
}

// 单个服务变量类型
export interface IServ{
    Title : string;
    URL : string;
    Rank : number;
    ResponseTime: string;
    Image : string;
    Abstract : string;
    Keywords : string;
    Location: string;
    GeoLocation : number[]; 
}

class DataSearch extends React.Component {
    private menuList = menuListData[0]; // 条件选择菜单数据
    private servList = servListData[0]; // 服务列表数据
    private paginationSize = 10; // 分页器初试当前页码
    
    // public componentDidMount(){
    //     const aMap = L.map('location-map').setView([0,0],3);
    //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }).addTo(aMap);
    // }
    public render() {
      return (
        <Layout className="main_container">
            <Sider width={300} className="main_container_sider">
                <Icon className="main_container_sider_icon" type="global"/><span>Filte By Location</span>
                <div className="main_container_sider_map" id="location-map"/>
                <Menu
                    mode="inline"
                    multiple={true}
                    defaultOpenKeys={['Topic']}
                    className="main_container_sider_menu"
                > 
                    {this.menuList.map((menu:IMenu)=>{ 
                        return addMenuItem(menu) 
                    })}
                </Menu>
            </Sider> 
            <Content className="main_container_content">
                <List
                    className="main_container_content_list"
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        pageSize: this.paginationSize,
                    }}
                    dataSource={this.servList}
                    footer={<div><b>service list</b> footer part</div>}
                    renderItem={(item:IServ) => (
                        <List.Item key={item.Title} className="main_container_content_list_item">
                            <b>{item.Title}</b>
                            <Rate disabled={true} allowHalf={true} value={item.Rank} className="rank"/><br/>
                            <span><Icon className="icon" type="compass"/>{item.Location}</span>
                            <span className="span"><Icon className="icon" type="pushpin"/>{item.GeoLocation[0]},{item.GeoLocation[1]}</span><br/>
                            Service was public at the website: <a href={item.URL}>{item.URL}</a><br/>
                            {stringFilter(item.Abstract)}<br/>
                            <b>Keywords: </b><span>{stringFilter(item.Keywords)}</span>
                        </List.Item>
                    )}
                />
            </Content>
        </Layout>
      );
    }
  }
  
  export default DataSearch;
  