import * as React from 'react';
import WebGLGlobe from './distribution_globe/webglGlobe'
import '../../style/_globe.scss';
class Distribution extends React.Component {
  public render() {
    return (
      <div>
         <WebGLGlobe /> 
      </div>
      
    );
  }

}

export default Distribution;