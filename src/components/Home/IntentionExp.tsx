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
import '../../style/_rightSider.scss';
import {createFromIconfontCN, DoubleLeftOutlined, DoubleRightOutlined,  DownOutlined, BarChartOutlined, EditFilled} from '@ant-design/icons';
import {Layout, Tag, Card, Tooltip, Tree, Progress, Tabs, Button, Select, Input, message,} from 'antd';
// import { MapContainer, Popup, Marker, TileLayer } from 'react-leaflet'

import { ISubIntent } from '../../util/interface'
import rawData from "../../assets/data/intentionResult2022.2.23.json";

// import res from "../../assets/data/intentionResult2022.2.23.json";
const { Option } = Select;
// import "node_modules/leaflet/dist/leaflet.css"
// import "node_modules/leaflet/dist/leaflet.js"
declare const require: any;
const { Sider } = Layout;


const Topic = ["Agriculture", "Biodiversity", "Climate", "Disaster", "Ecosystem", "Energy", "Geology", "Health", "Water", "Weather"];
const Style=["Point symbol method","Line symbol method","Area method","Quality base method","Choloplethic method","Others"]
const styleImg = Style.map((item: string) => require("../../assets/img/style/" + item + ".png"));
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1728748_42yz4wxteli.js', // use some icon from iconfont
});

// const Generation = ["Camera", "Computer", "Paper Scanner"];
// const generationImg = Generation.map((item: string) => require("../../assets/img/generation/" + item + ".jpg"));

interface Props {
    collapsed: boolean;
    callback: (advancedPanel:boolean)=>void;
}

interface State {
    setintent1: {
        colors: string[];
        Map: string;
        style: string[];
        topic: string[];
    };
    setintent2: {
        colors: string[];
        Map: string;
        style: string[];
        topic: string[];
    };
    collapsed: boolean;
    color: string;
    pickerVisible: boolean;

    activeTabKey: string;


