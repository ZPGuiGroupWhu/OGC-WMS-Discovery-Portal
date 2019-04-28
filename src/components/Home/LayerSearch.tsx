import * as React from 'react';
import { Layout, Statistic } from 'antd';

class LayerSearch extends React.Component {
  public render() {
    return (
        <Layout className="main_container_content_imglist sr-only">
          <div className="main_container_content_imglist_statis">
            <Statistic className="main_container_content_imglist_statis_value" value={0}/>
            <span> layer images have been found.</span>
          </div>
        </Layout>
    );
  }
}

export default LayerSearch;
