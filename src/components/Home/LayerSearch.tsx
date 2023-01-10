import * as React from 'react';
import '../../style/_home.scss';

import {
    BulbOutlined,
    MoreOutlined,
    ProjectOutlined,
    PushpinOutlined,
    SettingOutlined,
    TagOutlined,
    ThunderboltOutlined,
    CloseCircleTwoTone,
    HeartOutlined,
    FrownOutlined,
    HeartTwoTone,
    UpOutlined,
    DownOutlined,
} from '@ant-design/icons';

import {
    Layout,
    Statistic,
    List,
    Card,
    Popover,
    Button,
    Carousel,
    Divider,
    message,
    Modal,
    Image,
    Input,
    Tabs,
    Select,
    Radio,
    Tooltip,
    Space,
} from 'antd';
import $req from '../../util/fetch';
import {IQueryPar, IPageInfo, ILayer, IHover, ISubIntent} from "../../util/interface";
import { reqUrl, delEmptyKey, smoothscroll } from '../../util/util';
import LeftSider from './LeftSider';
import IntensionExp from './IntentionExp';
import {connect} from 'react-redux';
import {conveyIntentData, conveyLayerID, conveyQueryPar} from '../../redux/action';
import AdvIntentionPanel from "./AdvIntentionPanel";
// import rawData from "../../assets/data/intentionResult2022.2.23.json";

// @ts-ignore
// import hm from 'heatmap.js'

const { Content} = Layout;
const { TabPane } = Tabs;


interface Props { 
  queryPar: IQueryPar;
  dispatch: (action:any)=>void;
}

interface State {
  bSideCollapsed: boolean;
  currentSize: number;
  dataList: ILayer [];
  isDelete: boolean;
  isUpdate: boolean;
  isPositiveTab: boolean;
  listFootShow: string;
  listTotal: number;
  loading: boolean;
  positiveList: ILayer[];
  negativeList: ILayer[];
  pageInfo: IPageInfo;
  queryPar: IQueryPar;
  queryMethod: string;  // 'metaData', 'layerVision', 'MDL', 'intention'
  radioValue: string;
  rSideCollapsed: boolean;
  showAdvIntentPanel: boolean;
  submitVisible: boolean;
  time: number;
  uploadList: FormData;

