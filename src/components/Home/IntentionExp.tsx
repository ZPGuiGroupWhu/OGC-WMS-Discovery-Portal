// import * as React from 'react';
// import '../../style/_home.scss';
// import {SketchPicker} from 'react-color';
// import { BarChartOutlined, createFromIconfontCN, DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined } from '@ant-design/icons';
//
// import {
//   Layout,
//   Radio,
//   Switch,
//   Select,
//   Tag,
//   Button,
//   Popover,
//   Card,
//   Tooltip,
//   Checkbox,
// } from 'antd';
// import WordCloud from '../../assets/charts/WordCloud'
//
// declare const require:any;
// const {Option} =  Select;
// const { Sider} = Layout;
//
// const Topic =["Agriculture","Biodiversity","Climate","Disaster","Ecosystem","Energy","Geology","Health","Water","Weather"];
// const Generation=["Camera","Computer","Paper Scanner"];
// const Style=["Chart","Line","Point","Satellite","Scope","Text"];
// const generationImg=Generation.map((item:string)=>require("../../assets/img/generation/"+item+".jpg"));
// const styleImg=Style.map((item:string)=>require("../../assets/img/style/"+item+".jpg"));
// const MyIcon=createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_1728748_h9k22gml30j.js', // use some icon from iconfont
// });
//
//
// interface Props {
//   collapsed: boolean;
//   callback: (advancedPanel:boolean)=>void;
// }
//
// interface State {
//     advancedPanel: boolean;
//     settingPar: {
//         colors: string[];
//         generation: string;
//         style: string[];
//         topic: string[];
//     };
//     collapsed: boolean;
//     color: string;
//     isEdit: boolean;
//     pickerVisible: boolean;
// }
//
// class IntentionExp extends React.Component<Props,State> {
//     constructor(props: Props) {
//         super(props);
//         this.state = {
//             advancedPanel: false,
//             settingPar: {
//                 colors: ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3'],
//                 style: ['Line'],
//                 generation: 'Computer',
//                 topic: ['Agriculture', 'Biodiversity', "Disaster"],
//             },
//             collapsed: this.props.collapsed,
//             color: '',
//             isEdit: false,
//             pickerVisible: false,
//         };
//     }
//
// // public componentWillReceiveProps =()=>{
// //   this.setState({
// //     collapsed: false,
// //   })
// // }
//
// public render(){
//   return (
//     <Sider  collapsible={true} collapsed={this.state.collapsed}   collapsedWidth={10} reverseArrow={true} trigger={null}
//             className="main_container_rightsider"  width={'300'}>
//       <div style={{display:this.state.collapsed?'none':'inline'}}>
//         <div className="main_container_rightsider_head">
//           <BarChartOutlined className="icon" />
//           <span className="title">Retrieval Intention</span>
//           <Switch className="switch" checkedChildren="Save" unCheckedChildren="Edit" onChange={()=>{this.setState({isEdit: !this.state.isEdit})}} />
//         </div>
//         {this.rightsiderBody()}
//           <Button className="advanced_Btn" type="primary" size="large" shape="round"
//                   style={{ position:'relative', width: '60%', left: '20%', margin: '10px'}}
//                   onClick={()=>{
//                       this.props.callback(true)
//                       this.setState({advancedPanel: true})
//                   }}
//           >
//               &lt;&lt;&nbsp;Advanced
//           </Button>
//       </div>
//       <div className="main_container_rightsider_trigger" onClick={()=>{this.setState({collapsed: !this.state.collapsed})}}>
//           {this.state.collapsed?<DoubleLeftOutlined />:<DoubleRightOutlined />}
//       </div>
//     </Sider>
//   );
//   }
//
//
//
// public rightsiderBody =()=>{
//   // The page cannot be edited
//   if(!this.state.isEdit){
//     const barWidth=250;
//     const barInsideWidth=(barWidth-10)/this.state.settingPar.colors.length;
//       return(
//          <div className="main_container_rightsider_body">
//            <div className="main_container_rightsider_body_list">
//              <span className="span">Color:</span><br/>
//                <div className="bar" style={{ width: barWidth}}>
//                  {this.state.settingPar.colors.map((item:string)=>{
//                      return (<div key={item} className="barInside" style={{backgroundColor: item, width: barInsideWidth}}/>)
//                  })}
//                </div>
//            </div>
//
//            <div className="main_container_rightsider_body_list">
//              <span className="span">Keywords:</span><br/>
//              <WordCloud/>
//            </div>
//
//            <div className="main_container_rightsider_body_list">
//              <span className="span">Production:</span><br/>
//              <Tag className="tag" color="#1890ff">{this.state.settingPar.generation}</Tag>
//            </div>
//
//            <div className="main_container_rightsider_body_list">
//              <span className="span">Topic:</span><br/>
//              <div className="iconList">
//              {this.state.settingPar.topic.length===0?
//               <Tag className="tag" color="#1890ff">No Topic</Tag>:
//                this.state.settingPar.topic.map((item:string)=>{
//                return (
//                    <Tooltip key={item} title={item}>
//                     <MyIcon  className="myIcon" type={"icon-"+item}/>
//                   </Tooltip>
//              )})}
//              </div>
//            </div>
//
//            <div className="main_container_rightsider_body_list">
//              <span className="span">Style:</span><br/>
//              {this.state.settingPar.style.length===0?
//               <Tag className="tag" color="#1890ff">No Style</Tag>:
//               this.state.settingPar.style.map((item:string)=>{
//                return (
//                  <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]}/>}
//                         bodyStyle={{fontSize:15, textAlign: "center", padding: 2}}>
//                    {item}
//                  </Card>
//              )})}
//            </div>
//
//            {/* <div className="main_container_rightsider_body_list">
//              <span className="span">Shape:</span><br/>
//
//            </div> */}
//
//          </div>
//     )
//   }
//
//   else{
//     // The page can be edited
//     return (
//       <div className="main_container_rightsider_body">
//        <div className="main_container_rightsider_body_setting">
//          <span className="span">Color:</span>
//          <Popover  trigger="click"  arrowPointAtCenter={true}
//            visible={this.state.pickerVisible}  onVisibleChange={(visible:boolean)=>{this.setState({pickerVisible: visible})}}
//            content={
//             <div >
//              <SketchPicker color={this.state.color} onChange={(color:any)=>{this.setState({color: color.hex})}}/>
//              <Button className="okBtn" size="small"  type="primary" onClick={()=>{this.handleComfirmColor(this.state.color)}}>OK</Button>
//              <Button className="cancelBtn"  size="small"  onClick={()=>{this.setState({pickerVisible: !this.state.pickerVisible,color:''})}}>Cancel</Button>
//             </div>}>
//            <Button className="newColorBtn" icon={<PlusOutlined />}  size="small" style={{background: this.state.color}}
//                    onClick={()=>{this.setState({pickerVisible: !this.state.pickerVisible})}}>New Color</Button><br/>
//          </Popover>
//          <div className="bar">
//            {this.state.settingPar.colors.map((item:string)=>{
//              return (<Tag key={item} closable={true} onClose={()=>this.handleCloseTag(item)} color={item}>{item}</Tag>)
//            })}
//          </div>
//       </div>
//
//       <div className="main_container_rightsider_body_setting">
//          <span className="span">Production:</span><br/>
//          <Radio.Group className="radioGroup" value={this.state.settingPar.generation} onChange={this.onSourceChange}>
//            {Generation.map((item:string,index:number)=>{
//             return (
//               <Popover key={item} placement="top"
//                   content={<Card cover={<img src={generationImg[index]}/>} bodyStyle={{padding: 2, textAlign:"center"}}>{item+" Example"}</Card>}>
//                  <Radio className="radioBtn" value={item}>
//                      {item}
//                  </Radio><br/>
//                </Popover>
//             )})}
//          </Radio.Group>
//       </div>
//
//       <div className="main_container_rightsider_body_setting">
//           <span className="span">Topic:</span><br/>
//               <Select mode="multiple" className="select" defaultValue={this.state.settingPar.topic} optionLabelProp="label"
//                  placeholder="Select a Topic" onChange={this.onTopicChange}>
//                 {Topic.map((item:string)=>{
//                    return(
//                      <Option key={item} label={<MyIcon style={{fontSize:20, marginRight:3}} type={"icon-"+item}/>} value={item} style={{fontSize:16}}>
//                      <MyIcon style={{fontSize:25, marginRight:5}} type={"icon-"+item}/>{item}
//                      </Option>)
//                 })}
//               </Select>
//       </div>
//
//
//       <div className="main_container_rightsider_body_setting">
//          <span className="span">Style:</span><br/>
//
//           <Checkbox.Group className="checkboxGroup" defaultValue={this.state.settingPar.style} onChange={this.onStyleChange}>
//            {Style.map((item:string,index:number)=>{
//             return (
//               <Checkbox key={item} className="checkbox" value={item}>
//                 <Card className="card" cover={<img src={styleImg[index]}/>} bodyStyle={{padding: 2, textAlign:"center", fontWeight: "bold"}}>{item}</Card>
//               </Checkbox>
//             )})}
//          </Checkbox.Group>
//       </div>
//       {/* <div className="main_container_rightsider_body_setting">
//          <span className="span">Shape:</span><br/>
//
//       </div> */}
//     </div>
//     );}
// }
//
//
// // close color tag
// public handleCloseTag = (removedTag:string)=>{
//   const self=this.state.settingPar;
//   const tags=this.state.settingPar.colors.filter(tag=>tag!==removedTag);
//   self.colors=tags;
//   this.setState({
//     settingPar: self
//   })
// }
//
// // comfirm selected color
// public handleComfirmColor = (color:string)=>{
//   const self=this.state.settingPar;
//   if (self.colors.indexOf(color)===-1){
//     self.colors.push(color);
//   }
//   this.setState({
//     settingPar: self,
//     pickerVisible: !this.state.pickerVisible,
//     color: ''
//   })
// }
//
// // handle change of topic selection
// public onTopicChange =(value:string[])=>{
//   const self=this.state.settingPar;
//   self.topic=value;
//   this.setState({
//     settingPar:self,
//   })
// }
//
// // handle change of generation selection
// public onSourceChange = (e:any) =>{
//   const self=this.state.settingPar;
//   self.generation=e.target.value;
//   this.setState({
//     settingPar:self,
//   })
// }
//
// // handle change of style selection
// public onStyleChange = (value:string[]) =>{
//     const self=this.state.settingPar;
//     self.style=value;
//     this.setState({
//       settingPar:self,
//     })
// }
//
// }
//
// export default IntentionExp;

