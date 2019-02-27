import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import { Layout } from 'antd';
import * as servInfo from '../../assets/data/testServInfo.json';

const { Content} = Layout;

interface Props{
    name: string;
}

interface State{
    servInfoData: object;
    servTitle: string;
}

class ServiceInfo extends React.Component<Props,State>{
    private SERV_INFO = servInfo[0];
    constructor(props: Props){
        super(props)
        this.state = {
            servInfoData: this.SERV_INFO[0],
            servTitle: this.SERV_INFO.Title
        }
    }

    public render() {
        return (
            <Layout className="_info">
                <header>Home / {this.state.servTitle}</header>
                <Content className="_info_container">
                    service _info
                </Content>  
            </Layout>
        );
    }
}

export default ServiceInfo;