    advancedPanel: boolean;
    intent: ISubIntent[];
    confidence: number[];
    isTopicEdit: boolean,
    isStyleEdit: boolean,
    isContentEdit: boolean,
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

const buildTreeData=()=>{
    const labelColor=['#D9D9D9','#FFF2CC','#C4D9EE','#D7CAE4','#C5E0B2','#F2C2A5']
    const iconColor=['#B0B0B0', '#F4CA5E', '#9BC1E1', '#C39EE2','#A9D18E' ,'#F0A573']
    const intent=rawData.result[0].intention

    const intentLen=intent.length
    const treeDate: Node[]=[];
    treeDate[0]= new Node();
    for(let i=0;i<intentLen;i++){
        const subIntent=new Node()
        subIntent.class='Sub-Intention'
        subIntent.key='0-0-'+i.toString()
        subIntent.title=<Tag className='label' color={labelColor[1]}>{'Sub-Intention-'+i.toString()}</Tag>
        subIntent.icon=<MyIcon className='myIcon' type={'icon-subIntent'} style={{background:iconColor[1]}}/>
        let j=0
        for (const key in intent[i]){
            if(intent[i][key]!=='null' && key!=='confidence'){
                const tmp=new Node()
                tmp.key=subIntent.key+'-'+j.toString()

                if(key==='content') {
                    tmp.class='Content'
                    tmp.icon=<MyIcon className='myIcon' type={'icon-content'} style={{background:iconColor[2]}}/>
                    tmp.title=<Tag className='label' color={labelColor[2]}>
                        {intent[i][key].slice(intent[i][key].lastIndexOf('/')+1,intent[i][key].length)}
                    </Tag>
                }
                else if(key==='location') {
                    tmp.class='Location'
                    tmp.icon=<MyIcon className='myIcon' type={'icon-location'} style={{background: iconColor[3]}}/>
                    tmp.title=<Tag className='label' color={labelColor[3]}>{intent[i][key]}</Tag>
                }
                else if(key==='style') {
                    tmp.class='Style'
                    tmp.icon=<MyIcon className='myIcon' type={'icon-style'} style={{background: iconColor[4]}}/>
                    tmp.title=<Tag className='label' color={labelColor[4]}>{intent[i][key]}</Tag>
                }
                else if(key==='topic') {
                    tmp.class='Topic'
                    tmp.icon=<MyIcon className='myIcon' type={'icon-topic'} style={{background: iconColor[5]}}/>
                    tmp.title=<Tag className='label' color={labelColor[5]}>{intent[i][key]}</Tag>
                }
                j++
                subIntent.children.push(tmp)
            }
        }
        treeDate[0].children.push(subIntent)
    }
    return treeDate
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

    constructor(props: Props) {
        super(props);

        const selfConfidence:number[]=[]
        rawData.result[0].intention.map((val:ISubIntent)=>{
            selfConfidence.push(val.confidence)
        })
        selfConfidence.push(rawData.result[0].confidence)

        this.state = {
            setintent1: {
                colors: ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3'],
                style: ['Line'],
                Map: 'Soil Map',
                topic: ['Water'],
            },
            setintent2: {
                colors: ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3'],
                style: ['Line'],
                Map: 'Water Map',
                topic: ['Water'],
            },
            collapsed: this.props.collapsed,
            color: '',
            pickerVisible: false,
            activeTabKey: "0-0",



            advancedPanel: false,
            intent: rawData.result[0].intention,
            confidence: selfConfidence,
            isTopicEdit: false,
            isStyleEdit: false,
            isContentEdit: false,

        };
    }

    public componentDidMount() {
        this.SetVal(0, 1)
    }

    public render() {
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
                                    switcherIcon={<DownOutlined />}
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
                                    {(this.state.confidence[this.state.confidence.length-1]).toFixed(2)}
                                </div>
                                <Progress className="progress"  status='active' showInfo={true}
                                          percent={Math.round(this.state.confidence[this.state.confidence.length-1]*100)}
                                         />
                            </div>
                            {/*{this.renderIntentionTree()}*/}
                        </Tabs.TabPane>
                        {/*{this.state.intent.map((item, index) => {*/}
                        {/*    return this.renderSubIntention(item, index)*/}
                        {/*})}*/}

                    </Tabs>
                    <Button className="advanced_Btn" type="primary" size="large" shape="round"
                            style={{position: 'relative', width: '60%', left: '20%', margin: '10px'}}
                            onClick={() => {
                                this.props.callback(true)
                                this.setState({advancedPanel: true})
                            }}
                    >
                        &lt;&lt;&nbsp;Advanced
                    </Button>
                    </div>
                </div>

                <div className="main_container_rightsider_trigger" onClick={() => {
                    this.setState({collapsed: !this.state.collapsed})
                }}>
                    {this.state.collapsed ? <DoubleLeftOutlined/> : <DoubleRightOutlined/>}
                </div>
            </Sider>
        );
    }

