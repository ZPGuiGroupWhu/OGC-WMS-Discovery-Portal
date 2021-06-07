import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';
import { Layout, Icon, Card, Button } from 'antd';
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
                bbox: [],
                id: 1,
                keywords: '',
                name: '',
                photo: '',
                projection: '',
                title: '',
                topic: '',
                url: '',
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
                <header><Icon type="home"/><Link to="/">Home</Link> / {this.state.layerInfoData.name}</header>
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
                        <span className='span'><Icon className="icon" type="tag" /><b>Name: </b>{this.state.layerInfoData.name}.</span><br/>
                        <span className='span'><Icon className="icon" type="container"/><b>Abstract: </b>{this.state.layerInfoData.abstr}</span><br/>
                        <span className='span'><Icon className="icon" type="pushpin"/><b>Attribution: </b>{attribution}.</span><br/>
                        <span className='span'><Icon className="icon" type="environment"/><b>BoundingBox(using {this.state.layerInfoData.projection}): </b>({this.state.layerInfoData.bbox[0]});({this.state.layerInfoData.bbox[1]}).</span><br/>
                        <span className='span'><Icon className="icon" type="link" /><b>Layer link：</b><a id="layerInfoUrl" href={this.state.layerInfoData.url}>{this.state.layerInfoData.url}</a></span><br/>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <b>Topic & Keywords</b><br/>
                            <span className='span'><Icon className="icon" type="bulb"/><b>Topic: </b><span className="tag">{this.state.layerInfoData.topic}</span></span><br/>
                            <span className='span'><Icon className="icon" type="thunderbolt"/><b>Keywords: </b><span className={(LayerKeyword!=='null')?'tag':'tagnull'}>{LayerKeyword}</span></span><br/>
                        </Content>
                    </Content>
                    <br/>
                    <b className="_info_container_header">The service messages of the layer</b><br/>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <span className='span'><Icon className="icon" type="compass"/><b>Location：</b>{this.state.layerInfoData.service["administrative_unit"]}</span>
                            <span className="span"><Icon className="icon" type="pushpin"/><b>GeoGraphic Location：</b>{this.state.layerInfoData.service["geoLocation"][0]},{this.state.layerInfoData.service["geoLocation"][1]}</span><br/>
                            <p>{this.state.layerInfoData.service["abstr"] ? this.state.layerInfoData.service["abstr"] : ''}</p>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <span className='span'><Icon className="icon" type="link" /><b>Access link：</b><a href={this.state.layerInfoData.service["url"]}>{this.state.layerInfoData.service["url"]}</a></span><br/>
                            <span className='span'><Icon className="icon" type="mobile"/><b>Contact_info</b></span><br/>
                            <span className='span'><Icon className="icon" type="user"/><b>Person: </b>{this.state.layerInfoData.service["contact_info"].person}</span><br/>
                            <span className='span'><Icon className="icon" type="team"/><b>Organization: </b>{this.state.layerInfoData.service["contact_info"].organization}</span><br/>
                            <span className='span'><Icon className="icon" type="bank"/><b>Administrative_unit: </b>{this.state.layerInfoData.service["contact_info"].administrative_unit}</span><br/>
                            <span className='span'><Icon className="icon" type="border"/><b>State_province: </b>{this.state.layerInfoData.service["contact_info"].state_province}</span><br/>
                            <span className='span'><Icon className="icon" type="mail"/><b>Email: </b>{this.state.layerInfoData.service["contact_info"].email}</span>
                            <span className='span'><Icon className="icon" type="profile"/><b>Post_code: </b>{this.state.layerInfoData.service["contact_info"].post_code}</span><br/>
                            <span className='span'><Icon className="icon" type="environment"/><b>Address: </b>{this.state.layerInfoData.service["contact_info"].address}</span><br/>
                            <span className='span'><Icon className="icon" type="shop"/><b>City: </b>{this.state.layerInfoData.service["contact_info"].city}</span><br/>
                            <span className='span'><Icon className="icon" type="compass"/><b>Position: </b>{this.state.layerInfoData.service["contact_info"].position}</span><br/>                                <span className='span'><Icon className="icon" type="phone"/><b>Fascimile_tel: </b>{this.state.layerInfoData.service["contact_info"].fascimile_tel}</span><br/>
                            <span className='span'><Icon className="icon" type="message"/><b>Voice_tel: </b>{this.state.layerInfoData.service["contact_info"].voice_tel}</span><br/>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <b>Title:</b><span>{this.state.layerInfoData.service["title"]}.</span><br/>
                        </Content>
                    </Content>
                    <Content className="_info_container_section">
                        <Content className="_info_container_section_content">
                            <b>Topic & Keywords</b><br/>
                            <span className='span'><Icon className="icon" type="bulb"/><b>Topic: </b><span className='tag'>{this.state.layerInfoData.service["topic"]}</span></span><br/>
                            <span className='span'><Icon className="icon" type="thunderbolt"/><b>Keywords: </b><span className={(ServiceKeyword!=='null')?'tag':'tagnull'}>{ServiceKeyword}</span></span><br/>
                            <span className='span'><Icon className="icon" type="project"/><b>Version: </b><span>{this.state.layerInfoData.service["version"]}</span></span><br/>
                        </Content>
                        <Content className="_info_container_section">
                                <Content className="_info_container_section_content">
                                      <Link to='/serviceInfo'>
                                          <Button type='primary' onClick={()=>{this.props.dispatch(conveyServiceID(this.state.layerInfoData.service["id"]))}}>
                                              Learn more 
                                              <Icon type='right'/>
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
        const url:string = reqUrl({id:this.props.layerID},baseUrl,'8081');
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

// get layerID from store(state.conveyIDReducer)
const mapStateToProps = (state:any)=>{
    return{
        layerID:state.conveyIDReducer.layerID
    }
}
export default connect(mapStateToProps) (LayerInfo);