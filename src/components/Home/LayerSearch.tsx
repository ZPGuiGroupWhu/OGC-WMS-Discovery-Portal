import * as React from 'react';
import '../../style/_home.scss'; 
import { Layout, Statistic,List,Card,Icon,Popover, Button, Carousel, Divider,
    message, Modal, Input, Select, Radio, Tooltip} from 'antd';
import $req from '../../util/fetch';    
import { IQueryPar, IPageInfo,ILayer } from "../../util/interface";
import { reqUrl, delEmptyKey, smoothscroll } from '../../util/util';
import LeftSider from './LeftSider';
import IntensionExp from './IntentionExp';
import {connect} from 'react-redux';
import {conveyLayerID,conveyQueryPar} from '../../redux/action';

// @ts-ignore
import hm from 'heatmap.js'

const { Content} = Layout;

interface Props { 
  queryPar: IQueryPar;
  dispatch: (action:any)=>void;
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
  queryPar: IQueryPar;
  queryType: string;
  recycleList: ILayer[];
  rSideCollapsed: boolean;
  submitVisible: boolean;
  time: number;
  uploadList: FormData;

  isDrawHeatmap: boolean;
}

class LayerSearch extends React.Component<Props,State> {
    // Instead of unsafe and not recommended componentWillReceiveProps,
    // use static getDerivedStateFromProps to get new state from props
    // fetching new data is accomplished in componentDidUpdate
    public static getDerivedStateFromProps(nextProps: any, prevState: any){
        if (nextProps.queryPar !== prevState.queryPar){
            return {
                queryPar: nextProps.queryPar,
                loading: true,
                pageInfo:{ pageNum: 1,
                    pageSize: 40
                }
            }
        }
        return null
    }

  public data: ILayer [][];
  public submitOptionList: ILayer [];

