import * as React from 'react';
import '../../style/_home.scss'; 
import { Layout, Statistic,List,Card,Icon,Popover,Button} from 'antd';
import $req from '../../util/fetch';    
import { IQueryPar, IPageInfo,ILayer } from "../../util/interface";
import { reqUrl, delEmptyKey, smoothscroll } from '../../util/util';
import {connect} from 'react-redux';
import {conveyLayerID} from '../../redux/action'

const { Content, Sider} = Layout;

interface Props { 
  queryPar: IQueryPar;
  dispatch: (acion:any)=>void;
}

interface State {
  collapsed: boolean;
  currentSize: number;
  dataList: ILayer [];
  isUpdate: boolean;
  listFootShow: string;
  listTotal: number;
  loading: boolean;
  optionList: ILayer[];
  pageInfo: IPageInfo;
   // queryPar: IQueryPar;
}

class LayerSearch extends React.Component<Props,State> {
  public data: ILayer [][];
  constructor (props:Props) {
    super(props);
    this.state = {
      collapsed: true,
      currentSize: 0,
      dataList: [],
      isUpdate: false,
      listFootShow: 'none',
      listTotal: 0,
      loading: true,
      optionList: [],
      pageInfo: {
          pageNum: 1,
          pageSize: 40  // should be
      },
      // queryPar: this.props.queryPar,
    };
  }

  public componentDidMount(){
    this.initData();
    
  }

  public componentWillReceiveProps(nextProps:any){
    this.setState({
      loading: true
    })
    this.queryLayerList(this.state.pageInfo,nextProps.queryPar);
}
  
  public render() {
    this.prepareData();
    return (
      <Layout className="main_container_content_imglist sr-only">
        <Content className="main_container_content">
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
                    grid={{gutter:15,column:8}}
                    dataSource={item}
                    renderItem={(childItem:ILayer) => (
                        <List.Item key={childItem.id} className="main_container_content_imglist_item">
                          <Popover className="main_container_content_imglist_item_popover" trigger="hover" content={this.popoverContent(childItem)}>
                             <Card hoverable={true}  cover={<img src={'data:image/png;base64,'+childItem.photo} />}  onClick={()=>{this.handleStar(childItem)}}
                                   style={{border: this.forOptionList(childItem)?' 5px solid #1890ff' :' 1px solid #ccc' }}
                                   bodyStyle={{padding:2, textAlign: "center", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}>
                                     {childItem.name}
                             </Card>
                          </Popover>
                        </List.Item>
                       )}
                    />
                </List.Item>
                 )}
          />
           </Content>
           <Sider 
           collapsible={true} collapsed={this.state.collapsed}   collapsedWidth={10} reverseArrow={true} trigger={null}
           className="main_container_rightsider"  width={300}
           >

              <div className="main_container_rightsider_trigger" onClick={this.toggle}>
                <Icon  type={this.state.collapsed?"double-left":"double-right"} />
               </div>
            </Sider>
        </Layout>
       
    );
  }

  // show card component when the mouse hovers the layers.
  public popoverContent = (layer:ILayer) =>{
     return (
        <Card  cover={<img src={'data:image/png;base64,'+layer.photo} />} bodyStyle={{padding: "10px"}}>
            <div className="main_container_content_imglist_item_popover_description">
                <span><Icon className="icon" type="tag" /><b>Name:</b>{layer.name}</span><br/>
                <span><Icon className="icon" type="project" /><b>Title:</b>{layer.title}</span><br/>
                <span><Icon className="icon" type="pushpin"/><b>Attribution: </b>{layer.attribution===""?"No attribution":layer.attribution}</span><br/>
                <span><Icon className="icon" type="bulb"/><b>Topic: </b>{layer.topic}</span><br/>
                <span><Icon className="icon" type="thunderbolt"/><b>Keywords: </b>{layer.keywords===""?"No keywords":layer.keywords}</span>
            </div>
            <div className="main_container_content_imglist_item_popover_button">
                {this.popoverContentStar(layer)}
                <Popover trigger="hover" content={<span>Learn more ></span>} placement="top" >
                  <Button className="button"  icon="more" onClick={()=>{this.props.dispatch(conveyLayerID(layer.id))}} href='layerInfo'/>
                </Popover>
             </div>
         </Card>
          )
  }

  // show the star button in the popoverContent when the mouse click it
  public popoverContentStar = (layer:ILayer) =>{
    if(this.forOptionList(layer)){
      return (
        <Popover trigger="hover" content={<span>Cancel this Layer</span>} placement="top" >
           <Button className="button" onClick={()=>{this.handleStar(layer)}} >
             <Icon type="star" theme="filled" style={{color: '#1890ff', borderColor: '#1890ff'}}/>
           </Button>
        </Popover>
      )
    }
    else {
      return(
        <Popover trigger="hover" content={<span>Choose this Layer</span>} placement="top" >
           <Button className="button" onClick={()=>{this.handleStar(layer)}} >
             <Icon type="star" theme="filled" />
           </Button>
        </Popover>
      )
    }
  }

  // prepare two dimention array for Layerlist
  public prepareData = () =>{
    if(this.state.isUpdate){ 
      const col=8; 
      const round=Math.floor(this.state.currentSize/col);
      const remainder=this.state.currentSize%col;
       for(let i=0;i<round;++i){
          this.data[i]=[]
          for(let k=0;k<col;++k){
              this.data[i][k]=this.state.dataList[i*col+k];
          }
        }
        if (remainder!==0){
          this.data[round]=[]
          for(let m=0;m<remainder;++m){
               this.data[round][m]=this.state.dataList[round*col+m]
           }
        }
      }

      if(this.state.loading){
        this.data=[[]];
      }
    }
    
  // init layer list by sending http request 
  public initData = () => {
    const self=this;
    this.queryLayerList(this.state.pageInfo,this.props.queryPar).then(setLoading);
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
      this.queryLayerList(this.state.pageInfo,this.props.queryPar);
  }

   // hide right sider
   public toggle =()=>{
    this.setState({collapsed:!this.state.collapsed});
  }

  // handleStar button
  // If the layer is selected last time, then remove the layer from optionList
  // If the layer is never selected last time, then add the layer into optionList
  public handleStar =(layer:ILayer)=>{
    const self= this.state.optionList;
    let isContain= false;
    for (const index in self){
      if(self[index].id===layer.id){
         self.splice(Number(index),1);
         isContain=true;
         break;
      }
    }
    if(!isContain) {
       self.push(layer)
    }
    this.setState({
        optionList: self,
    })
  }
 
  // foreach optionList to find whether the layer is selected or not
  public forOptionList =(layer:ILayer)=> {
    let temp=false;
     for(const each of this.state.optionList){
          if (each.id===layer.id){
            temp=true;
            break;
          } 
     }
    return temp;
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
            currentSize: resBody.currentPageSize,
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

// get queryPar from store(state.conveyQueryParReducer)
const mapStateToProps = (state:any) =>{
  return {
      queryPar: state.conveyQueryParReducer.queryPar,
  }
}

export default connect(mapStateToProps)(LayerSearch);
