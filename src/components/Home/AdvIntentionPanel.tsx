import * as React from 'react';

import {ISubIntent} from '../../util/interface'
import res from '../../assets/data/intentionResult2022.2.23.json'
import {QuestionCircleOutlined, CheckCircleOutlined, FrownOutlined, DownCircleOutlined, UpCircleOutlined} from '@ant-design/icons';
import {Button, InputNumber,Layout, message, Popconfirm, Progress, Slider, Spin, Tag, Tooltip} from "antd";
import '../../style/_intention.scss'
import HeatMap from "../../assets/charts/HeatMap";
import BoxPlot from "../../assets/charts/BoxPlot";
import Graphin,{ Behaviors } from "@antv/graphin";
// import WordCloud from 'src/assets/charts/WordCloud';

// tslint:disable-next-line:no-empty-interface
interface Props{
   callback:(advancedPanel:boolean)=>void
}

interface State{
    confidence: number[];
    encodingLen: number[];
    filtration: number;
    intent: ISubIntent[];
    isLoading: boolean;
    isSatisfy: number;   // describe user's satisfaction for the intention result.
                         // -1 means unknown, 0 means dissatisfaction, 1 means satisfaction
    isShowBoxplot: boolean;
    isShowHeatmap: boolean;
    mergeNum: number;
}

class AdvIntentionPanel extends React.Component<Props,State>{
    constructor(props:Props) {
        super(props);
        this.state={
            confidence: [],
            encodingLen: [],
            filtration: 0,
            intent:[],
            isLoading: true,
            isSatisfy: -1,
            isShowBoxplot: true,
            isShowHeatmap: true,
            mergeNum: 0,

        }
    }


    public componentDidMount() {
        const selfConfidence:number[]=[]
        res.result[0].intention.map((val:ISubIntent)=>{
            selfConfidence.push(val.confidence)
        })
        selfConfidence.push(res.result[0].confidence)

        setTimeout(()=>{
            this.setState({
                confidence: selfConfidence,
                encodingLen: res.parameter.encodingLength,
                filtration: res.parameter.filtrationCoefficient,
                intent: res.result[0].intention,
                isLoading: false,
                mergeNum: res.parameter.mergeNum
            })
        }, 100)

    }


    public generateIntentDes=(val:ISubIntent,index:number)=>{

        return(
            <div key={index} style={{margin: '5px 0px'}}>
                A {val.content === 'null' ? '' :
                <span className="tag" style={{background: "#ef476f"}}>{val.content.slice(val.content.lastIndexOf('/') + 1, val.content.length)}</span>}
                Map {val.location === 'null' ? '' :
                <span>  in <span className="tag" style={{background: "#f9c74f"}}> {val.location}</span></span>}
                {val.topic === 'null' ? '' :
                    <span>  with <span className="tag" style={{background: "#43aa8b"}}>{val.topic}</span> theme </span>}
                {val.style === 'null' ? '' :
                    <span>  drew by <Tag className="tag" color="#277da1">{val.style}</Tag></span>}
                {index === this.state.intent.length - 1 ? '.' :
                    <span style={{fontWeight: "bold"}}> OR </span>}
            </div>
        )
    }


    public renderEncodingLen = (len:number, index: number, arr:number[])=>{
        const totalWidth=600
        const label=['①','②','③','③','④','⑤','⑥']
        const iterator=['first', 'second', 'third', 'fourth', 'fourth', 'sixth']
        return(
            <div key={index}>
                <h3>
                    {label[index]}
                    <span id={'column'+(index+1).toString()}  className="column"
                          style={{width: len/Math.max(...arr)*totalWidth}}>
                        The {iterator[index]} time: {Math.round(arr[index])}
                    </span>
                </h3>
            </div>
        )
    }

    public render(){
        // const data = Utils.mock(8)
        //     .tree()
        //     .graphinTree();

        const treeData = {
            id: 'node1',
            label: 'Intention',
            children: [
                {
                    id: 'node2',
                    label: 'Sub-Intention-1',
                    children: [
                        {
                            id: 'node4',
                            label: 'Content'
                        },
                        {
                            id: 'node5',
                            label: 'Location'
                        },
                        {
                            id: 'node6',
                            label: 'Topic'
                        },
                        {
                            id: 'node7',
                            label: 'Style'
                        },
                    ]
                }, {
                    id: 'node3',
                    label: 'Sub-Intention-2',
                    children: [
                        {
                            id: 'node8',
                            label: 'Content'
                        },
                        {
                            id: 'node9',
                            label: 'Location'
                        },
                        {
                            id: 'node10',
                            label: 'Topic'
                        },
                        {
                            id: 'node11',
                            label: 'Style'
                        },
                    ]
                }
            ]
        }

        // 定制节点
        // Graphin.registerNode('icon-node',
        //     {
        //         size: [60,20],  // 矩形框的长宽
        //         stroke:
        //         fill: '#91d5ff',
        //     })
        // const layouts={
        //     type: 'compactBox',
        //     title: '紧凑树布局',
        //     options:{
        //         direction: "TB",
        //         getId: function getId(d:any) {
        //             return d.id;
        //         },
        //         getHeight: function getHeight() {
        //             return 16;
        //         },
        //         getWidth: function getWidth() {
        //             return 16;
        //         },
        //         getVGap: function getVGap() {
        //             return 80;
        //         },
        //         getHGap: function getHGap() {
        //             return 50;
        //         },
        //     }
        // }
        return(
            <Layout.Content className="main_container_content">
                {this.state.isLoading?
                    <Spin className="advanced_intent_spin" spinning={this.state.isLoading} size="large" tip="Loading"/>:
                    <div className="advanced_intent_panel">
                        <div className="advanced_intent_panel_header">
                            <h2>Retrieval Intention Extracted By MDL</h2>
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
                                <Graphin width={700} height={400}  fitView={true} data={treeData}
                                layout={{
                                    type: 'compactBox',
                                    direction: 'TB',
                                    getId: function getId(d:any) {
                                        return d.id;
                                    },
                                    getHeight: function getHeight() {
                                        return 16;
                                    },
                                    getWidth: function getWidth() {
                                        return 16;
                                    },
                                    getVGap: function getVGap() {
                                        return 80;
                                    },
                                    getHGap: function getHGap() {
                                        return 50;
                                    },
                                }}>
                                    <Behaviors.TreeCollapse trigger="click"/>
                                </Graphin>
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
                            <Slider step={5} min={50} max={100}
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
                                        onConfirm={()=>{this.props.callback(false)}}
                                        onCancel={()=>{this.props.callback(false)}}
                             >
                                <Button type="primary" shape="round" size="large"
                                        style={{ position:'relative', width: '180px', margin: '10px'}}
                                >
                                    Return {">>"}
                                </Button>
                           </Popconfirm>
                        </div>

                    </div>}
            </Layout.Content>
        )
    }




}

export default AdvIntentionPanel