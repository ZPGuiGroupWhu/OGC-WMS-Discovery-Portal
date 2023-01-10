import * as React from 'react';
import {Layout} from 'antd';
class Settings extends React.Component{

    public render(){
        return(
            <Layout>
                <Layout.Sider theme = "light">这时侧边栏</Layout.Sider>
                <Layout.Content>
                    <p>This is a settings page</p>
                    <p>这是主页面的内容</p>
                </Layout.Content>
            </Layout>

        )
    }
}

export default Settings