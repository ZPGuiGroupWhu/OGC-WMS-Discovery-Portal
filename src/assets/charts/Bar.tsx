import * as React from 'react';
import * as echarts from 'echarts';
export default class Bar extends React.Component{
    public componentDidMount() {
        const ec=echarts as any;
        const myChart = ec.init(document.getElementById('bar_chart'));

        const option = {
            backgroundColor: "#344b58",
            title: {
                text: "Yearly distribution of Map layers and WMSs with current map layers",
                x: "4%",

                textStyle: {
                    color: '#fff',
                    fontSize: '22'
                },
                subtextStyle: {
                    color: '#90979c',
                    fontSize: '16',

                },
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                    textStyle: {
                        color: "#fff"
                    }

                },
            },
            grid: {
                borderWidth: 0,
                top: 110,
                bottom: 95,
                textStyle: {
                    color: "#fff"
                }
            },
            legend: {
                x: '4%',
                top: '11%',
                textStyle: {
                    color: '#90979c',
                },
                data: ['The total number of map layers collected in a paticular year', 'The number of WMSs whose latest map layers were collected in a paticular year']
            },
             

            calculable: true,
            xAxis: [{
                type: "category",
                axisLine: {
                    lineStyle: {
                        color: '#90979c'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisLabel: {
                    interval: 0,

                },
                data: [
                    1995,
                    1996,
                    1997,
                    1998,
                    1999,
                    2000,
                    2001,
                    2002,
                    2003,
                    2004,
                    2005,
                    2006,
                    2007,
                    2008,
                    2009,
                    2010,
                    2011,
                    2012,
                    2013,
                    2014,
                    2015
                ]
            }],
            yAxis: [{
                type: "value",
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#90979c'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0,

                },
                splitArea: {
                    show: false
                },

            }],
            dataZoom: [{
                show: true,
                height: 30,
                xAxisIndex: [
                    0
                ],
                bottom: 30,
                start: 10,
                end: 80,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle:{
                    color:"#d3dee5",
                    
                },
                   textStyle:{
                    color:"#fff"},
                   borderColor:"#90979c"
                
                
            }, {
                type: "inside",
                show: true,
                height: 15,
                start: 1,
                end: 35
            }],
            series: [{
                    name: "The total number of map layers collected in a paticular year",
                    type: "bar",
                    barMaxWidth: 35,
                    barGap: "10%",
                    label: {
                        show: true,
                        color: "#fff",
                        position: "insideTop",
                        formatter: (p:any) => {
                            return p.value > 0 ? (p.value) : '';
                        }},
                    itemStyle: {
                        color: "rgba(255,144,128,1)",
                    },
                    data: [
                        1544,
                        1538,
                        1596,
                        1603,
                        1621,
                        3231,
                        2042,
                        1848,
                        2331,
                        2414,
                        2774,
                        4985,
                        3196,
                        3527,
                        3806,
                        8422,
                        3464,
                        4318,
                        3474,
                        2805,
                        2386
                    ],
                }, 
                {
                    name: "The number of WMSs whose latest map layers were collected in a paticular year",
                    type: "line",
                    symbolSize:10,
                    symbol:'circle',
                    label: {
                        show: true,
                        position: "top",
                        formatter: (p:any) => {
                            return p.value > 0 ? (p.value) : '';
                        }
                    },
                    itemStyle: {
                        color: "rgba(252,230,48,1)",
                        barBorderRadius: 0,
                    },
                    data: [
                        46,
                        36,
                        23,
                        96,
                        30,
                        280,
                        66,
                        75,
                        65,
                        81,
                        115,
                        1045,
                        88,
                        106,
                        101,
                        579,
                        757,
                        535,
                        188,
                        143,
                        132
                    ]
                },
            ]
        }
        myChart.setOption(option);

    }
    public render() {
        return (
            <div id="bar_chart" style={{width: 800 + 'px', height: 400 + 'px', margin: 'auto'}} />
        )
    }
}
