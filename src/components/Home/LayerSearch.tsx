import * as React from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';

const { Content} = Layout;

class LayerSearch extends React.Component {
  public render() {
    return (
          <Layout style={{ padding: '20px 0', background: '#fff' }}>
            <Content style={{ padding: '0 20px', minHeight: 280 }}>
              Content
            </Content>
          </Layout>
    );
  }
}

export default LayerSearch;
