import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Detector from './Detector';
import TWEEN from './Tween';
import DAT from './globeAdd';
import data from '../../../assets/data/population909500.json';

export default class WebGLGlobe extends React.Component{
  render() {
    return (
      <div id="webglGlobe">
        <div id="countries">
        </div>
        <div className="container" ref="container">
        </div>
        <div id="currentInfo">
          <span ref="year1990" className="year">46296WMSs</span>
        </div>
        <ul id="serviceInfo">
          <li>North America: 76.80%</li>
          <li>Europe: 22.60%</li>
          <li>Asia: 0.23%</li>  
          <li>South America: 0.21%</li>
          <li>Oceania: 0.15%</li>
          <li>Africa: 0.01%</li>
        </ul>
        <div id="title">
        WMS distribution
        </div>
      </div>
    );
  }

  componentDidMount() {
// tslint:disable-next-line: variable-name
    var _this = this;
    var container = ReactDOM.findDOMNode(this.refs.container);
    
    if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {
      //创建三维地球
      var globe = new DAT.Globe(container);
      var i;
      //tween补间动画的配置
// tslint:disable-next-line: no-shadowed-variable
      var settime = function(globe, t) {
        return function() {
          new TWEEN.Tween(globe).to({time: t},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
          //改变classname=year标签的字体大小
// tslint:disable-next-line: no-shadowed-variable
          var y = ReactDOM.findDOMNode(_this.refs[('year1990')]);
          if (y.getAttribute('class') === 'year active') {
            return;
          }
          var yy = document.getElementsByClassName('year');
          for(i=0; i<yy.length; i++) {
            yy[i].setAttribute('class','year');
          }
          y.setAttribute('class', 'year active');
        };
      };
      var y = ReactDOM.findDOMNode(this.refs[('year1990')]);
      y.addEventListener('mouseover', settime(globe,0), false);
      TWEEN.start();//启用补间动画
//在三维地球上添加可视化的柱状数据
      for (i=0;i<data.length;i++) {
              globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
      }
      globe.createPoints();
      (settime(globe,0).bind(this))();
      globe.animate();
      document.body.style.backgroundImage = 'none'; // remove loading
    }

  }

};

