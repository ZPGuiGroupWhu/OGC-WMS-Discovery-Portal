import * as React from 'react';
import { Layout, Statistic } from 'antd';
import {NavLink as Link} from 'react-router-dom';
import $req from '../../util/fetch';    
import { IQueryPar, IPageInfo } from "../../util/interface";
import { reqUrl, delEmptyKey } from '../../util/util';

interface Props {
  queryPar: IQueryPar;
}

interface State {
  dataList: object[];
  queryPar: IQueryPar;
  pageInfo: IPageInfo;
}

class LayerSearch extends React.Component<Props,State> {

  constructor (props:Props) {
    super(props);
    this.state = {
      dataList: [],
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

  public render() {
    return (
        <Layout className="main_container_content_imglist sr-only">
          <div className="main_container_content_imglist_statis">
            <Statistic className="main_container_content_imglist_statis_value" value={0}/>
            <span> layer images have been found. </span>
            <Link to="/layerInfo" style={{paddingBottom:"5px"}}>test link to detailed information of individual layer</Link>
          </div>
        </Layout>
    );
  }

  // init layer list by sending http request 
  public initData = () => {
    this.queryLayerList(this.state.pageInfo,this.state.queryPar);
  }

  // Function: send http request to get layer list data
  // When to transfer: init render LayerSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
  // @param  params:object = {keyword?:string, bound?:number[], pageNum:number, pageSize:number, topic?:string, organization?:string, organization_type?:string, continent?:string}
  public async queryLayerList(pagePar:object, queryPar:object) {
    const baseUrl:string = 'search/querylayerlist';
    const reqPar:object = Object.assign(pagePar,queryPar);
    const url:string = reqUrl(delEmptyKey(reqPar),baseUrl,'8080');
    console.log(url)
    try {
        const res: any = await $req(url, {})
        const resBody:any  = JSON.parse(res)
        // console.log(res)
        this.setState({
            dataList: resBody.data
        })
    } catch(e) {
        alert(e.message)
    }
  }

}

export default LayerSearch;
