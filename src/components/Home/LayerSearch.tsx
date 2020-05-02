import * as React from 'react';
import '../../style/_home.scss'; 
import { Layout, Statistic,List,Card,Icon,Popover,Button,Carousel,Divider} from 'antd';
import $req from '../../util/fetch';    
import { IQueryPar, IPageInfo,ILayer } from "../../util/interface";
import { reqUrl, delEmptyKey, smoothscroll } from '../../util/util';
import IntensionExp from './IntentionExp'
import {connect} from 'react-redux';
import {conveyLayerID} from '../../redux/action'

const { Content} = Layout;

interface Props { 
  queryPar: IQueryPar;
  dispatch: (acion:any)=>void;
}

interface State {
  bSideCollapsed: boolean;
  currentSize: number;
  dataList: ILayer [];
  isEdit: boolean;
  isUpdate: boolean;
  listFootShow: string;
  listTotal: number;
  loading: boolean;
  optionList: ILayer[];
  pageInfo: IPageInfo;
   // queryPar: IQueryPar;
   recycleList: ILayer[];
   rSideCollapsed: boolean;
   time: number;
}

class LayerSearch extends React.Component<Props,State> {
  public data: ILayer [][];
  constructor (props:Props) {
    super(props);
    this.state = {
      bSideCollapsed: true,
      currentSize: 0,
      dataList: [],
      isEdit: false,
      isUpdate: false,
      listFootShow: 'none',
      listTotal: 0,
      loading: true,
      optionList: [],
      pageInfo: {
          pageNum: 1,
          pageSize: 24// should be multiple of 8
      },
      // queryPar: this.props.queryPar,
      recycleList: [],
      rSideCollapsed: true,
      time: 0,
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
             <Statistic className="main_container_content_imglist_statis_value" value={this.state.listTotal} suffix="layer images have been found."/>
             <Statistic className="main_container_content_imglist_statis_value" value={this.state.time} precision={2} suffix="seconds have been needed."/>
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
                                   style={{border: this.forList(childItem,this.state.optionList)?' 5px solid #1890ff' :' 1px solid #ccc' }}
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
          <Divider />
           <div className="main_container_content_shoppingCart">
               <div className="main_container_content_shoppingCart_head">
                 <Icon className="icon" type="shopping-cart" />
                 <span className="title">Shopping Cart</span>
                 <Icon className="icon_small" type={this.state.bSideCollapsed?"down-square":"up-square"} onClick={()=>{this.setState({bSideCollapsed: !this.state.bSideCollapsed})}}/><br/>
                 <Statistic className="value" value={this.state.optionList.length} suffix="  layers have been selected."/>         
                 <div className="buttons">
                   <Button className="button" type="primary" disabled={this.state.bSideCollapsed?true:false} onClick={()=>{this.handleEdit()}}>{this.state.isEdit?"Delete":"Edit"}</Button>
                   <Button className="button" type="ghost" onClick={()=>{this.handleSummit()}}>Summit</Button>
                </div>
               </div>
               <div  className="main_container_content_shoppingCart_body" style={{display:this.state.bSideCollapsed?"none":"block"}}>
                 {this.shoppingcart()}
               </div>
           </div>
           </Content>
           <IntensionExp collapsed={this.state.rSideCollapsed}/>
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
   if(this.forList(layer,this.state.optionList)){
     return (
       <Popover trigger="hover" content={<span>Deselect this Layer</span>} placement="top" >
          <Button className="button" onClick={()=>{this.handleStar(layer)}} >
            <Icon type="star" theme="filled" style={{color: '#1890ff', borderColor: '#1890ff'}}/>
          </Button>
       </Popover>
     )
   }
   else {
     return(
       <Popover trigger="hover" content={<span>Select this Layer</span>} placement="top" >
          <Button className="button" onClick={()=>{this.handleStar(layer)}} >
            <Icon type="star" theme="filled" />
          </Button>
       </Popover>
     )
   }
 }

  // show shopping cart component
  public shoppingcart = () =>{
    // prepare two dimention array for optionList
     const col=6;  // every row has six picture
     const round=Math.floor(this.state.optionList.length/col);
     const remainder=this.state.optionList.length%col;
     let temp:ILayer[][];

     temp=[[]];
     for(let i=0;i<round;++i){
      temp[i]=[]
        for(let k=0;k<col;++k){
          temp[i][k]=this.state.optionList[i*col+k];
        }
      }
      if (remainder!==0){
        temp[round]=[]
        for(let m=0;m<remainder;++m){
          temp[round][m]=this.state.optionList[round*col+m]
         }
      }
      
      return (
        <Carousel className="main_container_content_shoppingCart_body_carousel">
            {temp.map((item:ILayer[],index:number)=>{
              return this.carouselComponent(item,index)
          })}
        </Carousel>
        )
    }

  // carouse component in the shopping cart 
  public carouselComponent = (layer:ILayer[],index: number) =>{
    return (
      <List
      key={index}
      className="main_container_content_shoppingCart_body_list"
      itemLayout="horizontal"
      size="small"
      grid={{gutter:15,column:6}}
      dataSource={layer}
      renderItem={(item:ILayer)=>(
        <List.Item key={item.id}>
          <Card className="card" hoverable={true}  cover={<img src={'data:image/png;base64,'+item.photo} />} 
                onClick={()=>{this.handleRecyle(item)}}
                style={{border: this.forList(item,this.state.recycleList)?' 5px solid #c0392b' :' 1px solid #ccc' }}
                bodyStyle={{padding:2, textAlign: "center", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}>
              {item.name}
          </Card>
        </List.Item>
      )}
   />
    )
  }
  

  // prepare two dimention array for Layerlist
  public prepareData = () =>{
    if(this.state.isUpdate){ 
      const col=8;  // every row has eight picture
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

  // handle those layers in the shopping cart, which are going to delete
  // If the layer is selected last time in the shopping cart, then remove the layer from recycleList
  // If the layer is never selected last time in the shopping cart, then add the layer into recycleList
  public handleRecyle =(layer:ILayer) =>{
    if(this.state.isEdit){
       const self= this.state.recycleList;
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
          recycleList: self,
      })
    }
  }

  // handle Edit button in the shopping cart
  public handleEdit = () =>{
    // if the button is in the deleted state, then detele chosen layers in the shopping cart
    if(this.state.isEdit){
      const selfOption=this.state.optionList;
      const selfRecycle=this.state.recycleList;
      const newOption=selfOption.filter(item=>{
      const layer=selfRecycle.map(value=>value)
      return !layer.includes(item)
    })
    this.setState({
      optionList: newOption,
      recycleList: [],
      isEdit: !this.state.isEdit
    })
  }
  // if the button is in the edited state, then change button state into deleting
    else{
      this.setState({
        isEdit: !this.state.isEdit
      })
    }
}

  // handle Summit button in the shopping cart
  public handleSummit = () =>{
    smoothscroll();
    this.setState({
      rSideCollapsed: false,
    })
  }

  // foreach List to find whether the layer is existed or not
  public forList = (layer:ILayer,arraylist:ILayer[]) =>{
  let isContain=false;
  for(const each of arraylist){
       if (each.id===layer.id){
         isContain=true;
         break;
       } 
  }
 return isContain;
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
  this.setState({rSideCollapsed:!this.state.rSideCollapsed});
}

  // Function: send http request to get layer list data
  // When to transfer: init render LayerSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
  // @param  params:object = {keyword?:string, bound?:number[], pageNum:number, pageSize:number, topic?:string, organization?:string, organization_type?:string, continent?:string}
  public async queryLayerList(pagePar:object, queryPar:object) {
    const baseUrl:string = 'search/querylayerlist';
    const reqPar:object = Object.assign(pagePar,queryPar);
    const url:string = reqUrl(delEmptyKey(reqPar),baseUrl,'8080');
    let requestTime:number=0;  // record request time
    console.log(url)
    try {
        const timer=setInterval(()=>{++requestTime},10)
        const res: any = await $req(url, {})
        clearInterval(timer);
        const resBody:any  = JSON.parse(res)
        this.setState({
            currentSize: resBody.currentPageSize,
            dataList: resBody.data,
            listTotal: resBody.total,
            isUpdate: true,
            loading: false,
            time: requestTime*0.01,
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
