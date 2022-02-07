import * as React from 'react';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox, message, Input, Modal, Select } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'react-redux';
import '../../style/_login.scss'
import {conveyForgotPasswordVisible, conveyIsLogin, conveyLoginVisible, conveyRegisterVisible} from "../../redux/action";
import logo from "../../assets/img/logo.svg";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import {reqUrl} from "../../util/util";
import $req from "../../util/fetch";

interface Props extends FormComponentProps {
   dispatch: (action: any)=>void
}

interface State{
    loginVisible: boolean;
    identifier: string;
}

class Login extends React.Component<Props, State>{
    // Instead of unsafe and not recommended componentWillReceiveProps,
    // use static getDerivedStateFromProps to get new state from props
    public static getDerivedStateFromProps(nextProps: any, prevState: any){
        if (nextProps.loginVisible !== prevState.loginVisible){
            return {
                loginVisible: nextProps.loginVisible
            }
        }
        // return null means do nothing on state
        return null
    }

    constructor(props:Props) {
        super(props);
        this.state = {
            loginVisible: false,
            identifier: 'email'
        }
    }

    // receive changed variable from redux
    // public componentWillReceiveProps(nextProps: any) {
    //     if (nextProps.loginVisible !== this.state.loginVisible)
    //     {
    //         this.setState({
    //             loginVisible: nextProps.loginVisible
    //         })
    //     }
    // }

    // handle login button
    public handleLogin = (e:any) => {
        // prevent refresh page after form submission
        e.preventDefault();

        const {form,dispatch}=this.props
        form.validateFields(  async (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values)
                // post login authentication to back-end, return user information
                try {
                    const url = reqUrl({},'identify/login','8081')
                    console.log(url)

                    const tmpValues = {
                        loginType: values.loginType,
                        password: values.password }
                    let postValues=null
                    if (values.loginType === "email"){
                         postValues={...tmpValues, email:values.identity}
                    }else if (values.loginType === "username"){
                         postValues={...tmpValues, username:values.identity}
                    }

                    const config = {body: postValues, method: "post", 'Content-Type': 'application/json'}
                    const res: any = await $req(url, config)
                    const resBody: any=JSON.parse(res)
                    if (resBody.errCode===0) {
                        // should push resBody.resBody(user information) to redux store.
                        message.success("Login successfully.")
                        dispatch(conveyLoginVisible(false))
                        dispatch(conveyIsLogin(true))
                        form.resetFields()
                    }
                    else if (resBody.errCode === 1001){
                        message.error("Identifier and password mismatched.Please input correct account.")
                        form.resetFields(['password'])
                    }
                    else if (resBody.errCode === 1002){
                        message.error("Service request failed. Please try again later!")
                        form.resetFields(['password'])
                    }
                } catch (e) {
                    alert(e.message)
                    form.resetFields(['password'])
                }
            }
        })
    }

    // handle cancel button
    public handleCancel =()=>{
        this.props.dispatch(conveyLoginVisible(false))
    }


    public render() {
        const {getFieldDecorator} =this.props.form;
        const prefixSelector=getFieldDecorator('loginType',{initialValue: this.state.identifier})(
            <Select onSelect={(value:string)=>{this.setState({identifier: value})}}
                    onChange={()=>{this.props.form.resetFields()}}>
                <Select.Option key='email'><MailOutlined style={{color: 'rgba(0,0,0,.5)'}} /></Select.Option>
                <Select.Option key='username'><UserOutlined style={{color: "rgba(0,0,0,.5)"}} /></Select.Option>
            </Select>);
        return (
            <Modal
                visible={this.state.loginVisible}
                title="Welcome to OGC WMS Discovery Portal"
                footer={null}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div className="login_logo">
                    <img src={logo} className="login_logo_img" alt="logo" />
                </div>
                <Form  className="login_form" onSubmit={this.handleLogin}>
                    <Form.Item label={this.state.identifier=== 'email'? 'Email':'Username'} labelAlign="left" >
                        {getFieldDecorator('identity',{
                            rules: [{required: true, message: 'Please input your '+ this.state.identifier + "!"}],
                        })(
                            <Input  addonBefore={prefixSelector}
                                    placeholder={this.state.identifier=== 'email'? 'Email':'Username'}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Password" labelAlign="left">
                        {getFieldDecorator('password',{
                            rules:[{required: true, message: 'Please input your password!'}],
                        })(
                            <Input.Password prefix={<LockOutlined style={{color: "rgba(0,0,0,.5)"}} />}
                                   placeholder="Password"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember',{
                            valuePropName: 'check', initialValue: true})
                        (<Checkbox>Remember me</Checkbox>)}
                        <a className="login_form_forgot" onClick={this.handleForgotPassword}>Forgot password</a>
                        <ForgotPassword />
                        <Button type="primary" htmlType="submit" className="login_form_button" >
                            Log in
                        </Button>
                        Or <a onClick={this.handleRegister}>register now!</a>
                    </Form.Item>
                </Form>
                <Register />
            </Modal>
        );
    }

    // Dispatch registerVisible to render register modal.
    public handleRegister =()=>{
        this.props.dispatch(conveyRegisterVisible(true))
    }

    // Dispatch forgotPasswordVisible to render find password modal.
    public handleForgotPassword =()=>{
        this.props.dispatch(conveyForgotPasswordVisible(true))
    }

}

const mapStateToProps =(state:any) =>{
    return{
        loginVisible: state.conveyVisibleReducer.loginVisible
    }
}


const wrappedLogin=Form.create<Props>({name:'login'})(Login)
export default connect(mapStateToProps)(wrappedLogin);