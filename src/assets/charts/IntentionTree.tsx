// @ts-ignore
import Graphin, {Components, Behaviors, GraphinContext, } from "@antv/graphin";
// import { ContextMenu, FishEye } from '@antv/graphin-components';
// @ts-ignore
import type {ContextMenuValue}from "@antv/graphin";
import { Toolbar } from '@antv/graphin-components';
import {Menu, message, Drawer, Input, Select, Space, Button, Tooltip} from "antd";
import {
    EditOutlined, DeleteOutlined, PlusCircleOutlined, EyeOutlined, DownloadOutlined, AimOutlined,
    EyeInvisibleOutlined, UndoOutlined, RedoOutlined, createFromIconfontCN, SaveOutlined
} from '@ant-design/icons';
import '../../style/_intention.scss'

import * as React from "react";
import {useEffect, useImperativeHandle,forwardRef} from "react";
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import {ISubIntent} from "../../util/interface";
import {conveyIntentData} from "../../redux/action";

declare const require:any;

const MyIcon=createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1728748_42yz4wxteli.js', // use some icon from iconfont
});

class Node{
    public id:string
    public class:string
    public label:string
    public type:string
    public children: Node[]
    constructor() {
        this.id='0-0';
        this.class='Intention';
        this.label='Intention';
        this.type='icon-node';
        this.children=[]
    }
}

// generate data dynamically
const buildTreeData=(intent:ISubIntent[])=>{
    // const intent=rawData.result[0].intention
    const intentLen=intent.length
    let treeDate: Node;
    treeDate = new Node();
    for(let i=0;i<intentLen;i++){
        const subIntent=new Node()
        subIntent.id='0-0-'+i.toString()
        subIntent.class='Sub-Intention'
        subIntent.label='Sub-Intention-'+i.toString()
        let j=0
        for (const key of Object.keys(intent[i])){
            for(const val of intent[i][key]){
                if(key!=='confidence'){
                    const tmp=new Node()
                    tmp.id=subIntent.id+'-'+j.toString()
                    tmp.label=val
                    if(key==='content') {
                        tmp.class='Content';
                        tmp.label=val.slice(val.lastIndexOf('/')+1,val.length)
                    }
                    else if(key==='location') {tmp.class='Location'}
                    else if(key==='style') {tmp.class='Style'}
                    else if(key==='topic') {tmp.class='Topic'}
                    j++
                    subIntent.children.push(tmp)
                }
            }
        }
        treeDate.children.push(subIntent)
    }
    return treeDate
}

// treeData example
// const treeData = {
//     id: '0-0',
//     class: 'Intention',
//     label: 'Intention',
//     type: 'icon-node',
//     children: [
//         {
//             id: '0-0-0',
//             class: 'Sub-Intention',
//             label: 'Sub-Intention-1',
//             type: 'icon-node',
//             children: [
//                 {
//                     id: '0-0-0-0',
//                     class: 'Content',
//                     label: 'Soil',
//                     type: 'icon-node',
//                     children:[]
//                 },
//                 {
//                     id: '0-0-0-1',
//                     class: 'Location',
//                     label: 'Florida',
//                     type: 'icon-node',
//                     children: []
//                 },
//                 {
//                     id: '0-0-0-2',
//                     class: 'Topic',
//                     label: 'Agriculture',
//                     type: 'icon-node',
//                     children: []
//                 },
//                 {
//                     id: '0-0-0-3',
//                     class: 'Style',
//                     label: 'Quality Base',
//                     type: 'icon-node',
//                     children: []
//                 },
//             ]
//         }, {
//             id: '0-0-1',
//             class: 'Sub-Intention',
//             label: 'Sub-Intention-2',
//             type: 'icon-node',
//             children: [
//                 {
//                     id: '0-0-1-0',
//                     class: 'Content',
//                     label: 'River',
//                     type: 'icon-node',
//                     children: []
//                 },
//                 {
//                     id: '0-0-1-1',
//                     class: 'Location',
//                     label: 'Wisconsin',
//                     type: 'icon-node',
//                     children: []
//                 },
//                 {
//                     id: '0-0-1-2',
//                     class: 'Topic',
//                     label: 'Water',
//                     type: 'icon-node',
//                     children: []
//                 },
//             ]
//         }
//     ]
// }


