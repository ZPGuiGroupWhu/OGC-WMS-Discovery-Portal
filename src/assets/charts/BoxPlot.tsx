import * as React from "react";
import  * as echarts from 'echarts';
import '../../style/_intention.scss'

interface Props{
    isRender: boolean
}

export default class BoxPlot extends React.Component<Props>{
    public componentDidMount() {
        const ec=echarts as any;
        const myChart=ec.init(document.getElementById('boxplot'))

        const filtration=[0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.4]
        const mergeNum=[50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

        // 绘制置信度（Confidence）随合并次数（mergeNum）的变化
        const option1 = {
            title: [
                {
                    text: 'Confidence BoxPlot',
                    left: 'center',
                    padding: [10,15,5,5],
                    textStyle:{
                        fontSize: 16,
                    }
                },
                // {
                //     text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
                //     borderColor: '#999',
                //     borderWidth: 1,
                //     textStyle: {
                //         fontWeight: 'normal',
                //         fontSize: 12,
                //         lineHeight: 14
                //     },
                //     left: '10%',
                //     bottom: '0%'
                // }
            ],
            toolbox:{
                itemGap: 5,
                feature:{
                    myTool1:{
                        show: true,
                        title: 'mergeNum',
                        icon:'path("M 952 224 h -52 c -4.4 0 -8 3.6 -8 8 v 248 h -92 V 304 c 0 -4.4 -3.6 -8 -8 -8 H 232 c -4.4 0 -8 3.6 -8 8 v 176 h -92 V 232 c 0 -4.4 -3.6 -8 -8 -8 H 72 c -4.4 0 -8 3.6 -8 8 v 560 c 0 4.4 3.6 8 8 8 h 52 c 4.4 0 8 -3.6 8 -8 V 548 h 92 v 172 c 0 4.4 3.6 8 8 8 h 560 c 4.4 0 8 -3.6 8 -8 V 548 h 92 v 244 c 0 4.4 3.6 8 8 8 h 52 c 4.4 0 8 -3.6 8 -8 V 232 c 0 -4.4 -3.6 -8 -8 -8 Z M 296 368 h 88 v 288 h -88 V 368 Z m 432 288 H 448 V 368 h 280 v 288 Z")',
                        onclick: ()=>{
                            myChart.setOption(option1)
                        }
                    },
                    myTool2:{
                        show: true,
                        title: 'filtration',
                        icon: 'path("M 320 224 h -66 v -56 c 0 -4.4 -3.6 -8 -8 -8 h -52 c -4.4 0 -8 3.6 -8 8 v 56 h -66 c -4.4 0 -8 3.6 -8 8 v 560 c 0 4.4 3.6 8 8 8 h 66 v 56 c 0 4.4 3.6 8 8 8 h 52 c 4.4 0 8 -3.6 8 -8 v -56 h 66 c 4.4 0 8 -3.6 8 -8 V 232 c 0 -4.4 -3.6 -8 -8 -8 Z m -60 508 h -80 V 292 h 80 v 440 Z m 644 -436 h -66 v -96 c 0 -4.4 -3.6 -8 -8 -8 h -52 c -4.4 0 -8 3.6 -8 8 v 96 h -66 c -4.4 0 -8 3.6 -8 8 v 416 c 0 4.4 3.6 8 8 8 h 66 v 96 c 0 4.4 3.6 8 8 8 h 52 c 4.4 0 8 -3.6 8 -8 v -96 h 66 c 4.4 0 8 -3.6 8 -8 V 304 c 0 -4.4 -3.6 -8 -8 -8 Z m -60 364 h -80 V 364 h 80 v 296 Z M 612 404 h -66 V 232 c 0 -4.4 -3.6 -8 -8 -8 h -52 c -4.4 0 -8 3.6 -8 8 v 172 h -66 c -4.4 0 -8 3.6 -8 8 v 200 c 0 4.4 3.6 8 8 8 h 66 v 172 c 0 4.4 3.6 8 8 8 h 52 c 4.4 0 8 -3.6 8 -8 V 620 h 66 c 4.4 0 8 -3.6 8 -8 V 412 c 0 -4.4 -3.6 -8 -8 -8 Z m -60 145 a 3 3 0 0 1 -3 3 h -74 a 3 3 0 0 1 -3 -3 v -74 a 3 3 0 0 1 3 -3 h 74 a 3 3 0 0 1 3 3 v 74 Z")',
                        onclick: ()=>{
                            myChart.setOption(option2)
                        }
                    },
                    dataZoom: { show: true},
                    // restore: { show: true },
                    saveAsImage: { show: true },

                }
            },
            dataset: [
                {
                    // 这个 dataset 的 index 为 `0` (原始数据）。
                    source: [
                        [85, 74, 66, 77, 60, 48, 68, 88, 88, 78, 75, 78, 73, 85, 86, 81, 64, 75, 86, 76],
                        [90, 64, 66, 64, 88, 80, 65, 88, 90, 74, 73, 79, 81, 78, 78, 83, 80, 79, 76, 80],
                        [88, 88, 78, 76, 82, 92, 62, 86, 77, 92, 88, 91, 85, 87, 84, 84, 75, 84, 84, 84],
                        [89, 81, 81, 82, 80, 97, 86, 74, 75, 86, 91, 92, 89, 86, 88, 92, 84, 85, 85, 78],
                        [89, 64, 78, 81, 76, 81, 79, 61, 82, 65, 67, 87, 81, 74, 81, 90, 92, 80, 81, 87],
                        [62, 80, 60, 82, 80, 95, 65, 78, 80, 15, 68, 61, 85, 64, 77, 72, 10, 75, 68, 80],
                        [40, 77, 62, 64, 60, 55, 54, 53, 12, 31, 42, 57, 51, 55, 53, 44, 48, 45, 47, 55],
                        [30, 62, 42, 53, 44, 43, 22, 23, 60, 62, 43, 48, 35, 45, 49, 50, 60, 65, 13, 50],
                        [20, 24, 42, 24, 23, 24, 30, 15, 40, 46, 38, 30, 18, 53, 54, 42, 31, 32, 20, 33],
                        [12, 12, 18, 24, 12, 18, 42, 30, 32, 15, 44, 42, 42, 30, 32, 26, 14, 16, 12, 8],
                        [30, 18, 15, 36, 19, 40, 42, 38, 16, 33, 44, 36, 44, 80, 14, 34, 37, 26, 24, 20],
                    ]
                },
                {
                    // 这个 "boxplot" transform 生成了两个数据：
                    // result[0]: boxplot series 所需的数据。
                    // result[1]: 离群点数据。
                    // 当其他 series 或者 dataset 引用这个 dataset 时，他们默认只能得到
                    // result[0] 。
                    // 如果想要他们得到 result[1] ，需要额外声明如下这样一个 dataset ：
                    transform: {
                        type: 'boxplot',
                        config: {
                            itemNameFormatter: (params:any)=>{
                                  return mergeNum[params.value]
                                }
                            },
                        // print: true       // 调试状态打印结果
                    }
                },
                {
                    // 这个 dataset 的 index 为 `2`。
                    fromDatasetIndex: 1,      // 这个额外的 dataset 指定了数据来源于 index 为 `1` 的 dataset。
                    fromTransformResult: 1    // 并且指定了获取 transform result[1] 。
                }
            ],
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '15%',
                right: '10%',
                bottom: '15%',
                top:'12%',
            },
            xAxis: {
                name: 'Number of Merge',
                type: 'category',
                boundaryGap: true,
                nameGap: 25,
                nameLocation: 'middle',
                nameTextStyle:{
                    fontSize: 14,
                    fontWeight: "bold"
                },
                splitArea: {
                    show: true
                },
                splitLine: {
                    show: true
                },

            },
            yAxis: {
                name: 'Confidence (%)',
                type: 'value',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle:{
                    fontSize: 14,
                    fontWeight: "bold"
                },
                splitArea: {
                    show: true
                }
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    itemStyle: {
                        color: '#b8c5f2'
                    },
                    // Reference the data from result[0].
                    // 这个 series 引用 index 为 `1` 的 dataset 。
                    datasetIndex: 1
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    itemStyle: {
                        color: '#eb3b5a'
                    },
                    // 这个 series 引用 index 为 `2` 的 dataset 。
                    // 从而也就得到了上述的 transform result[1] （即离群点数据）
                    datasetIndex: 2
                }
            ]
        };