import * as React from 'react';
import {createFromIconfontCN, DoubleLeftOutlined, DoubleRightOutlined,  DownOutlined, BarChartOutlined, SaveOutlined,
    EditOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {Layout, Tag, Tooltip, Tree, Progress, Tabs, Button, Select, message, Card, Alert, Space, Modal, Cascader} from 'antd';
import { ISubIntent } from '../../util/interface'
import '../../style/_rightSider.scss';
import { connect } from 'react-redux';
import {conveyIntentData} from "../../redux/action";
import * as L from 'leaflet'
import region from "../../assets/data/region.json";
import provinceData from "../../assets/data/province.json"
import countryData from "../../assets/data/country.json"
import continentData from "../../assets/data/continent.json"

// import { MapContainer, Popup, Marker, TileLayer } from 'react-leaflet'
// import "node_modules/leaflet/dist/leaflet.css"
// import "node_modules/leaflet/dist/leaflet.js"
declare const require: any;
const { Sider } = Layout;
const { Option } = Select;


const Topic = ["Agriculture", "Biodiversity", "Climate", "Disaster", "Ecosystem", "Energy", "Geology", "Health", "Water", "Weather"];
const Style=["Point Symbol Method","Line Symbol Method","Area Method","Quality Base Method","Choloplethic Method","Others"]
const styleImg = Style.map((item: string) => require("../../assets/img/style/" + item + ".png"));
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1728748_42yz4wxteli.js', // use some icon from iconfont
});

