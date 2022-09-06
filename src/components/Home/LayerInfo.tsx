import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_info.scss';

import {
    BankOutlined,
    BorderOutlined,
    BulbOutlined,
    CompassOutlined,
    ContainerOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    LinkOutlined,
    MailOutlined,
    MessageOutlined,
    MobileOutlined,
    PhoneOutlined,
    ProfileOutlined,
    ProjectOutlined,
    PushpinOutlined,
    RightOutlined,
    ShopOutlined,
    TagOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    UserOutlined,
} from '@ant-design/icons';

import { Layout, Card, Button } from 'antd';
import $req from '../../util/fetch';
import {reqUrl} from '../../util/util';
import {NavLink as Link} from 'react-router-dom';
import { ILayer } from "../../util/interface";
import {connect} from 'react-redux';
import {conveyServiceID} from '../../redux/action'

const { Content} = Layout;

interface Props{
    layerID: number;
    dispatch: (action:any) => void;
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
                bbox: [[],[]],
                id: 1,
                keywords: '',
                name: '',
                photo: '',
                projection: '',
                title: '',
                topic: '',
                url: '',
                fContent: '',
                fSpace: '',
                fStyle: '',
                fTopic: '',
                service:{
                    abstr:'',
                    administrative_unit:'',
                    contact_info:{
                    address:'',
                    administrative_unit:'',
                    city:'',email:'',
                    fascimile_tel:'',
                    organization: '',
                    person:'',
                    position:'',
                    post_code:'',
                    state_province:'',
                    voice_tel: ''
                    },
                    geoLocation:[],
                    id:1,ip:'',
                    keywords:'',
                    title:'',
                    topic:'',
                    url:'',
                    version:''
                }
            }
        }
    }

    public componentDidMount(){
        this.initData();
    }

    public render() {
        let attribution='null';
        if(this.state.layerInfoData.attribution)
        {
            attribution=this.state.layerInfoData.attribution;
        }
        let LayerKeyword='null';
        if(this.state.layerInfoData.keywords)
        {
            LayerKeyword=this.state.layerInfoData.keywords;
        }
        let ServiceKeyword='null';
        if(this.state.layerInfoData.service["keywords"])
        {
            ServiceKeyword=this.state.layerInfoData.service["keywords"];
        }

        return (
            <Layout className="_info">
                <header><HomeOutlined /><Link to="/">Home</Link> / {this.state.layerInfoData.name}</header>
                <Content className="_info_container">
                <b className="_info_container_header">LayerInfo</b><br/>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_photo">
                           <Card hoverable={true} cover={<img src={'data:image/png;base64,'+this.state.layerInfoData.photo} />} bodyStyle={{padding:2, textAlign: "center"}}>
                                <span><b>Name:</b>{this.state.layerInfoData.name}</span><br/>
                                <span><b>Title:</b>{this.state.layerInfoData.title}</span>
                          </Card>
                        </Content>
                    </Content>
                    <Content className="_info_container_section" >
                    <span><b className="_info_container_section_header">Details of the layer:</b></span><br/>
                        <Content className="_info_container_section_content">
                        <span className='span'><TagOutlined className="icon" /><b>Name: </b>{this.state.layerInfoData.name}</span><br/>
                        <span className='span'><ContainerOutlined className="icon" /><b>Abstract: </b>{this.state.layerInfoData.abstr}</span><br/>
                        <span className='span'><PushpinOutlined className="icon" /><b>Attribution: </b>{attribution}</span><br/>
                        <span className='span'><EnvironmentOutlined className="icon" /><b>BoundingBox(using {this.state.layerInfoData.projection}): </b>
                            ({this.state.layerInfoData.bbox[0][0]}, {this.state.layerInfoData.bbox[0][1]}), ({this.state.layerInfoData.bbox[1][0]}, {this.state.layerInfoData.bbox[1][1]})</span><br/>
                        <span className='span'><LinkOutlined className="icon" /><b>Layer link：</b><a id="layerInfoUrl" href={this.state.layerInfoData.url}>{this.state.layerInfoData.url}</a></span><br/>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <b>Topic & Keywords</b><br/>
                            <span className='span'><BulbOutlined className="icon" /><b>Topic: </b><span className="tag">{this.state.layerInfoData.topic}</span></span><br/>
                            <span className='span'><ThunderboltOutlined className="icon" /><b>Keywords: </b><span className={(LayerKeyword!=='null')?'tag':'tagnull'}>{LayerKeyword}</span></span><br/>
                        </Content>
                    </Content>
                    { window.sessionStorage.getItem('dataSource') === 'labeled data' ?
                        <Content className="_info_container_section">
                            <Content className="_info_container_section_content">
                                <b>Tagging Dimensions</b><br/>
                                <span className='span'><TagOutlined className="icon" /><b>FContent: </b>
                                    {this.state.layerInfoData.fContent}</span><br/>
                                <span className='span'><ProjectOutlined className="icon" /><b>FSpace: </b>
                                    {this.state.layerInfoData.fSpace}</span><br/>
                                <span className='span'><PushpinOutlined className="icon" /><b>FStyle: </b>
                                    <span className="tag">{this.state.layerInfoData.fStyle}</span></span><br/>
                                <span className='span'><BulbOutlined className="icon" /><b>FTopic: </b>
                                    <span className="tag">{this.state.layerInfoData.fTopic}</span></span><br/>
                            </Content>
                        </Content>
                        : null}
                    <br/>
                    <b className="_info_container_header">The service messages of the layer</b><br/>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <span className='span'><CompassOutlined className="icon" /><b>Location：</b>{this.state.layerInfoData.service["administrative_unit"]}</span>
                            <span className="span"><PushpinOutlined className="icon" /><b>GeoGraphic Location：</b>({this.state.layerInfoData.service["geoLocation"][0]}, {this.state.layerInfoData.service["geoLocation"][1]})</span><br/>
                            <p>{this.state.layerInfoData.service["abstr"] ? this.state.layerInfoData.service["abstr"] : ''}</p>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <span className='span'><LinkOutlined className="icon" /><b>Access link：</b><a href={this.state.layerInfoData.service["url"]}>{this.state.layerInfoData.service["url"]}</a></span><br/>
                            <span className='span'><MobileOutlined className="icon" /><b>Contact_info</b></span><br/>
                            <span className='span'><UserOutlined className="icon" /><b>Person: </b>{this.state.layerInfoData.service["contact_info"].person}</span><br/>
                            <span className='span'><TeamOutlined className="icon" /><b>Organization: </b>{this.state.layerInfoData.service["contact_info"].organization}</span><br/>
                            <span className='span'><BankOutlined className="icon" /><b>Administrative_unit: </b>{this.state.layerInfoData.service["contact_info"].administrative_unit}</span><br/>
                            <span className='span'><BorderOutlined className="icon" /><b>State_province: </b>{this.state.layerInfoData.service["contact_info"].state_province}</span><br/>
                            <span className='span'><MailOutlined className="icon" /><b>Email: </b>{this.state.layerInfoData.service["contact_info"].email}</span>
                            <span className='span'><ProfileOutlined className="icon" /><b>Post_code: </b>{this.state.layerInfoData.service["contact_info"].post_code}</span><br/>
                            <span className='span'><EnvironmentOutlined className="icon" /><b>Address: </b>{this.state.layerInfoData.service["contact_info"].address}</span><br/>
                            <span className='span'><ShopOutlined className="icon" /><b>City: </b>{this.state.layerInfoData.service["contact_info"].city}</span><br/>
                            <span className='span'><CompassOutlined className="icon" /><b>Position: </b>{this.state.layerInfoData.service["contact_info"].position}</span><br/>
                            <span className='span'><PhoneOutlined className="icon" /><b>Fascimile_tel: </b>{this.state.layerInfoData.service["contact_info"].fascimile_tel}</span><br/>
                            <span className='span'><MessageOutlined className="icon" /><b>Voice_tel: </b>{this.state.layerInfoData.service["contact_info"].voice_tel} </span><br/>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <b>Title: </b><span>{this.state.layerInfoData.service["title"]}.</span><br/>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <b>Topic & Keywords</b><br/>
                            <span className='span'><BulbOutlined className="icon" /><b>Topic: </b><span className='tag'>{this.state.layerInfoData.service["topic"]}</span></span><br/>
                            <span className='span'><ThunderboltOutlined className="icon" /><b>Keywords: </b><span className={(ServiceKeyword!=='null')?'tag':'tagnull'}>{ServiceKeyword}</span></span><br/>
                            <span className='span'><ProjectOutlined className="icon" /><b>Version: </b><span>{this.state.layerInfoData.service["version"]}</span></span><br/>
                        </Content>
                        <Content className="_info_container_section">
                                <Content className="_info_container_section_content">
                                      <Link to='/serviceInfo'>
                                          <Button type='primary' onClick={()=>{this.props.dispatch(conveyServiceID(this.state.layerInfoData.service["id"]))}}>
                                              Learn more 
                                              <RightOutlined />
                                          </Button>
                                      </Link>
                                </Content>
                            </Content>
                    </Content>
                </Content>
            </Layout>
        );
    }

    // init service info: to get data
    public async initData(){
        const baseUrl:string = 'search/queryLayerInfo';
        const dbTable = {
            table: window.sessionStorage.getItem('dataSource') === 'labeled data'? 'layerlist_for_intent':'layerlist'
        }
        const reqPar = Object.assign({id: this.props.layerID}, {photoType: 'Base64Str'}, dbTable)
        const url:string = reqUrl(reqPar,baseUrl,'8081');
        try {
            const res: any = await $req(url,{})
            // console.log(res)
            this.setState({
                layerInfoData: JSON.parse(res).data
            })
        } catch(e) {
            alert(e.message)
        }
    }
}

// get layerID from store(state.conveyIDReducer)
const mapStateToProps = (state:any)=>{
    return{
        layerID:state.conveyIDReducer.layerID
    }
}
export default connect(mapStateToProps) (LayerInfo);