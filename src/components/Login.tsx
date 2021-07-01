import * as React from 'react';
import {Button, Checkbox, Form, Icon, Input, Modal} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'react-redux';
import '../style/_login.scss'
import {conveyLoginVisible, conveyRegisterVisible} from "../redux/action";
import logo from "../assets/img/logo.svg";
import Register from "./Register";

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
        this.setState({
            loginVisible: nextProps.loginVisible
        })
    }

    public handleLogin =(e:any)=>{
        // prevent form submission
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                console.log('Received values of form: ', values)
            }
        })

        this.props.dispatch(conveyLoginVisible(false))
        this.setState({
            loginVisible: false})
    }

    public handleCancel =()=>{
        this.props.dispatch(conveyLoginVisible(false))
        this.setState({
            loginVisible: false})
    }

    public handleRegister =()=>{
        this.props.dispatch(conveyRegisterVisible(true))
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
                <Form  className="login_form" onSubmit={this.handleLogin}>
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
                        <a className="login_form_forgot" >Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login_form_button" >
                            Log in
                        </Button>
                        Or <a onClick={this.handleRegister}>register now!</a>
                    </Form.Item>
                </Form>
                <Register />
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