  intention: ISubIntent[];    // store intent passing from IntentionExp

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
                pageInfo:{
                    pageNum: 1,
                    pageSize: 40
                },
                showAdvIntentPanel: false
            }
        }

        return null
    }

  public data: ILayer [][];
    // store the current positive layers and negative layers when submit
    // and store the last positive layers and negative layers when paginate
  public submitOptionList: ILayer [][]=new Array(2).fill([]);

  // Record time and count when mouse enter the layer
  public layerInterval: NodeJS.Timeout;
  public hoverInterval: NodeJS.Timeout;
  public hoverList: IHover[];

    constructor(props: Props) {
        super(props);
        this.state = {
            bSideCollapsed: true,
            currentSize: 0,
            dataList: [],
            isDelete: false,
            isUpdate: false,
            isPositiveTab: true,
            listFootShow: 'none',
            listTotal: 0,
            loading: true,
            positiveList: [],
            negativeList: [],
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
            queryMethod: 'metaData',
            radioValue: 'MDL',
            rSideCollapsed: true,
            showAdvIntentPanel: false,
            submitVisible: false,
            time: 0,
            uploadList: new FormData(),   // uploadList's keys equal layer's ids starting from -1 to -∞, its value store upload File.

            intention: []   // store intent passing from IntentionExp
        };

        window.sessionStorage.setItem('dataSource','all data')
    }

  public componentDidMount(){
      this.initData();
      this.hoverList = [];
      // ban the default function of right click in the main_container_content_imglist
      const element = document.getElementById("main_container_content_imglist")
      if (element) {
          element.addEventListener('contextmenu', (e) => {
              e.preventDefault();
          })
      }
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

    // deliver callback function to IntentionExp and AdvIntentionPanel components to change the state of showAdvIntentPanel
    public intentionPanelCallback=(advancePanel:boolean)=>{
        this.setState({showAdvIntentPanel: advancePanel})
    }

    // deliver callback function to IntentionExp to control IntentionExp component visually
    public rSideCallback=(rSide:boolean)=>{
        this.setState({rSideCollapsed: rSide})
    }

    public intentionCallback = (intention:ISubIntent[], queryMethod: string) => {
        const selfPageInfo = {
            pageNum: 1,
            pageSize: 40
        }
        this.setState({
            intention,
            queryMethod,
            pageInfo: selfPageInfo,
            loading: true,
        }, () => this.queryLayerByIntention(this.state.pageInfo, intention))
    }

  public render() {
      let layerCounter=0
      this.prepareData();
      const createTabsExtraContent = () => {
          return (
              <div className="main_container_content_markCollection_head">
                  <div className="words">
                      <Statistic className="value"
                                 value={this.state.isPositiveTab ? this.state.positiveList.length : this.state.negativeList.length}
                                 suffix={this.state.isPositiveTab ? "  layers have been selected in the Like Collection." :
                                     "  layers have been selected in the Dislike Collection."}/>
                  </div>
                  <div className="buttons">
                      <input type="file" id="upload_file" multiple={true} style={{display: 'none'}}
                             accept=".jpg, .jpeg, .png"/>
                      <Button className="button" type="primary" disabled={!this.state.isPositiveTab}
                              onClick={() => {
                                  this.uploadButton()
                              }}>
                          Upload
                      </Button>
                      <Button className="button" type="primary"
                              disabled={!!this.state.bSideCollapsed
                              || (this.state.isPositiveTab && this.state.positiveList.length === 0)
                              || (!this.state.isPositiveTab && this.state.negativeList.length === 0)}
                              onClick={() => {
                                  this.setState({isDelete: !this.state.isDelete})
                              }}
                      >
                          {this.state.isDelete ? "Cancel" : "Remove"}</Button>
                      <Button className="button" type="primary"
                              disabled={this.state.positiveList.length === 0 && this.state.negativeList.length===0}
                              onClick={() => {
                                  this.setState({submitVisible: true})
                              }}>
                          Submit
                      </Button>
                  </div>
                  <div className="rightIcon">
                      {this.state.bSideCollapsed ?
                          <DownOutlined  onClick={() => {
                              this.setState({bSideCollapsed: !this.state.bSideCollapsed, isDelete: false})
                          }}/> :
                          <UpOutlined  onClick={() => {
                              this.setState({bSideCollapsed: !this.state.bSideCollapsed, isDelete: false})
                          }}/>}
                  </div>
              </div>)
      }

      return (
      <Content className="content">
          <div className="content_tool">
              {/*<Input.Search allowClear className="content_tool_search" enterButton={true} placeholder="Input something to search services" onSearch={value=>this.handleInputSearch(value)} />*/}
              <Input.Search  className="content_tool_search"  placeholder="Enter something to search for layers"
                             onSearch={this.handleSearch} onPressEnter={this.handleSearch} enterButton = {true}
              />
              <Radio.Group className = 'content_tool_radio' defaultValue = "all data" buttonStyle = "solid"
                           onChange={(e) => this.handleModifyDataSource(e)}>
                  <Radio.Button value ="all data">All Data Source</Radio.Button>
                  <Radio.Button value = "labeled data">Labeled Data Source</Radio.Button>
              </Radio.Group>
              <Select defaultValue="firstLetter" className="content_tool_select">
                  <Select.Option value="firstLetter">Sort by Name First Letter</Select.Option>
                  <Select.Option value="qulityRank" disabled = {true}>Sort by Quality Rank</Select.Option>
                  <Select.Option value="ResTime"  disabled = {true}>Sort By Response Time</Select.Option>
                  <Select.Option value="LayerNum"  disabled= {true}>Sort By Layer Number</Select.Option>
              </Select>
          </div>
          <Layout className="main_container">
              <LeftSider queryType={"layer"}/>
              {
                  this.state.showAdvIntentPanel?
                      <AdvIntentionPanel callback={this.intentionPanelCallback}/> :
              <Content className="main_container_content" id="main_container_content" >
                <div className="main_container_content_imglist_statis">
                   <Statistic className="main_container_content_imglist_statis_value" value={this.state.listTotal} suffix="layers have been found, taking"/>
                   <Statistic className="main_container_content_imglist_statis_value" value={this.state.time} precision={2} suffix="seconds."/>
                </div>
                  <div className = "main_container_content_imglist_explanation" >
                      <div>Like: click  <HeartOutlined/> or  press left</div>
                      <div>Dislike: click  <FrownOutlined/> or press right</div>
                  </div>
                <div id="heatmap_wrapper" >
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
                          <List.Item style={{padding: '12px'}}>
                              <List
                              className="main_container_content_childimglist"
                              itemLayout="horizontal"
                              size="small"
                              grid={{gutter:12,column:8,}}
                              dataSource={item}
                              renderItem={(childItem:ILayer) => (
                                  <List.Item key={childItem.id} className="main_container_content_imglist_item" style={{margin: 0, padding:0}}>
                                    <Popover className="main_container_content_imglist_item_popover" trigger="hover" content={this.popoverContent(childItem)}>
                                       <Card hoverable={true} onContextMenu={()=>{this.handleDiscard(childItem)}} cover={<img src={'http://119.91.111.143:8082/'+childItem.photo} />}
                                             onClick={()=>{this.handleStar(childItem)}}
                                             style={{border: (this.forList(childItem,this.state.positiveList))?' 5px solid #c0392b':
                                                     (this.forList(childItem,this.state.negativeList)?' 5px solid #808080':' 1px solid #ccc') }}
                                             bodyStyle={{padding:2, textAlign: "center", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}
                                             onMouseEnter={()=>{this.layerInterval=setInterval(()=>{layerCounter+=1},50)}}
                                             onMouseLeave={()=>{
                                                 this.updateHoverList(childItem,layerCounter);
                                                 clearInterval(this.layerInterval);
                                                 layerCounter=0}}
                                       >
                                               {childItem.name}
                                       </Card>
                                        <HeartTwoTone className="icon" twoToneColor="#c0392b"
                                                      style={{display: this.forList(childItem, this.state.positiveList)?"inline-block": "none"}}/>
                                        <FrownOutlined className="icon"
                                                      style={{display: this.forList(childItem, this.state.negativeList)?"inline-block": "none",color: "#808080"}}/>
                                    </Popover>
                                  </List.Item>
                                 )}
                              />
                          </List.Item>
                           )}
                    />
                </div>
                <Divider />
                <div className="main_container_content_markCollection">
                  <Tabs defaultActiveKey="positive" tabBarExtraContent={createTabsExtraContent()}
                        onTabClick={(activeKey:string)=>{
                            this.setState({isPositiveTab: activeKey==="positive"?true: false,isDelete:false,})
                        }}
                  >
                      <TabPane  key="positive"
                          tab={
                              <div className="main_container_content_markCollection_head">
                                      <HeartOutlined className="icon"/>
                                      <span className="title">Like</span>
                              </div>
                          }
                      >
                          <div key="positive_body" className="main_container_content_markCollection_body"
                               style={{display: this.state.bSideCollapsed ? "none" : "block"}}>
                              {this.renderMarkCollection()}
                          </div>
                      </TabPane>

                      <TabPane  key="negative"
                          tab={
                              <div className="main_container_content_markCollection_head">
                                      <FrownOutlined className="icon"/>
                                      <span className="title">Dislike</span>
                              </div>
                          }
                      >
                          <div key="negative_body" className="main_container_content_markCollection_body" style={{display:this.state.bSideCollapsed?"none":"block"}}>
                              {this.renderMarkCollection()}
                          </div>
                      </TabPane>
                  </Tabs>
                </div>
              </Content>
              }

              <IntensionExp advancedPanelCallback={this.intentionPanelCallback} rSideCallback={this.rSideCallback}
                            intentionCallback={this.intentionCallback} collapsed={this.state.rSideCollapsed}/>

              <Modal className="main_container_modal" visible={this.state.submitVisible} onOk={() => {this.handleSubmitOk()}}
                     onCancel={() => {this.setState({submitVisible: false})}} closable={false}
                    title={
                    <div className="main_container_modal_title">
                      <SettingOutlined className="icon" /><span className="span">Submit Setting</span>
                    </div>}
                  footer={[
                    <Button key="back" onClick={()=>{this.setState({submitVisible: false})}}>Return</Button>,
                    <Button key="submit" type="primary" onClick={()=>{this.handleSubmitOk()}}>Submit</Button>,]}>

                <div className="main_container_modal_body">
                  <span className="sub_title">Retrieval Method:</span><br/>
                    <Radio.Group className="radioGroup" defaultValue='MDL' value={this.state.radioValue}
                          onChange={(e)=>{this.setState({radioValue: e.target.value})}}>
                        <Radio value='MDL'>
                            Map Retrieval Intention Recognition based on Minimum Description Length Principle and Random Merge Strategy
                            ( Must in the labeled database)
                        </Radio>
                        <Radio value='layerVision' >
                            Content-based WMS Layer Retrieval by Considering Cartographic Method and Main Area of Map
                            ( Negative Samples are not used)
                        </Radio>
                    </Radio.Group>
                </div>
             </Modal>

          </Layout>
      </Content>
    );
  }

  // show card component when the mouse hovers the layers.
  public popoverContent = (layer:ILayer) =>{
      let hoverCounter=0
      const dataSourceCache = window.sessionStorage.getItem('dataSource')
      const abbContentList = []
      if (dataSourceCache === 'labeled data') {
          const wholeContent = layer.fContent?.split(',')
          for (const item of wholeContent!) {
              abbContentList.push(item.slice(item.lastIndexOf('/') + 1, item.length))
          }
      }

      // setTimeout(()=>{
      //     const el = document.getElementById('guide_select')
      //     if (el) {
      //         el.setAttribute("open",String(true))
      //         console.log(el)
      //     }
      // },3000)

    return (
      <Card  cover={<img src={'http://119.91.111.143:8082/'+layer.photo} />} bodyStyle={{padding: "10px"}}
             onMouseEnter={()=>{this.hoverInterval=setInterval(()=>{hoverCounter+=1},50)}}
             onMouseLeave={()=>{
                 this.updateHoverList(layer,hoverCounter)
                 clearInterval(this.hoverInterval)
                 hoverCounter=0}}
      >
          {
              dataSourceCache === 'labeled data' ?
                  <div className="main_container_content_imglist_item_popover_description">
                      <span><TagOutlined className="icon"/><b>Content: </b>{layer.fContent === "" ? "No Content" : abbContentList.join(', ')}</span><br/>
                      <span><ProjectOutlined className="icon"/><b>Space: </b> {layer.fSpace === "" ? "No space" : layer.fSpace} </span><br/>
                      <span><PushpinOutlined className="icon"/><b>Style: </b>{layer.fStyle === "" ? "No style" : layer.fStyle}</span><br/>
                      <span><BulbOutlined className="icon"/><b>Topic: </b>{layer.fTopic === "" ? "No topic" : layer.fTopic}</span><br/>
                  </div>
                  :
                  <div className="main_container_content_imglist_item_popover_description">
                      <span><TagOutlined className="icon"/><b>Name: </b>{layer.name}</span><br/>
                      <span><ProjectOutlined className="icon"/><b>Title: </b>{layer.title}</span><br/>
                      <span><PushpinOutlined
                          className="icon"/><b>Attribution: </b>{layer.attribution === "" ? "No attribution" : layer.attribution}</span><br/>
                      <span><BulbOutlined className="icon"/><b>Topic: </b>{layer.topic}</span><br/>
                      <span><ThunderboltOutlined
                          className="icon"/><b>Keywords: </b>{layer.keywords === "" ? "No keywords" : layer.keywords}</span>
                  </div>
          }
          <div className="main_container_content_imglist_item_popover_button">
              <Space size="small" align="center">
                  <Tooltip trigger="hover" placement="top"
                           title={<span>{this.forList(layer,this.state.positiveList)? "Deselect ": "Select "}this Layer</span>}>
                      <Button className="button" onClick={()=>{this.handleStar(layer)}}
                              type={this.forList(layer,this.state.positiveList)?"primary":"default"}>
                           <HeartOutlined />
                      </Button>
                  </Tooltip>
                  {/*add an annoying collection button*/}
                  <Tooltip trigger="hover" placement="top"
                           title={<span>{this.forList(layer,this.state.negativeList)? "Cancel the deletion of ": "Discard "}this Layer</span>}>
                      <Button className="button" onClick={()=>{this.handleDiscard(layer)}}
                              type={this.forList(layer,this.state.negativeList)?"primary":"default"}>
                          <FrownOutlined />
                      </Button>

                  </Tooltip>
                  <Tooltip trigger="hover" title={<span>Learn more </span>} placement="top">
                      <Button className="button"  icon={<MoreOutlined />} onClick={()=>{this.props.dispatch(conveyLayerID(layer.id))}} href='layerInfo'/>
                  </Tooltip>
              </Space>

           </div>
       </Card>
    );
 }


  // show the collection component of marking layers
  public renderMarkCollection = () =>{
    // prepare two dimension array for positiveList or negativeList
     const col=6;  // every row has six picture
     const round=Math.floor((this.state.isPositiveTab?this.state.positiveList:this.state.negativeList).length/col);
     const remainder=(this.state.isPositiveTab?this.state.positiveList:this.state.negativeList).length % col;
     let temp:ILayer[][];

     temp=[[]];
      for (let i = 0; i < round; ++i) {
          temp[i] = []
          for (let k = 0; k < col; ++k) {
              temp[i][k] = (this.state.isPositiveTab ? this.state.positiveList : this.state.negativeList)[i * col + k];
          }
      }
      if (remainder !== 0) {
          temp[round] = []
          for (let m = 0; m < remainder; ++m) {
              temp[round][m] = (this.state.isPositiveTab ? this.state.positiveList : this.state.negativeList)[round * col + m]
          }
      }

      return (
        <Carousel  className="main_container_content_markCollection_body_carousel">
            {temp.map((item:ILayer[],index:number)=>{
              return this.carouselComponent(item,index)
          })}
        </Carousel>

        )
    }


  // carouse component in the marking collection
  public carouselComponent = (layer:ILayer[],index: number) =>{

    return (
      <List
      key={index}
      className="main_container_content_markCollection_body_list"
      itemLayout="horizontal"
      size="small"
      grid={{gutter:15,column:6}}
      dataSource={layer}
      renderItem={(item:ILayer)=>(
        <List.Item key={item.id} style={{margin: 2, padding: 4}}>
            <Tooltip title={() => {
                const abbContentList = []
                if (window.sessionStorage.getItem('dataSource') === 'labeled data') {
                    const wholeContent = item.fContent?.split(',')
                    for (const concept of wholeContent!) {
                        abbContentList.push(concept.slice(concept.lastIndexOf('/') + 1, concept.length))
                    }
                }
                return (
                    window.sessionStorage.getItem('dataSource') === 'labeled data' ?
                        <div>
                            <span><TagOutlined
                                className="icon"/><b>Content: </b>{item.fContent === "" ? "No Content" : abbContentList.join(', ')}</span><br/>
                            <span><ProjectOutlined
                                className="icon"/><b>Space: </b> {item.fSpace === "" ? "No space" : item.fSpace} </span><br/>
                            <span><PushpinOutlined
                                className="icon"/><b>Style: </b>{item.fStyle === "" ? "No style" : item.fStyle}</span><br/>
                            <span><BulbOutlined
                                className="icon"/><b>Topic: </b>{item.fTopic === "" ? "No topic" : item.fTopic}</span><br/>
                        </div>
                        :
                        <div>
                            <span><TagOutlined className="icon"/><b>Name: </b>{item.name}</span><br/>
                            <span><ProjectOutlined className="icon"/><b>Title: </b>{item.title}</span><br/>
                            <span><PushpinOutlined
                                className="icon"/><b>Attribution: </b>{item.attribution === "" ? "No attribution" : item.attribution}</span><br/>
                            <span><BulbOutlined className="icon"/><b>Topic: </b>{item.topic}</span><br/>
                            <span><ThunderboltOutlined
                                className="icon"/><b>Keywords: </b>{item.keywords === "" ? "No keywords" : item.keywords}</span>
                        </div>
                )
              }
            }>
                <Card className="card" hoverable={true}
                      cover={<Image className="img" alt="Layer Image" preview={!this.state.isDelete}
                                    src={'http://119.91.111.143:8082/' + item.photo} style={{display: 'inline-block'}}/>}
                      onClick={() => {
                          (this.state.isPositiveTab ? this.handlePositiveDelete : this.handleNegativeDelete)(item)
                      }}
                      style={{border: this.state.isDelete ? ' 5px solid #c0392b' : ' 1px solid #ccc'}}
                      bodyStyle={{
                          padding: 2,
                          textAlign: "center",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap"
                      }}
                >
                    {item.name}
                </Card>
            </Tooltip>
            <CloseCircleTwoTone className="deleteIcon" twoToneColor="#c0392b"
                                style={{display: this.state.isDelete?"inline-block": "none"}}
                                onClick={()=>{(this.state.isPositiveTab?this.handlePositiveDelete:this.handleNegativeDelete)(item)}}/>
        </List.Item>
      )}
   />
    )
  }

    // update hoverList to save moving action of the users' mouse
    public updateHoverList=(layer:ILayer,counter:number)=>{
        let isLayerContain=false
        const selfHoverList=this.hoverList
        selfHoverList.map((hoverItem:IHover,index:number,list:IHover[])=>{
            if(hoverItem.layerID===layer.id){
                const freq=hoverItem.frequency
                const time=hoverItem.time
                list[index]={layerID:layer.id, frequency: freq+1, time: Math.floor((time+counter*0.05)*100)/100}
                isLayerContain=true
            }
        })
        if(!isLayerContain){
            selfHoverList.push({layerID: layer.id, frequency: 1, time: Math.floor(counter*0.05*100)/100})
        }
        this.hoverList=selfHoverList
    }

    // handle data source modification
    public handleModifyDataSource = (e:any) => {
        const dataSourceCache = window.sessionStorage.getItem('dataSource')
        if (dataSourceCache !== e.target.value){
            window.sessionStorage.setItem('dataSource', e.target.value)
            // query
            const initialPageInfo = {
                    pageNum: 1,
                    pageSize: 40// should be multiple of 8
            }
            // TODO: queryPar need to be initialed and render consistently.
            this.setState({
                loading: true,
                pageInfo: initialPageInfo,
                positiveList: [],
                negativeList: []
            })
            this.queryLayerList(initialPageInfo, this.state.queryPar)
        }
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

  // handle upload button in the marking collection.
  // upload users' layers and push them into positiveList.
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
    const selfPositive=this.state.positiveList;
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
           for(let i=0;i<fileList.length;i++){     // push every layers user uploaded into positiveList
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
                selfPositive.push(layer);

                selfUpload.append(layer.id.toString(),fileList[i],fileList[i].name)  // formData.append(name, value, filename)
                // selfUpload.set(layer.id.toString(),fileList[i]);

                // console.log(selfFile.get(this.state.uploadNum.toString()));
                if(i===fileList.length-1 && uploadKey===1){
                  message.success('Upload Successfully',2);
                }
                this.setState({
                  positiveList: selfPositive,
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

  // handleDiscard button
  public handleDiscard =(layer:ILayer)=>{
      // Find out if this layer is in the positiveList
      const selfPositive = this.state.positiveList;
      for (const i in selfPositive){
          if(selfPositive[i].id===layer.id){
              this.state.positiveList.splice(Number(i),1);
              break;
          }
      }

      const self= this.state.negativeList;
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
          negativeList: self,
      })

  }
  // handleStar button
  // If the layer is selected last time, then remove the layer from positiveList
  // If the layer is never selected last time, then add the layer into positiveList
  public handleStar =(layer:ILayer)=>{
    // Find out if this layer is in the negativeList
    const discard = this.state.negativeList;
    for (const i in discard){
        if(discard[i].id===layer.id){
            this.state.negativeList.splice(Number(i),1);
            break;
        }
    }
    const self= this.state.positiveList;
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
        positiveList: self,
    })
  }

    // handle those layers in the positive collection, which are going to delete
    // update positiveList and uploadList
    public handlePositiveDelete = (layer: ILayer) => {
        // const self=this.state.positiveList;
        if (this.state.isDelete) {
            const newPositiveList = this.state.positiveList.filter((itemLayer: ILayer) => {
                return itemLayer.id !== layer.id
            })

            // TODO: ALSO DELETE IN THE UPLOADLIST
            const selfUpload = this.state.uploadList;
            selfUpload.delete(layer.id.toString())

            // if positiveList is null, ban the delete button function
            if (newPositiveList.length === 0) {
                this.setState({
                    uploadList: selfUpload,
                    positiveList: newPositiveList,
                    isDelete: false
                })
            } else {
                this.setState({
                    uploadList: selfUpload,
                    positiveList: newPositiveList
                })
            }
        }
    }

    // handle those layers in the negative collection, which are going to delete
    public handleNegativeDelete = (layer: ILayer) => {
        if (this.state.isDelete) {
            const newNegativeList = this.state.negativeList.filter((itemLayer: ILayer) => {
                return itemLayer.id !== layer.id
            })

            // if negativeList is null, ban the delete button function
            if (newNegativeList.length === 0) {
                this.setState({
                    negativeList: newNegativeList,
                    isDelete: false
                })
            } else {
                this.setState({
                    negativeList: newNegativeList
                })
            }
        }
    }

  // handle Submit button in the marking collection
  public  handleSubmitOk = () => {
    smoothscroll();
    // this.setState({
    //     loading: true,
    //     submitVisible: false,
    //     pageInfo:{
    //         pageNum: 1,
    //         pageSize: 40,
    //     },
    // })

    if(this.state.radioValue==='MDL'){
        if (window.sessionStorage.getItem('dataSource') === 'labeled data') {
            if (this.state.negativeList.length === 0) {
                message.error('Annoying layer list can not be null!')
            } else {
                this.setState({
                        loading: true,
                        submitVisible: false,
                        pageInfo:{
                            pageNum: 1,
                            pageSize: 40,
                        },
                        queryMethod: 'MDL',
                    },
                    ()=>{this.queryLayerByMDL(this.state.pageInfo,this.state.positiveList, this.state.negativeList)
                        // ()=>{this.queryLayerByLayerVision(this.state.pageInfo,this.state.positiveList)
                    })
            }
        } else {
            message.error('MDL method must be used in the labeled database.')
        }

    }else if(this.state.radioValue==='layerVision'){
        this.setState({
            loading: true,
            submitVisible: false,
            pageInfo:{
                pageNum: 1,
                pageSize: 40,
            },
            queryMethod:'layerVision',
        },()=>{this.queryLayerByLayerVision(this.state.pageInfo,this.state.positiveList)})
    }
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
    if (this.state.queryMethod === 'metaData'){
      this.queryLayerList(this.state.pageInfo,this.props.queryPar);
    }
    else if (this.state.queryMethod === 'layerVision'){
      this.queryLayerByLayerVision(this.state.pageInfo,this.submitOptionList[0]);
    }
    else if(this.state.queryMethod === 'MDL'){
        this.queryLayerByMDL(this.state.pageInfo, this.submitOptionList[0], this.submitOptionList[1]);
    }
    else if(this.state.queryMethod === 'intention'){
        this.queryLayerByIntention(this.state.pageInfo, this.state.intention);
    }

}

 // hide right sider
