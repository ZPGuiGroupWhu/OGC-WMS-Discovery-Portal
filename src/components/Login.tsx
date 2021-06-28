import * as React from 'react';
import {Button, Checkbox, Form, Icon, Input, Modal} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'react-redux';
import '../style/_login.scss'
import {conveyLoginVisible} from "../redux/action";
import logo from "../assets/img/logo.svg";

interface Props extends FormComponentProps {
   dispatch: (action: any)=>void
}

interface State{
    loginVisible: boolean;
}

class Login extends React.Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            loginVisible: false,
        }
    }

    public componentWillReceiveProps(nextProps: any) {
        // const tmpVisible=nextProps.loginVisible
        this.setState({
            loginVisible: nextProps.loginVisible
        })
    }

    public handleLogin =()=>{
        this.props.dispatch(conveyLoginVisible(false))
        this.setState({
            loginVisible: false})
    }

    public handleCancel =()=>{
        this.props.dispatch(conveyLoginVisible(false))
        this.setState({
            loginVisible: false})
    }

    public render() {
        const {getFieldDecorator} =this.props.form;
        return(
            <Modal
                visible={this.state.loginVisible}
                title="Welcome to OGC WMS Discovery Portal"
                footer={null}
                onCancel={this.handleCancel}
            >
                <div className="login_logo">
                    <img src={logo} className="login_logo_img" alt="logo" />
                </div>
                <Form  className="login-form">
                    <Form.Item label="Username" labelAlign="left" >
                        {getFieldDecorator('username',{
                            rules: [{required: true, message: 'Please input your username!'}],
                        })(
                            <Input prefix={<Icon type="user" style={{color: "rgba(0,0,0,.5)"}}/>}
                                   placeholder="Username"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Password" labelAlign="left">
                        {getFieldDecorator('password',{
                            rules:[{required: true, message: 'Please input your password!'}],
                        })(
                            <Input.Password prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.5)"}}/>}
                                   placeholder="Password"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember',{
                            valuePropName: 'check', initialValue: true})
                        (<Checkbox>Remember me</Checkbox>)}
                        <a className="login_form_forgot" href="">Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login_form_button" onClick={this.handleLogin}>
                            Log in
                        </Button>
                        Or <a href="">register now!</a>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

const mapStateToProps =(state:any) =>{
    return{
        loginVisible: state.conveyVisibleReducer.loginVisible
    }
}

const wrappedLogin=Form.create<Props>({name:'login'})(Login)
export default connect(mapStateToProps)(wrappedLogin);