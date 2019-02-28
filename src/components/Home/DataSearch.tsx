import * as React from 'react';
import 'antd/dist/antd.css';
import '../../style/_home.scss';  
import $req, { HttpMethod } from '../../util/fetch';                                                  
import {stringFilter, reqUrl, delEmptyKey, smoothscroll } from '../../util/util';
import { IServ, IPageInfo } from "../../util/interface";
import {NavLink as Link} from 'react-router-dom';
import * as testData from '../../assets/data/testServList.json';
import { Icon, List, Rate } from 'antd';

interface Props {
    getServListBody: object;
}

interface State {
    dataList: object[];
    getServListBody: any;
    listFootShow: string;
    listTotal: number;
    loading: boolean;
    pageInfo: IPageInfo;
    paginationConfig: any;
}

class DataSearch extends React.Component<Props, State> {

    constructor (props:Props) {
        super(props);
        this.state = {
            dataList: [],
            getServListBody: this.props.getServListBody,
            listFootShow: 'none',
            listTotal: 100,
            loading: true,
            pageInfo: {
                page: 0,
                size: 10
            },
            paginationConfig: false,
        };
    }

    public componentDidMount(){
        this.initData();
    }

    public componentWillReceiveProps(){
        this.getServList(this.state.pageInfo,this.state.getServListBody);
    }

    public render() {
        return (
            <List
                className="main_container_content_list"
                itemLayout="vertical"
                size="large"
                pagination={this.state.paginationConfig}
                loading = {this.state.loading}
                dataSource={this.state.dataList}
                footer={<div style={{"display":this.state.listFootShow}}><b>service list</b> footer part</div>}
                renderItem={(item:IServ) => (
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
        );
    }

    // init service list by sending http request 
    public initData = () => {
        const self = this;
        this.getServList(this.state.pageInfo,this.state.getServListBody).then(setLoading);
        function setLoading(){
            self.setState({
                listFootShow: 'block',
                loading: false,
                paginationConfig: {
                    hideOnSinglePage: true,
                    onChange: self.handlePaginate,
                    pageSize: self.state.pageInfo.size,
                    total: self.state.listTotal
                }
            })
        }
    }

    // paginate to request new data
    public handlePaginate = (cur:number) => {
        const pageInfo = this.state.pageInfo;
        pageInfo.page = cur-1;
        this.setState({
            pageInfo,
        })
        this.getServList(this.state.pageInfo,this.state.getServListBody).then(smoothscroll);
    }

    // Function: send http request to get service list data
    // When to transfer: init render DataSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
    // @param  params:object = {keyword?:string, bound?:number[], page:number, size:number}
    public async getServList(pagePar:object, getServListBody:object) {
        const baseUrl:string = 'search/queryWMSList';
        const url:string = reqUrl(pagePar,baseUrl,'8081');
        const body = delEmptyKey(getServListBody);
        try {
            const res: any = await $req(url, {
                body,
                method: HttpMethod.post
            })
            this.setState({
                dataList: JSON.parse(res)
            })
        } catch(e) {
            alert(e.message)
        }
    }

    // response function of clicking the service item title to turn to the individual service info page
    public async turnToServPage(){
        const container = document.getElementsByClassName('content')[0];
        container.className = 'content sr-only';
        window.location.reload();
    }

}
  
export default DataSearch;
  