// const Generation = ["Camera", "Computer", "Paper Scanner"];
// const generationImg = Generation.map((item: string) => require("../../assets/img/generation/" + item + ".jpg"));

interface Props {
    collapsed: boolean;
    advancedPanelCallback: (advancedPanel:boolean)=>void;
    dispatch:(action:any)=>void;
    intentData: object
    rSideCallback:(rSideCollapse:boolean)=>void
}

interface State {
    activeTabKey: string;
    advancedPanel: boolean;
    intent: ISubIntent[];
    collapsed: boolean;
    confidence: number[];
    isTopicEdit: boolean;
    isStyleEdit: boolean;
    isContentEdit: boolean;
    isLocationEdit: boolean;
    newIntent: ISubIntent[];      // 临时存储用户修正的意图维度

    // locSelectValue: string[][];
}

class Node{
    public class: string;
    public icon: JSX.Element;
    public key: string;
    public title: JSX.Element;
    public children: Node[];
    constructor() {
        this.class='Intention'
        this.icon=<MyIcon className='myIcon' type={'icon-intent'} style={{background:'#B0B0B0'}}/>
        this.key='0-0';
        this.title=<Tag className='label' color={'#D9D9D9'}>{'Intention'}</Tag>;
        this.children=[]
    }

}



// treeData example
// const tree = [
//     {
//         title: 'Intention',
//         key: '0-0',
//         icon: <CarryOutOutlined />,
//         children: [
//             {
//                 title: 'Sub-Intention Ⅰ',
//                 key: '0-0-0',
//                 icon: <BulbFilled />,
//                 children: [
//                     {
//                         title: <Tag color='orange' > {IntentinData.result[0].intention[0].topic}</Tag>,
//                         key: '0-0-0-0',
//                         icon: <AppstoreFilled />,
//                     },
//
//                     {
//                         title: <Tag color='purple' > {(IntentinData.result[0].intention[0].content || ' ').split("/")[4]} Map</Tag>,
//                         key: '0-0-0-1',
//                         icon: <DatabaseOutlined />,
//                     },
//
//                     {
//                         title: <Tag color='blue' >{IntentinData.result[0].intention[0].location}</Tag>,
//                         key: '0-0-0-2',
//                         icon: <EnvironmentFilled />,
//                     },
//                     {
//                         title: <Tag color='green' >{IntentinData.result[0].intention[0].style}</Tag>,
//                         key: '0-0-0-3',
//                         icon: <BoxPlotFilled />,
//                     }
//                 ],
//             },
//             {
//                 title: 'Sub-Intention Ⅱ',
//                 key: '0-0-1',
//                 icon: <BulbFilled />,
//                 children: [
//                     {
//                         title: <Tag color='orange' > {IntentinData.result[0].intention[1].topic}</Tag>,
//                         key: '0-0-1-0',
//                         icon: <AppstoreFilled />,
//                     },
//                     {
//                         title: <Tag color='purple' > {(IntentinData.result[0].intention[1].content || ' ').split("/")[4]} Map</Tag>,
//                         key: '0-0-1-1',
//                         icon: <DatabaseOutlined />,
//                     },
//
//                     {
//                         title: <Tag color='blue' >{IntentinData.result[0].intention[1].location}</Tag>,
//                         key: '0-0-1-2',
//                         icon: <EnvironmentFilled />,
//                     },
//                     {
//                         title: <Tag color='green' >{IntentinData.result[0].intention[1].style}</Tag>,
//                         key: '0-0-1-3',
//                         icon: <BoxPlotFilled />,
//                     }
//                 ],
//             }
//
//         ],
//     }
// ];


// tslint:disable-next-line:max-classes-per-file
class IntentionExp extends React.Component<Props, State> {
    public static getDerivedStateFromProps(nextProps:any,preState: any){
        if(nextProps.collapsed!==preState.collapsed ||
            nextProps.intentData.intent!==preState.intent ||
            nextProps.intentData.confidence!==preState.confidence){
            // console.log(nextProps.intentData)

            return{
                collapsed: nextProps.collapsed,
                confidence: nextProps.intentData.confidence,
                intent: nextProps.intentData.intent,
                newIntent: nextProps.intentData.intent
            }
        }
            return null
    }

    public map: L.Map

    constructor(props: Props) {
        super(props);
        this.state = {
            activeTabKey: "0-0",
            advancedPanel: false,
            intent: [],
            collapsed: this.props.collapsed,
            confidence: [],
            isTopicEdit: false,
            isStyleEdit: false,
            isContentEdit: false,
            isLocationEdit: false,
            newIntent:[],   // 临时存储用户修正的意图维度

            // locSelectValue: []
        };
    }


    public componentDidUpdate() {
        this.state.newIntent.map((subIntent:ISubIntent) =>{
            subIntent.location.map((item) => {
                this.drawCanvas(item, 250 ,200, 10)
            })
        })

        if (this.state.isLocationEdit) {
            this.initMap()
        }
    }