        // 绘制置信度（Confidence）随过滤系数（mergeNum）的变化
        const option2={
            ...option1,
            dataset: [
                {
                    // 这个 dataset 的 index 为 `0` (原始数据）。
                    source: [
                        [35, 44, 36, 27, 40, 48, 38, 28, 48, 38, 25, 28, 53, 45, 46, 51, 34, 45, 26, 36],
                        [78, 78, 68, 66, 72, 76, 52, 76, 67, 82, 78, 81, 75, 77, 64, 74, 65, 74, 74, 64],
                        [89, 81, 81, 82, 80, 97, 86, 74, 75, 86, 91, 92, 89, 86, 88, 92, 84, 85, 85, 78],
                        [89, 64, 78, 81, 76, 81, 79, 61, 82, 65, 67, 87, 81, 74, 81, 90, 92, 80, 81, 87],
                        [62, 80, 60, 82, 80, 95, 65, 78, 80, 15, 68, 61, 85, 64, 77, 72, 66, 75, 68, 80],
                        [30, 62, 42, 53, 44, 43, 22, 23, 60, 62, 43, 48, 35, 45, 49, 50, 60, 65, 13, 50],
                        [12, 12, 18, 24, 12, 18, 42, 30, 32, 15, 44, 42, 42, 30, 32, 26, 14, 16, 12, 8],
                    ]
                },
                {
                    // 这个 "boxplot" transform 生成了两个数据：
                    // result[0]: boxplot series 所需的数据。
                    // result[1]: 离群点数据。
                    // 当其他 series 或者 dataset 引用这个 dataset 时，他们默认只能得到
                    // result[0] 。
                    // 如果想要他们得到 result[1] ，需要额外声明如下这样一个 dataset ：
                    transform: {
                        type: 'boxplot',
                        config: {
                            itemNameFormatter: (params:any)=>{
                                return filtration[params.value]
                            }
                        },
                        // print: true        // 调试状态打印结果
                    }
                },
                {
                    // 这个 dataset 的 index 为 `2`。
                    fromDatasetIndex: 1,      // 这个额外的 dataset 指定了数据来源于 index 为 `1` 的 dataset。
                    fromTransformResult: 1    // 并且指定了获取 transform result[1] 。
                }
            ],
            xAxis: {
                name: 'Filtration Coefficient',
                type: 'category',
                boundaryGap: true,
                nameGap: 30,
                nameLocation: 'middle',
                nameTextStyle:{
                    fontSize: 14,
                    fontWeight: "bold"
                },
                splitArea: {
                    show: true
                },
                splitLine: {
                    show: true
                },

            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    itemStyle: {
                        color: '#e0c298'
                    },
                    // Reference the data from result[0].
                    // 这个 series 引用 index 为 `1` 的 dataset 。
                    datasetIndex: 1
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    itemStyle: {
                        color: '#0e8f7c'
                    },
                    // 这个 series 引用 index 为 `2` 的 dataset 。
                    // 从而也就得到了上述的 transform result[1] （即离群点数据）
                    datasetIndex: 2
                }
            ]
        }
        myChart.setOption(option1);
    }

    public render(){
        return (
            <div id="boxplot" className="canvas" style ={{
                display:this.props.isRender?'block':'none',
                width: '400px',
                height: '300px',
                borderTop: '2px solid #555555',
                left: '-6px'
            }}/>
        )
    }
}