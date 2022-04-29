import * as React from 'react';
import '../../style/_home.scss';
import {SketchPicker} from 'react-color';
import { BarChartOutlined, createFromIconfontCN, DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined } from '@ant-design/icons';

import {
  Layout,
  Radio,
  Switch,
  Select,
  Tag,
  Button,
  Popover,
  Card,
  Tooltip,
  Checkbox,
} from 'antd';
import WordCloud from '../../assets/charts/WordCloud'

declare const require:any;
const {Option} =  Select;
const { Sider} = Layout;

const Topic =["Agriculture","Biodiversity","Climate","Disaster","Ecosystem","Energy","Geology","Health","Water","Weather"];
const Generation=["Camera","Computer","Paper Scanner"];
const Style=["Chart","Line","Point","Satellite","Scope","Text"];
const generationImg=Generation.map((item:string)=>require("../../assets/img/generation/"+item+".jpg"));
const styleImg=Style.map((item:string)=>require("../../assets/img/style/"+item+".jpg"));
const MyIcon=createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1728748_h9k22gml30j.js', // use some icon from iconfont
});


interface Props { 
  collapsed: boolean;
  callback: (advancedPanel:boolean)=>void;
}

interface State {
    advancedPanel: boolean;
    settingPar: {
        colors: string[];
        generation: string;
        style: string[];
        topic: string[];
    };
    collapsed: boolean;
    color: string;
    isEdit: boolean;
    pickerVisible: boolean;
}

class IntentionExp extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            advancedPanel: false,
            settingPar: {
                colors: ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3'],
                style: ['Line'],
                generation: 'Computer',
                topic: ['Agriculture', 'Biodiversity', "Disaster"],
            },
            collapsed: this.props.collapsed,
            color: '',
            isEdit: false,
            pickerVisible: false,
        };
    }

// public componentWillReceiveProps =()=>{
//   this.setState({
//     collapsed: false,
//   })
// }

public render(){
  return (
    <Sider  collapsible={true} collapsed={this.state.collapsed}   collapsedWidth={10} reverseArrow={true} trigger={null}
            className="main_container_rightsider"  width={'300'}>
      <div style={{display:this.state.collapsed?'none':'inline'}}>
        <div className="main_container_rightsider_head">
          <BarChartOutlined className="icon" />
          <span className="title">Retrieval Intention</span>
          <Switch className="switch" checkedChildren="Save" unCheckedChildren="Edit" onChange={()=>{this.setState({isEdit: !this.state.isEdit})}} />
        </div>
        {this.rightsiderBody()}
          <Button className="advanced_Btn" type="primary" size="large" shape="round"
                  style={{ position:'relative', width: '60%', left: '20%', margin: '10px'}}
                  onClick={()=>{
                      this.props.callback(true)
                      this.setState({advancedPanel: true})
                  }}
          >
              &lt;&lt;&nbsp;Advanced
          </Button>
      </div>
      <div className="main_container_rightsider_trigger" onClick={()=>{this.setState({collapsed: !this.state.collapsed})}}>
          {this.state.collapsed?<DoubleLeftOutlined />:<DoubleRightOutlined />}
      </div>
    </Sider>
  );
  }



