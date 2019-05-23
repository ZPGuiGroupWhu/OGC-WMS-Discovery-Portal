import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_layer_service_info.scss';
import { Layout, Icon } from 'antd';
import $req from '../../util/fetch';
import {reqUrl} from '../../util/util';
import {NavLink as Link} from 'react-router-dom';
import { ILayer } from "../../util/interface";

const { Content} = Layout;

interface Props{
    name: string;
}

interface State{
    layerInfoData: ILayer;
}

class LayerInfo extends React.Component<Props,State>{

    constructor(props: Props){
        super(props)
        this.state = {
            layerInfoData:{
                abstr: '',
                attribution: '',
                bbox: [],
                id: 1,
                keywords: '',
                name: '',
                photo: '',
                projection: '',
                title: '',
                topic: '',
                url: '',
                service:{}
            }
        }
    }

    public componentDidMount(){
        this.initData();
    }

    public render() {
        return (
            <Layout className="_info">
                <header><Icon type="home"/><Link to="/">Home</Link> / {this.state.layerInfoData.name}</header>
                <Content className="_info_container" />
            </Layout>
        );
    }

    // init service info: to get data
    public async initData(){
        const baseUrl:string = 'search/queryLayerInfo';
        const url:string = reqUrl({id:2},baseUrl,'8080');
        try {
            const res: any = await $req(url,{})
            console.log(res)
            this.setState({
                layerInfoData: JSON.parse(res).data
            })
        } catch(e) {
            alert(e.message)
        }
    }
}

export default LayerInfo;