// customize node style
Graphin.registerNode(
    'icon-node',
    {
        options: {
            size: [90, 30],
            stroke: '#91d5ff',
            fill: '#91d5ff',
            lineWidth: 1,
            radius: 7
        },
        draw(cfg: any, group: any) {
            // console.log(cfg)
            const styles = this.getShapeStyle(cfg);
            // const { labelCfg = {} } = cfg;

            const w = styles.width;
            const h = styles.height;
            const iconType = cfg.class;
            // console.log(styles)

            const keyShape = group.addShape('rect', {
                attrs: {
                    ...styles,
                    x: -w / 2,
                    y: -h / 2,
                    // cursor: 'pointer'
                },
            });

            const rectIcon = group.addShape('rect', {
                attrs: {
                    x: 1 - w / 2,
                    y: 1 - h / 2,
                    width: 28,
                    height: styles.height - 2,
                    // fill: '#8c8c8c',
                },
            });

            group.addShape('image', {
                attrs: {
                    x: 4 - w / 2,
                    y: 4 - h / 2,
                    width: 22,
                    height: 22,
                    img:
                        require('../../assets/img/icon/' + iconType + '.svg')
                },
                name: 'image-shape',
            });

            switch (iconType) {
                case 'Intention':
                    keyShape.attr({
                        fill: '#D9D9D9',
                        stroke: '#B0B0B0',
                    })
                    rectIcon.attr({
                        fill: '#B0B0B0'
                    })
                    break
                case 'Sub-Intention':
                    keyShape.attr({
                        fill: '#FFF2CC',
                        stroke: '#F4CA5E',
                    })
                    rectIcon.attr({
                        fill: '#F4CA5E'
                    })
                    break
                case 'Content':
                    keyShape.attr({
                        fill: '#C4D9EE',
                        stroke: '#9BC1E1',
                    })
                    rectIcon.attr({
                        fill: '#9BC1E1'
                    })
                    break
                case 'Location':
                    keyShape.attr({
                        fill: '#D7CAE4',
                        stroke: '#C39EE2',
                    })
                    rectIcon.attr({
                        fill: '#C39EE2'
                    })
                    break
                case 'Topic':
                    keyShape.attr({
                        fill: '#F2C2A5',
                        stroke: '#F0A573',
                    })
                    rectIcon.attr({
                        fill: '#F0A573'
                    })
                    break
                case 'Style':
                    keyShape.attr({
                        fill: '#C5E0B2',
                        stroke: '#A9D18E',
                    })
                    rectIcon.attr({
                        fill: '#A9D18E'
                    })
                    break
                default:
                    keyShape.attr({
                        fill: '#D9D9D9',
                        stroke: '#B0B0B0',
                    })
                    rectIcon.attr({
                        fill: '#B0B0B0'
                    })
            }

            const labelObj = group.addShape('text', {
                attrs: {
                    fill: 'black',
                    text: cfg.label,
                    x: 32.5 - w / 2,
                    y: 22.5 - h / 2,
                    labelCfg: {
                        textAlign: 'center'
                    }
                },
            });
            // console.log(rectIcon.getBBox().maxX,labelObj.getBBox().maxX)
            // console.log(labelObj.getBBox().maxX-rectIcon.getBBox().minX)

            keyShape.attr({
                width: labelObj.getBBox().maxX - rectIcon.getBBox().minX + 5
            })
            return keyShape;
        },
        // update(cfg: any, node: any) {
        //     console.log(cfg)
        //     console.log(node)
        // },
    },
    'rect',
);

// set canvas mode
const modes = {
    default: [
        'drag-node',
        'drag-canvas',
        'zoom-canvas',
        {
            type: 'tooltip',
            formatText(node: any) {
                return `
                        <li><b>Class: </b>${node.class}</li>
                        <li><b>Label: </b>${node.label}</li>
                        `
            }
        },
    ]
}

