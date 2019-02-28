import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import { Layout } from 'antd';
import $req from '../../util/fetch';
import {reqUrl} from '../../util/util';

const { Content} = Layout;

interface Props{
    name: string;
}

interface State{
    servInfoData: object;
}

class ServiceInfo extends React.Component<Props,State>{

    constructor(props: Props){
        super(props)
        this.state = {
            servInfoData: {}
        }
    }

    public componentDidMount(){
        this.initData();
    }

    public render() {
        return (
            <Layout className="_info">
                <header>Home / </header>
                <Content className="_info_container">
                    service _info
                </Content>  
            </Layout>
        );
    }

    // init service info: to get data
    public async initData(){
        const baseUrl:string = 'search/queryWMSInfo';
        const url:string = reqUrl({id:1},baseUrl,'8002');
        try {
            const res: any = await $req(url,{})
            console.log(res)
        } catch(e) {
            alert(e.message)
        }
    }
}

export default ServiceInfo;