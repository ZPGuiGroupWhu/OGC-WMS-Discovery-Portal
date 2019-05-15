import * as React from 'react';
import '../../style/_serviceQuality.scss';

class ThemeMap extends React.Component {

// iframe的src路径是相对于public文件夹下的index.html
  public render() {
    return (
      <div id="map">
      <iframe src='/qualityOfServiceView/VisualisationOfQoS.html' 
              sandbox="allow-scripts allow-same-origin allow-forms"  frameBorder={0}/> 
      </div>
    );
  }
}
export default ThemeMap;
