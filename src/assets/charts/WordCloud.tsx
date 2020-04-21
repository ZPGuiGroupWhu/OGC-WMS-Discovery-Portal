import * as React from 'react';
import  * as echarts from 'echarts';
import 'echarts-wordcloud'


export default class WordCloud extends React.Component{
    private data=[{
        name: 'water',
        value: 100
        },
        {
        name: 'stream',
        value: 95
        },
        {
        name: 'ocean',
        value: 95
        },
        {
        name: 'rain',
        value: 90
        },
        {
        name: 'snow',
        value: 90
        },
        {
        name: 'undergroudWater',
        value: 85
        },
        {
        name: 'surfaceWater',
        value: 85
        },
        {
        name: 'ice',
        value: 80
        },
        {
        name: 'flood',
        value: 80
        },
        {
        name: 'sea',
        value: 75
        },
        {
        name: 'river',
        value: 75
        },
        {
        name: 'vapor',
        value: 70
        },
        {
        name: 'cloud',
        value: 70
        },
        {
        name: 'waterfall',
        value: 65
        },
        {
        name: 'brook',
        value: 65
        },
        {
        name: 'pond',
        value: 60
        },
        {
        name: 'fog',
        value: 60
        },
        {
        name: 'lake',
        value: 55
        },
        {
        name: 'sewage',
        value: 55
        },
        {       
        name: 'pool',
        value: 50
        },]

    public componentDidMount() {
         const ec=echarts as any;
         const myChart = ec.init(document.getElementById('wordCloud'));
         const option = {
             tooltip:{
                 trigger: 'item',
                 formatter: '{b} : {c} ',
             },
             series : [{
                type: 'wordCloud',
                shape: 'circle',
                // left: 'center',
                // top: 'center',
                 width: '100%',
                 height: '100%',
                // Text size range which the value in data will be mapped to.
                // Default to have minimum 10px and maximum 30px size.
                sizeRange: [10, 30],
                // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
                rotationRange: [-60, 60],
                rotationStep: 30,
                // size of the grid in pixels for marking the availability of the canvas
                // the larger the grid size, the bigger the gap between words.
                gridSize: 6,
                // set to true to allow word being draw partly outside of the canvas.
                // Allow word bigger than the size of the canvas to be drawn
                drawOutOfBound: false,
                // Global text style
             textStyle: {
               normal: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                // Color can be a callback function or a color string
                color: ()=>{return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                ].join(',') + ')';},
               },
               emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
               }
             },
             // Data is an array. Each array item must have name and value property.
             data: this.data
            }]
           }
        myChart.setOption(option);
    }
       
    public render() {
        return (<div id="wordCloud" style ={{ width: 270 + 'px', height: 200 + 'px'}} />)
     }
 }
 