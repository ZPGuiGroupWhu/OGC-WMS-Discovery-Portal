import * as React from 'react';
import  * as echarts from 'echarts';
export default class Bar2 extends React.Component{
    public componentDidMount() {
        const ec=echarts as any;
        const myChart = ec.init(document.getElementById('bar2_chart'));
        const option = {
            title: {
                text: 'WMS 主题词统计',
                x:'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data : ['Geology', 'Climate', 'Land', 'Water', 'Ocean', 'Species', 'Census', 'Vegetation', 'Fire', 'Atmosphere', 'Energy', 'Lithology', 'Meteorology', 'Soil', 'Solar', 'Wind', 'Temperature', 'NDVI','Boundaries', 'Coast', 'Population', 'Islands', 'Environment'],
            },
            series: [
                {
                    name: '主题词',
                    type: 'bar',
                    data:[9418,8514,7147,6408,6017,4460,4192,3598,3546,3456,3240,3220,3187,3171,2987,2360,2355,2236,2170,2154,1846,1497,145]
                }
            ]
        };

        myChart.setOption(option);

    }
    public render() {
        return (
            <div id="bar2_chart" style={{width: 800 + 'px', height: 600 + 'px', margin: 'auto'}} />
        )
    }
}
