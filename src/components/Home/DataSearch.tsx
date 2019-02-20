import * as React from 'react';
import 'antd/dist/antd.css';
// import * as L from 'leaflet';
import '../../style/_home.scss';
import { Layout, Menu, Icon, Pagination} from 'antd';
import * as menuListData from '../../assets/data/filterCondition.json';

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
            title={<span><Icon type={menu.icon} />{menu.name}</span>}
        >
            {menu.children.map((item:ISubMenu)=>{
                return addSubMenuItem(item); 
            })}
        </SubMenu>               
    );
}

class DataSearch extends React.Component {
    // 条件选择菜单数据
    private menuList = menuListData[0]; 
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
                <div className="main_container_content_list" />
                <div className="main_container_content_pagination">
                    <Pagination defaultCurrent={6} total={500} />
                </div>
            </Content>
        </Layout>
      );
    }
  }
  
  export default DataSearch;
  