// @ts-ignore
import Graphin, {Components, Behaviors, GraphinContext, } from "@antv/graphin";
// @ts-ignore
import type {ContextMenuValue}from "@antv/graphin";
import {Menu, message, Drawer,Input, Select, Space, Button} from "antd";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, EyeOutlined, DownloadOutlined} from '@ant-design/icons';
import '../../style/_intention.scss'
// import { ContextMenu, FishEye } from '@antv/graphin-components';

import * as React from "react";
import rawData from "../data/intentionResult2022.2.23.json";

declare const require:any;

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

// 动态生成数据
const buildTreeData=()=>{
    const intent=rawData.result[0].intention
    const intentLen=intent.length
    let treeDate: Node;
    treeDate = new Node();
    for(let i=0;i<intentLen;i++){
        const subIntent=new Node()
        subIntent.id='0-0-'+i.toString()
        subIntent.class='Sub-Intention'
        subIntent.label='Sub-Intention-'+i.toString()
        let j=0
        for (const key in intent[i]){
             if(intent[i][key]!=='null' && key!=='confidence'){
                 const tmp=new Node()
                 tmp.id=subIntent.id+'-'+j.toString()
                 tmp.label=intent[i][key]
                 if(key==='content') {
                     tmp.class='Content';
                     tmp.label=intent[i][key].slice(intent[i][key].lastIndexOf('/')+1,intent[i][key].length)
                 }
                 else if(key==='location') {tmp.class='Location'}
                 else if(key==='style') {tmp.class='Style'}
                 else if(key==='topic') {tmp.class='Topic'}
                 j++
                 subIntent.children.push(tmp)
             }
        }
        treeDate.children.push(subIntent)
    }
    return treeDate
}

// 示例数据
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
//             children: [
//                 {
//                     id: '0-0-0-0',
//                     class: 'Content',
//                     label: 'Soil',
//                 },
//                 {
//                     id: '0-0-0-1',
//                     class: 'Location',
//                     label: 'Florida'
//                 },
//                 {
//                     id: '0-0-0-2',
//                     class: 'Topic',
//                     label: 'Agriculture'
//                 },
//                 {
//                     id: '0-0-0-3',
//                     class: 'Style',
//                     label: 'Quality Base'
//                 },
//             ]
//         }, {
//             id: '0-0-1',
//             class: 'Sub-Intention',
//             label: 'Sub-Intention-2',
//             children: [
//                 {
//                     id: '0-0-1-0',
//                     class: 'Content',
//                     label: 'River'
//                 },
//                 {
//                     id: '0-0-1-1',
//                     class: 'Location',
//                     label: 'Wisconsin'
//                 },
//                 {
//                     id: '0-0-1-2',
//                     class: 'Topic',
//                     label: 'Water'
//                 },
//             ]
//         }
//     ]
// }


// 自定义节点
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


            // // 如果不需要动态增加或删除元素，则不需要 add 这两个 marker
            // group.addShape('marker', {
            //     attrs: {
            //         x: 40 - w / 2,
            //         y: 52 - h / 2,
            //         r: 6,
            //         stroke: '#73d13d',
            //         cursor: 'pointer',
            //         symbol: EXPAND_ICON,
            //     },
            //     name: 'add-item',
            // });
            //
            // group.addShape('marker', {
            //     attrs: {
            //         x: 80 - w / 2,
            //         y: 52 - h / 2,
            //         r: 6,
            //         stroke: '#ff4d4f',
            //         cursor: 'pointer',
            //         symbol: COLLAPSE_ICON,
            //     },
            //     name: 'remove-item',
            // });


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
        update(cfg: any, node: any) {
            console.log(cfg)
            console.log(node)
        },
    },
    'rect',
);

// 设置编辑模式
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
        return 50
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
const style=["Chart","Line","Point","Satellite","Scope","Text"]
const topic=["Agriculture","Biodiversity","Climate","Disaster","Ecosystem","Energy","Geology","Health","Water","Weather"]



