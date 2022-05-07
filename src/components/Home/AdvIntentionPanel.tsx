import * as React from 'react';

import {ISubIntent} from '../../util/interface'
import {QuestionCircleOutlined, CheckCircleOutlined, FrownOutlined, DownCircleOutlined, UpCircleOutlined} from '@ant-design/icons';
import {Button, InputNumber,Layout, message, Popconfirm, Progress, Slider, Tooltip} from "antd";
import '../../style/_intention.scss'
import HeatMap from "../../assets/charts/HeatMap";
import BoxPlot from "../../assets/charts/BoxPlot";
import * as Iprocess from "../../assets/img/Intention Retrieval Process.png"
import IntentionTree from "../../assets/charts/IntentionTree";
import { connect } from 'react-redux';
import {conveyIntentData} from "../../redux/action";

// import WordCloud from 'src/assets/charts/WordCloud';

// tslint:disable-next-line:no-empty-interface
interface Props{
    intentData: object
    callback:(advancedPanel:boolean)=>void
    dispatch: (action:any)=>void
}

interface State{
    confidence: number[];
    encodingLen: number[];
    filtration: number;
    intent: ISubIntent[];
    isSatisfy: number;   // describe user's satisfaction for the intention result.
                         // -1 means unknown, 0 means dissatisfaction, 1 means satisfaction
    isShowBoxplot: boolean;
    isShowHeatmap: boolean;
    mergeNum: number;
    storeFiltration:number;
    storeMergeNum:number;
}

class AdvIntentionPanel extends React.Component<Props,State>{
    public static  getDerivedStateFromProps(nextProps:any,preState:any){
        if(nextProps.intentData.filtration!==preState.storeFiltration ||
            nextProps.intentData.mergeNum!==preState.storeMergeNum ||
            nextProps.intentData.intent!==preState.intent){

            // console.log(nextProps.intentData.intent,preState.intent)
            return{
                confidence: nextProps.intentData.confidence,
                encodingLen: nextProps.intentData.encodingLen,
                filtration: nextProps.intentData.filtration,
                intent: nextProps.intentData.intent,
                mergeNum: nextProps.intentData.mergeNum,

                storeFiltration: nextProps.intentData.filtration,
                storeMergeNum:nextProps.intentData.mergeNum
            }
        }
        return null
    }

