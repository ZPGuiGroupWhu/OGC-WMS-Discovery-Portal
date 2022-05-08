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
import {createFromIconfontCN, DoubleLeftOutlined, DoubleRightOutlined,  DownOutlined, BarChartOutlined, SaveOutlined, EditOutlined} from '@ant-design/icons';
import {Layout, Tag, Tooltip, Tree, Progress, Tabs, Button, Select, message, Card} from 'antd';
import { ISubIntent } from '../../util/interface'
import '../../style/_rightSider.scss';
import { connect } from 'react-redux';
import {conveyIntentData} from "../../redux/action";

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
            return{
                collapsed: nextProps.collapsed,
                confidence: nextProps.intentData.confidence,
                intent: nextProps.intentData.intent,
                newIntent: nextProps.intentData.intent
            }
        }
            return null
    }


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
            newIntent:[]   // 临时存储用户修正的意图维度
        };
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
            <Sider collapsible={true} collapsed={this.state.collapsed} collapsedWidth={10} reverseArrow={true}
                   trigger={null} style={{ backgroundColor: 'white',borderLeft: '1px solid #e8e8e8'}}
                   width={'300'}>
                <div style={{display: this.state.collapsed ? 'none' : 'inline'}}>
                    <div className="rightSider">
                        <div className='rightSider_head'>
                            <BarChartOutlined className="icon"/>
                            <span className="title">Retrieval Intention</span>
                        </div>
                        <div style={{display: this.state.intent.length === 0 ? 'none' : 'block'}}>
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
                            <Button className="advanced_Btn" type="primary" size="large" shape="round"
                                    style={{position: 'relative', width: '60%', left: '20%', margin: '10px'}}
                                    onClick={() => {
                                        this.props.advancedPanelCallback(true)
                                        this.setState({advancedPanel: true})
                                    }}
                            >
                                &lt;&lt;&nbsp;Advanced
                            </Button>
                        </div>
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

    public generateIntentDes=(val:ISubIntent,index:number)=>{
        let mapContent= ''
        let mapLocation=''
        let mapTopic=''
        let mapStyle=''
        val.content.map((item:string)=>{
            mapContent+=item.slice(item.lastIndexOf('/') + 1, item.length)+','
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
        if (selectedKeys[0] === "0-0-0" || selectedKeys[0] === "0-0-1") {
            this.setState({ activeTabKey: selectedKeys[0].toString() });
        }
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
                                    onClick={()=>this.handleContentChange(index)}/>
                        </Tooltip>
                    </div>

                    <div className="body">
                        {
                            this.state.isContentEdit ?
                                <Select className="select"  mode="tags" placeholder="Input Value on Content"
                                        onChange={(val) => {
                                            const self=this.state.newIntent
                                            self[index]['content']=val
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
                                    onClick={() => this.handleTopicChange(index)}/>
                        </Tooltip>
                    </div>
                    <div className="body">
                        {this.state.isTopicEdit ?
                            <Select className="select" defaultValue={val.topic} mode="multiple"
                                    onChange={(val:string[]) => {
                                        const self=this.state.newIntent
                                        self[index]['topic']=val
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
                                    onClick={() => this.handleStyleChange(index)}/>
                        </Tooltip>
                    </div>
                    <div className="body" style={{marginLeft: '1rem'}}>
                        {
                            this.state.isStyleEdit?
                                <Select mode="multiple" defaultValue={val.style} optionLabelProp="label" showArrow={true}
                                        onChange={(val:string[])=> {
                                            const self=this.state.newIntent
                                            self[index]['style']=val
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
                                                  style={{width: '90%'}}>
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
                                    onClick={() => this.setState({isLocationEdit: !this.state.isLocationEdit})}/>
                        </Tooltip>
                    </div>
                </div >
            </Tabs.TabPane>
        )
    }

    // handle content change
    public handleContentChange=(index:number)=>{
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
    public handleTopicChange=(index:number)=>{
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
    public handleStyleChange=(index:number)=>{
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