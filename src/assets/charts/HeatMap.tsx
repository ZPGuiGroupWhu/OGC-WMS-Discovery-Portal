import * as React from "react";
import  * as echarts from 'echarts';
import '../../style/_intention.scss'
interface Props{
    isRender: boolean
}

export default class HeatMap extends React.Component<Props>{
    public componentDidMount() {
        const ec=echarts as any;
        const myChart=ec.init(document.getElementById('heatMap'))

        const filtration=[0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.4]
        const mergeNum=[50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

        
        const data = [[0,0,1],[0,1,1],[0,2,3],[0,3,4],[0,4,6],[0,5,4],[0,6,4],[0,7,3],[0,8,3],[0,9,2],[0,10,5],
            [1,0,6],[1,1,9],[1,2,11],[1,3,6],[1,4,7],[1,5,8],[1,6,12],[1,7,5],[1,8,5],[1,9,7],[1,10,2],
            [2,0,9],[2,1,8],[2,2,10],[2,3,6],[2,4,5],[2,5,5],[2,6,5],[2,7,7],[2,8,4],[2,9,2],[2,10,4],
            [3,0,14],[3,1,13],[3,2,12],[3,3,9],[3,4,5],[3,5,5],[3,6,10],[3,7,6],[3,8,4],[3,9,4],[3,10,1],
            [4,0,4],[4,1,4],[4,2,14],[4,3,12],[4,4,1],[4,5,8],[4,6,5],[4,7,3],[4,8,7],[4,9,3],[4,10,0],
            [5,0,6], [5,1,5],[5,2,7],[5,3,11],[5,4,6],[5,5,0],[5,6,5],[5,7,3],[5,8,4],[5,9,2],[5,10,0],
            [6,0,1],[6,1,3],[6,2,4],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,1],[6,8,2],[6,9,2],[6,10,6]]
            .map( (item)=> {
                return [item[1], item[0], item[2]*6 || '-'];
            });

        const option = {
            title:{
                text:'Confidence Heatmap',
                left: 'center',
                padding: [10,5,5,5],
                textStyle:{
                    fontSize: 16,
                }
            },
            tooltip: {
                position: 'top',
            },
            toolbox:{
                feature:{
                    dataZoom: { show: true},
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            grid: {
                bottom: '20%',
                top: '12%',
                left: '15%',
            },
            xAxis: {
                name: 'Number of Merge',
                type: 'category',
                data: mergeNum,
                nameLocation: 'middle',
                nameGap: 25,
                nameTextStyle:{
                    padding: [0, 0, 0, 230],
                    fontSize: 14,
                    fontWeight: "bold"
                },
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                name: 'Filtration Coefficient',
                type: 'category',
                data: filtration,
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle:{
                    fontSize: 14,
                    fontWeight: "bold"
                },
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                min: 0,
                max: 100,
                calculable: true,
                orient: 'horizontal',
                left: 0,
                bottom: '0%',
                text:['100%','Confidence:  0%'],
                align: 'left',
                itemWidth: 15,
                itemHeight: 100
            },
            series: [
                {
                    name: 'Confidence',
                    type: 'heatmap',
                    data,
                    label: {
                        show: true
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
    public render(){
        return (
            <div id="heatMap" className="canvas" style ={{
                display:this.props.isRender?'block':'none',
                width: '400px',
                height: '300px',
                borderTop: '2px solid #555555',
               }}/>
        )
    }
}