    constructor(props:Props) {
        super(props);
        this.state={
            confidence: [],
            encodingLen: [],
            filtration: 0,
            intent:[],
            isSatisfy: -1,
            isShowBoxplot: true,
            isShowHeatmap: true,
            mergeNum: 0,
            storeFiltration:0,     // 将state中Filtration和store中的Filtration分离，实现组件位置异步的dispatch
            storeMergeNum:0,       // 将state中MergeNum和store中的MergeNum分离，实现组件位置异步的dispatch


        }
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


    public renderEncodingLen = (len:number, index: number, arr:number[])=>{
        const totalWidth=580
        const label=['①','②','③','③','④','⑤','⑥']
        const iterator=['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth']
        return(
            <div key={index}>
                <h3>
                    {label[index]}
                    <span id={'column'+(index+1).toString()}  className="column"
                          style={{width: len/Math.max(...arr)*totalWidth}}>
                        The {iterator[index]}: {Math.round(arr[index])}
                    </span>
                </h3>
            </div>
        )
    }


    public render(){
        return(
            <Layout.Content className="main_container_content">
                <div className="advanced_intent_panel">
                        <div className="advanced_intent_panel_header">
                            <h2>Retrieval Intention Extracted By MDL</h2>
                        </div>
                        <div className="advanced_intent_panel_intention_process">
                            <h3 className="title">Intention Retrieval Process:</h3>
                            <img  src={Iprocess} alt="Intention Retrieval Process" />
                        </div>
                        <div className="advanced_intent_panel_chart">
                            <div className="boxplot">
                                <h3 className="title">Confidence Boxplot:
                                    {this.state.isShowBoxplot?
                                        <UpCircleOutlined className="icon" onClick={()=>{this.setState({isShowBoxplot: false})}}/>:
                                        <DownCircleOutlined className="icon" onClick={()=>{this.setState({isShowBoxplot: true})}}/>
                                    }
                                    <BoxPlot isRender={this.state.isShowBoxplot} />
                                </h3>
                            </div>
                            <div className="heatMap">
                                <h3 className="title">Confidence Heatmap:
                                    {this.state.isShowHeatmap?
                                        <UpCircleOutlined className="icon" onClick={()=>{this.setState({isShowHeatmap: false})}}/>:
                                        <DownCircleOutlined className="icon" onClick={()=>{this.setState({isShowHeatmap: true})}}/>
                                    }
                                </h3>
                                <HeatMap isRender={this.state.isShowHeatmap}/>
                            </div>
                            {/*<div className="wordCloud">*/}
                            {/*    <h3 className="title">Word Cloud:*/}
                            {/*        <WordCloud/>*/}
                            {/*    </h3>*/}
                            {/*</div>*/}

                        </div>

                        <div className="advanced_intent_panel_encode_length">
                            <h3>Encoding length:</h3>
                            <div className="advanced_intent_panel_encode_length_body">
                                {this.state.encodingLen.map((len:number,index:number,arr:number[])=>{
                                    return this.renderEncodingLen(len,index,arr)
                                })}

                            </div>
                        </div>
                        <div className="advanced_intent_panel_intent_result">
                            <h3>Intention Result:</h3>
                            <div className="advanced_intent_panel_intent_result_body" >
                                <IntentionTree />
                            </div>
                        </div>

                        <div className="advanced_intent_panel_description">
                            <h3>Description
                                {this.state.isSatisfy===-1?
                                    <Popconfirm trigger="hover" title={"Is this your retrieval intention?"} okText="Yes" cancelText="No"
                                                onConfirm={()=>{
                                                    message.success('Thanks for your feedback!')
                                                    this.setState({isSatisfy:1})
                                                }}
                                                onCancel={()=>{
                                                    message.info('Modify the intention result and help us do better!')
                                                    this.setState({isSatisfy:0})
                                                }}
                                    >
                                        <QuestionCircleOutlined className="icon"/>
                                    </Popconfirm>
                                    : null}
                                {this.state.isSatisfy===0?
                                    <Tooltip title={'Modify intention the result and help us do better!'}>
                                        <FrownOutlined className="icon" twoToneColor="#8b8c89"/>
                                    </Tooltip> : null}
                                {this.state.isSatisfy===1?
                                    <Tooltip title={'Thanks for your feedback!'}>
                                        <CheckCircleOutlined className="icon" />
                                    </Tooltip> :null}
                                &nbsp;:
                            </h3>
                            <div className="advanced_intent_panel_description_body">
                                {this.state.intent.map((val:ISubIntent,index:number)=>{
                                    return this.generateIntentDes(val,index)
                                })}
                            </div>

                        </div>
                        <div className="advanced_intent_panel_filtration">
                            <h3 >Filtration Coefficient:   </h3>
                            <InputNumber step={0.05} min={0.1} max={0.4} value={this.state.filtration}
                                         onChange={(val:number)=>{
                                             let fixValue
                                             if(val>0.4) {fixValue=0.4}
                                             else if(val<0.1) {fixValue=0.1}
                                             else{ fixValue=Math.round(val*20)/20}
                                             this.setState({filtration: fixValue})}}/>
                            <Slider step={0.05} min={0.1} max={0.4}  value={this.state.filtration}
                                    onChange={(val:number)=>{this.setState({filtration: val})}}
                                    style={{width:'400px'}}
                                    marks={{
                                        0.1: '0.1',
                                        0.25: {
                                            style: {
                                                color: '#f50',
                                            },
                                            label: <strong>0.25</strong>
                                        },
                                        0.4: '0.4'
                                    }}
                            />
                        </div>
                        <div className="advanced_intent_panel_mergeNum">
                            <h3>Number of Random Merge:</h3>
                            <InputNumber step={5} min={50} max={100} value={this.state.mergeNum}
                                         onChange={(val:number)=>{
                                             let fixValue
                                             if(val>100) {fixValue=100}
                                             else if(val<50) {fixValue=50}
                                             else{ fixValue=Math.round(val/5)*5}
                                             this.setState({mergeNum: fixValue})}}/>
                            <Slider step={5} min={50} max={100} value={this.state.mergeNum}
                                    onChange={(val:number)=>{this.setState({mergeNum: val})}}
                                    marks={{
                                        50: '50',
                                        75: {
                                            style: {
                                                color: '#f50',
                                            },
                                            label: <strong>75</strong>
                                        },
                                        100: '100'
                                    }}
                                    style={{width:'400px'}}/>
                        </div>
                        <div className="advanced_intent_panel_confidence">
                            <h3>Confidence:  {Math.round(this.state.confidence[this.state.confidence.length-1]*100)/100}</h3>
                            <Progress percent={this.state.confidence[this.state.confidence.length-1]*100}
                                      format={percent => Math.round(typeof percent === "number" ? percent : 0)+'%'}
                                      style={{width: '500px', marginLeft: '50px'}}
                                      strokeColor={{
                                          '0%': '#108ee9',
                                          '100%': '#87d068',
                                      }}
                            />
                        </div>
                        <div className="advanced_intent_panel_btn">
                            <Popconfirm title="Are you sure to save these change" okText="Yes" cancelText="No"
                                        onConfirm={()=>{this.saveModification()}}
                                        onCancel={()=>{this.props.callback(false)}}
                             >
                                <Button type="primary" shape="round" size="large"
                                        style={{ position:'relative', width: '180px', margin: '10px'}}
                                >
                                    Return {">>"}
                                </Button>
                           </Popconfirm>
                        </div>

                    </div>
            </Layout.Content>
        )
    }

    // save change and dispatch to store by redux
    public saveModification=()=>{
        const {dispatch,callback}=this.props
        dispatch(conveyIntentData({
            ...this.props.intentData,
            filtration: this.state.filtration,
            mergeNum:this.state.mergeNum
        }))
        callback(false)
    }


}

const mapStateToProps=(state:any)=>{
    return {
        intentData: state.conveyIntentDataReducer
    }
}

export default connect(mapStateToProps)(AdvIntentionPanel)