    public render() {
        const buildTreeData=()=>{
            const labelColor=['#D9D9D9','#FFF2CC','#C4D9EE','#D7CAE4','#C5E0B2','#F2C2A5']
            const iconColor=['#B0B0B0', '#F4CA5E', '#9BC1E1', '#C39EE2','#A9D18E' ,'#F0A573']
            const intent=this.state.intent

            const intentLen=intent.length
            const treeData: Node[]=[];
            treeData[0]= new Node();
            for(let i=0;i<intentLen;i++){
                const subIntent=new Node()
                subIntent.class='Sub-Intention'
                subIntent.key='0-0-'+i.toString()
                subIntent.title=<Tag className='label' color={labelColor[1]}>{'Sub-Intention-'+i.toString()}</Tag>
                subIntent.icon=<MyIcon className='myIcon' type={'icon-subIntent'} style={{background:iconColor[1]}}/>
                let j=0
                for (const key of Object.keys(intent[i])){
                    for(const val of intent[i][key]){
                        if(key!=='confidence'){
                            const tmp=new Node()
                            tmp.key=subIntent.key+'-'+j.toString()

                            if(key==='content') {
                                tmp.class='Content'
                                tmp.icon=<MyIcon className='myIcon' type={'icon-content'} style={{background:iconColor[2]}}/>
                                tmp.title=<Tag className='label' color={labelColor[2]}>
                                    {val.slice(val.lastIndexOf('/')+1,val.length)}
                                </Tag>
                            }
                            else if(key==='location') {
                                tmp.class='Location'
                                tmp.icon=<MyIcon className='myIcon' type={'icon-location'} style={{background: iconColor[3]}}/>
                                tmp.title=<Tag className='label' color={labelColor[3]}>{val}</Tag>
                            }
                            else if(key==='style') {
                                tmp.class='Style'
                                tmp.icon=<MyIcon className='myIcon' type={'icon-style'} style={{background: iconColor[4]}}/>
                                tmp.title=<Tag className='label' color={labelColor[4]}>{val}</Tag>
                            }
                            else if(key==='topic') {
                                tmp.class='Topic'
                                tmp.icon=<MyIcon className='myIcon' type={'icon-topic'} style={{background: iconColor[5]}}/>
                                tmp.title=<Tag className='label' color={labelColor[5]}>{val}</Tag>
                            }
                            j++
                            subIntent.children.push(tmp)
                        }
                    }
                }
                treeData[0].children.push(subIntent)
            }
            return treeData
        }

        return (
            <Sider collapsible={true} collapsed={this.state.collapsed} collapsedWidth={20} reverseArrow={true}
                   trigger={null} style={{ backgroundColor: 'white',borderLeft: '1px solid #e8e8e8'}}
                   width={'300'}>
                <div style={{display: this.state.collapsed ? 'none' : 'inline'}}>
                    <div className="rightSider">
                        <div className='rightSider_head'>
                            <BarChartOutlined className="icon"/>
                            <span className="title">Retrieval Intention</span>
                        </div>
                        {this.state.intent.length===0?
                            <Alert message='Error' type='error' showIcon={true} closable={true}
                                   description='This part is inaccessible until you submit interesting and annoying layer collections'/>
                            :
                            <div >
                                <Tabs defaultActiveKey="1" size='small' activeKey={this.state.activeTabKey}
                                      onChange={(activeKey) => {
                                          this.setState({activeTabKey: activeKey})
                                      }}>
                                    <Tabs.TabPane tab="Intention" key="0-0">
                                        <div className='rightSider_tree'>
                                            <div className='rightSider_tree_title'>
                                                Intention Tree:
                                            </div>
                                            <Tree
                                                showLine={false}
                                                showIcon={true}
                                                switcherIcon={<DownOutlined/>}
                                                defaultExpandAll={true}
                                                onSelect={this.onTreeSelect}
                                                treeData={buildTreeData()}
                                            />
                                        </div>

                                        <div className='rightSider_description'>
                                            <div className='rightSider_description_title'>
                                                Description:
                                            </div>
                                            <div className="rightSider_description_body">
                                                {this.state.intent.map((val: ISubIntent, index: number) => {
                                                    return this.generateIntentDes(val, index)
                                                })}
                                            </div>
                                        </div>

                                        <div className='rightSider_confidence'>
                                            <div className='rightSider_confidence_title'>
                                                Confidence:&nbsp;&nbsp;
                                                {Math.round((this.state.confidence[this.state.confidence.length - 1])*100)/100}
                                            </div>
                                            <Progress className="progress" status='active' showInfo={true}
                                                      percent={Math.round(this.state.confidence[this.state.confidence.length - 1] * 100)}
                                            />
                                        </div>
                                    </Tabs.TabPane>
                                    {this.state.newIntent.map((item, index) => {
                                        return this.renderSubIntention(item, index)
                                    })}

                                </Tabs>
                                <Space style={{margin:'20px 10px'}} size={36}>
                                    <Button className="advanced_Btn" type="primary"  shape="round"
                                            // disabled={this.state.advancedPanel}
                                            onClick={() => {
                                                this.props.advancedPanelCallback(true)
                                                this.setState({advancedPanel: true})
                                            }}
                                    >
                                        &lt;&lt;&nbsp;Advanced
                                    </Button>
                                    <Button className="advanced_Btn"  shape="round" disabled={true}>
                                        Feedback&nbsp;&gt;&gt;
                                    </Button>
                                </Space>
                            </div>
                        }

                    </div>
                </div>

                <div className="main_container_rightsider_trigger" onClick={() => {
                    this.props.rSideCallback(!this.state.collapsed)
                    // this.setState({collapsed: !this.state.collapsed})
                }}>
                    {this.state.collapsed ? <DoubleLeftOutlined/> : <DoubleRightOutlined/>}
                </div>
            </Sider>
        );
    }

