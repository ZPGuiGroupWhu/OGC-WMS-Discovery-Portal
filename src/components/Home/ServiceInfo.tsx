import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import { Layout, Icon } from 'antd';
import $req from '../../util/fetch';
import {reqUrl} from '../../util/util';
import {NavLink as Link} from 'react-router-dom';
import * as testData from '../../assets/data/testServList.json';
import { IServInfo, ILayer } from "../../util/interface";

const { Content} = Layout;

interface Props{
    name: string;
}

interface State{
    layerData: ILayer[];
    servInfoData: IServInfo;
}

class ServiceInfo extends React.Component<Props,State>{

    constructor(props: Props){
        super(props)
        this.state = {
            layerData:[],
            servInfoData: {
                abstr: '',
                administrative_unit: '',
                geoLocation: [],
                id: 0,
                ip: '',
                keywords: '',
                layer: [],
                title: '',
                url: '',
                version: ''
            },
        }
    }

    public componentDidMount(){
        this.initData();
    }

    public render() {
        return (
            <Layout className="_info">
                <header><Icon type="home"/><Link to="/">Home</Link> / {this.state.servInfoData.title}</header>
                <Content className="_info_container">
                    <b className="_info_container_header">{this.state.servInfoData.title}</b><br/>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <span><Icon className="icon" type="compass"/><b>Location：</b>{this.state.servInfoData.administrative_unit}</span>
                            <span className="span"><Icon className="icon" type="pushpin"/><b>GeoGraphic Location：</b>{this.state.servInfoData.geoLocation[0]},{this.state.servInfoData.geoLocation[1]}</span><br/>
                            <p>{this.state.servInfoData.abstr ? this.state.servInfoData.abstr : 'There is no abstract in the service capability document.'}</p><br/>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <b className="_info_container_section_header">Access & Use Information</b><br/>
                        <Content className="_info_container_section_content">
                            <Icon className="icon" type="link" /><b>Access link：</b><a href={this.state.servInfoData.url}>{this.state.servInfoData.url}</a><br/>
                            <Icon className="icon" type="user" /><b>Contact Person：</b><span>{testData[0][0].ContactPerson}</span>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <b className="_info_container_section_header">Keywords</b><br/>
                        <Content className="_info_container_section_content" />
                    </Content>
                </Content>  
            </Layout>
        );
    }

    // init service info: to get data
    public async initData(){
        const baseUrl:string = 'search/queryWMSInfo';
        const url:string = reqUrl({id:1},baseUrl,'8080');
        try {
            const res: any = await $req(url,{})
            console.log(res)
            this.setState({
                servInfoData: JSON.parse(res).data
            })
        } catch(e) {
            alert(e.message)
        }
    }
}

export default ServiceInfo;