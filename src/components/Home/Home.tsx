import * as React from 'react';
import * as L from 'leaflet';     
import 'leaflet-draw';   
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import DataSearch from './DataSearch';
import LayerSearch from './LayerSearch';
import {mapDrawConfig} from '../../util/config'; 
import { IMenu, ISubMenu, IQueryPar } from "../../util/interface";
import * as menuListData from '../../assets/data/filterCondition.json';
import { Layout, Input, Radio, Select, Icon, Menu } from 'antd';

const { SubMenu } = Menu;
const { Content, Sider} = Layout;

interface Props {
  history: any;
}

interface State {
  geoBoxStr: string;
  queryPar: IQueryPar;
}

class Home extends React.Component<Props,State> {
  private menuList = menuListData[0]; // condition selector menu 
  private geoBoxStrDefault = 'Filter Geo-Range'; // place-holder of input text in front of the map

  constructor (props:Props) {
    super(props);
    this.state = {
      geoBoxStr: this.geoBoxStrDefault,
      queryPar: {
          bound: [],
          continent: '',
          keywords: '',
      },
    };
  }

  public componentDidMount(){
      this.initMap();
  }

  public render() {
    return (
        <Content className="content">
          <div className="content_tool">
            <Input.Search className="content_tool_search" enterButton={true} placeholder="Input something to search services" onSearch={value => this.handleInputSearch(value)}/>
            <Radio.Group defaultValue="service" buttonStyle="solid" className="content_tool_radio" >
              <Radio.Button className="content_tool_radio_btn" value="service" onClick={() => { this.handleRatio(0) }}>Service Searching</Radio.Button>
              <Radio.Button className="content_tool_radio_btn" value="layer" onClick={() => { this.handleRatio(1) }}>Map Layer Searching</Radio.Button>
            </Radio.Group>
            <Select defaultValue="firstLetter" className="content_tool_select">
              <Select.Option value="qualityRank">Order By Quality Rank</Select.Option>
              <Select.Option value="firstLetter">Order By Name First Letter</Select.Option>
              <Select.Option value="ResTime">Order By Response Time</Select.Option>
              <Select.Option value="LayerNum">Order By Layer Number</Select.Option>
            </Select>
          </div> 
          <Layout className="main_container">
              <Sider width={300} className="main_container_sider">
                  <div className="main_container_sider_icon"><Icon type="global"/><span className="title">Filte By Location</span></div>
                  <div className="main_container_sider_title"><Input disabled={true} value={this.state.geoBoxStr}/></div>
                  <div className="main_container_sider_map" id="location_map" />
                  <Menu className="main_container_sider_menu" defaultOpenKeys={['Topic']} mode="inline" multiple={true} > 
                      {this.menuList.map((menu:IMenu)=>{ 
                          return this.addMenuItem(menu) 
                      })}
                  </Menu>
              </Sider>
              <Content className="main_container_content">
                <DataSearch queryPar={this.state.queryPar}/>
                <LayerSearch/>
              </Content>
          </Layout>
        </Content>
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
          draw: mapDrawConfig,
          edit: {
              edit: false,
              featureGroup: drawnItems
          },
          position:'topleft'
      });
      locatioNMap.addControl(drawControl);
      locatioNMap.on(L.Draw.Event.DRAWSTART,(e) => {
          if (Object.keys(drawnItems["_layers"]).length !== 0){
              const layer = drawnItems["_layers"][Object.keys(drawnItems["_layers"])[0]];
              drawnItems.removeLayer(layer);
          };
      })
      locatioNMap.on(L.Draw.Event.CREATED, (e) => {
          const layer = e["layer"];
          drawnItems.addLayer(layer);
          const bound = e["layer"]["_bounds"];
          const boxArr = [bound["_southWest"]["lng"].toFixed(1),bound["_northEast"]["lng"].toFixed(1),bound["_southWest"]["lat"].toFixed(1),bound["_northEast"]["lat"].toFixed(1)]
          const rangeStr = `lng(${boxArr[0]},${boxArr[1]}),lat(${boxArr[2]},${boxArr[3]})`;
          const queryPar = self.state.queryPar;
          queryPar.bound = boxArr;
          self.setState({
            geoBoxStr: rangeStr,
            queryPar,             
          })
      });
      locatioNMap.on(L.Draw.Event.DELETED, (e) => {
          const queryPar = self.state.queryPar;
          queryPar.bound = [];
          self.setState({
              geoBoxStr: this.geoBoxStrDefault,
              queryPar,
          })
      })
  }

  // input something and search
  public handleInputSearch = (value: string) => {
    const queryPar = this.state.queryPar;
    queryPar.keywords = value;
    this.setState({queryPar});
  }

  // switch to service data search page, handle the radio button background color
  public handleRatio = (active: number) => { 
    const dataComp = document.getElementsByClassName('main_container_content_list')[0];
    const imgComp = document.getElementsByClassName('main_container_content_imglist')[0];
    const target = active === 0 ? dataComp : imgComp;
    const untarget = active === 0 ? imgComp : dataComp;
    target.className = target.className.replace('sr-only','');
    untarget.className = `${untarget.className} sr-only`;
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

}

export default Home;
