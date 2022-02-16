import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';  
import $req from '../../util/fetch';
import LeftSider from './LeftSider';
import {stringFilter, reqUrl, smoothscroll, delEmptyKey } from '../../util/util';
import { IServInfo, IPageInfo, IQueryPar } from "../../util/interface";
import {NavLink as Link} from 'react-router-dom';
import { Layout, Icon, List, Rate, Statistic, Input, Select, Button, Radio, Tooltip } from 'antd';
import {connect}from 'react-redux'
import {conveyServiceID, conveyQueryPar} from '../../redux/action'

const { Content } = Layout;


interface Props {
    queryPar: IQueryPar;
    dispatch: (action:any)=>void
}

interface State {
    dataList: object[];
    listFootShow: string;
    listTotal: number;
    loading: boolean;
    pageInfo: IPageInfo;
    queryPar: IQueryPar;
    time: number;
}

class ServiceSearch extends React.Component<Props, State> {
    // Instead of unsafe and not recommended componentWillReceiveProps,
    // use static getDerivedStateFromProps to get new state from props
    // fetching new data is accomplished in componentDidUpdate
    public static getDerivedStateFromProps(nextProps: any, prevState: any){
        if (nextProps.queryPar !== prevState.queryPar){
            return {
                queryPar: nextProps.queryPar,
                loading: true,
                pageInfo:{
                    pageNum: 1,
                    pageSize: 10
                }
            }
        }
        return null
    }

    constructor (props:Props) {
        super(props);
        this.state = {
            dataList: [],
            listFootShow: 'none',
            listTotal: 0,
            loading: true,
            pageInfo: {
                pageNum: 1,
                pageSize: 10
            },
           queryPar: {
               bound: [],
               continent: '',
               keywords: '',
               organization: '',
               organization_type: '',
               topic: '',
           },
           time: 0,
        };
    }


    public componentDidMount(){
        this.initData();
    }

    public componentDidUpdate(prevProps: any, prevState: any){
        if (this.state.queryPar !== prevState.queryPar) {
            this.queryWMSList(this.state.pageInfo, this.state.queryPar).then(()=>{
                this.setState({
                    listFootShow: 'block',
                    loading: false
                })
            })
        }
    }

    // Unsafe, recommend getDerivedStateFromProps instead of componentWillReceiveProps
    // public componentWillReceiveProps(nextProps:any){
    //     // if updated queryPar type is service(defined as 0),then search for new queryPar and update data.
    //     // if updated queryPar type is layers(defined as 1), then skip updating action in the wms search page.
    //     if(nextProps.queryPar.type===0)
    //     {
    //         this.setState({
    //             loading: true,
    //             pageInfo:{
    //                 pageNum: 1,
    //                 pageSize: 10
    //             }
    //           },()=>{this.queryWMSList(this.state.pageInfo,nextProps.queryPar)})
    //     }
    // }

