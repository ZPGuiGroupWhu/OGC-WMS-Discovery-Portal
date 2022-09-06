import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_info.scss';

import {
    BulbOutlined,
    CheckCircleOutlined,
    CompassOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    LinkOutlined,
    MailOutlined,
    MessageOutlined,
    PaperClipOutlined,
    PhoneOutlined,
    PushpinOutlined,
    SolutionOutlined,
    SwitcherOutlined,
    UploadOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from '@ant-design/icons';

import { Layout, Card, List } from 'antd';
import $req from '../../util/fetch';
import {reqUrl} from '../../util/util';
import {NavLink as Link} from 'react-router-dom';
import { IServInfo, ILayer } from "../../util/interface";
import {connect} from 'react-redux'
import {conveyLayerID} from '../../redux/action'

const { Content} = Layout;

interface Props{
   // name: string;
    serviceID: number;
    dispatch: (action: any)=>void;
}

interface State{
    // layerData: ILayer[];  // abandon
    servInfoData: IServInfo;
}

class ServiceInfo extends React.Component<Props,State>{

    constructor(props: Props){
        super(props)
        this.state = {
            // layerData:[],
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
                id: 1,
                ip: '',
                keywords: '',
                layers: [],
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
    

    public render() {
        return (
            <Layout className="_info">
                <header><HomeOutlined /><Link to="/">Home</Link> / {this.state.servInfoData.title}</header>
                <Content className="_info_container">
                    <b className="_info_container_header">{this.state.servInfoData.title}</b><br/>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <span><CompassOutlined className="icon" /><b>Location：</b>{this.state.servInfoData.administrative_unit}</span>
                            <span className="span"><PushpinOutlined className="icon" /><b>GeoGraphic Location：</b>({this.state.servInfoData.geoLocation[0]}, {this.state.servInfoData.geoLocation[1]})</span><br/>
                            <p>{this.state.servInfoData.abstr ? this.state.servInfoData.abstr : 'There is no abstract in the service capability document.'}</p><br/>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <b className="_info_container_section_header">Access & Use Information</b><br/>
                        <Content className="_info_container_section_content">
                            <LinkOutlined className="icon" /><b>Access link：</b><a href={this.state.servInfoData.url}>{this.state.servInfoData.url}</a><br/> 
                            <UserOutlined className="icon" /><b>Contact Person：</b><span>{ this.state.servInfoData.contact_info.person }</span><br/>                        
                            <span><EnvironmentOutlined className="icon" /><b>Address：</b><span className="double">{ this.state.servInfoData.contact_info.address }</span></span>
                            <span className="span"><MailOutlined className="icon" /><b>Post Code：</b>{ this.state.servInfoData.contact_info.post_code }</span><br/>
                            <span><MessageOutlined className="icon" /><b>Email Address：</b>{ this.state.servInfoData.contact_info.email }</span><br/>
                            <span><UploadOutlined className="icon" /><b>Fascimile Tel：</b><span className="double">{ this.state.servInfoData.contact_info.fascimile_tel }</span></span>
                            <span className="span"><PhoneOutlined className="icon" /><b>Voice Tel：</b>{ this.state.servInfoData.contact_info.voice_tel }</span><br/>
                            <span><UsergroupAddOutlined className="icon" /><b>Organization：</b><span className="double">{ this.state.servInfoData.contact_info.organization }</span></span>
                            <span className="span"><SolutionOutlined className="icon" /><b>Position：</b>{ this.state.servInfoData.contact_info.position }</span><br/><br/>
                        </Content>  
                    </Content>
                    <Content className="_info_container_section">
                        <b className="_info_container_section_header">Keywords & Topic</b><br/>
                        <Content className="_info_container_section_content">
                            <span><BulbOutlined className="icon" /><b>Keywords：</b>{ this.judgenull(this.state.servInfoData.keywords) }</span><br/>
                            <span><CheckCircleOutlined className="icon" /><b>Topic：</b>{ this.judgenull(this.state.servInfoData.topic) }</span><br/><br/>
                        </Content> 
                    </Content>
                    <Content className="_info_container_section">
                        <b className="_info_container_section_header">Other Details</b><br/>
                        <Content className="_info_container_section_content">
                            <span><SwitcherOutlined className="icon" /><b>Version：</b>{ this.state.servInfoData.version }</span><br/>
                            <span><PaperClipOutlined className="icon" /><b>IP：</b>{ this.state.servInfoData.ip }</span><br/><br/>
                        </Content> 
                    </Content>
                    <Content className="_info_container">
                        <b className="_info_container_header">Layer Info</b><br/>
                        <Content className="_info_container_section_content">
                            {this.layerInfo(this.state.servInfoData.layers)}
                        </Content> 
                    </Content>
                </Content>  
            </Layout>
        );
    }

  
    public layerInfo = (layers:ILayer[]) =>{
        const col=6;  // every row has six picture
        const round=Math.floor(layers.length/col);
        const remainder=layers.length%col;
        const data:ILayer[][]=[];
         for(let i=0;i<round;++i){
            data[i]=[]
            for(let k=0;k<col;++k){
                data[i][k]=layers[i*col+k];
            }
          }
          if (remainder!==0){
            data[round]=[]
            for(let m=0;m<remainder;++m){
                 data[round][m]=layers[round*col+m]
             }
          }
        return (
            <List
            itemLayout="vertical"
            size="small"
            dataSource={data}
            renderItem={(item:ILayer[])=>(
               <List.Item>
                   <List
                   className="main_container_content_childimglist"
                   itemLayout="horizontal"
                   size="small"
                   grid={{gutter:25,column:6}}
                   dataSource={item}
                   renderItem={(childItem:ILayer) => (
                       <List.Item key={childItem.id} className="main_container_content_imglist_item">
                           <Link to='/layerInfo'>
                            <Card hoverable={true}  cover={<img src={'data:image/png;base64,'+childItem.photo} />}  onClick={()=>{this.props.dispatch(conveyLayerID(childItem.id))}}
                                  bodyStyle={{padding:2, textAlign: "center", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}>
                                    {childItem.name}
                            </Card>
                            </Link>
                       </List.Item>
                      )}
                   />
               </List.Item>
                )}
         />
          )
    }
    
    // init service info: to get data
    public async initData(){
        const baseUrl:string = 'search/queryWMSInfo';
        const reqPar: object = Object.assign({id:this.props.serviceID}, {photoType: 'Base64Str'})
        const url:string = reqUrl(reqPar,baseUrl,'8081');
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

// get serviceID from store(state.conveyIDReducer)
const mapStateToProps = (state:any)=>{
    return{
        serviceID:state.conveyIDReducer.serviceID
    }
}
export default connect(mapStateToProps)(ServiceInfo);