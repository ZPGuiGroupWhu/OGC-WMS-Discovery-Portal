import * as React from 'react';
import 'antd/dist/antd.css';
import '../style/_footer.scss';
import { Layout} from 'antd';
const { Footer} = Layout;

class PortalFooter extends React.Component {
    public render() {
      return (
        <Footer className="footer">
          <span>Geographic Service catalogue Copyright &copy; 2018</span>
          <a href="https://github.com/zpguigroupwhu" rel="noopener noreferrer" target="_blank"> GeoAI & Spatial Visual Analytics Lab (GeoAI&SVAL) @ Wuhan University</a>
      </Footer>
      );
    }
}
  
export default PortalFooter;