    public generateIntentDes = (val:ISubIntent,index:number)=>{
        let mapContent= ''
        let mapLocation=''
        let mapTopic=''
        let mapStyle=''
        val.content.map((item:string)=>{
            mapContent+=item.slice(item.lastIndexOf('/') + 1, item.length)+', '
        })
        val.location.map((item:string)=>{mapLocation+=item+', '})
        val.topic.map((item:string)=>{mapTopic+=item+', '})
        val.style.map((item:string)=>{mapStyle+=item+', '})
        mapContent=mapContent.slice(0,mapContent.length-2)
        mapLocation=mapLocation.slice(0,mapLocation.length-2)
        mapTopic=mapTopic.slice(0,mapTopic.length-2)
        mapStyle=mapStyle.slice(0,mapStyle.length-2)

        return(
            <div key={index} style={{margin: '5px 0px'}}>
                A {val.content.length === 0 ? '' :
                <span className="tag" style={{background: "#9BC1E1"}}>{mapContent}</span>}
                 Map {val.location.length === 0 ? '' :
                <span>  in <span className="tag" style={{background: "#C39EE2"}}> {mapLocation}</span></span>}
                {val.topic.length === 0 ? '' :
                    <span>  with <span className="tag" style={{background: "#F0A573"}}>{mapTopic}</span> theme </span>}
                {val.style.length === 0 ? '' :
                    <span>  drew by <span className="tag" style={{background: "#A9D18E"}}>{mapStyle}</span></span>}
                {index === this.state.intent.length - 1 ? '.' :
                    <span style={{fontWeight: "bold"}}> OR </span>}
            </div>
        )
    }

    public onTreeSelect=(selectedKeys: React.Key[],e:any)=>{
        // sum the number of hyphen in a string
        const sumHyphen=(s:string)=>{
            let hyphenNum=0
            for(let i=0;i<s.length;i++){
                if(s.charAt(i)==='-'){
                    ++hyphenNum
                }
            }
            return hyphenNum
        }
        // if the node is a sub-Intention, skip to the descriptive tab
        if (sumHyphen(selectedKeys[0].toString()) === 2 ) {
            this.setState({ activeTabKey: selectedKeys[0].toString() });
        }
        // else print information of the node
        message.info(`${e.node.class}: ${e.node.title.props.children}`)
    }

