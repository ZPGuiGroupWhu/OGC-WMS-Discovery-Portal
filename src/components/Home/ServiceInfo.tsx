import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import { Layout, Icon, Card } from 'antd';
import $req from '../../util/fetch';
import {reqUrl} from '../../util/util';
import {NavLink as Link} from 'react-router-dom';
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
                contact_info: {
                    address: '',
                    administrative_unit: '',
                    city: '',
                    email: '',
                    fascimile_tel: '',
                    organization: '',
                    person: '',
                    position: '',
                    post_code: '',
                    state_province: '',
                    voice_tel: ''
                },
                geoLocation: [],
                id: 0,
                ip: '',
                keywords: '',
                layer: [],
                title: '',
                topic: '',
                url: '',
                version: ''
            },
        }
    }

    public componentDidMount(){
        this.initData();
    }

    public judgenull(str:string){
        if(str){
            return(
                <span className="tag">{str}</span>
            )
        }
        else{
          return(
              <span className="tagnull">null</span>
          )
        }
    }
    

    public showphoto = (Layer: ILayer) => {
        return (
        <div className="responsive">
            <Link to='/layerInfo'>
               <Card hoverable={true} cover={<img src={Layer.url} />} bodyStyle={{padding:2, textAlign: "center"}}>
                 <b>Keywords：</b><span>{Layer.keywords ? Layer.keywords : 'null'}</span><br/>
                <b>Title：</b><span>{Layer.title ? Layer.title : 'null'}</span>
              </Card>
            </Link>
        </div>     
        );
    }

    public showphotos = (Layers: ILayer[]) => {
        return (
            <div>
                {Layers.map((item:ILayer)=>{
                    return this.showphoto(item); 
                })}
            </div>               
        );
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
                            <Icon className="icon" type="user" /><b>Contact Person：</b><span>{ this.state.servInfoData.contact_info.person }</span><br/>                        
                            <span><Icon className="icon" type="environment" /><b>Address：</b><span className="double">{ this.state.servInfoData.contact_info.address }</span></span>
                            <span className="span"><Icon className="icon" type="mail" /><b>Post Code：</b>{ this.state.servInfoData.contact_info.post_code }</span><br/>
                            <span><Icon className="icon" type="message" /><b>Email Address：</b>{ this.state.servInfoData.contact_info.email }</span><br/>
                            <span><Icon className="icon" type="upload" /><b>Fascimile Tel：</b><span className="double">{ this.state.servInfoData.contact_info.fascimile_tel }</span></span>
                            <span className="span"><Icon className="icon" type="phone" /><b>Voice Tel：</b>{ this.state.servInfoData.contact_info.voice_tel }</span><br/>
                            <span><Icon className="icon" type="usergroup-add" /><b>Organization：</b><span className="double">{ this.state.servInfoData.contact_info.organization }</span></span>
                            <span className="span"><Icon className="icon" type="solution" /><b>Position：</b>{ this.state.servInfoData.contact_info.position }</span><br/><br/>
                        </Content>  
                    </Content>
                    <Content className="_info_container_section">
                        <b className="_info_container_section_header">Keywords & Topic</b><br/>
                        <Content className="_info_container_section_content">
                            <span><Icon className="icon" type="bulb" /><b>Keywords：</b>{ this.judgenull(this.state.servInfoData.keywords) }</span><br/>
                            <span><Icon className="icon" type="check-circle" /><b>Topic：</b>{ this.judgenull(this.state.servInfoData.topic) }</span><br/><br/>
                        </Content> 
                    </Content>
                    <Content className="_info_container_section">
                        <b className="_info_container_section_header">Other Details</b><br/>
                        <Content className="_info_container_section_content">
                            <span><Icon className="icon" type="switcher" /><b>Version：</b>{ this.state.servInfoData.version }</span><br/>
                            <span><Icon className="icon" type="paper-clip" /><b>IP：</b>{ this.state.servInfoData.ip }</span><br/><br/>
                        </Content> 
                    </Content>
                    <Content className="_info_container">
                        <b className="_info_container_header">Layer Info</b><br/>
                        <Content className="_info_container_section_content">
                            {this.showphotos(this.state.servInfoData.layer)}
                        </Content> 
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
            // console.log(res)
            this.setState({
                servInfoData: JSON.parse(res).data
            })
        } catch(e) {
            alert(e.message)
        }
    }
}

export default ServiceInfo;