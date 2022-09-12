import * as React from 'react';
import  * as echarts from 'echarts';
export default class Pie extends React.Component{
   public componentDidMount() {
        const ec=echarts as any;
        const myChart = ec.init(document.getElementById('pie_chart'));
        const option = {
            title : {
                subtext: '',
                text: 'Continental proportion',
                left: 'center',
                // x:'right'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left: 'left',
                top: '10%',
                data: ['Europe','North America','Asia','South America','Oceania', 'Africa']
            },
            series : [
                {
                    name: 'Continent',
                    type: 'pie',
                    radius : '53%',
                    center: ['50%', '65%'],
                    data:[
                        {value:22.6, name:'Europe'},
                        {value:76.8, name:'North America'},
                        {value:0.23, name:'Asia'},
                        {value:0.21, name:'South America'},
                        {value:0.15, name:'Oceania'},
                        {value:0.01, name:'Africa'}
                    ],
                    emphasis:{
                        itemStyle:{
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                }
            ]
        };
        myChart.setOption(option);
        const myChart2 = ec.init(document.getElementById('provider_chart'));

        const option2 = {
            title : {
                text: 'Provider type proportion',
                subtext: '',
                left: 'center',
                // x:'right'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left: 'left',
                top: '10%',
                data: ['Government','Academic institutions','Intergovernmental organizations','Industry','Other']
            },
            series : [
                {
                    name: 'Provider',
                    type: 'pie',
                    radius : '53%',
                    center: ['50%', '65%'],
                    data:[
                        {value:528, name:'Government'},
                        {value:479, name:'Academic institutions'},
                        {value:288, name:'Intergovernmental organizations'},
                        {value:25, name:'Industry'},
                        {value:81, name:'Other'}
                    ],
                    emphasis:{
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart2.setOption(option2);

    }
    public render() {
        return (
            <div id="pie" style={{width: 800 + 'px', height: 320 + 'px', margin: 'auto'}}>
                <div id="pie_chart" style ={{ width: 390 + 'px', height: 320 + 'px', float: 'left', marginLeft: '20px'}} />
                <div id="provider_chart" style ={{ width: 390 + 'px', height: 320 + 'px', float: 'left'}} />
            </div>
        )
    }
}
