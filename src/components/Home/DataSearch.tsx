import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import * as L from 'leaflet';     
import 'leaflet-draw';     
import $req, { HttpMethod } from '../../util/fetch';      
import {mapDrawConfig} from '../../util/config';                                                 
import {stringFilter, reqUrl, delEmptyKey, smoothscroll } from '../../util/util';
import { IMenu, ISubMenu, IServ, IBody, IPageInfo } from "../../util/interface";
import {NavLink as Link} from 'react-router-dom';
import * as menuListData from '../../assets/data/filterCondition.json';
import * as testData from '../../assets/data/testServList.json';
import { Layout, Menu, Icon, List, Rate, Input, Button } from 'antd';

const { SubMenu } = Menu;
const { Content, Sider} = Layout;

interface Props {
    history: any;
}

interface State {
    dataList: object[];
    listTotal: number;
    geoBoxStr: string;
    bodyPar: IBody;
    pageInfo: IPageInfo;
}

class DataSearch extends React.Component<Props, State> {
    private menuList = menuListData[0]; // condition selector menu 

    constructor (props:Props) {
        super(props);
        this.state = {
            dataList: [],
            geoBoxStr: 'Filter Geo-Range',
            listTotal: 100,
            bodyPar: {
                keywords: '',
                bound: []
            },
            pageInfo: {
                page: 0,
                size: 10
            }
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
                        <Input disabled={true} value={this.state.geoBoxStr}/>
                        <Button 
                                onClick={()=>{this.getServList(this.state.pageInfo,this.state.bodyPar);}}><Icon type="search" />
                        </Button>
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
                            pageSize: this.state.pageInfo.size,
                            hideOnSinglePage: true,
                            total: this.state.listTotal,
                            current: this.state.pageInfo.page+1,
                            onChange: this.handlePaginate
                        }}
                        dataSource={this.state.dataList}
                        footer={<div><b>service list</b> footer part</div>}
                        renderItem={(item:IServ) => (
                            <List.Item key={item.id} className="main_container_content_list_item">
                                <Link to="/serviceInfo" className="title" onClick={this.turnToServPage}>{item.title ? item.title : 'null'}</Link>
                                <Rate disabled={true} allowHalf={true} value={testData[0][0].Rank} className="rank"/><br/>
                                <span><Icon className="icon" type="compass"/>Location: {item.administrative_unit}</span>
                                <span className="span"><Icon className="icon" type="pushpin"/>GeoGraphic Location: {testData[0][0].GeoLocation[0]},{testData[0][0].GeoLocation[1]}</span><br/>
                                Service was public at the website: <a href={item.url}>{item.url}</a><br/>
                                {testData[0][0].Abstract ? stringFilter(testData[0][0].Abstract) : 'There is no abstract in the service capability document.'}<br/>
                                <b>Keywords: </b><span>{item.keywords ? stringFilter(item.keywords): 'no keywords'}</span>
                            </List.Item>
                        )}
                    />
                </Content>
            </Layout>
        );
    }

    // init service list by sending http request 
    public initData = () => {
        this.getServList(this.state.pageInfo,this.state.bodyPar);
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
            draw: mapDrawConfig,
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
            const boxArr = [bound["_southWest"]["lng"].toFixed(1),bound["_northEast"]["lng"].toFixed(1),bound["_southWest"]["lat"].toFixed(1),bound["_northEast"]["lat"].toFixed(1)]
            const rangeStr = `lng(${boxArr[0]},${boxArr[1]}),lat(${boxArr[2]},${boxArr[3]})`;
            const bodyPar = self.state.bodyPar;
            bodyPar.bound = boxArr;
            self.setState({
                geoBoxStr: rangeStr,
                bodyPar,
            })
        });
        locatioNMap.on(L.Draw.Event.DELETED, function(e){
            self.setState({
                geoBoxStr: 'Filter Geo-Range'
            })
        })
    }

    // paginate to request new data
    public handlePaginate = (cur:number) => {
        const pageInfo = this.state.pageInfo;
        pageInfo.page = cur-1;
        this.setState({
            pageInfo,
        })
        this.getServList(this.state.pageInfo,this.state.bodyPar).then(smoothscroll);
    }

    // Function: send http request to get service list data
    // When to transfer: init render DataSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
    // @param  params:object = {keyword?:string, bound?:number[], page:number, size:number}
    public async getServList(pagePar:object, bodyPar:object) {
        const baseUrl:string = 'search/queryWMSList';
        const url:string = reqUrl(pagePar,baseUrl);
        const body = delEmptyKey(bodyPar);
        try {
            const res: any = await $req(url, {
                body,
                method: HttpMethod.post
            })
            this.setState({
                dataList: JSON.parse(res)
            })
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
    public turnToServPage = () => {
        const container = document.getElementsByClassName('content')[0];
        container.className = 'content sr-only';
        window.location.reload();
    }

}
  
export default DataSearch;
  