    public renderSubIntention=(val:ISubIntent,index:number)=>{

        const key='0-0-'+index.toString()

        return(
            <Tabs.TabPane tab={"Sub-intention-"+index.toString()} key={key} >
                <div className="rightSider_subIntention_dim">
                    <div className="title">
                        <span >Map Element:</span>
                        <Tooltip title='Edit'>
                            <Button className="Btn" size="large" type="text"
                                    icon={this.state.isContentEdit?<SaveOutlined />:<EditOutlined />}
                                    onClick={this.handleContentChange}/>
                        </Tooltip>
                    </div>

                    <div className="body">
                        {
                            this.state.isContentEdit ?
                                <Select className="select"  mode="tags" placeholder="Input Value on Content"
                                        onChange={(val) => {
                                            const self=this.state.newIntent
                                            self[index]['content']=val
                                            self[index]['confidence']=100
                                            this.setState({
                                                newIntent: self
                                            })
                                        }}
                                        defaultValue={val.content.map((item)=>item.slice(item.lastIndexOf('/') + 1, item.length))}
                                        // value={this.tmpContent.map((item)=>item.slice(item.lastIndexOf('/') + 1, item.length))}
                                        showArrow={true} style={{width: '80%'}} />
                                :
                                val.content.length === 0 ?
                                    'No Intention on Content '
                                    :
                                    val.content.map((item: string) => {
                                        return (
                                            <Tag key={item} style={{fontSize: '16px'}} color='#1890ff'>
                                                {item.slice(item.lastIndexOf('/') + 1, item.length)}
                                            </Tag>
                                        )
                                    })
                        }
                    </div>
                </div>

                <div className="rightSider_subIntention_dim">
                    <div className="title">
                        <span >Topic:</span>
                        <Tooltip title='Edit'>
                            <Button className="Btn" size="large" type="text"
                                    icon={this.state.isTopicEdit ? <SaveOutlined/> : <EditOutlined/>}
                                    onClick={this.handleTopicChange}/>
                        </Tooltip>
                    </div>
                    <div className="body">
                        {this.state.isTopicEdit ?
                            <Select className="select" defaultValue={val.topic} mode="multiple"
                                    onChange={(val:string[]) => {
                                        const self=this.state.newIntent
                                        self[index]['topic']=val
                                        self[index]['confidence']=100
                                        this.setState({
                                            newIntent: self
                                        })
                                    }}
                                    optionLabelProp="label"
                                    showArrow={true} style={{width: '80%'}}>
                                {Topic.map((item: string) => {
                                    return (
                                        <Option key={item} label={<MyIcon style={{fontSize: 20, marginRight: 3}}
                                                                          type={"icon-" + item}/>} value={item}
                                                style={{fontSize: 16}}>
                                            <MyIcon style={{fontSize: 25, marginRight: 5}} type={"icon-" + item}/>{item}
                                        </Option>)
                                })}
                            </Select>
                            :
                            val.topic.length === 0 ?
                                'No Intention on Topic '
                                :
                                val.topic.map((item: string) => {
                                    return (
                                        <Tooltip key={item} title={item}>
                                            <MyIcon style={{fontSize: 28}} className="myIcon" type={"icon-" + item}/>
                                        </Tooltip>
                                    )
                                })
                        }
                    </div>
                </div>

                <div className="rightSider_subIntention_dim">
                    <div className="title">
                        <span>Style:</span>
                        <Tooltip title='Edit'>
                            <Button className="Btn" size="large" type="text"
                                    icon={this.state.isStyleEdit ? <SaveOutlined/> : <EditOutlined/>}
                                    onClick={this.handleStyleChange}/>
                        </Tooltip>
                    </div>
                    <div className="body" style={{marginLeft: '1rem'}}>
                        {
                            this.state.isStyleEdit?
                                <Select mode="multiple" defaultValue={val.style} optionLabelProp="label" showArrow={true}
                                        onChange={(val:string[])=> {
                                            const self=this.state.newIntent
                                            self[index]['style']=val
                                            self[index]['confidence']=100
                                            this.setState({
                                                newIntent: self
                                            })
                                        }} style={{ width: '85%' }}>
                                    {Style.map((item: string) => {
                                        return (
                                            <Option key={item} label={item} value={item}
                                                    style={{ fontSize: 16}}>
                                                <img src={styleImg[Style.indexOf(item)]} style={{float: 'left',width: '100px',height: '60px'}}/>
                                                <div style={{textAlign:'center', padding: '10px 0',whiteSpace:'pre-wrap'}}>{item}</div>
                                            </Option>)
                                    })}
                                </Select>
                                :
                                val.style.length === 0 ?
                                    <div style={{marginLeft: '2rem'}}>No Intention on Style</div>
                                    :
                                    val.style.map((item: string) => {
                                        return (
                                            <Card className="card" key={item}
                                                  cover={<img src={styleImg[Style.indexOf(item)]}/>}
                                                  bodyStyle={{fontSize: 15, textAlign: "center", padding: 2}}
                                                  style={{width: '250px'}}>
                                                {item}
                                            </Card>
                                        )
                                    })

                        }
                    </div>
                </div>

                <div className="rightSider_subIntention_dim">
                    <div className="title">
                        <span>Location: </span>
                        <Tooltip title='Edit'>
                            <Button className="Btn" type="text" size="large"
                                    icon={this.state.isLocationEdit ? <SaveOutlined/> : <EditOutlined/>}
                                    onClick={this.handleLocationChange}/>
                        </Tooltip>
                    </div>
                    <div className = "body" style = {{marginLeft: '1rem'}}>
                        {
                            val.location.length === 0 ? 'No Intention on Location' :
                                val.location.map((item,index) => {
                                    return (
                                        <canvas className = 'canvas' id = {item} key = {index}
                                                width={250} height={200}
                                        >
                                            Your browser does not support the canvas element.
                                        </canvas>
                                    )
                                })
                        }
                    </div>
                    {/*<div className="body">*/}
                    {/*{*/}
                    {/*    this.state.isLocationEdit ?*/}
                    {/*        <Select className="select"  mode="tags" placeholder="Input Value on Location"*/}
                    {/*                onChange={(val) => {*/}
                    {/*                    const self=this.state.newIntent*/}
                    {/*                    self[index]['location']=val*/}
                    {/*                    self[index]['confidence']=100*/}
                    {/*                    this.setState({*/}
                    {/*                        newIntent: self*/}
                    {/*                    })*/}
                    {/*                }}*/}
                    {/*                defaultValue={val.location}*/}
                    {/*            // value={this.tmpContent.map((item)=>item.slice(item.lastIndexOf('/') + 1, item.length))}*/}
                    {/*                showArrow={true} style={{width: '80%'}} />*/}
                    {/*        :*/}
                    {/*        val.location.length === 0 ?*/}
                    {/*            'No Intention on Location '*/}
                    {/*            :*/}
                    {/*            val.location.map((item: string) => {*/}
                    {/*                return (*/}
                    {/*                    <Tag key={item} style={{fontSize: '16px'}} color='#1890ff'>*/}
                    {/*                        {item}*/}
                    {/*                    </Tag>*/}
                    {/*                )*/}
                    {/*            })*/}
                    {/*}*/}
                    {/*</div>*/}
                </div >

                <div className="rightSider_subIntention_dim">
                    <div className="title">
                        <span>
                        Sub-Intention Confidence&nbsp;&nbsp;
                        {Math.round((this.state.confidence[index])*100)/100}
                        </span>
                        {this.state.intent[index]['confidence']===this.state.confidence[index]?
                            null
                            :
                            <Tooltip title='Confidence may be wrong because some dimensions has been changed in this sub-Intention!'
                                     placement="left">
                                <Button className="Btn" type="text" size="large"
                                        icon={<InfoCircleOutlined />}
                                />
                            </Tooltip>
                        }
                    </div>
                    <div className="body" style={{marginLeft:0}}>
                        <Progress className="progress" status='active' showInfo={true}
                                  percent={Math.round(this.state.confidence[index] * 100)}
                        />
                    </div>
                </div>

                <Modal
                    className = "rightSider_subIntention_modal"
                    maskClosable = {false}
                    visible = {this.state.isLocationEdit}
                    onCancel = {() => {this.setState({isLocationEdit: false})}}
                    footer = {null}
                    title = {'Location Edit'}
                    width = {816}
                >
                    <div className = "select_section">
                        <span className = "span">Value： </span>
                        <Cascader
                            className = "cascader"
                            placeholder = 'Please select a region (support multiple)'
                            options = {region}
                            expandTrigger = 'hover'
                            // value = {this.state.locSelectValue}
                            // onChange = {(value:any) => {
                            //     console.log(value);
                            //     this.setState({locSelectValue: value})}}
                            style={{width: '700px'}}
                            fieldNames={{'label': 'value', 'value': 'value', 'children': 'children'}}
                            multiple = {true}
                            defaultValue = {val.location}
                            displayRender = { (label) => {
                                const backgroundColor:string[] = ['#8e44ad', '#27ae60', '#e67e22', '#3498db']
                                const labelStr = label.join('/')
                                const index = labelStr.split('/').length - 1
                                return (
                                    <Tag color = {backgroundColor[index]} >
                                        {labelStr}
                                    </Tag>)
                                }}
                            // tagRender = {(props) => {
                            //     const backgroundColor:string[] = ['#8e44ad', '#27ae60', '#e67e22', '#3498db']
                            //     const index = props.label!.toString().split('/').length - 1
                            //     return (
                            //         <Tag closable = {true} color = {backgroundColor[index]} onClose={(e)=>console.log(e.target)}>
                            //             {props.label!.toString()}
                            //         </Tag>)
                            // }}
                            dropdownMenuColumnStyle = {{width: '150px'}}
                        />
                    </div>
                    <div className = "map" id = "intent_loc_map"/>
                </Modal>
            </Tabs.TabPane>
        )
    }

