import * as React from 'react';
import {NavLink as Link} from 'react-router-dom';
import logo from '../assets/img/logo.svg';
import Login from "./User/Login";
import {Avatar, Layout, Menu} from 'antd';
import {conveyIsLogin, conveyLoginVisible} from "../redux/action";
import { connect } from 'react-redux';
import '../style/_header.scss';
import 'antd/dist/antd.css';
const { Header } = Layout;

interface Props{
    dispatch: (action:any)=>void
}

interface State{
    current:string,
    isLogin: boolean,
}

class PortalHeader extends React.Component<Props,State>{
  constructor(props:any)
    {
      super(props);
      this.state={
          current:'1',
          isLogin: false,
      }
    }

    public componentWillReceiveProps(nextProps:any) {
        this.setState({isLogin:nextProps.isLogin})
    }

    public handleClick =(e:any) =>{
      if (e.key === "6"){
          this.props.dispatch(conveyLoginVisible(true))
      }else if(e.key === "11"){
          this.props.dispatch(conveyIsLogin(false))
      }
      else{
          this.setState({current: e.key});
      }
    }

    public render() {
      return (
          <Header className="header">
            <div className="header_logo">     
              <img src={logo} className="header_logo_img" alt="logo" />
              <span className="header_logo_name">OGC WMS Discovery Portal</span>
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                className="header_menu"
                defaultSelectedKeys={['1']}
                selectedKeys={[this.state.current]}
                onClick= {this.handleClick}
            >
                {/*<Menu.Item  key="1"><Link   className="header_menu_nav" exact={true}  to="/" >Home</Link></Menu.Item>*/}
                <Menu.SubMenu key="1" className="header_menu_dropdown" title={<span>Home</span>}>
                    <Menu.Item key="7"><Link to="/">Service Search</Link></Menu.Item>
                    <Menu.Item key="8"><Link to="/layerSearch">Layer Search</Link></Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu key="2" className="header_menu_dropdown" title={<span>Theme Map</span>}>
                    <Menu.Item key="9"><Link to="/distribution">Service Distribution</Link></Menu.Item>
                    <Menu.Item key="10"><Link to="/serviceQuality">Service Quality</Link></Menu.Item>
                    <Menu.Item key="11"><Link to="/layerStatis">Layer Statistic</Link></Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key="3"><Link className="header_menu_nav" to="/dataAnalysis" >Data Analysis</Link></Menu.Item>
                <Menu.Item key="4"><Link className="header_menu_nav" to="/about" >About</Link></Menu.Item>
                {this.state.isLogin?
                    <Menu.SubMenu key="5" className="header_menu_dropdown"
                                  title={<Avatar size={"large"} src="User.jpg"/>}>
                        <Menu.Item key="12"><Link to="/settings">Settings</Link></Menu.Item>
                        <Menu.Item key="13">Sign Out</Menu.Item>
                    </Menu.SubMenu> :
                    <Menu.Item key="6" className="header_menu_nav">Login</Menu.Item>}
            </Menu>
           <Login />
          </Header>
      );
    }
  }

  const mapStateToProps=(state:any)=>{
     return {
         isLogin: state.conveyVisibleReducer.isLogin
     }
}
  export default connect(mapStateToProps)(PortalHeader);