//  public toggle =()=>{
//   this.setState({rSideCollapsed:!this.state.rSideCollapsed});
// }

  // Function: send http request to get layer list data
  // When to transfer: init render LayerSearch component, select the condition submenu item, click "apply", click "search", pahinate to a new page 
  // @param  params:object = {keyword?:string, bound?:number[], pageNum:number, pageSize:number, topic?:string, organization?:string, organization_type?:string, continent?:string}
  public async queryLayerList(pagePar:IPageInfo, queryPar:IQueryPar) {
      this.hoverList=[] // TODO: POST MOUSE DATA TO BACK END
      const baseUrl: string = 'search/queryLayerList';
      const dbTable = {
          table: window.sessionStorage.getItem("dataSource") === 'labeled data'? 'layerlist_for_intent':'layerlist'
      }
      // const reqPar: object = Object.assign(pagePar, queryPar, dbTable, {photoType: 'Base64Str'}); deliver image by encoding base64, abandoned
      const reqPar: object = Object.assign(pagePar, queryPar, dbTable);
      const url: string = reqUrl(delEmptyKey(reqPar), baseUrl, '8081');
      let requestTime: number = 0;  // record request time
      console.log(url)
      try {
          const timer = setInterval(() => {
              ++requestTime
          }, 10)
          const res: any = await $req(url, {})
          clearInterval(timer);
          const resBody: any = JSON.parse(res)
          this.setState({
              currentSize: resBody.currentLayerNum,
              dataList: resBody.data,
              listTotal: resBody.totalLayerNum,
              isUpdate: true,
              loading: false,
              queryMethod: 'metaData',
              time: requestTime * 0.01,
          })
      } catch (e) {
          alert(e.message)
      }
  }

  public async queryLayerByLayerVision(pagePar: IPageInfo,layerList:ILayer[]) {
      this.hoverList=[]  // TODO: POST MOUSE DATA TO BACK END
      const dbTable = {
          table: window.sessionStorage.getItem("dataSource") === 'labeled data'? 'layerlist_for_intent':'layerlist'
      }
      // const reqPar:object = Object.assign(pagePar, dbTable, {photoType: 'Base64Str'})  // deliver image by encoding base64, abandoned
      const reqPar:object = Object.assign(pagePar, dbTable)
      const baseUrl:string = reqUrl(delEmptyKey(reqPar),'search/queryLayerByTemplate','8081');
      let url: string = baseUrl + '&templateId=';
      this.submitOptionList[0]=JSON.parse(JSON.stringify(layerList))
      // if (!this.state.queryState.paginate) {
      //     // deep copy
      //     this.submitOptionList = JSON.parse(JSON.stringify(this.state.positiveList))
      // }
      for (const each of this.submitOptionList[0]) {
          if (each.id < 0) {
              continue;
          }
          url += each.id.toString() + ','
      }
      url = url.substring(0, url.length - 1)
      // const url:string = 'http://132.232.98.213:8081/search/querylayerbytemplate?templateId=1,2&pageNum=1&pageSize=40';

      let requestTime: number = 0;  // record request time
      console.log(url)
      try {
          const timer = setInterval(() => {
              ++requestTime
          }, 10)
          const res: any = await $req(url, {})
          clearInterval(timer);
          const resBody: any = JSON.parse(res)
          this.setState({
              currentSize: resBody.currentLayerNum,
              dataList: resBody.data,
              listTotal: resBody.totalLayerNum,
              isUpdate: true,
              loading: false,
              queryMethod: 'layerVision',
              time: requestTime * 0.01,
          })
      } catch (e) {
          alert(e.message)
      }
  }

  public async queryLayerByMDL(pagePar: IPageInfo, positiveList:ILayer[], negativeList: ILayer[]){
      // get the positive and negative layers ID
      const positiveID: number[] = []
      const negativeID: number[] = []
      for (const item of positiveList) {
          if (item.id < 0) {
              continue
          }
          positiveID.push(item.id)
      }
      for (const item of negativeList) {
          negativeID.push(item.id)
      }

      // construct body of post method
      const config = {
          body: {
              sessionID: '',
              layers: {
                  irrelevance: negativeID,
                  relevance: positiveID,
              },
              // parameter: {}
              pageNum: pagePar.pageNum,
              pageSize: pagePar.pageSize,
              // photoType: "Base64Str"     // deliver image by encoding base64, abandoned
          },
          method: "post",
          'Content-Type': 'application/json'
      }
      const url :string = reqUrl({},'search/queryLayerByMDL','8081');

      this.submitOptionList=JSON.parse(JSON.stringify([positiveList, negativeList]))
      // if (!this.state.queryState.paginate) {
      //     // deep copy
      //     this.submitOptionList = JSON.parse(JSON.stringify(this.state.positiveList))
      // }

      let requestTime: number = 0;  // record request time
      console.log(url)
      try {
          const timer = setInterval(() => {
              ++requestTime
          }, 10)
          const res: any = await $req(url, config)
          clearInterval(timer);
          const resBody: any = JSON.parse(res)
          this.setState({
              currentSize: resBody.currentLayerNum,
              dataList: resBody.data,
              listTotal: resBody.totalLayerNum,
              isUpdate: true,
              loading: false,
              queryMethod: 'MDL',
              time: requestTime * 0.01,

              rSideCollapsed: false
          })

          // update intention in the right sider
          const selfConfidence:number[]=[]
          // const resIntent = JSON.parse(resBody.intention)
          const intentList = resBody.intention.result[0].intention
          intentList.map((val:ISubIntent)=>{
              selfConfidence.push(val.confidence)
          })
          selfConfidence.push(resBody.intention.result[0].confidence)
          const intention = {
              confidence: selfConfidence,
              encodingLen: resBody.intention.parameter.encodingLength,
              filtration: resBody.intention.parameter.filtrationCoefficient,
              intent: resBody.intention.result[0].intention,
              mergeNum: resBody.intention.parameter.mergeNum
          }
          this.props.dispatch(conveyIntentData(intention))

      } catch (e) {
          alert(e.message)
      }

      // 将静态的意图数据存放在redux中
      // const selfConfidence:number[]=[]
      // rawData.result[0].intention.map((val:ISubIntent)=>{
      //     selfConfidence.push(val.confidence)
      // })
      // selfConfidence.push(rawData.result[0].confidence)
      // const res={
      //     confidence: selfConfidence,
      //     encodingLen: rawData.parameter.encodingLength,
      //     filtration: rawData.parameter.filtrationCoefficient,
      //     intent: rawData.result[0].intention,
      //     mergeNum: rawData.parameter.mergeNum
      // }
      // this.props.dispatch(conveyIntentData(res))
  }

  public async queryLayerByIntention(pagePar: IPageInfo, intention: ISubIntent[]) {
      const config = {
          body: {
              sessionID: '',
              intention,
              pageNum: pagePar.pageNum,
              pageSize: pagePar.pageSize,
              // photoType: "Base64Str"    // deliver image by encoding base64, abandoned
          },
          method: "post",
          'Content-Type': 'application/json'
      }
      const url: string = reqUrl({}, '/search/queryLayerByIntention','8081')

      let requestTime: number = 0;  // record request time
      console.log(url)
      try {
          const timer = setInterval(() => {
              ++requestTime
          }, 10)
          const res: any = await $req(url, config)
          clearInterval(timer);
          const resBody: any = JSON.parse(res)
          this.setState({
              currentSize: resBody.currentLayerNum,
              dataList: resBody.data,
              listTotal: resBody.totalLayerNum,
              isUpdate: true,
              loading: false,
              queryMethod: 'intention',
              time: requestTime * 0.01,

              rSideCollapsed: false
          })

          console.log(resBody)
      } catch (e) {
          alert(e.message)
      }
  }
}

// get queryPar from store(state.conveyQueryParReducer)
const mapStateToProps = (state:any) =>{
  return {
      queryPar: state.conveyQueryParReducer.queryPar,
      intentData: state.conveyIntentDataReducer.intentData,
  }
}

export default connect(mapStateToProps)(LayerSearch);
