import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';  
import $req from '../../util/fetch';                                                  
import {stringFilter, reqUrl, smoothscroll, delEmptyKey } from '../../util/util';
import { IServInfo, IPageInfo, IQueryPar } from "../../util/interface";
import {NavLink as Link} from 'react-router-dom';
import * as testData from '../../assets/data/testServList.json';
import { Layout, Icon, List, Rate, Statistic } from 'antd';

const { Content } = Layout;

interface Props {
    queryPar: IQueryPar;
}

interface State {
    dataList: object[];
    queryPar: IQueryPar;
    listFootShow: string;
    listTotal: number;
    loading: boolean;
    pageInfo: IPageInfo;
}

class DataSearch extends React.Component<Props, State> {

    constructor (props:Props) {
        super(props);
        this.state = {
            dataList: [],
            listFootShow: 'none',
            listTotal: 0,
            loading: true,
            pageInfo: {
                pageNum: 0,
                pageSize: 10
            },
            queryPar: this.props.queryPar,
        };
    }

    public componentDidMount(){
        this.initData();
    }

    public componentWillReceiveProps(){
        this.queryWMSList(this.state.pageInfo,this.state.queryPar);
    }

    public render() {
        return (
            <Content>
                <div className="main_container_content_statis">
                    <Statistic className="main_container_content_statis_value" value={this.state.listTotal}/>
                    <span> services have been found.</span>
                </div>
                <List
                    className="main_container_content_list"
                    itemLayout="vertical"
                    size="large"
                    pagination={{
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
                            <Link to="/serviceInfo" className="title" onClick={this.turnToServPage}>{item.title ? item.title : 'null'}</Link>
                            <Rate disabled={true} allowHalf={true} value={testData[0][0].Rank} className="rank"/><br/>
                            <span><Icon className="icon" type="compass"/>Location: {item.administrative_unit}</span>
                            <span className="span"><Icon className="icon" type="pushpin"/>GeoGraphic Location: {testData[0][0].GeoLocation[0]},{testData[0][0].GeoLocation[1]}</span><br/>
                            Service was public at the website: <a href={item.url}>{item.url}</a><br/>
                            {testData[0][0].Abstract ? stringFilter(testData[0][0].Abstract) : 'There is no abstract in the service capability document.'}<br/>
                            <b>Keywords: </b><span>{item.keywords ? stringFilter(item.keywords): 'no keywords'}</span>
                        </List.Item>
                    )}
                />
            </Content>
        );
    }

    // init service list by sending http request 
    public initData = () => {
        const self = this;
        this.queryWMSList(this.state.pageInfo,this.state.queryPar).then(setLoading);
        function setLoading(){
            self.setState({
                listFootShow: 'block',
                loading: false
            })
        }
    }

    // paginate to request new data
    public handlePaginate = (cur:number) => {
        const pageInfo = this.state.pageInfo;
        pageInfo.pageNum = cur-1;
        this.setState({
            pageInfo,
        })
        this.queryWMSList(this.state.pageInfo,this.state.queryPar).then(smoothscroll);
    }

    // Function: send http request to get service list data
    // When to transfer: init render DataSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
    // @param  params:object = {keyword?:string, bound?:number[], page:number, size:number}
    public async queryWMSList(pagePar:object, queryPar:object) {
        const baseUrl:string = 'search/queryWMSList';
        const reqPar:object = Object.assign(pagePar,queryPar);
        const url:string = reqUrl(delEmptyKey(reqPar),baseUrl,'8080');
        console.log(url)
        try {
            const res: any = await $req(url, {})
            const resBody:any  = JSON.parse(res)
            console.log(res)
            this.setState({
                dataList: resBody.data,
                listTotal: resBody.total
            })
        } catch(e) {
            alert(e.message)
        }
    }

    // response function of clicking the service item title to turn to the individual service info page
    public async turnToServPage(){
        const container = document.getElementsByClassName('content')[0];
        container.className = 'content sr-only';
        // window.location.reload();
    }

}
  
export default DataSearch;
  