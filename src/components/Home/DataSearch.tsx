import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import * as L from 'leaflet';     
import 'leaflet-draw';     
import $req, { HttpMethod } from '../../util/fetch';                                                                
import {stringFilter, reqUrl} from '../../util/util';
import {NavLink as Link} from 'react-router-dom';
import * as menuListData from '../../assets/data/filterCondition.json';
import * as servListData from '../../assets/data/testServList.json';
import { Layout, Menu, Icon, List, Rate, Input, Button } from 'antd';

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

interface Props {
    history: any;
}

interface State {
    dataList: object[];
    geoBox: string;
    listTotal: number;
}

class DataSearch extends React.Component<Props, State> {
    private menuList = menuListData[0]; // condition selector menu 
    private servList = servListData[0]; // service data
    private paginationSize = 10; // data count in each page of the pagination 

    constructor (props:Props) {
        super(props);
        this.state = {
            dataList: this.servList,
            geoBox: 'Filter Geo-Range',
            listTotal: this.servList.length
        };
    }

    public componentDidMount(){
        this.initMap();
        this.initData();
    }

    public render() {
        return (
            <Layout className="main_container">
                <Sider width={300} className="main_container_sider">
                    <div className="main_container_sider_icon"><Icon type="global"/><span className="title">Filte By Location</span></div>
                    <div className="main_container_sider_title">
                        <Input disabled={true} value={this.state.geoBox}/>
                        <Button type="primary">Apply</Button>
                    </div>
                    <div className="main_container_sider_map" id="location_map" />
                    <Menu
                        mode="inline"
                        multiple={true}
                        defaultOpenKeys={['Topic']}
                        className="main_container_sider_menu"
                    > 
                        {this.menuList.map((menu:IMenu)=>{ 
                            return this.addMenuItem(menu) 
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
                            hideOnSinglePage: true,
                            total: this.state.listTotal
                        }}
                        dataSource={this.state.dataList}
                        footer={<div><b>service list</b> footer part</div>}
                        renderItem={(item:IServ) => (
                            <List.Item key={item.Title} className="main_container_content_list_item">
                                <Link to="/serviceInfo" className="title" onClick={this.turnToServPage}>{item.Title}</Link>
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
    public initMap = () => { 
        const self = this;
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
        locatioNMap.on(L.Draw.Event.DRAWSTART,function(e){
            if (Object.keys(drawnItems["_layers"]).length !== 0){
                const layer = drawnItems["_layers"][Object.keys(drawnItems["_layers"])[0]];
                drawnItems.removeLayer(layer);
            };
        })
        locatioNMap.on(L.Draw.Event.CREATED, function(e){
            const layer = e["layer"];
            drawnItems.addLayer(layer);
            const bound = e["layer"]["_bounds"];
            const rangeStr = `[${(bound["_southWest"]["lat"].toFixed(1))},${(bound["_southWest"]["lng"].toFixed(1))}],[${(bound["_northEast"]["lat"]).toFixed(1)},${(bound["_northEast"]["lng"]).toFixed(1)}]`
            self.setState({
                geoBox: rangeStr
            })
        });
        locatioNMap.on(L.Draw.Event.DELETED, function(e){
            self.setState({
                geoBox: 'Filter Geo-Range'
            })
        })
    }

    // init service list by sending http request 
    public initData = () => {
        this.getServList({
            page: 0,
            size: this.paginationSize
        },{
            keywords: '1'
        });
    }

    // Function: send http request to get service list data
    // When to transfer: init render DataSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
    // @param  params:object = {keyword?:string, bound?:number[], page:number, size:number}
    public async getServList(pagePar:object, bodyPar:object) {
        const baseUrl:string = 'search/queryWMSList';
        const url:string = reqUrl(pagePar,baseUrl);
        console.log(url)
        try {
            const res: any = await $req(url, {
                body: bodyPar,
                method: HttpMethod.post
            })
            console.log(res);
        } catch(e) {
            alert(e.message)
        }
    }

    // init to render condition selector menu (submenu item)
    public addSubMenuItem = (subMenu: ISubMenu) => {
        return (
            <Menu.Item key={subMenu.name}>{subMenu.name} ({subMenu.count})</Menu.Item>                
        )
    }

    // init to render condition selector menu (parent menu item)
    public addMenuItem = (menu: IMenu) => {
        return (
            <SubMenu 
                className="main_container_sider_menu_item" key={menu.name} 
                title={<span><Icon className="icon" type={menu.icon} />Filte By {menu.name}</span>}
            >
                {menu.children.map((item:ISubMenu)=>{
                    return this.addSubMenuItem(item); 
                })}
            </SubMenu>               
        );
    }

    // response function of clicking the service item title to turn to the individual service info page
    public turnToServPage = () =>{
        const container = document.getElementsByClassName('content')[0];
        container.className = 'content sr-only';
        window.location.reload();
    }

}
  
export default DataSearch;
  