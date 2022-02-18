import * as React from 'react';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Button, Form, Input, message, Modal, Select } from 'antd';
// import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'react-redux';
import {conveyForgotPasswordVisible} from "../../redux/action";
import '../../style/_forgotPassword.scss'
import {reqUrl} from "../../util/util";
import $req from "../../util/fetch";

interface Props  {
    dispatch: (action: any)=>void
}

interface State{
    forgotPasswordVisible: boolean,
    identifier: string,
    password: string,
}

class ForgotPassword extends React.Component<Props, State>{
    // Instead of unsafe and not recommended componentWillReceiveProps,
    // use static getDerivedStateFromProps to get new state from props
    public static getDerivedStateFromProps(nextProps: any, prevState: any){
        if (nextProps.forgotPasswordVisible !== prevState.forgotPasswordVisible){
            return {
                forgotPasswordVisible: nextProps.forgotPasswordVisible
            }
        }
        // return null means do nothing on state
        return null
    }

    public formRef:React.RefObject<any>=React.createRef()

    constructor(props:Props) {
        super(props);
        this.state = {
            forgotPasswordVisible: false,
            identifier: "email",
            password: '',
        }
    }

    // receive changed variable from redux
    // public componentWillReceiveProps(nextProps: any) {
    //     if(this.state.forgotPasswordVisible !== nextProps.forgotPasswordVisible){
    //         this.setState({
    //             forgotPasswordVisible: nextProps.forgotPasswordVisible
    //         })
    //     }
    // }

    // handle find my password button
    public async handleFindPassword (values:any){
        // prevent refresh page after form submission
        // e.preventDefault();

        // console.log('Received values of form: ', values)
        // query password by findType and identity

        try {
            const url = reqUrl({findType: values.FType , identifier: values.identity},'identify/findPwd','8081')
            console.log(url)

            const res: any = await $req(url, {method:"GET"})
            const resBody: any=JSON.parse(res)
            if (resBody.errCode===0) {
                message.success("Request successfully.")
                this.formRef.current.setFieldsValue({password: resBody.resBody})
            }
            else if (resBody.errCode === 1001){
                message.error("Can not find this identifier in the database.Please input correct account.")
                this.formRef.current.resetFields()
            }
            else if (resBody.errCode === 1002){
                message.error("Service request failed. Please try again later!")
                this.formRef.current.resetFields()
            }
        } catch (e) {
            alert(e.message)
            this.formRef.current.resetFields()
        }

    }

    // handle cancel button
    public handleCancel =()=>{
        this.props.dispatch(conveyForgotPasswordVisible(false))
        this.formRef.current.resetFields()
    }

    public render (){
        const prefixSelector=(
            <Form.Item id="temp" name="FType" initialValue={this.state.identifier} noStyle={true}>
                <Select onSelect={(value:string)=>{this.setState({identifier: value})}}
                        onChange={()=>{this.formRef.current.resetFields(['identity','password'])}}>
                    <Select.Option key='email' value='email'><MailOutlined style={{color: 'rgba(0,0,0,.5)'}} /></Select.Option>
                    <Select.Option key='username' value='username'><UserOutlined style={{color: "rgba(0,0,0,.5)"}} /></Select.Option>
                </Select>
            </Form.Item>)
        // const {getFieldDecorator}=this.props.form
        return (
            <Modal
                visible={this.state.forgotPasswordVisible}
                title={"Find Password"}
                footer={null}
                maskClosable={false}
                onCancel={this.handleCancel}
                forceRender={true}
            >
                <p>Forgot your Password?   Ծ‸Ծ </p>
                <p>Don't worry. Let's help you to retrieve your password by your registered Email or Username   </p>
                <Form className="forgot_password_form" layout={"vertical"} ref={this.formRef} onFinish={(values:any)=>this.handleFindPassword(values)}>
                    <Form.Item  name="identity" label={this.state.identifier === 'email' ? "Email" : "Username"}
                               labelAlign="left" validateTrigger="onBlur"
                               rules={[{
                                   required: true,
                                   message: "Please input your " + this.state.identifier + "!"
                               }, this.state.identifier === 'email' ?
                                   {type: "email", message: "The input is not valid Email!"} : {}]}>
                        <Input  id="FPIdentity" addonBefore={prefixSelector}
                                placeholder={this.state.identifier=== 'email'? 'Email':'Username'}/>
                    </Form.Item>
                    <Form.Item name="password" label="Your Lost Password" labelAlign="left">
                        <Input id="FPPassword" prefix={<LockOutlined style={{color: "rgba(0,0,0,.5)"}} />}
                               disabled={true}  />
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 8}}>
                        <Button type="primary" className="forgot_password_button" htmlType="submit" >
                            Find My Password
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps =(state:any) =>{
    return{
        forgotPasswordVisible: state.conveyVisibleReducer.forgotPasswordVisible
    }
}

// const wrappedForgotPassword=Form.create<Props>({name:'forgotpassword'})(ForgotPassword)
export default connect(mapStateToProps)(ForgotPassword);