// 设置节点布局
const layout={
    type: 'compactBox',
    direction: 'TB',
    getId: function getId(d: any) {
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
    getHGap: function getHGap(d: any) {
        return 60
    }
}

// 使用graphin-components封装的内置组件
// const CanvasMenu = (props:any) => {
//     const { graph, contextmenu } = React.useContext(GraphinContext);
//     const context = contextmenu.canvas;
//     const handleDownload = () => {
//         graph.downloadFullImage('canvas-contextmenu');
//         context.handleClose();
//     };
//     const handleOpenFishEye = () => {
//         props.handleOpenFishEye();
//         context.handleClose();
//     };
//     return (
//         <Menu >
//             <Menu.Item key="fishEye" icon={<EyeOutlined />} onClick={handleOpenFishEye}>开启鱼眼</Menu.Item>
//             <Menu.Item key="download" icon={<DownloadOutlined />} onClick={handleDownload}>下载画布</Menu.Item>
//         </Menu>
//     );
// };

const dimension=['Content','Topic','Style','Location']
const style=["Point symbol method","Line symbol method","Area method","Quality base method","Choloplethic method","Others"]
const topic=["Agriculture","Biodiversity","Climate","Disaster","Ecosystem","Energy","Geology","Health","Water","Weather"]

let historyUndoList:any[]=[]
let historyRedoList:any[]=[]


// render intention tree
const IntentionTree = (props:any,ref:React.RefObject<unknown>) => {
    // @ts-ignore
    const store=useSelector(state=> state.conveyIntentDataReducer,shallowEqual)
    const dispatch=useDispatch()

    const [treeData,setTreeData]=React.useState(buildTreeData(store.intent))
    const [visible,setVisible]=React.useState({drawerVisible: false, fishEyeVisible: false})
    const [modifyData,setModifyData]=React.useState({dimValue:'Content',labelValue: ''})
    const [modifyAction,setModifyAction]=React.useState({type:'EDIT', id: ''})

    useEffect(()=>{historyUndoList.push(treeData)},[]) // init historyUndoList

    useEffect(()=>setTreeData(buildTreeData(store.intent)),[store.intent])

    useImperativeHandle(ref,()=>({saveIntentData}))

    const handleOpenFishEye=()=>{
        setVisible({...visible,fishEyeVisible: true})
    }
    const handleCloseFishEye=()=>{
        setVisible({...visible,fishEyeVisible: false})
    }

    // find a node in the treeData
    const getNode=(data:Node, key:string):Node=>{
        const tmp=[]
        tmp.push(data)
        let resNode=new Node()
        // 暴力递归，直接找数据
        const helper=(arr:Node[],key:string)=>{
            for (const node of arr) {
                if (node.id === key) {
                    resNode=node
                    return
                }
                if(node.children.length){
                    helper(node.children,key)
                }
            }
            return
        }
        helper(tmp,key)
        return resNode
    }

    // Add a node
    const handleAddNode=(data:Node,key:string, dimValue:string, labelValue:string)=>{
        const tmp=[]
        tmp.push(data)
        const newData=JSON.parse(JSON.stringify(tmp)) // 深拷贝，封装成数组
        // 暴力递归，直接找数据
        const helper=(arr:Node[],key:string):void=>{
            for (const node of arr) {
                if (node.id === key) {
                    const endNode=node.children[node.children.length-1]
                    const nodeNum=endNode?parseInt(endNode.id.slice(endNode.id.lastIndexOf('-')+1,endNode.id.length),10):0 // 获取该层最大的id数
                    const nNode = new Node()
                    nNode.id=node.id+'-'+(nodeNum+1).toString()
                    nNode.class=dimValue
                    nNode.label=labelValue
                    node.children.push(nNode)
                    return
                }
                if(node.children.length){
                    helper(node.children,key)
                }
            }
        }
        helper(newData,key)
        setTreeData(newData[0])
        // record change
        historyUndoList.push(newData[0])
        historyRedoList=[]
    }

    // Edit a node
    const handleEditNode=(data:Node,key:string,label:string)=>{
        getNode(data,key)

        const tmp=[]
        tmp.push(data)
        const newData=JSON.parse(JSON.stringify(tmp)) // 深拷贝，封装成数组
        // 暴力递归，直接找数据
        const helper=(arr:Node[],key:string):void=>{
            for (const node of arr) {
                if (node.id === key) {
                    node.label=label
                    return
                }
                if(node.children.length){
                    helper(node.children,key)
                }
            }
        }
        helper(newData,key)
        setTreeData(newData[0])
        // record change
        historyUndoList.push(newData[0])
        historyRedoList=[]
    }

    // Delete a node
    const handleDeleteNode=(data:Node,key:string)=>{
        const tmp=[]
        tmp.push(data)
        const newData=JSON.parse(JSON.stringify(tmp)) // 深拷贝，封装成数组
        // 暴力递归，直接找数据
        const helper=(arr:Node[],key:string):void=>{
            for(let i=0;i<arr.length;i++){
                const node=arr[i]
                if(node.id===key){
                    arr.splice(i,1)
                    return
                }
                if(node.children.length){
                    helper(node.children,key)
                }
            }
        }
        helper(newData,key)
        setTreeData(newData[0])
        // record change
        historyUndoList.push(newData[0])
        historyRedoList=[]

    }

    // right click menu(设置右键菜单， 使用graphin封装的内置组件而不是graphin-components)
    const NodeMenu = (value:ContextMenuValue) => {
        const {onClose, id} = value;
        const handleClick = (e: { key: string }) => {
            const node=getNode(treeData,id)

            setModifyAction({type:e.key,id})
            setModifyData({dimValue: node.class,labelValue: node.label})
            if(e.key==='EDIT'){
                setModifyData({dimValue: node.class,labelValue: node.label})
                setVisible({...visible,drawerVisible: true})
            }
            if(e.key==='ADD'){
                if(id==='0-0'){
                    const endNode=node.children[node.children.length-1]
                    const nodeNum=parseInt(endNode.id.slice(endNode.id.lastIndexOf('-')+1,endNode.id.length),10) // 获取该层最大的id数
                    handleAddNode(treeData,id,'Sub-Intention','Sub-Intention-'+(nodeNum+1).toString())
                }else{
                    setModifyData({dimValue: 'Content',labelValue: ''})
                    setVisible({...visible,drawerVisible: true})
                }
            }
            message.info(`${e.key}:${id}`);
            onClose();
        };

        const sumHyphen=(s:string)=>{
            let hyphenNum=0
            for(let i=0;i<s.length;i++){
                if(s.charAt(i)==='-'){
                    ++hyphenNum
                }
            }
            return hyphenNum
        }
        return (
            <Menu onClick={handleClick}>
                <Menu.Item key="ADD" icon={<PlusCircleOutlined />} disabled={sumHyphen(id)===3}>Add</Menu.Item>
                <Menu.Item key="DELETE" icon={<DeleteOutlined />} disabled={sumHyphen(id)===1}
                           onClick={()=>handleDeleteNode(treeData,id)}>Delete</Menu.Item>
                <Menu.Item key="EDIT" icon={<EditOutlined />} disabled={sumHyphen(id)!==3}>Edit</Menu.Item>
            </Menu>
        );

    }

    // canvas menu(设置画布菜单， 使用graphin封装的内置组件而不是graphin-components)
    const CanvasMenu = (value:ContextMenuValue) => {
        const {graph}=React.useContext(GraphinContext)
        const handleDownLoad=()=>{
            graph.downloadFullImage('canvas-contextmenu');
            value.onClose()
        }
        const openFishEye=()=>{
            handleOpenFishEye()
            value.onClose()
            buildTreeData(store.intent)
        }

        return (
            <Menu >
                <Menu.Item key="fishEye" icon={<EyeOutlined />} onClick={openFishEye}>Open Fish Eye</Menu.Item>
                <Menu.Item key="download" icon={<DownloadOutlined />} onClick={handleDownLoad}>DownLoad</Menu.Item>
            </Menu>
        );
    }

    // edit selector (渲染编辑下拉框)
    const RenderEditSelector=({value}:{value:string})=>{
        switch (value){
            case 'Topic': return (
                <Select className="label_value" style={{width: '170px'}} size="small" value={modifyData.labelValue}
                        onChange={(val)=>setModifyData({...modifyData,labelValue: val})}
                        defaultValue={modifyData.labelValue}>
                    {topic.map((item)=><Select.Option key={item}>{item}</Select.Option>)}
                </Select>)
            case 'Style': return (
                <Select className="label_value" style={{width: '170px'}} size="small" value={modifyData.labelValue}
                        onChange={(val)=>setModifyData({...modifyData,labelValue: val})}
                        defaultValue={modifyData.labelValue}>
                    {style.map((item)=><Select.Option key={item}>{item}</Select.Option>)}
                </Select>)
            default: return <Input id='inputLabel' style={{width: '170px'}} size="small"
                                   placeholder={'Please input value'} allowClear={true}/>
        }
    }

    // toolbar (渲染工具栏)
    const RenderToolbar = () => {
        const {apis,graph}=React.useContext(GraphinContext)
        const {handleAutoZoom}=apis
        const options=[
            {
                key: 'autoZoom',
                name: <AimOutlined />,
                description: 'Auto Zoom',
                action:()=>{
                    handleAutoZoom()
                }
            },
            {
                key: 'fishEye',
                name: visible.fishEyeVisible?<EyeInvisibleOutlined />:<EyeOutlined />,
                description: visible.fishEyeVisible?'Close Fish Eye':'Open Fish Eye',
                action:()=>{
                    visible.fishEyeVisible?handleCloseFishEye():handleOpenFishEye()
                }
            },
            {
                key: 'downLoad',
                name: <DownloadOutlined />,
                description: 'DownLoad the Canvas',
                action:()=>{
                    graph.downloadFullImage('canvas-contextmenu');
                }
            },
            {
                key: 'unDo',
                name: <UndoOutlined />,
                description: 'Undo',
                action:()=>{
                    historyRedoList.push(historyUndoList.pop())
                    setTreeData(historyUndoList[historyUndoList.length-1])
                }
            },
            {
                key: 'reDo',
                name: <RedoOutlined />,
                description: 'Redo',
                action:()=>{
                    historyUndoList.push(historyRedoList.pop())
                    setTreeData(historyUndoList[historyUndoList.length-1])
                }
            },
            {
                key: 'save',
                name: <SaveOutlined/>,
                description: 'save',
                action:()=>saveIntentData()
            }
        ]

        return (
            <Toolbar  direction="vertical" style={{position: 'absolute', bottom: 148, left: 28}}>
                <Space className="toolbar" direction="vertical" size={0}>
                    {options.map((item) => {
                        return (
                            <Tooltip title={item.description} key={item.key} placement="right">
                                <Button icon={item.name} onClick={item.action}
                                        disabled={(item.key==='unDo' && historyUndoList.length===1)||
                                        (item.key==='reDo' && historyRedoList.length===0)}/>
                            </Tooltip>
                        )
                    })}
                </Space>
            </Toolbar>
        )

    };

    // legend (渲染图例)
    const RenderLegend=()=>{
        return(
            <div className='legend'>
                <div className='item'>
                    <MyIcon className='myIcon' type={'icon-intent'} style={{background:'#B0B0B0'}}/>
                    <span className='text' style={{background: '#D9D9D9'}}>Intention</span>
                </div>
                <div className='item'>
                    <MyIcon className='myIcon' type={'icon-subIntent'} style={{background:'#F4CA5E'}}/>
                    <span className='text' style={{background: '#FFF2CC'}}>Sub-Intention</span>
                </div>

                <div className='item'>
                    <MyIcon className='myIcon' type={'icon-content'} style={{background:'#9BC1E1'}}/>
                    <span className='text' style={{background: '#C4D9EE'}}>Content</span>
                </div>
                <div className='item'>
                    <MyIcon className='myIcon' type={'icon-location'} style={{background: '#C39EE2'}}/>
                    <span className='text' style={{background: '#D7CAE4'}}>Location</span>
                </div>
                <div className='item'>
                    <MyIcon className='myIcon' type={'icon-style'} style={{background:'#A9D18E'}}/>
                    <span className='text' style={{background: '#C5E0B2'}}>Style</span>
                </div>
                <div className='item'>
                    <MyIcon className='myIcon' type={'icon-topic'} style={{background:'#F0A573'}}/>
                    <span className='text' style={{background: '#F2C2A5'}}>Topic</span>
                </div>
            </div>
            )
    }

    // summit changed treeData
    const editSummit=()=>{
        const el=document.getElementById("inputLabel")
        let labelValue=el?el.getAttribute("value"):null
        labelValue=(labelValue===null?modifyData.labelValue:labelValue)
        if(labelValue===''){
            message.error('Please input value!')
        }
        if(modifyAction.type==='ADD' && labelValue!==''){
            handleAddNode(treeData, modifyAction.id, modifyData.dimValue, labelValue)

        } else if(modifyAction.type==='EDIT' && labelValue!==''){
            handleEditNode(treeData, modifyAction.id, labelValue)
        }
        setVisible({...visible, drawerVisible: false})
    }

    const saveIntentData=()=>{
        // init newIntentData
        const newIntentData=Array.from(new Array(treeData.children.length),item=>new Object ({
            confidence: 0,
            content: [],
            location: [],
            style: [],
            topic: []
        }))

        treeData.children.map((item,index)=>{
            for(const node of item.children){
                if(node.class==='Content'){
                    newIntentData[index]['content'].push(node.label)
                }else if(node.class==='Location'){
                    newIntentData[index]['location'].push(node.label)
                }else if(node.class==='Topic'){
                    newIntentData[index]['topic'].push(node.label)
                }else if(node.class==='Style'){
                    newIntentData[index]['style'].push(node.label)
                }
            }
            // 判断newIntent中的元素（子意图）是否和原始数据storeIntent中的元素（子意图）相同，若相同需要复制置信度confidence，否则新置信度为0
            store.intent.map((item:any)=>{
                if(item['content']===newIntentData[index]['content'] && item['location']===newIntentData[index]['location']
                && item['style']===newIntentData[index]['style'] && item['topic']===newIntentData[index]['topic']){
                    newIntentData[index]['confidence']=item['confidence']
                }
            })

        })

        historyUndoList=[treeData]
        historyRedoList=[]

        dispatch(conveyIntentData({
            ...store,
            intent: newIntentData
        }))
    }


    return (
        <Graphin id="graphin" width={600} height={400} fitView={true} animate={true} data={treeData} enabledStack={true}
                     defaultNode={{type: 'icon-node', anchorPoints: [0.5, 0]}}
                     defaultEdge={{sourceAnchor: 0, targetAnchor: 0}}
                     modes={modes}
                     layout={layout}

        >
            <RenderToolbar/>
            <RenderLegend/>

            <Behaviors.TreeCollapse trigger="click"/>
            <Components.ContextMenu bindType="node" style={{background: '#fff'}}>
                {(value: ContextMenuValue) => <NodeMenu {...value}/>}
            </Components.ContextMenu>

            <Components.ContextMenu bindType="canvas" style={{width:150, background: '#fff'}}>
                {(value: ContextMenuValue)=><CanvasMenu {...value} />}
            </Components.ContextMenu>
            <Components.FishEye visible={visible.fishEyeVisible} handleEscListener={handleCloseFishEye} />

            {/*<ContextMenu style={{background: '#fff'}} bindType="canvas">*/}
            {/*    <CanvasMenu handleOpenFishEye={handleOpenFishEye} />*/}
            {/*</ContextMenu>*/}
            {/*<FishEye options={{}} visible={visible} handleEscListener={handleCloseFishEye} />*/}

            <Drawer placement="top" style={{position: "absolute"}}
                    bodyStyle={{display:"none"}} headerStyle={{padding: '8px 12px'}}
                    drawerStyle={{height:"auto"}} contentWrapperStyle={{height:"auto"}}
                    visible={visible.drawerVisible} getContainer={false} onClose={()=>setVisible({...visible,drawerVisible: false})}
                    destroyOnClose={true}
                    extra={
                        <Space>
                            <Space>
                                <b>Dimension:</b>
                                <Select style={{width:90}} size="small" disabled={modifyAction.type==='EDIT'}
                                        defaultValue={modifyData.dimValue}
                                        onChange={(val)=>{setModifyData({...modifyData, dimValue: val})}}>
                                    {dimension.map((dim)=><Select.Option key={dim}>{dim}</Select.Option>)}
                                </Select>
                                <b>Value:</b>
                                   <RenderEditSelector value={modifyData.dimValue}/>
                            </Space>
                            <Space>
                                <Button onClick={editSummit} type="primary" size="small">
                                    Submit
                                </Button>
                                <Button onClick={()=>setVisible({...visible,drawerVisible: false})} size="small">Cancel</Button>
                            </Space>
                        </Space>
                    }
            />
        </Graphin>

    )
}

export default forwardRef(IntentionTree)