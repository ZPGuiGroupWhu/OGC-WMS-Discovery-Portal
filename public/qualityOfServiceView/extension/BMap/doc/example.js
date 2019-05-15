(function() {
    require.config({
        paths: {
            echarts: '../qualityOfServiceView/js'
        },
        packages: [{
            name: 'BMap',
            location: '../qualityOfServiceView/extension/Bmap/src',
            main: 'main'
        }]
    });

    require(
        [
            'echarts',
            'BMap',
            'echarts/chart/map'
        ],
        function(echarts, BMapExtension) {
            $('#main').css({
                height: "100%",
                width: "100%"
            });
            // 初始化地图
            var BMapExt = new BMapExtension($('#main')[0], BMap, echarts, {
                enableMapClick: false
            });
            var map = BMapExt.getMap();
            var container = BMapExt.getEchartsContainer();

            var startPoint = {
                x: 0,
                y: 30
            };
            var point = new BMap.Point(startPoint.x, startPoint.y);
            map.centerAndZoom(point, 1);
            map.enableScrollWheelZoom(true);
            // 地图自定义样式
            map.setMapStyle({
                styleJson: [{
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": {
                        "color": "#044161"
                    }
                }, {
                    "featureType": "land",
                    "elementType": "all",
                    "stylers": {
                        "color": "#004981"
                    }
                }, {
                    "featureType": "boundary",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#064f85"
                    }
                }, {
                    "featureType": "railway",
                    "elementType": "all",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#004981"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#005b96",
                        "lightness": 1
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#004981"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#00508b"
                    }
                }, {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "green",
                    "elementType": "all",
                    "stylers": {
                        "color": "#056197",
                        "visibility": "off"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "all",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "manmade",
                    "elementType": "all",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "all",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "boundary",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#029fd4"
                    }
                }, {
                    "featureType": "building",
                    "elementType": "all",
                    "stylers": {
                        "color": "#1a5787"
                    }
                }, {
                    "featureType": "label",
                    "elementType": "all",
                    "stylers": {
                        "visibility": "off"
                    }
                }]
            });

            option = {
                color: ['gold', 'aqua', 'lime'],
                title: {
                    text: 'QoGIS',
                    subtext: ' ',
                    x: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(v) {
                        return v[1].replace(':', ' > ');
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['Monitor-US.VIRGINIA',
                        'Monitor-IRELAND',
                        'Monitor-HONGKONG',
                        'Monitor-NETHERLANDS',
                        'Monitor-SINGAPORE',
                        'Monitor-US.CALIFORNIA',
                        'Monitor-US.VIRGINIA2',
                        'Monitor-IRELAND2',
                        'Monitor-NETHERLANDS2',
                        'Monitor-US.CALIFORNIA2',
                        'Monitor-HONGKONG2',
                        'Monitor-US.VIRGINIA3',
                        'Monitor-IRELAND3',
                        'Monitor-CHINA',
                        'Monitor-IRELAND4',
                        'Monitor_US.WASHINGTON',
                        'Monitor_US.ILLINOIS',
                        //' ',
                        'Service-Europe',
                        'Service-NorthAmerica',
                        'Service-Oceania',
                        'Service-SouthAmerica'
                    ],
                    //data: ['Monitor-US.VIRGINIA', 'Monitor-IRELAND', 'Monitor-HONGKONG','Monitor-NETHERLANDS','Monitor-SINGAPORE','Monitor-US.CALIFORNIA','Monitor-US.VIRGINIA2','Service-Europe','Service-NorthAmerica','Service-Oceania','Service-SouthAmerica'],
                    selectedMode: 'single',
                    selected: {
                        //'Monitor-US.VIRGINIA': false,
                        'Monitor-IRELAND': false,
                        'Monitor-HONGKONG': false,
                        'Monitor-NETHERLANDS': false,
                        'Monitor-SINGAPORE': false,
                        'Monitor-US.CALIFORNIA': false,
                        'Monitor-US.VIRGINIA2': false,
                        'Monitor-IRELAND2': false,
                        'Monitor-NETHERLANDS2': false,
                        'Monitor-US.CALIFORNIA2': false,
                        'Monitor-HONGKONG2': false,
                        'Monitor-US.VIRGINIA3': false,
                        'Monitor-IRELAND3': false,
                        'Monitor-CHINA': false,
                        'Monitor-IRELAND4': false,
                        'Monitor_US.WASHINGTON': false,
                        'Monitor_US.ILLINOIS': false,
                        //' ': false,
                        'Service-Europe': false,
                        'Service-NorthAmerica': false,
                        'Service-Oceania': false,
                        'Service-SouthAmerica': false
                    },
                    textStyle: {
                        color: '#fff'
                    }
                },
                toolbox: {
                    show: false,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                dataRange: {
                    min: 0,
                    max: 2,
                    x: 'right',
                    calculable: true,
                    color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [{
                        name: 'Monitor-US.VIRGINIA',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        geoCoord: geoCoord // 引用data.js中的geoCoord
                        ,

                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[1]
                                //                            data:testData4_1
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            //                            data:testData4_2
                            data: monitorDataPoint[1]

                        }

                    }, {
                        name: 'Monitor-IRELAND',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data:monitorDataLine[2]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[2]
                        }
                    }, {
                        name: 'Monitor-HONGKONG',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[3]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },

                            data: monitorDataPoint[3]
                        }
                    }, {
                        name: 'Monitor-NETHERLANDS',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[4]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[4]
                        }
                    }, {
                        name: 'Monitor-SINGAPORE',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[5]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[5]
                        }
                    }, {
                        name: 'Monitor-US.CALIFORNIA',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[6]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[6]
                        }
                    }, {
                        name: 'Monitor-US.VIRGINIA2',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[7]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[7]
                        }
                    }, {
                        name: 'Monitor-IRELAND2',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[8]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[8]
                        }
                    }, {
                        name: 'Monitor-NETHERLANDS2',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[9]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[9]
                        }
                    }, {
                        name: 'Monitor-US.CALIFORNIA2',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[10]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[10]
                        }
                    }, {
                        name: 'Monitor-HONGKONG2',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[11]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[11]
                        }
                    }, {
                        name: 'Monitor-US.VIRGINIA3',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[12]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[12]
                        }
                    }, {
                        name: 'Monitor-IRELAND3',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[14]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[14]
                        }
                    }, {
                        name: 'Monitor-CHINA',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[16]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[16]
                        }
                    }, {
                        name: 'Monitor-IRELAND4',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[17]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[17]
                        }
                    }, {
                        name: 'Monitor_US.WASHINGTON',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[18]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[18]
                        }
                    }, {
                        name: 'Monitor_US.ILLINOIS',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: monitorDataLine[19]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: false }
                                }
                            },
                            data: monitorDataPoint[19]
                        }
                     },
                     //{
                    //     name: ' ',
                    //     type: 'map',
                    //     mapType: 'none',
                    //     data: [],
                    //     markLine: {
                    //         smooth: true,
                    //         effect: {
                    //             show: true,
                    //             scaleSize: 1,
                    //             period: 30,
                    //             color: '#fff',
                    //             shadowBlur: 10
                    //         },
                    //         itemStyle: {
                    //             normal: {
                    //                 borderWidth: 1,
                    //                 lineStyle: {
                    //                     type: 'solid',
                    //                     shadowBlur: 10
                    //                 }
                    //             }
                    //         },
                    //         data: []
                    //     },
                    //     markPoint: {
                    //         symbol: 'emptyCircle',
                    //         symbolSize: function(v) {
                    //             return 10 + v / 10
                    //         },
                    //         effect: {
                    //             show: true,
                    //             shadowBlur: 0
                    //         },
                    //         itemStyle: {
                    //             normal: {
                    //                 label: { show: false }
                    //             }
                    //         },

                    //         data: []
                    //     }
                    // }, '
                    {
                        name: 'Service-Europe',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },

                            data: countryData2[1]
                        }

                    }, {
                        name: 'Service-NorthAmerica',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: countryData2[2]
                        }

                    }, {
                        name: 'Service-Oceania',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: countryData2[3]
                        }

                    }, {
                        name: 'Service-SouthAmerica',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: countryData2[4]
                        }
                    }


                ]
            };

            var myChart = BMapExt.initECharts(container);
            BMapExt.setOption(option);
        }
    );
})();
