import * as React from 'react';
import '../../style/_home.scss'; 
import { Layout, Statistic,List,Card} from 'antd';
import $req from '../../util/fetch';    
import { IQueryPar, IPageInfo,ILayer } from "../../util/interface";
import { reqUrl, delEmptyKey, smoothscroll } from '../../util/util';

interface Props {
  queryPar: IQueryPar;
}

interface State {
  dataList: ILayer [];
  queryPar: IQueryPar;
  pageInfo: IPageInfo;
  isUpdate: boolean;
  listFootShow: string;
  listTotal: number;
  loading: boolean
}

class LayerSearch extends React.Component<Props,State> {
  public data: ILayer [][];
  constructor (props:Props) {
    super(props);
    this.state = {
      dataList:[],
      pageInfo: {
          pageNum: 1,
          pageSize: 36
      },
      queryPar: this.props.queryPar,
      isUpdate: false,
      listFootShow: 'none',
      listTotal: 0,
      loading: true,
    };
  }

  public componentDidMount(){
    this.initData();
  }

  public render() {
    if(this.state.isUpdate){
      this.data=[[this.state.dataList[0],this.state.dataList[1],this.state.dataList[2],this.state.dataList[3],this.state.dataList[4],this.state.dataList[5]],
                 [this.state.dataList[6],this.state.dataList[7],this.state.dataList[8],this.state.dataList[9],this.state.dataList[10],this.state.dataList[11]],
                 [this.state.dataList[12],this.state.dataList[13],this.state.dataList[14],this.state.dataList[15],this.state.dataList[16],this.state.dataList[17]],
                 [this.state.dataList[18],this.state.dataList[19],this.state.dataList[20],this.state.dataList[21],this.state.dataList[22],this.state.dataList[23]],
                 [this.state.dataList[24],this.state.dataList[25],this.state.dataList[26],this.state.dataList[27],this.state.dataList[28],this.state.dataList[29]],
                 [this.state.dataList[30],this.state.dataList[31],this.state.dataList[32],this.state.dataList[33],this.state.dataList[34],this.state.dataList[35]],]
    }
    if(this.state.loading){
      this.data=[[]];
    }
    return (
        <Layout className="main_container_content_imglist sr-only">
          <div className="main_container_content_imglist_statis">
            <Statistic className="main_container_content_imglist_statis_value" value={this.state.listTotal}/>
            <span> layer images have been found. </span>
          </div>
          <List
                 className="main_container_content_imglist"
                 itemLayout="vertical"
                 size="small"
                 pagination={{
                  hideOnSinglePage: true,
                  onChange: this.handlePaginate,
                  pageSize: this.state.pageInfo.pageSize,
                  showQuickJumper: true,
                  total: this.state.listTotal
                  }}
                 dataSource={this.data}
                 loading={this.state.loading}
                 footer={<div style={{"display":this.state.listFootShow}}><b>Map Layer list</b> footer part</div>}
                 renderItem={(item:ILayer[])=>(
                 <List.Item>
                    <List
                    className="main_container_content_childimglist"
                    itemLayout="horizontal"
                    size="small"
                    grid={{gutter:10,column:6}}
                    dataSource={item}
                    renderItem={(childItem:ILayer) => (
                        <List.Item key={childItem.id} className="main_container_content_imglist_item">
                          <Card hoverable={true}  cover={<img src={'data:image/png;base64,'+childItem.photo} />} bodyStyle={{padding:2, textAlign: "center"}}>
                            {childItem.name}
                          </Card>
                        </List.Item>
                       )}
                    />
                </List.Item>
                 )}
          />
        </Layout>
    );
  }

  // init layer list by sending http request 
  public initData = () => {
    const self=this;
    this.queryLayerList(this.state.pageInfo,this.state.queryPar).then(setLoading);
    function setLoading(){
      self.setState({
          listFootShow: 'block',
          loading: false
      })
    }
  }

  // paginate to request new data
  public handlePaginate = (cur:number) => {
      smoothscroll()
      const pageInfo = this.state.pageInfo;
      pageInfo.pageNum = cur;
      this.setState({
          pageInfo,
          loading: true,
      })
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
        this.setState({
            dataList: resBody.data,
            listTotal: resBody.total,
            isUpdate: true,
            loading: false,
        })
    } catch(e) {
        alert(e.message)
    }
  }
}

export default LayerSearch;