    // draw canvas in the location
    // Attention: The width and height of canvas are different from css.
    public drawCanvas = (loc: string ,width: number, height: number, padding: number) =>{
        const canvas: HTMLCanvasElement = document.getElementById(loc) as HTMLCanvasElement

        if (canvas) {
            // get geometry

            // const coordinate = [[[1, 5], [3, 7], [2, 2], [1, 5]]]
            // const type = 'Polygon'

            let xMin = Number.MAX_SAFE_INTEGER
            let xMax = Number.MIN_SAFE_INTEGER
            let yMin = Number.MAX_SAFE_INTEGER
            let yMax = Number.MIN_SAFE_INTEGER
            let coordinates = []
            let type = ''
            const administration = [continentData, countryData, provinceData]  // +globe
            for (const unit of administration) {
                for (const feature of unit.features) {
                    const level = feature.properties.level
                    if ( loc === feature.properties['name_' + level.toString()]) {
                        const geometry = feature.geometry
                        coordinates = geometry.coordinates
                        type = geometry.type;
                        [xMin, yMin, xMax, yMax] = feature.bbox
                        break
                    }
                }
                if (coordinates.length) { break }
            }

            const cxt = canvas!.getContext('2d')
            const dWidth = width - padding
            const dHeight = height - padding  // add some white space around the geometry
            const drawPolygon = (polygon: any) =>{
                for (const points of polygon){
                    // define xMin, xMax, yMin, yMax, xCentre, yCentre
                    // let xMin = Number.MAX_SAFE_INTEGER
                    // let xMax = Number.MIN_SAFE_INTEGER
                    // let yMin = Number.MAX_SAFE_INTEGER
                    // let yMax = Number.MIN_SAFE_INTEGER
                    // for (const point of points){
                    //     xMin = Math.min(point[0], xMin)
                    //     xMax = Math.max(point[0], xMax)
                    //     yMin = Math.min(point[1], yMin)
                    //     yMax = Math.max(point[1], yMax)
                    // }
                    const xCentre = (xMax + xMin)/2
                    const yCentre = (yMax + yMin)/2

                    // draw geometry
                    cxt!.beginPath()
                    for (let j = 0; j<points.length; j++){
                        const point = points[j]
                        const x = Number(point[0])
                        const y = Number(point[1])

                        // calculate scroll position
                        const scaleX = (xMax - xMin)/dWidth
                        const scaleY = (yMax - yMin)/dHeight
                        const scale = Math.max(scaleX, scaleY)      // Proportional scaling
                        const xBias = dWidth/2 - (xCentre - xMin)/scale + padding/2
                        const yBias = dHeight/2 - (yCentre - yMin)/scale + padding/2

                        const l = (x - xMin)/scale                 // left: x position in the canvas
                        const t = dHeight - (y - yMin)/scale       // top: y position in the canvas

                        // console.log(l, t)
                        // if (l + xBias < 5 || l + xBias > 245 || t + yBias < 5 || t + yBias > 195){
                        //     console.log(l + xBias, t + yBias)
                        // }
                        // console.log(l + xBias, t + yBias)
                        if (j === 0) {
                            cxt!.moveTo(l + xBias, t + yBias)
                        } else {
                            cxt!.lineTo(l + xBias, t + yBias)
                        }
                    }
                    cxt!.closePath()
                    cxt!.fillStyle = "#dcdde1"
                    cxt!.strokeStyle = "#7f8fa6"
                    cxt!.fill()
                    cxt!.stroke()
                }
            }

            // clear canvas before drawing
            cxt!.clearRect(0, 0, 250, 200)
            // draw canvas
            if (type === 'Polygon') {
                drawPolygon(coordinates)
            } else if (type === 'MultiPolygon') {
                for (const polygon of coordinates) {
                    drawPolygon(polygon)
                }
            }

            // draw text
            cxt!.font = '14px Microsoft Yahei'
            cxt!.textBaseline = 'middle'
            const text = cxt!.measureText(loc)
            const rectWidth = text.width + padding
            cxt!.fillStyle = "#ced6e0"
            cxt!.fillRect(width - rectWidth, 0, rectWidth, 20)
            cxt!.fillStyle = "#57606f"
            cxt!.fillText(loc, width - text.width - padding/2, 10)
        }
    }

    // init map in the location editing modal
    public initMap = () => {
        if (!this.map){
            this.map = L.map('intent_loc_map',{
                zoomSnap: 0.5,              // control zoom minimum unit
                zoomDelta: 0.5,             // control +/- minimum change for zoom
                wheelPxPerZoomLevel: 120    // control minimum change of mouse wheel for zoom
            }).setView([0, 0], 1)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map)

            // distribute color
            const getColor = (d: number) => {
                return d > 1000 ? '#800026' :
                    d > 500  ? '#BD0026' :
                        d > 200  ? '#E31A1C' :
                            d > 100  ? '#FC4E2A' :
                                d > 50   ? '#FD8D3C' :
                                    d > 20   ? '#FEB24C' :
                                        d > 10   ? '#FED976' :
                                            '#FFEDA0';
            }

            // define common style of polygon on the map
            const commonStyle = (feature: any) =>{
                return {
                    fillColor: getColor(feature.properties.layerNum),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }

            // handle mouseover on the polygon
            const highlightFeature = (e:any) => {
                const layer = e.target
                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                })

                if(!L.Browser.ie && !L.Browser.opera && !L.Browser.edge){
                    layer.bringToFront()
                }
                info.update(layer.feature.properties)
            }

