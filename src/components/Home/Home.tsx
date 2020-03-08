import * as React from 'react';
import * as L from 'leaflet';     
import 'leaflet-draw';   
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import DataSearch from './DataSearch';
import LayerSearch from './LayerSearch';
import {mapDrawConfig} from '../../util/config'; 
import { IMenu, ISubMenu, IQueryPar } from "../../util/interface";
import { pushKeyValueToArr } from "../../util/util";
import * as menuListData from '../../assets/data/filterCondition.json';
import { Layout, Input, Radio, Select, Icon, Menu} from 'antd';


const { SubMenu } = Menu;
const { Content, Sider} = Layout;
const topic:any = [];
const organization:any = [];
const organizationType:any = [];
const continent:any = [];

interface Props {
  history: any;
}

interface State {
  geoBoxStr: string;
  queryPar: IQueryPar;
  collapsed: boolean;
}

class Home extends React.Component<Props,State> {
  private menuList = menuListData[0]; // condition selector menu 
  private geoBoxStrDefault = 'Filter Geo-Range'; // place-holder of input text in front of the map
  private topicArr = pushKeyValueToArr(this.menuList[0].children);
  private organizationTypeArr = pushKeyValueToArr(this.menuList[1].children);
  private organizationArr = pushKeyValueToArr(this.menuList[2].children);
  private continentArr = pushKeyValueToArr(this.menuList[3].children);

  constructor (props:Props) {
    super(props);
    this.state = {
      geoBoxStr: this.geoBoxStrDefault,
      queryPar: {
          bound: [],
          continent: '',
          keywords: '',
          organization: '',
          organization_type: '', 
          topic: ''
      },
      collapsed: false,
    };
  }

  public componentDidMount(){
      this.initMap();
  }

// hide left sider
  public toggle =()=>{
    this.setState({collapsed:!this.state.collapsed});
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
          <Layout className="main_container" >
              <Sider 
              collapsible={true} collapsed={this.state.collapsed}  collapsedWidth={20} trigger={null}
              width={300} className="main_container_leftsider"
              >
                <div style={{display:this.state.collapsed?'none':'inline'}}>
                  <div className="main_container_leftsider_icon"><Icon type="global"/><span className="title">Filte By Location</span></div>
                  <div className="main_container_leftsider_title"><Input disabled={true} value={this.state.geoBoxStr}/></div>
                  <div className="main_container_leftsider_map" id="location_map" />
                  <Menu className="main_container_leftsider_menu" defaultOpenKeys={['Topic']} mode="inline" multiple={true} > 
                      {this.menuList.map((menu:IMenu)=>{ 
                          return this.addMenuItem(menu) 
                      })}
                  </Menu>
                </div>
                <div className="main_container_leftsider_trigger" onClick={this.toggle}>
                     <Icon  type={this.state.collapsed?"double-right":"double-left"} />
                </div>
              </Sider>
              <Content className="main_container_content">
                <DataSearch queryPar={this.state.queryPar}/>
                <LayerSearch queryPar={this.state.queryPar}/>
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
    const dataSta = document.getElementsByClassName('main_container_content_statis')[0];
    const imgSta = document.getElementsByClassName('main_container_content_imglist_statis')[0];
    const target = active === 0 ? dataComp : imgComp;
    const untarget = active === 0 ? imgComp : dataComp;
    target.className = target.className.replace('sr-only','');
    untarget.className = `${untarget.className} sr-only`;
    const sta = active === 0 ? dataSta : imgSta;
    const unsta = active === 0 ? imgSta : dataSta;
    sta.className = sta.className.replace('sr-only','');
    unsta.className = `${unsta.className} sr-only`;
  }

  // click submenu to choose search parameters
  public handleMenuClick = (e:any) => {
    if(this.topicArr.indexOf(e.key) !== -1){
      this.setConditionPar(e.key,topic);
    }else if(this.organizationArr.indexOf(e.key) !== -1){
      this.setConditionPar(e.key,organization);
    }else if(this.organizationTypeArr.indexOf(e.key) !== -1){
      this.setConditionPar(e.key,organizationType);
    }else if(this.continentArr.indexOf(e.key) !== -1){
      this.setConditionPar(e.key,continent);
    }else{
      alert('There is something wrong in menu')
    }
    const queryPar = this.state.queryPar;
    queryPar.topic = topic.join(',');
    queryPar.organization = organization.join(',');
    queryPar.organization_type = organizationType.join(',');
    queryPar.continent = continent.join(',');
    // console.log(queryPar);
    this.setState({
      queryPar
    })
  }

  public setConditionPar = (par:string,result:any) => {
    const index = result.indexOf(par);
    if( index !== -1){
      result.splice(index,1);
    }else{
      result.push(par);
    }
    return result;
  }

  // init to render condition selector menu (submenu item)
  public addSubMenuItem = (subMenu: ISubMenu) => {
    return (
        <Menu.Item key={subMenu.name} onClick = { this.handleMenuClick}>{subMenu.name}</Menu.Item>                
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
