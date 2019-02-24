import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import * as L from 'leaflet';  
import 'leaflet-draw';                                                                                          
import stringFilter from '../../util/util';
import { Layout, Menu, Icon, List, Rate } from 'antd';
import * as menuListData from '../../assets/data/filterCondition.json';
import * as servListData from '../../assets/data/testServList.json';

const { SubMenu } = Menu;
const { Content, Sider} = Layout;

// menu item variable type
interface IMenu{
    name: string;
    icon: string;
    children: object[];
}

// submenu item variable type
interface ISubMenu{
    name: string;
    count: number;
}

// init to render condition selector menu (submenu item)
function addSubMenuItem(subMenu: ISubMenu){
    return (
        <Menu.Item key={subMenu.name}>{subMenu.name} ({subMenu.count})</Menu.Item>                
    )
}

// init to render condition selector menu (parent menu item)
function addMenuItem(menu: IMenu){
    return (
        <SubMenu 
            className="main_container_sider_menu_item" 
            key={menu.name} 
            title={<span><Icon className="icon" type={menu.icon} />Filte By {menu.name}</span>}
        >
            {menu.children.map((item:ISubMenu)=>{
                return addSubMenuItem(item); 
            })}
        </SubMenu>               
    );
}

// service item variable type
interface IServ{
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

class DataSearch extends React.Component<object> {
    private menuList = menuListData[0]; // condition selector menu 
    private servList = servListData[0]; // service data
    private paginationSize = 10; // data count in each page of the pagination 

    public componentDidMount(){
        this.mapInit();
    }

    public render() {
      return (
        <Layout className="main_container">
            <Sider width={300} className="main_container_sider">
                <div className="main_container_sider_icon"><Icon type="global"/><span className="title">Filte By Location</span></div>
                <div className="main_container_sider_map" id="location_map" />
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
                            <span><Icon className="icon" type="compass"/>Location: {item.Location}</span>
                            <span className="span"><Icon className="icon" type="pushpin"/>GeoGraphic Location: {item.GeoLocation[0]},{item.GeoLocation[1]}</span><br/>
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

    // init leaflet map, init add leaflet draw control
    public mapInit(){ 
        const locatioNMap = L.map("location_map",{
            attributionControl:false,
            zoomControl: false
        }).setView([0,0],1);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(locatioNMap);
        const drawnItems = new L.FeatureGroup();
        locatioNMap.addLayer(drawnItems);
        const drawControl = new L.Control.Draw({
            position:'topleft',
            draw: {
                polyline: false,
                polygon: false,
                marker: false,
                circle: false,
                circlemarker: false,
                rectangle: {
                    shapeOptions: {
                        weight: 1
                    },
                    repeatMode: false
                },
            },
            edit: {
                featureGroup: drawnItems,
                edit: false
            }
        });
        locatioNMap.addControl(drawControl);
        locatioNMap.on(L.Draw.Event.CREATED, function(e){
            const layer = e["layer"];
            drawnItems.addLayer(layer);
            
        });
    }
  }
  
  export default DataSearch;
  