    public render() {
        return (
            <Content className="content">
                <div className="content_tool">
                    {/*<Input.Search allowClear className="content_tool_search" enterButton={true} placeholder="Input something to search services" onSearch={value=>this.handleInputSearch(value)} />*/}
                    <Input  className="content_tool_search" allowClear={true}  placeholder="Input something to search services"  onPressEnter={this.handleSearch} addonAfter={
                        <Radio.Group className="content_tool_radio" buttonStyle="solid" >
                            <Tooltip placement="bottom" title="Search in the Database"><Radio.Button onClick={this.handleSearch}><Icon type="search"/></Radio.Button></Tooltip>
                            <Tooltip placement="bottom" title="Search in the Last Result"><Radio.Button onClick={this.handleRefine}><Icon type="file-search"/></Radio.Button></Tooltip>
                        </Radio.Group>} />
                    <Button className="content_tool_btn" type="primary">Return to Last Result</Button>
                    <Select defaultValue="firstLetter" className="content_tool_select">
                       <Select.Option value="qulityRank">Order by Quality Rank</Select.Option>
                       <Select.Option value="firstLetter">Order by Name First Letter</Select.Option>
                        <Select.Option value="ResTime">Order By Response Time</Select.Option>
                        <Select.Option value="LayerNum">Order By Layer Number</Select.Option>
                    </Select>
                </div>
                <Layout className="main_container">
                    <LeftSider queryType={"service"}/>
                    <Content className="main_container_content">
                        <div className="main_container_content_statis">
                            <Statistic className="main_container_content_statis_value" value={this.state.listTotal}  suffix="services have been found."/>
                            <Statistic className="main_container_content_statis_value" value={this.state.time} precision={2} suffix="seconds have been needed."/>
                        </div>
                        <List
                            className="main_container_content_list"
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                current: this.state.pageInfo.pageNum,
                                hideOnSinglePage: true,
                                onChange: this.handlePaginate,
                                pageSize: this.state.pageInfo.pageSize,
                                showQuickJumper: true,
                                total: this.state.listTotal
                            }}
                            loading = {this.state.loading}
                            dataSource={this.state.dataList}
                            footer={<div style={{"display":this.state.listFootShow}}><b>service list</b> footer part</div>}
                            renderItem={(item:IServInfo) => (
                                <List.Item key={item.id} className="main_container_content_list_item">
                                    <Link to="/serviceInfo" className="title" onClick={()=>{this.props.dispatch(conveyServiceID(item.id))}}>{item.title ? item.title : 'null'}</Link>
                                    <Rate disabled={true} allowHalf={true} value={4.5} className="rank"/><br/>
                                    <span><Icon className="icon" type="compass"/>Location: {item.administrative_unit}</span>
                                    <span className="span"><Icon className="icon" type="pushpin"/>GeoGraphic Location: ({item.geoLocation[0]}, {item.geoLocation[1]})</span><br/>
                                    Service was public at the website: <a href={item.url}>{item.url}</a><br/>
                                    {item.abstr ? stringFilter(item.abstr) : 'There is no abstract in the service capability document.'}<br/>
                                    <b>Keywords: </b><span>{item.keywords ? stringFilter(item.keywords): 'no keywords'}</span>
                                </List.Item>
                            )}
                        />
                    </Content>
                </Layout>
            </Content>
              
        );
    }

    // init service list by sending http request 
    public initData = () => {
        const self = this;
        // initialization needs clear the queryPar
        const queryPar={
            bound: [],
            continent: '',
            keywords: '',
            organization: '',
            organization_type: '',
            topic: '',
        }
        self.props.dispatch(conveyQueryPar(queryPar));
        // this.queryWMSList(this.state.pageInfo,queryPar).then(setLoading);
        // function setLoading(){
        //     self.setState({
        //         listFootShow: 'block',
        //         loading: false
        //     })
        // }
    }

    // handle input search in the database
    public handleSearch=()=>{
        const inputValue=document.getElementsByClassName('ant-input')[0].getAttribute('value');
        const queryPar = this.state.queryPar;
        if(inputValue!==null){queryPar.keywords=inputValue}
        this.props.dispatch(conveyQueryPar(queryPar));
        this.setState({queryPar});
        // this.queryWMSList(this.state.pageInfo, this.state.queryPar)

    }

    // handle input search in the last result
    public handleRefine=()=>{
        const inputValue=document.getElementsByClassName("ant-input")[0].getAttribute("value");
        console.log(inputValue);
        // complete refine interface...
    }


    // paginate to request new data
    public handlePaginate = (cur:number) => {
        const pageInfo = this.state.pageInfo;
        pageInfo.pageNum = cur;
        this.setState({
            pageInfo,
            loading: true,
        })
        this.queryWMSList(this.state.pageInfo,this.props.queryPar).then(smoothscroll);
    }

    // Function: send http request to get service list data
    // When to transfer: init render DataSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
    // @param  params:object = {keyword?:string, bound?:number[], pageNum:number, pageSize:number, topic?:string, organization?:string, organization_type?:string, continent?:string}
    public async queryWMSList(pagePar:object, queryPar:object) {
        const baseUrl:string = 'search/queryWMSList';
        const reqPar:object = Object.assign(pagePar,queryPar);
        const url:string = reqUrl(delEmptyKey(reqPar),baseUrl,'8081');
        let requestTime:number=0;  // record request time
        console.log(url)
        try {
            const timer=setInterval(()=>{++requestTime},10);
            const res: any = await $req(url, {})
            clearInterval(timer);
            const resBody:any  = JSON.parse(res)
            // console.log(res)
            this.setState({
                dataList: resBody.data,
                listTotal: resBody.totalWMSNum,
                loading: false,
                time: requestTime*0.01,
            })
        } catch(e) {
            alert(e.message)
        }
    }

    // // response function of clicking the service item title to turn to the individual service info page
    // public turnToServPage(serviceid:number){
    //     // const container = document.getElementsByClassName('content')[0];
    //     // container.className = 'content sr-only';
    //     // window.location.reload();
    //     // this.props.dispatch(conveyServiceID(serviceid));
    // }
}

// get queryPar from store(state.conveyQueryParReducer)
const mapStateToProps = (state:any) =>{
   return {
       queryPar: state.conveyQueryParReducer.queryPar,
   }
 }

export default connect(mapStateToProps)(ServiceSearch);
  