// @ts-ignore
import Graphin, {Components, Behaviors, GraphinContext, } from "@antv/graphin";
// @ts-ignore
import type {ContextMenuValue}from "@antv/graphin";
import {Menu, message} from "antd";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, EyeOutlined, DownloadOutlined} from '@ant-design/icons';
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
             }else{
                 continue
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

// 设置右键菜单， 使用graphin封装的内置组件而不是graphin-components
const NodeMenu = (value: ContextMenuValue) => {
    const {onClose, id} = value;
    const handleClick = (e: { key: unknown }) => {
        message.info(`${e.key}:${id}`);
        onClose();
    };

    return (
        <Menu onClick={handleClick}>
            <Menu.Item key="copy" icon={<PlusCircleOutlined />} disabled={id.search(/^0-0-0-[0-9]$/)!==-1}>添加</Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />} disabled={id.search(/^0-0$/)!==-1}>删除</Menu.Item>
            <Menu.Item key="tag" icon={<EditOutlined />} disabled={id.search(/0-0-0-[0-9]/)===-1}>修改</Menu.Item>
        </Menu>
    );

}

// 设置画布菜单， 使用graphin封装的内置组件而不是graphin-components
const CanvasMenu = ({value,onClick}:{value:ContextMenuValue,onClick:()=>void}) => {
    const {graph}=React.useContext(GraphinContext)
    const handleDownLoad=()=>{
        graph.downloadFullImage('canvas-contextmenu');
        value.onClose()
        // contextMenu.canvas.handleClose();
    }
    const handleOpenFishEye=()=>{
        onClick()
        value.onClose()
        buildTreeData()
    }

    return (
        <Menu >
            <Menu.Item key="fishEye" icon={<EyeOutlined />} onClick={handleOpenFishEye}>开启鱼眼</Menu.Item>
            <Menu.Item key="download" icon={<DownloadOutlined />} onClick={handleDownLoad}>下载画布</Menu.Item>
        </Menu>
    );
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

// 渲染意图树
const IntentionTree = () => {
    const [visible,setVisible]=React.useState(false)
    const handleOpenFishEye=()=>{
        setVisible(true)
    }
    const handleCloseFishEye=()=>{
        setVisible(false)
    }
    return (
        <Graphin width={600} height={400} fitView={true} animate={true} data={buildTreeData()}
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

            <Components.ContextMenu bindType="canvas" style={{background: '#fff'}}>
                {(value: ContextMenuValue)=><CanvasMenu value={value} onClick={handleOpenFishEye} />}
            </Components.ContextMenu>
            <Components.FishEye visible={visible} handleEscListener={handleCloseFishEye} />

            {/*<ContextMenu style={{background: '#fff'}} bindType="canvas">*/}
            {/*    <CanvasMenu handleOpenFishEye={handleOpenFishEye} />*/}
            {/*</ContextMenu>*/}
            {/*<FishEye options={{}} visible={visible} handleEscListener={handleCloseFishEye} />*/}
        </Graphin>
    )
}

export default IntentionTree