    public generateIntentDes=(val:ISubIntent,index:number)=>{
        return(
            <div key={index} style={{margin: '5px 0px'}}>
                A {val.content === 'null' ? '' :
                <span className="tag" style={{background: "#9BC1E1"}}>{val.content.slice(val.content.lastIndexOf('/') + 1, val.content.length)}</span>}
                 Map {val.location === 'null' ? '' :
                <span>  in <span className="tag" style={{background: "#C39EE2"}}> {val.location}</span></span>}
                {val.topic === 'null' ? '' :
                    <span>  with <span className="tag" style={{background: "#F0A573"}}>{val.topic}</span> theme </span>}
                {val.style === 'null' ? '' :
                    <span>  drew by <span className="tag" style={{background: "#A9D18E"}}>{val.style}</span></span>}
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


    // public renderIntentionTree() {
    //
    //     const onSelect = (selectedKeys: React.Key[]) => {
    //
    //         if (selectedKeys[0] === "0-0-0" || selectedKeys[0] === "0-0-1") {
    //             this.setState({ activeTabKey: selectedKeys[0].toString() });
    //         }
    //     };
    //
    //
    //     return (
    //
    //         <>
    //             <div className='main_container_rightsider_body'>
    //                 <Tree
    //                     showLine={false}
    //                     showIcon={true}
    //                     switcherIcon={<DownOutlined />}
    //                     defaultExpandAll={true}
    //                     onSelect={onSelect}
    //                     treeData={buildTreeData()}
    //
    //                 />
    //             </div>
    //
    //             <div className='main_container_rightsider_body_list' >
    //
    //                 <span className='span'> Discription:</span> <br />
    //             </div>
    //             <div className='main_container_rightsider_body'>
    //                 {this.state.intent.map((val:ISubIntent,index:number)=>{
    //                     return this.generateIntentDes(val,index)
    //                 })}
    //
    //                 {/*<Tag className="tag" color="purple"> {(this.state.intent[0].content || ' ').split("/")[4]} Map </Tag>*/}
    //                 {/*<span> in </span>*/}
    //                 {/*<Tag className='tag' color='blue'> {this.state.intent[0].location} </Tag>*/}
    //                 {/*<span> with </span>*/}
    //                 {/*<Tag className='tag' color='orange'> {this.state.intent[0].topic} </Tag>*/}
    //                 {/*<span>Theme drew by </span>*/}
    //                 {/*<Tag className='tag' color='green'> {this.state.intent[0].style} </Tag>*/}
    //                 {/*<span> or </span>*/}
    //                 {/*<Tag className='tag' color='purple'> {(this.state.intent[1].content || ' ').split("/")[4]} Map </Tag>*/}
    //                 {/*<span> with </span>*/}
    //                 {/*<Tag className='tag' color='orange'> {this.state.intent[1].topic} </Tag>*/}
    //                 {/*<span>Theme drew by </span>*/}
    //                 {/*<Tag className='tag' color='green'> {this.state.intent[1].style} </Tag>*/}
    //
    //             </div>
    //             <div className='main_container_rightsider_body_list' >
    //                 <span className='span'>Confidence:
    //                     {(this.state.confidence[this.state.confidence.length-1]).toFixed(2)}
    //                 </span><br />
    //                 <Progress percent={100 * this.state.confidence[this.state.confidence.length-1]}
    //                           status='active' showInfo={true} />
    //             </div>
    //         </>
    //     );
    // }

    public renderSubIntention=(item:ISubIntent,index:number)=>{

        const key='0-0-'+index.toString()
        const mapContent=(item.content==='null'?'No Intention in the Content Dimension':
            item.content.slice(item.content.lastIndexOf('/')+1,item.content.length)+'Map')
        // const mapLocation=(item.location==='null'?'No Intention in the Location Dimension':item.location+' Map')
        const mapTopic=(item.topic==='null'?'No Intention in the Topic Dimension':item.topic)
        const mapStyle=(item.style==='null'?'No Intention in the Style Dimension':item.style)
        return(
            <Tabs.TabPane tab="Sub-intention" key={key} >
                <div className="rightSider_subIntention_content">
                    <span className="span">Map Element:</span>
                    <Tooltip title='Edit'>
                        <Button className="okBtn" size="large" type="text" icon={<EditFilled/>}
                                onClick={() => this.setState({isContentEdit: !this.state.isContentEdit})}/>
                    </Tooltip>
                    <div>
                        {
                            this.state.isContentEdit ?
                                <Input style={{width: '100%'}} defaultValue={mapContent}
                                       onChange={(value) => this.onElementChange(value,index)}/>
                                :
                                <Tag className="tag" color='blue'> {mapContent} </Tag>
                        }
                    </div>
                </div>

                <div className="rightSider_subIntention_topic">
                    <span className="span">Topic:</span>
                    <Tooltip title='Edit'>
                        <Button className="okBtn" size="large" type="text" icon={<EditFilled />}
                                onClick={() => this.setState({ isTopicEdit: !this.state.isTopicEdit })} />
                    </Tooltip>
                    <div >
                        {this.state.isTopicEdit?
                            <Select className="select" defaultValue={this.state.setintent1.topic}
                                    optionLabelProp="label"
                                    showArrow={true} onChange={this.onTopicChange1} style={{width: '80%'}}>
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
                            mapTopic === 'No Intention in the Topic Dimension' ?
                                mapTopic :
                                <Tooltip title={mapTopic}>
                                    <MyIcon className="myIcon" type={"icon-" + mapTopic}/>
                                </Tooltip>
                        }
                        {/*{*/}
                        {/*    this.state.isTopicEdit ?*/}
                        {/*        <div className="iconList">*/}
                        {/*            {this.state.setintent1.topic.length === 0 ?*/}
                        {/*                 'No Intention in the Topic Dimension' :*/}
                        {/*                this.state.setintent1.topic.map((item: string) => {*/}
                        {/*                    return (*/}
                        {/*                        <Tooltip key={item} title={item}>*/}
                        {/*                            <MyIcon className="myIcon" type={"icon-" + item} />*/}
                        {/*                        </Tooltip>*/}
                        {/*                    )*/}
                        {/*                })}*/}
                        {/*        </div> :*/}
                        {/*        <Select  className="select" defaultValue={this.state.setintent1.topic} optionLabelProp="label"*/}
                        {/*                 showArrow={true} onChange={this.onTopicChange1} style={{ width: '80%' }}>*/}
                        {/*            {Topic.map((item: string) => {*/}
                        {/*                return (*/}
                        {/*                    <Option key={item} label={<MyIcon style={{ fontSize: 20, marginRight: 3 }} type={"icon-" + item} />} value={item} style={{ fontSize: 16 }}>*/}
                        {/*                        <MyIcon style={{ fontSize: 25, marginRight: 5 }} type={"icon-" + item} />{item}*/}
                        {/*                    </Option>)*/}
                        {/*            })}*/}
                        {/*        </Select>*/}
                        {/*}*/}
                    </div>
                </div>

                <div className="rightSider_subIntention_style">
                    <span className="span">Style:</span>
                    <Tooltip title='Edit'>
                        <Button className="okBtn" size="large" type="text" icon={<EditFilled />}
                                onClick={() => this.setState({ isStyleEdit: !this.state.isStyleEdit })} />
                    </Tooltip>
                    <div >
                        {
                            this.state.isStyleEdit?
                                <Select className="select" defaultValue={this.state.setintent1.style} optionLabelProp="label"
                                        showArrow={true}
                                        onChange={(value)=>this.onStyleChange1} style={{ width: '100%' }}>
                                    {Style.map((item: string) => {
                                        return (
                                            <Option key={item} label={<Tag color="#1890ff" > {item} </Tag>} value={item} style={{ fontSize: 16 }}>
                                                <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]} />}
                                                      bodyStyle={{ fontSize: 15, textAlign: "center", padding: 2 }} />{item}
                                            </Option>)
                                    })}
                                </Select>
                                :
                                mapStyle === 'No Intention in the Topic Dimension' ?
                                    mapStyle :
                                    <Tooltip title={mapStyle}>
                                        <Card className="card"  cover={<img src={styleImg[Style.indexOf(mapStyle)]} />}
                                              bodyStyle={{ fontSize: 15, textAlign: "center", padding: 2 }} />
                                    </Tooltip>

                        }

                        {/*{*/}
                        {/*    this.state.isStyleEdit ?*/}
                        {/*        this.state.setintent1.style.length === 0 ?*/}
                        {/*            <Tag className="tag" color="#1890ff">No Style</Tag> :*/}
                        {/*            this.state.setintent1.style.map((item: string) => {*/}
                        {/*                return (*/}
                        {/*                    <Tooltip key={item} title={item}>*/}
                        {/*                        <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]} />}*/}
                        {/*                              bodyStyle={{ fontSize: 15, textAlign: "center", padding: 2 }} />*/}
                        {/*                    </Tooltip>*/}
                        {/*                )*/}
                        {/*            })*/}
                        {/*        :*/}
                        {/*        <Select className="select" defaultValue={this.state.setintent1.style} optionLabelProp="label"*/}
                        {/*                showArrow={true} onChange={this.onStyleChange1} style={{ width: '100%' }}>*/}
                        {/*            {Style.map((item: string) => {*/}
                        {/*                return (*/}
                        {/*                    <Option key={item} label={<Tag color="#1890ff" > {item} </Tag>} value={item} style={{ fontSize: 16 }}>*/}
                        {/*                        <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]} />}*/}
                        {/*                              bodyStyle={{ fontSize: 15, textAlign: "center", padding: 2 }} />{item}*/}
                        {/*                    </Option>)*/}
                        {/*            })}*/}
                        {/*        </Select>*/}
                        {/*}*/}
                    </div>
                </div>
                <div className="rightSider_subIntention_location">
                    <span className="span">Location: </span><br />

                </div >
            </Tabs.TabPane>
        )
    }

    // public rightsiderBody = () => {
    //
    //     return (
    //         <div className="main_container_rightsider_body">
    //
    //             <div className='main_container_rightsider_head'>
    //                 <BarChartOutlined className="icon" />
    //                 <span className="title">Retrieval Intention</span>
    //             </div>
    //             <Tabs defaultActiveKey="1" size='small' activeKey={this.state.activeTabKey} onChange={(activeKey) => { this.setState({ activeTabKey: activeKey }) }}>
    //                 <Tabs.TabPane tab="Intention" key="0-0">
    //                     {this.Intention_Demo()}
    //                 </Tabs.TabPane>
    //                 {this.state.intent.map((item,index)=>{
    //                     return this.renderSubIntention(item,index)
    //                 })}
    //                 {/*<Tabs.TabPane tab="Sub-intention" key="0-0-0" >*/}
    //                 {/*    <div className="main_container_rightsider_body_list" >*/}
    //
    //                 {/*        <span className="span">Map Element:</span>*/}
    //                 {/*        <Tooltip title='Edit'>*/}
    //                 {/*            <Button className="okBtn" size="large" type="text" icon={<EditFilled />} onClick={() => this.setState({ iselementChange: !this.state.iselementChange })} />*/}
    //                 {/*        </Tooltip>*/}
    //                 {/*        <div className='main_container_rightsider_body_list'>*/}
    //                 {/*            {*/}
    //                 {/*                this.state.iselementChange ?*/}
    //                 {/*                    <Tag className="tag" color='blue'> {this.state.setintent1.Map} Map </Tag>*/}
    //                 {/*                    :*/}
    //                 {/*                    <Input style={{ width: 'calc(100% - 200px)' }} defaultValue={this.state.setintent1.Map} onChange={(value) => this.onElementChange1(value)} />*/}
    //                 {/*            }*/}
    //                 {/*        </div>*/}
    //
    //                 {/*    </div>*/}
    //
    //                 {/*    <div className="main_container_rightsider_body_list">*/}
    //                 {/*        <span className="span">Topic:</span>*/}
    //                 {/*        <Tooltip title='Edit'>*/}
    //                 {/*            <Button className="okBtn" size="large" type="text" icon={<EditFilled />} onClick={() => this.setState({ istopicChange: !this.state.istopicChange })} />*/}
    //                 {/*        </Tooltip>*/}
    //                 {/*        <div className='main_container_rightsider_body_list'>*/}
    //                 {/*            {*/}
    //                 {/*                this.state.istopicChange ?*/}
    //                 {/*                    <div className="iconList">*/}
    //                 {/*                        {this.state.setintent1.topic.length === 0 ?*/}
    //                 {/*                            <Tag className="tag" color="#1890ff">No Topic</Tag> :*/}
    //                 {/*                            this.state.setintent1.topic.map((item: string) => {*/}
    //                 {/*                                return (*/}
    //                 {/*                                    <Tooltip key={item} title={item}>*/}
    //                 {/*                                        <MyIcon className="myIcon" type={"icon-" + item} />*/}
    //                 {/*                                    </Tooltip>*/}
    //                 {/*                                )*/}
    //                 {/*                            })}*/}
    //                 {/*                    </div> :*/}
    //                 {/*                    <Select mode="multiple" className="select" defaultValue={this.state.setintent1.topic} optionLabelProp="label"*/}
    //                 {/*                            showArrow={true} onChange={this.onTopicChange1} style={{ width: '80%' }}>*/}
    //                 {/*                        {Topic.map((item: string) => {*/}
    //                 {/*                            return (*/}
    //                 {/*                                <Option key={item} label={<MyIcon style={{ fontSize: 20, marginRight: 3 }} type={"icon-" + item} />} value={item} style={{ fontSize: 16 }}>*/}
    //                 {/*                                    <MyIcon style={{ fontSize: 25, marginRight: 5 }} type={"icon-" + item} />{item}*/}
    //                 {/*                                </Option>)*/}
    //                 {/*                        })}*/}
    //                 {/*                    </Select>*/}
    //                 {/*            }*/}
    //                 {/*        </div>*/}
    //                 {/*    </div>*/}
    //
    //                 {/*    <div className="main_container_rightsider_body_list">*/}
    //                 {/*        <span className="span">Style:</span>*/}
    //                 {/*        <Tooltip title='Edit'>*/}
    //                 {/*            <Button className="okBtn" size="large" type="text" icon={<EditFilled />} onClick={() => this.setState({ isstyleChange: !this.state.isstyleChange })} />*/}
    //                 {/*        </Tooltip>*/}
    //                 {/*        <div className='main_container_rightsider_body_list'>*/}
    //                 {/*            {*/}
    //                 {/*                this.state.isstyleChange ?*/}
    //                 {/*                    this.state.setintent1.style.length === 0 ?*/}
    //                 {/*                        <Tag className="tag" color="#1890ff">No Style</Tag> :*/}
    //                 {/*                        this.state.setintent1.style.map((item: string) => {*/}
    //                 {/*                            return (*/}
    //                 {/*                                <Tooltip key={item} title={item}>*/}
    //                 {/*                                    <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]} />}*/}
    //                 {/*                                          bodyStyle={{ fontSize: 15, textAlign: "center", padding: 2 }} />*/}
    //                 {/*                                </Tooltip>*/}
    //                 {/*                            )*/}
    //                 {/*                        })*/}
    //                 {/*                    :*/}
    //                 {/*                    <Select mode="tags" className="select" defaultValue={this.state.setintent1.style} optionLabelProp="label"*/}
    //                 {/*                            showArrow={true} onChange={this.onStyleChange1} style={{ width: '100%' }}>*/}
    //                 {/*                        {Style.map((item: string) => {*/}
    //                 {/*                            return (*/}
    //                 {/*                                <Option key={item} label={<Tag color="#1890ff" > {item} </Tag>} value={item} style={{ fontSize: 16 }}>*/}
    //                 {/*                                    <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]} />}*/}
    //                 {/*                                          bodyStyle={{ fontSize: 15, textAlign: "center", padding: 2 }} />{item}*/}
    //                 {/*                                </Option>)*/}
    //                 {/*                        })}*/}
    //                 {/*                    </Select>*/}
    //                 {/*            }*/}
    //                 {/*        </div>*/}
    //                 {/*    </div>*/}
    //                 {/*    <div className="main_container_rightsider_body_list">*/}
    //                 {/*        <span className="span">Location: </span><br />*/}
    //
    //                 {/*    </div >*/}
    //                 {/*</Tabs.TabPane>*/}
    //                 {/*<Tabs.TabPane tab="Sub-intention Ⅱ" key="0-0-1">*/}
    //                 {/*    <div className="main_container_rightsider_body_list" >*/}
    //
    //                 {/*        <span className="span">Map Element:</span>*/}
    //                 {/*        <Tooltip title='Edit'>*/}
    //                 {/*            <Button className="okBtn" size="large" type="text" icon={<EditFilled />}onClick={()=>this.setState({iselementChange:!this.state.iselementChange})}/>*/}
    //                 {/*        </Tooltip>*/}
    //                 {/*        <div className='main_container_rightsider_body_list'>*/}
    //                 {/*            {*/}
    //                 {/*                this.state.iselementChange ?*/}
    //                 {/*                    <Tag className="tag" color='blue'> {this.state.setintent2.Map} Map </Tag>*/}
    //                 {/*                    :*/}
    //                 {/*                    <Input style={{ width: 'calc(100% - 200px)' }} defaultValue={this.state.setintent2.Map} onChange={(value) => this.onElementChange2(value)} />*/}
    //                 {/*            }*/}
    //                 {/*        </div>*/}
    //                 {/*    </div>*/}
    //
    //                 {/*    <div className="main_container_rightsider_body_list">*/}
    //
    //                 {/*        <span className="span">Topic:  </span>*/}
    //                 {/*        <Tooltip title='Edit'>*/}
    //
    //                 {/*            <Button className="okBtn" size="large" type="text" icon={<EditFilled />} onClick={() => this.setState({ istopicChange: !this.state.istopicChange })} />*/}
    //                 {/*        </Tooltip>*/}
    //                 {/*        <div className='main_container_rightsider_body_list'>*/}
    //                 {/*            {*/}
    //                 {/*                this.state.istopicChange ?*/}
    //                 {/*                    <div className="iconList">*/}
    //                 {/*                        {this.state.setintent2.topic.length === 0 ?*/}
    //                 {/*                            <Tag className="tag" color="#1890ff">No Topic</Tag> :*/}
    //                 {/*                            this.state.setintent2.topic.map((item: string) => {*/}
    //                 {/*                                return (*/}
    //                 {/*                                    <Tooltip key={item} title={item}>*/}
    //                 {/*                                        <MyIcon className="myIcon" type={"icon-" + item} />*/}
    //                 {/*                                    </Tooltip>*/}
    //                 {/*                                )*/}
    //                 {/*                            })}*/}
    //                 {/*                    </div> :*/}
    //                 {/*                    <Select mode="multiple" className="select" defaultValue={this.state.setintent2.topic} optionLabelProp="label"*/}
    //                 {/*                            placeholder="Select a Topic" onChange={this.onTopicChange2} style={{ width: '80%' }}>*/}
    //                 {/*                        {Topic.map((item: string) => {*/}
    //                 {/*                            return (*/}
    //                 {/*                                <Option key={item} label={<MyIcon style={{ fontSize: 20, marginRight: 3 }} type={"icon-" + item} />} value={item} style={{ fontSize: 16 }}>*/}
    //                 {/*                                    <MyIcon style={{ fontSize: 25, marginRight: 5 }} type={"icon-" + item} />{item}*/}
    //                 {/*                                </Option>)*/}
    //                 {/*                        })}*/}
    //                 {/*                    </Select>*/}
    //                 {/*            }*/}
    //                 {/*        </div>*/}
    //                 {/*    </div>*/}
    //
    //                 {/*    <div className="main_container_rightsider_body_list">*/}
    //                 {/*        <span className="span">Style:</span>*/}
    //                 {/*        <Tooltip title='Edit'>*/}
    //                 {/*            <Button className="okBtn" size="large" type="text" icon={<EditFilled />} onClick={() => this.setState({ isstyleChange: !this.state.isstyleChange })} />*/}
    //                 {/*        </Tooltip>*/}
    //                 {/*        <div className='main_container_rightsider_body_list'>*/}
    //                 {/*            {*/}
    //                 {/*                this.state.isstyleChange ?*/}
    //                 {/*                    this.state.setintent2.style.length === 0 ?*/}
    //                 {/*                        <Tag className="tag" color="#1890ff">No Style</Tag> :*/}
    //                 {/*                        this.state.setintent2.style.map((item: string) => {*/}
    //                 {/*                            return (*/}
    //                 {/*                                <Tooltip key={item} title={item}>*/}
    //                 {/*                                    <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]} />}*/}
    //                 {/*                                          bodyStyle={{ fontSize: 15, textAlign: "center", padding: 2 }} />*/}
    //                 {/*                                </Tooltip>*/}
    //                 {/*                            )*/}
    //                 {/*                        })*/}
    //                 {/*                    :*/}
    //                 {/*                    <Select mode="tags" className="select" defaultValue={this.state.setintent2.style} optionLabelProp="label"*/}
    //                 {/*                            placeholder="Select a Style" onChange={this.onStyleChange2} style={{ width: '100%' }}>*/}
    //                 {/*                        {Style.map((item: string) => {*/}
    //                 {/*                            return (*/}
    //                 {/*                                <Option key={item} label={<Tag color="#1890ff" > {item} </Tag>} value={item} style={{ fontSize: 16 }}>*/}
    //                 {/*                                    <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]} />}*/}
    //                 {/*                                          bodyStyle={{ fontSize: 15, textAlign: "center", padding: 2 }} />{item}*/}
    //                 {/*                                </Option>)*/}
    //                 {/*                        })}*/}
    //                 {/*                    </Select>*/}
    //                 {/*            }*/}
    //                 {/*        </div>*/}
    //
    //                 {/*    </div>*/}
    //                 {/*    <div className="main_container_rightsider_body_list">*/}
    //                 {/*        <span className="span">Location: </span><br />*/}
    //                 {/*        /!* {this.makemap()} *!/*/}
    //                 {/*    </div >*/}
    //                 {/*</Tabs.TabPane>*/}
    //             </Tabs>
    //
    //         </div>
    //     )
    // }

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
    // close color tag

    public SetVal = (key1: any, key2: any) => {
        const self = this.state.setintent1;
        const self2 = this.state.setintent2;
        self.colors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3'];
        self.Map = (this.state.intent[key1].content || ' ').split("/")[4];
        self.style = [this.state.intent[key1].style];
        self.topic = [this.state.intent[key1].topic];
        self2.colors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3'];
        self2.Map = (this.state.intent[key2].content || ' ').split("/")[4];
        self2.style = [this.state.intent[key2].style];
        self2.topic = [this.state.intent[key2].topic];
        this.setState(
            {
                setintent1: self,
                setintent2: self2,
            }
        )
    }

    public onElementChange=(value:any,index:number)=>{
        console.log(value)
        const selfIntent=this.state.intent
        selfIntent[index]['content']=value
        this.setState({
            intent:selfIntent
        })
    }

    public onElementChange1 = (value: any) => {
        const self = this.state.setintent1;
        self.Map = value;
        this.setState({
            setintent1: self,
        })
    }

    public onElementChange2 = (value: any) => {
        const self = this.state.setintent2;
        self.Map = value;
        this.setState({
            setintent1: self,
        })
    }

    // handle change of topic selection
    public onTopicChange=(value:any,index:number)=>{
        const self=this.state.intent
        self[index]['topic']=value
        this.setState({
            intent:self
        })
    }

    public onTopicChange1 = (value: string[]) => {
        const self = this.state.setintent1;
        self.topic = value;
        this.setState({
            setintent1: self,
        })
    }

    public onTopicChange2 = (value: string[]) => {
        const self = this.state.setintent2;
        self.topic = value;
        this.setState({
            setintent2: self,
        })
    }

    // handle change of style selection
    public onStyleChange=(value:any,index:number)=>{
        const self=this.state.intent
        self[index]['style']=value
        this.setState({
            intent:self
        })
    }

    public onStyleChange1 = (value: string[]) => {
        const self = this.state.setintent1;
        self.style = value;
        this.setState({
            setintent1: self,
        })
    }
    public onStyleChange2 = (value: string[]) => {
        const self = this.state.setintent2;
        self.style = value;
        this.setState({
            setintent2: self,
        })
    }

}

export default IntentionExp;