  // define variable to collect mouse track date and draw heatmap
  public heatmapInstance: any;
  public trackData: boolean;
  public lastX:number;
  public lastY:number;
  public traceDataInterval: NodeJS.Timeout;
  public idleInterval: NodeJS.Timeout;
  public idleTimeout: NodeJS.Timeout;
  public heatMapData: any;

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
          pageSize: 40// should be multiple of 8
      },
      queryPar: {
          bound: [],
          continent: '',
          keywords: '',
          organization: '',
          organization_type: '',
          topic: '',
      },
      queryType: 'byMetadata',
      recycleList: [],
      rSideCollapsed: true,
      submitVisible: false,
      time: 0,
      uploadList: new FormData(),   // uploadList's keys equal layer's ids starting from -1 to -∞, its value store upload File.

      isDrawHeatmap: false,
    };
  }

  public componentDidMount(){
    this.initData();


    // set a timer to record traceData
    this.traceDataInterval=setInterval(()=>{this.trackData=true},50)
  }

    public componentDidUpdate(prevProps: any, prevState: any){
        if (this.state.queryPar !== prevState.queryPar) {
            this.queryLayerList(this.state.pageInfo, this.state.queryPar).then(()=>{
                this.setState({
                    listFootShow: 'block',
                    loading: false
                })
            })
        }
    }

    // Unsafe, recommend getDerivedStateFromProps instead of componentWillReceiveProps
    //   public componentWillReceiveProps(nextProps:any){
    //     // if updated queryPar type is service(defined as 0),then skip updating action in the layer search page.
    //     // if updated queryPar type is layers(defined as 1), then search for new queryPar and update data.
    //     if (nextProps.queryPar.type===1){
    //       this.setState({
    //         loading: true,
    //         pageInfo:{
    //           pageNum: 1,
    //           pageSize: 40,
    //         },
    //       },()=>{this.queryLayerList(this.state.pageInfo,nextProps.queryPar)})
    //     }
    // }

  // collect position when the mouse is on the heatmap canvas
  public collectMousePos =(e:any)=>{
      if (this.idleTimeout) {clearTimeout(this.idleTimeout)}
      if (this.idleInterval) {clearInterval(this.idleInterval)}

      if(this.state.isDrawHeatmap){
          if(this.trackData){
              // offsetX and offsetY is attribution in e.nativeEvent, not e.
              this.lastX=e.nativeEvent.offsetX
              this.lastY=e.nativeEvent.offsetY
              this.heatmapInstance.addData({
                  x: this.lastX,
                  y: this.lastY,
              })
              this.trackData=false
          }
          this.idleTimeout=setTimeout(()=>{this.idle(this)},500)
      }
  }

    // handle mouse idle in "heatmap_wrapper" element
    // self means Class LayerSearch
  public idle(self: any){
      let idleCount=0
      self.idleInterval=setInterval(()=>{
          self.heatmapInstance.addData({
              x: this.lastX,
              y: this.lastY,
          })
          idleCount++
          if(idleCount>10) {clearInterval(self.idleInterval)}
      },500)
  }

  // handle heatmap button to imshow the heatmap canvas or not
  public handleHeatmapBtn=()=>{
      // console.log(this.heatmapInstance.getDataURL())
      this.setState({isDrawHeatmap: !this.state.isDrawHeatmap}
      ,()=>{
              if(this.state.isDrawHeatmap){
                  this.heatmapInstance=hm.create({
                      container: document.getElementById("heatmap_wrapper"),
                      width: 2300,
                      height: 800,
                      radius: 20,
                      maxOpacity: 0.6,
                      minOpacity:0.05,
                      blur: 0.5,
                      gradient:{
                          '0.1': 'blue',
                          '0.3': 'green',
                          '0.6': 'yellow',
                          '0.9': 'red',
                      }
                  })
                  if(this.heatMapData){
                      this.heatmapInstance.setData(this.heatMapData)
                  }
              }else{
                  // setData removes all previously existing points from the heatmap instance and
                  // re-initializes the datastore
                  // this.heatmapInstance.setData({
                  //     max: 20,
                  //     min: 0,
                  //     data: []
                  // })
                  this.heatMapData=this.heatmapInstance.getData()
                  document.getElementsByClassName("heatmap-canvas")[0].remove()
                  // this.heatmapInstance.configure({
                  //     container: null,
                  //     width: 0,
                  //     height: 0,
                  //     maxOpacity: 0,
                  // })
              }
          })
  }

  public componentWillUnmonut(){
      // clear timer
      clearInterval(this.traceDataInterval)
      clearInterval(this.idleInterval)
      clearTimeout(this.idleTimeout)
  }

  public render() {
    
    this.prepareData();
    return (
        <Content className="content">
            <div className="content_tool">
                {/*<Input.Search allowClear className="content_tool_search" enterButton={true} placeholder="Input something to search services" onSearch={value=>this.handleInputSearch(value)} />*/}
                <Input  className="content_tool_search" allowClear={true}  placeholder="Input something to search services" onPressEnter={this.handleSearch}  addonAfter={
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
                <LeftSider />
                <Content className="main_container_content" id="main_container_content" >
                  <div className="main_container_content_imglist_statis">
                     <Statistic className="main_container_content_imglist_statis_value" value={this.state.listTotal} suffix="layer images have been found."/>
                     <Statistic className="main_container_content_imglist_statis_value" value={this.state.time} precision={2} suffix="seconds have been needed."/>
                      <Button type={this.state.isDrawHeatmap?"primary":"default"}icon="heat-map" size="small" onClick={this.handleHeatmapBtn}/>
                  </div>
                  <div id="heatmap_wrapper" onMouseMove={this.collectMousePos}>
                      <List
                         id="main_container_content_imglist"
                         className="main_container_content_imglist"
                         itemLayout="vertical"
                         size="small"
                         pagination={{
                         current: this.state.pageInfo.pageNum,
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
                                    <List.Item key={childItem.id} className="main_container_content_imglist_item" >
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
                  </div>
                  <Divider />
                   <div className="main_container_content_shoppingCart">
                       <div className="main_container_content_shoppingCart_head">
                         <Icon className="icon" type="shopping-cart" />
                         <span className="title">Shopping Cart</span>
                         <Icon className="icon_small" type={this.state.bSideCollapsed?"down-square":"up-square"} onClick={()=>{this.setState({bSideCollapsed: !this.state.bSideCollapsed})}}/><br/>
                         <Statistic className="value" value={this.state.optionList.length} suffix="  layers have been selected."/>
                         <div className="buttons">

                             <input type="file" id="upload_file" multiple={true} style={{display: 'none'}} accept=".jpg, .jpeg, .png" />
                             <Button className="button" type="primary" onClick={()=>{this.uploadButton()}}>Upload</Button>

                           <Button className="button" type="primary" disabled={!!this.state.bSideCollapsed} onClick={()=>{this.handleEdit()}}>{this.state.isEdit?"Delete":"Edit"}</Button>
                           <Button className="button" type="primary" disabled={this.state.optionList.length===0} onClick={()=>{this.setState({submitVisible: true})}}>Submit</Button>
                        </div>
                       </div>
                       <div  className="main_container_content_shoppingCart_body" style={{display:this.state.bSideCollapsed?"none":"block"}}>
                         {this.shoppingcart()}
                       </div>
                   </div>
                   </Content>
               <IntensionExp collapsed={this.state.rSideCollapsed}/>

               <Modal className="main_container_modal" visible={this.state.submitVisible} onOk={()=>{this.handleSubmitOk()}} onCancel={()=>{this.setState({submitVisible: false})}} closable={false}
                      title={
                      <div className="main_container_modal_title">
                        <Icon className="icon" type="setting" /><span className="span">Submit Setting</span>
                      </div>}
                    footer={[
                      <Button key="back" onClick={()=>{this.setState({submitVisible: false})}}>Return</Button>,
                      <Button key="submit" type="primary" onClick={()=>{this.handleSubmitOk()}}>Submit</Button>,]}>

                  <div className="main_container_modal_body">
                    <span className="sub_title">Retrieval Method:</span><br/>
                    <p>Content-based WMS layer retrieval by considering cartographic method and main area of map</p>
                    <span className="sub_title">Description:</span><br/>
                    <p>A WMS layer retrieval strategy that takes into account the knowledge of cartography methods and map content. Firstly, the map is roughly classified according to cartography methods. Then explore the best feature fusion modes corresponding to the maps with same cartography methods, and on this basis, extract the hash code. Finally, use hash codes to achieve fast WMS layer retrieval.</p>
                  </div>
               </Modal>

            </Layout>
        </Content>
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
               <Popover trigger="hover" content={<span>Learn more </span>} placement="top">
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
        <Carousel  className="main_container_content_shoppingCart_body_carousel">
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

    // handle input search in the database
    public handleSearch=()=>{
        const inputValue=document.getElementsByClassName('ant-input')[0].getAttribute('value');
        const queryPar = this.state.queryPar;
        if(inputValue!==null){queryPar.keywords=inputValue}
        this.setState({queryPar});
        this.props.dispatch(conveyQueryPar(queryPar))
        // this.queryLayerList(this.state.pageInfo, this.state.queryPar)
    }

    // handle input search in the last result
    public handleRefine=()=>{
        const inputValue=document.getElementsByClassName("ant-input")[0].getAttribute("value");
        console.log(inputValue);
        // complete refine interface...
    }

  // handle upload button in the shopping cart.
  // upload users' layers and push them into optionList.
  public uploadButton () {
    // read file by Base64
    function getBase64 (file:File){
      return  new Promise((resolve,reject) => {
        const fr=new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => resolve(fr.result as string)
        fr.onerror = error => reject(error);
      });  
    }

    const input = document.getElementById("upload_file") as HTMLInputElement;  // get upload DOM
    const selfOption=this.state.optionList;
    const selfUpload=this.state.uploadList;
    // get uploadList length
    let uploadListLength=0;
    selfUpload.forEach(item=>{
      uploadListLength=uploadListLength+1;
    })

    if(input!==null){
      input.click();   
      input.onchange= async ()=>{
        const fileList=input.files  // get upload files
        if (fileList!==null){
          if(fileList.length!==0){
            let uploadKey=1;
            // tslint:disable-next-line
           for(let i=0;i<fileList.length;i++){     // push every layers user uploaded into shopping cart
            if(fileList[i].type!=='image/jpeg' && fileList[i].type!=='image/jpg' && fileList[i].type!=='image/png'){
              message.error('Upload file '+fileList[i].name+ ' is not JPG, JPEG or PNG fomat',2);
              uploadKey=0;
            }
            else{
              uploadListLength=uploadListLength+1;
                const result=await getBase64(fileList[i])
                const layer:ILayer={
                  abstr: '',
                  attribution: '',
                  bbox: [],
                  id: 0,
                  keywords: '',
                  name: "",
                  photo:'',
                  projection: '',
                  service: {},
                  title: '',
                  topic: '',
                  url: ''
                };
                const base64=result as string;
                layer.id=-(uploadListLength);                                // layers' id user uploaded start from -1 to -∞
                layer.photo=base64.substring(base64.indexOf('base64')+7);;   // layers' photo user uploaded store Base64
                layer.name=fileList[i].name;                                 // layers' name user uploaded store photo own name
                selfOption.push(layer);
                selfUpload.set(layer.id.toString(),fileList[i]);

                // console.log(selfFile.get(this.state.uploadNum.toString()));
                if(i===fileList.length-1 && uploadKey===1){
                  message.success('Upload Successfully',2);
                }
                this.setState({
                  optionList: selfOption,
                  // uploadNum: -layer.id,
                  uploadList: selfUpload}); 
             }
            }

          }  
        }
      } 
    }
    
       
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
    // initialization needs clear the queryPar
    const queryPar={
        bound: [],
        continent: '',
        keywords: '',
        organization: '',
        organization_type: '',
        topic: '',
    }
    self.props.dispatch(conveyQueryPar(queryPar))
    // this.queryLayerList(this.state.pageInfo,queryPar).then(setLoading);
    // function setLoading(){
    //   self.setState({
    //       listFootShow: 'block',
    //       loading: false
    //   })
    // }
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
      const selfUpload=this.state.uploadList;

      const newOption=selfOption.filter(item=>{
        const layer=selfRecycle.map(value=>value)
        return !layer.includes(item)
    })
    
      // const newUpload=new FormData();
      selfUpload.forEach((item)=>{
        for(const layer of selfRecycle){
           if(selfUpload.has(layer.id.toString())){
             selfUpload.delete(layer.id.toString());
           }
        }
      })

      selfUpload.forEach((item)=>{
           console.log(item)
      })
      
    this.setState({
      optionList: newOption,
      recycleList: [],
      isEdit: !this.state.isEdit,
      uploadList: selfUpload,
    })
  }
  // if the button is in the edited state, then change button state into deleting
    else{
      this.setState({
        isEdit: !this.state.isEdit
      })
    }
}

  // handle Submit button in the shopping cart
  public  handleSubmitOk = () => {
    smoothscroll();
     this.setState({
      loading:true,
      submitVisible: false,
      pageInfo:{
          pageNum: 1,
          pageSize: 40,
      },
      queryType: 'submitByTemplate',
    },()=>{this.queryLayerByTemplate(this.state.pageInfo,this.state.optionList)})
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
    if (this.state.queryType === 'byMetadata'){
      this.queryLayerList(this.state.pageInfo,this.props.queryPar);
    }
    if (this.state.queryType === 'paginateByTemplate'){
      this.queryLayerByTemplate(this.state.pageInfo,this.state.optionList);
    }

}

 // hide right sider
//  public toggle =()=>{
//   this.setState({rSideCollapsed:!this.state.rSideCollapsed});
// }

  // Function: send http request to get layer list data
  // When to transfer: init render LayerSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
  // @param  params:object = {keyword?:string, bound?:number[], pageNum:number, pageSize:number, topic?:string, organization?:string, organization_type?:string, continent?:string}
  public async queryLayerList(pagePar:object, queryPar:object) {
    const baseUrl:string = 'search/queryLayerList';
    const reqPar:object = Object.assign(pagePar,queryPar);
    const url:string = reqUrl(delEmptyKey(reqPar),baseUrl,'8081');
    let requestTime:number=0;  // record request time
    console.log(url)
    try {
        const timer=setInterval(()=>{++requestTime},10)
        const res: any = await $req(url, {})
        clearInterval(timer);
        const resBody:any  = JSON.parse(res)
        this.setState({
            currentSize: resBody.currentLayerNum,
            dataList: resBody.data,
            listTotal: resBody.totalLayerNum,
            isUpdate: true,
            loading: false,
            queryType: 'byMetadata',
            time: requestTime*0.01,
        })
    } catch(e) {
        alert(e.message)
    }
  }

  public async queryLayerByTemplate(pagePar:object,optionList:ILayer[]) {
    const baseUrl:string = reqUrl(delEmptyKey(pagePar),'search/queryLayerByTemplate','8081');
    let url:string=baseUrl+'&templateId=';
    // if(this.state.queryType === 'paginateByTemplate'){
    // }
    if(this.state.queryType === 'submitByTemplate'){
      // deep copy
      this.submitOptionList=JSON.parse(JSON.stringify(this.state.optionList))
    }
    for(const each of this.submitOptionList){
      if(each.id<0){
        continue;
      } 
      url+=each.id.toString()+','
    }
    url=url.substring(0,url.length-1)
    // const url:string = 'http://132.232.98.213:8081/search/querylayerbytemplate?templateId=1,2&pageNum=1&pageSize=40'; 

    let requestTime:number=0;  // record request time
    console.log(url)
    try {
        const timer=setInterval(()=>{++requestTime},10)
        const res: any = await $req(url, {})
        clearInterval(timer);
        const resBody:any  = JSON.parse(res)
        this.setState({
            currentSize: resBody.currentLayerNum,
            dataList: resBody.data,
            listTotal: resBody.totalLayerNum,
            isUpdate: true,
            loading: false,
            queryType: 'paginateByTemplate',
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