public rightsiderBody =()=>{
  // The page cannot be edited
  if(!this.state.isEdit){
    const barWidth=250;
    const barInsideWidth=(barWidth-10)/this.state.settingPar.colors.length;
      return(
         <div className="main_container_rightsider_body">
           <div className="main_container_rightsider_body_list">
             <span className="span">Color:</span><br/>
               <div className="bar" style={{ width: barWidth}}>
                 {this.state.settingPar.colors.map((item:string)=>{
                     return (<div key={item} className="barInside" style={{backgroundColor: item, width: barInsideWidth}}/>)
                 })}   
               </div>
           </div>

           <div className="main_container_rightsider_body_list">
             <span className="span">Keywords:</span><br/>
             <WordCloud/>
           </div>

           <div className="main_container_rightsider_body_list">
             <span className="span">Production:</span><br/>
             <Tag className="tag" color="#1890ff">{this.state.settingPar.generation}</Tag>
           </div>

           <div className="main_container_rightsider_body_list">
             <span className="span">Topic:</span><br/>
             <div className="iconList">
             {this.state.settingPar.topic.length===0?
              <Tag className="tag" color="#1890ff">No Topic</Tag>:
               this.state.settingPar.topic.map((item:string)=>{
               return (                   
                   <Tooltip key={item} title={item}>
                    <MyIcon  className="myIcon" type={"icon-"+item}/>
                  </Tooltip>
             )})}
             </div>
           </div>

           <div className="main_container_rightsider_body_list">
             <span className="span">Style:</span><br/>
             {this.state.settingPar.style.length===0?
              <Tag className="tag" color="#1890ff">No Style</Tag>:
              this.state.settingPar.style.map((item:string)=>{
               return (
                 <Card className="card" key={item} cover={<img src={styleImg[Style.indexOf(item)]}/>}
                        bodyStyle={{fontSize:15, textAlign: "center", padding: 2}}>
                   {item}
                 </Card> 
             )})}
           </div>

           {/* <div className="main_container_rightsider_body_list">
             <span className="span">Shape:</span><br/>
             
           </div> */}

         </div>
    )
  }

  else{
    // The page can be edited
    return (
      <div className="main_container_rightsider_body">
       <div className="main_container_rightsider_body_setting">
         <span className="span">Color:</span>
         <Popover  trigger="click"  arrowPointAtCenter={true} 
           visible={this.state.pickerVisible}  onVisibleChange={(visible:boolean)=>{this.setState({pickerVisible: visible})}}
           content={
            <div > 
             <SketchPicker color={this.state.color} onChange={(color:any)=>{this.setState({color: color.hex})}}/>
             <Button className="okBtn" size="small"  type="primary" onClick={()=>{this.handleComfirmColor(this.state.color)}}>OK</Button> 
             <Button className="cancelBtn"  size="small"  onClick={()=>{this.setState({pickerVisible: !this.state.pickerVisible,color:''})}}>Cancel</Button>
            </div>}>
           <Button className="newColorBtn" icon={<PlusOutlined />}  size="small" style={{background: this.state.color}}
                   onClick={()=>{this.setState({pickerVisible: !this.state.pickerVisible})}}>New Color</Button><br/>
         </Popover>
         <div className="bar"> 
           {this.state.settingPar.colors.map((item:string)=>{
             return (<Tag key={item} closable={true} onClose={()=>this.handleCloseTag(item)} color={item}>{item}</Tag>)
           })}
         </div>
      </div>

      <div className="main_container_rightsider_body_setting">
         <span className="span">Production:</span><br/>
         <Radio.Group className="radioGroup" value={this.state.settingPar.generation} onChange={this.onSourceChange}>
           {Generation.map((item:string,index:number)=>{
            return (    
              <Popover key={item} placement="top"
                  content={<Card cover={<img src={generationImg[index]}/>} bodyStyle={{padding: 2, textAlign:"center"}}>{item+" Example"}</Card>}>     
                 <Radio className="radioBtn" value={item}>
                     {item}
                 </Radio><br/>
               </Popover>
            )})}
         </Radio.Group>
      </div>
      
      <div className="main_container_rightsider_body_setting">
          <span className="span">Topic:</span><br/>  
              <Select mode="multiple" className="select" defaultValue={this.state.settingPar.topic} optionLabelProp="label"
                 placeholder="Select a Topic" onChange={this.onTopicChange}>
                {Topic.map((item:string)=>{
                   return(
                     <Option key={item} label={<MyIcon style={{fontSize:20, marginRight:3}} type={"icon-"+item}/>} value={item} style={{fontSize:16}}>
                     <MyIcon style={{fontSize:25, marginRight:5}} type={"icon-"+item}/>{item}
                     </Option>)
                })}
              </Select>
      </div>

      
      <div className="main_container_rightsider_body_setting">
         <span className="span">Style:</span><br/>
         
          <Checkbox.Group className="checkboxGroup" defaultValue={this.state.settingPar.style} onChange={this.onStyleChange}>
           {Style.map((item:string,index:number)=>{
            return (    
              <Checkbox key={item} className="checkbox" value={item}>                    
                <Card className="card" cover={<img src={styleImg[index]}/>} bodyStyle={{padding: 2, textAlign:"center", fontWeight: "bold"}}>{item}</Card>                   
              </Checkbox>            
            )})}
         </Checkbox.Group>
      </div>
      {/* <div className="main_container_rightsider_body_setting">
         <span className="span">Shape:</span><br/>
         
      </div> */}
    </div>
    );}
}


// close color tag
public handleCloseTag = (removedTag:string)=>{
  const self=this.state.settingPar;
  const tags=this.state.settingPar.colors.filter(tag=>tag!==removedTag);
  self.colors=tags;
  this.setState({
    settingPar: self
  })
}

// comfirm selected color
public handleComfirmColor = (color:string)=>{
  const self=this.state.settingPar;
  if (self.colors.indexOf(color)===-1){
    self.colors.push(color);
  }
  this.setState({
    settingPar: self,
    pickerVisible: !this.state.pickerVisible,
    color: ''
  })
}

// handle change of topic selection
public onTopicChange =(value:string[])=>{
  const self=this.state.settingPar;
  self.topic=value;
  this.setState({
    settingPar:self,
  })
}

// handle change of generation selection
public onSourceChange = (e:any) =>{
  const self=this.state.settingPar;
  self.generation=e.target.value;
  this.setState({
    settingPar:self,
  })
}

// handle change of style selection
public onStyleChange = (value:string[]) =>{
    const self=this.state.settingPar;
    self.style=value;
    this.setState({
      settingPar:self,
    })
}

}

export default IntentionExp;