            // handle mouseout on the polygon
            const resetHighlight = (e:any) => {
                geojson.resetStyle(e.target)
                info.update()
            }

            // handle click on the polygon
            const zoomToFeature = (e:any) => {
                // e.target.feature.properties.level name_

                // const self: string[][] = this.state.locSelectValue
                // const level: number = e.target.feature.properties.level
                // const selectedValue: string[] = ['Globe']
                // for (let i = 1; i <= level; i++){
                //     selectedValue.push(e.target.feature.properties['name_'+ i.toString()])
                // }
                // self.push(selectedValue)
                // this.setState({
                //     locSelectValue: self
                // })
                //
                // console.log(this.state.locSelectValue)

                this.map.fitBounds(e.target.getBounds())
            }

            // import mouseover, mouseout and click method in the layer
            const onEachFeature = (feature:any, layer: any) =>{
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                })
            }

            // display info on the upper right corner
            // @ts-ignore
            const info = L.control()
            info.onAdd = (map:any) => {
                info._div = L.DomUtil.create('div', 'info')
                info.update();
                return info._div
            }
            info.update = (props:any) => {
                if (props) {
                    const label = (props.level === 1 ? '<h4>Continent: <b>' + props.name_1 + '</b></h4>' :
                        props.level === 2 ? '<h4>Continent: <b>' + props.name_1 + '</b></h4><h4>Country: <b>' + props.name_2 + '</b></h4>' :
                            '<h4>Continent: <b>' + props.name_1 + '</b></h4><h4>Country: <b>' + props.name_2 + '</b></h4><h4>State(Province): <b>' + props.name_3 + '</b></h4>')

                    info._div.innerHTML = label + '<h4>The number of Layers: <b>' + props.layerNum + '</b></h4>'
                } else {
                    info._div.innerHTML = 'Hover over a region'
                }

            }
            info.addTo(this.map)

            // display legend on the lower right corner
            // @ts-ignore
            const legend = L.control({position: 'bottomright'})
            legend.onAdd = () => {
                const div = L.DomUtil.create('div', 'info legend')
                const grades = [0, 10, 20, 50, 100, 200, 500, 1000]

                // loop through our density intervals and generate a label with a colored square for each interval
                for (let i = 0; i < grades.length; i++) {
                    div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i>' + grades[i] +
                        (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
                }
                return div
            }
            legend.addTo(this.map)

            // add geojson in the map
            let geojson = L.geoJSON(continentData,{
                style: commonStyle,
                onEachFeature
            }).addTo(this.map)
            let zoomStart = 1

            this.map.on('zoomstart', (e) => {
                zoomStart = e.target._zoom
            })

            this.map.on('zoomend',(e) => {
                if (this.map.getZoom() <= 2 && zoomStart > 2) {
                    this.map.removeLayer(geojson)
                    geojson = L.geoJSON(continentData,{
                        style: commonStyle,
                        onEachFeature
                    }).addTo(this.map)
                } else if (this.map.getZoom() > 2 && this.map.getZoom() <= 3.5 && (zoomStart <= 2 || zoomStart > 3.5 )) {
                    this.map.removeLayer(geojson)
                    geojson = L.geoJSON(countryData,{
                        style: commonStyle,
                        onEachFeature
                    }).addTo(this.map)
                } else if (this.map.getZoom() > 3.5 && zoomStart <= 3.5) {
                    this.map.removeLayer(geojson)
                    geojson = L.geoJSON(provinceData,{
                        style: commonStyle,
                        onEachFeature
                    }).addTo(this.map)
                }
            })

        }
        else {
            const container = this.map.getContainer()
            console.log(container)
        }
    }

    // handle content change
    public handleContentChange=()=>{
        if(this.state.isContentEdit){
            this.props.dispatch(conveyIntentData({
                ...this.props.intentData,
                intent:this.state.newIntent
            }))
        }

        this.setState({
            isContentEdit: !this.state.isContentEdit
        })
    }

    // handle topic change
    public handleTopicChange=()=>{
        if(this.state.isTopicEdit){
            this.props.dispatch(conveyIntentData({
                ...this.props.intentData,
                intent:this.state.newIntent
            }))
        }

        this.setState({
            isTopicEdit: !this.state.isTopicEdit
        })
    }

    // handle style change
    public handleStyleChange=()=>{
        if(this.state.isStyleEdit){
            this.props.dispatch(conveyIntentData({
                ...this.props.intentData,
                intent:this.state.newIntent
            }))
        }

        this.setState({
            isStyleEdit: !this.state.isStyleEdit
        })
    }

    // handle location change
    public handleLocationChange=()=>{
        if(this.state.isLocationEdit){
            this.props.dispatch(conveyIntentData({
                ...this.props.intentData,
                intent:this.state.newIntent
            }))
        }

        this.setState({
            isLocationEdit: !this.state.isLocationEdit
        })
    }

    // public makemap() {

    //   return (
    //     <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    //       <TileLayer
    //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //       />
    //       <Marker position={[51.505, -0.09]}>
    //         <Popup>
    //           A pretty CSS3 popup. <br /> Easily customizable.
    //         </Popup>
    //       </Marker>
    //     </MapContainer>
    //   )
    // }
}
const mapStateToProps=(state:any)=>{
    return {
        intentData: state.conveyIntentDataReducer
    }
}
export default connect(mapStateToProps)(IntentionExp);