// 渲染意图树
const IntentionTree = () => {
    const [treeData,setTreeData]=React.useState(buildTreeData())
    const [visible,setVisible]=React.useState({drawerVisible: false, fishEyeVisible: false})
    const [modifyData,setModifyData]=React.useState({dimValue:'Topic',labelValue: 'Agriculture'})
    const [modifyAction,setModifyAction]=React.useState({type:'EDIT', id: ''})
    
    const handleOpenFishEye=()=>{
        setVisible({...visible,fishEyeVisible: true})
    }
    const handleCloseFishEye=()=>{
        setVisible({...visible,fishEyeVisible: false})
    }

    // 设置右键菜单， 使用graphin封装的内置组件而不是graphin-components
    const NodeMenu = (value:ContextMenuValue) => {
        const {onClose, id} = value;
        const handleClick = (e: { key: string }) => {
            setModifyAction({type:e.key,id})
            if(e.key!=='DELETE'){
                setVisible({...visible,drawerVisible: true})
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

    // 设置画布菜单， 使用graphin封装的内置组件而不是graphin-components
    const CanvasMenu = (value:ContextMenuValue) => {
        const {graph}=React.useContext(GraphinContext)
        const handleDownLoad=()=>{
            graph.downloadFullImage('canvas-contextmenu');
            value.onClose()
        }
        const openFishEye=()=>{
            handleOpenFishEye()
            value.onClose()
            buildTreeData()
        }

        return (
            <Menu >
                <Menu.Item key="fishEye" icon={<EyeOutlined />} onClick={openFishEye}>Open Fish Eye</Menu.Item>
                <Menu.Item key="download" icon={<DownloadOutlined />} onClick={handleDownLoad}>DownLoad</Menu.Item>
            </Menu>
        );
    }

    // 渲染编辑下拉框
    const RenderEditSelector=({value}:{value:string})=>{
        switch (value){
            case 'Topic': return (
                <Select className="label_value" style={{width: '120px'}} size="small" value={modifyData.labelValue}
                        onChange={(val)=>setModifyData({...modifyData,labelValue: val})}>
                    {topic.map((item)=><Select.Option key={item}>{item}</Select.Option>)}
                </Select>)
            case 'Style': return (
                <Select className="label_value" style={{width: '120px'}} size="small" value={modifyData.labelValue}
                        onChange={(val)=>setModifyData({...modifyData,labelValue: val})}>
                    {style.map((item)=><Select.Option key={item}>{item}</Select.Option>)}
                </Select>)
            default: return <Input className="label_value" style={{width: '120px'}} size="small"/>
        }
    }

    const editSummit=()=>{
        let labelValue=document.getElementsByClassName("label_value")[0].getAttribute("value")
        labelValue=(labelValue===null?modifyData.labelValue:labelValue)
        if(modifyAction.type==='ADD'){
            handleAddNode(treeData, modifyAction.id, modifyData.dimValue, labelValue)

        } else if(modifyAction.type==='EDIT'){
            handleEditNode(treeData, modifyAction.id, labelValue)
        }
        setVisible({...visible, drawerVisible: false})
    }

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
    }

    const handleEditNode=(data:Node,key:string,label:string)=>{
        getNodeClass(data,key)

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
    }

    const handleAddNode=(data:Node,key:string, dimValue:string, labelValue:string)=>{
        const tmp=[]
        tmp.push(data)
        const newData=JSON.parse(JSON.stringify(tmp)) // 深拷贝，封装成数组
        // 暴力递归，直接找数据
        const helper=(arr:Node[],key:string):void=>{
            for (const node of arr) {
                if (node.id === key) {
                    const endNode=node.children[node.children.length-1]
                    const nodeNum=parseInt(endNode.id.slice(endNode.id.lastIndexOf('-')+1,endNode.id.length),10) // 获取该层最大的id数
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
    }

    const getNodeClass=(data:Node, key:string)=>{
        const tmp=[]
        tmp.push(data)
        // 暴力递归，直接找数据
        const helper=(arr:Node[],key:string):void=>{
            for (const node of arr) {
                if (node.id === key) {
                    setModifyData({...modifyData, dimValue: node.class})
                    return
                }
                if(node.children.length){
                    helper(node.children,key)
                }
            }
        }
        helper(tmp,key)
    }


    return (
        <Graphin id="graphin" width={600} height={400} fitView={true} animate={true} data={treeData} enabledStack={true}
                     defaultNode={{type: 'icon-node', anchorPoints: [0.5, 0]}}
                     defaultEdge={{sourceAnchor: 0, targetAnchor: 0}}
                     modes={modes}
                     layout={layout}

        >
            <Behaviors.TreeCollapse trigger="click"/>
            {/*<Behaviors.Hoverable bindType="node"/>*/}
            {/*<Behaviors.Hoverable bindType="edge"/>*/}
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
                                <Select style={{width:120}} size="small" disabled={modifyAction.type==='EDIT'}
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

export default IntentionTree