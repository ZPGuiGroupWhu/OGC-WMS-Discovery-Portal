import * as React from 'react';
import {Button, Form, Icon, Input, message, Modal, Select} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'react-redux';
import {conveyForgotPasswordVisible} from "../../redux/action";
import '../../style/_forgotPassword.scss'
import {reqUrl} from "../../util/util";
import $req from "../../util/fetch";

interface Props extends FormComponentProps {
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
    public handleFindPassword =(e:any)=>{
        // prevent refresh page after form submission
        e.preventDefault();
        const {form}=this.props
        form.validateFields(async (err,values)=>{
            if(!err){
                // console.log('Received values of form: ', values)
                // query password by reFindType and identity
                try {
                    const url = reqUrl({reFindType: values.ReFType , identifier: values.identity},'identify/reFindPas','8081')
                    console.log(url)

                    const res: any = await $req(url, {method:"GET"})
                    const resBody: any=JSON.parse(res)
                    if (resBody.errCode===0) {
                        message.success("Request successfully.")
                        form.setFieldsValue({password: resBody.resBody})
                    }
                    else if (resBody.errCode === 1001){
                        message.error("Can not find this identifier in the database.Please input correct account.")
                        form.resetFields()
                    }
                    else if (resBody.errCode === 1002){
                        message.error("Service request failed. Please try again later!")
                        form.resetFields()
                    }
                } catch (e) {
                    alert(e.message)
                    form.resetFields()
                }
            }
        })

    }

    // handle cancel button
    public handleCancel =()=>{
        const {form,dispatch}=this.props
        dispatch(conveyForgotPasswordVisible(false))
        form.resetFields()
    }

    public render (){
        const {getFieldDecorator}=this.props.form
        const prefixSelector=getFieldDecorator('ReFType',{initialValue: 'email'})(
            <Select onSelect={(value:string)=>{this.setState({identifier: value})}}
                    onChange={()=>{this.props.form.resetFields()}}>
                <Select.Option key='email'><Icon type="mail" style={{color: 'rgba(0,0,0,.5)'}}/></Select.Option>
                <Select.Option key='username'><Icon type="user" style={{color: "rgba(0,0,0,.5)"}}/></Select.Option>
            </Select>);
        return(
            <Modal
                visible={this.state.forgotPasswordVisible}
                title={"Find Password"}
                footer={null}
                maskClosable={false}
                onCancel={this.handleCancel}
            >
                <p>Forgot your Password?   Ծ‸Ծ </p>
                <p>Don't worry. Let's help you to retrieve your password by your registered Email or Username   </p>
                <Form className="forgot_password_form">
                    <Form.Item label={this.state.identifier === 'email'? "Email" : "Username" } labelAlign="left">
                        {getFieldDecorator("identity",{
                            validateTrigger: 'onBlur',
                            rules: [{required: true, message: "Please input your " + this.state.identifier + "!"},
                                    this.state.identifier ==='email'?
                                        {type: "email", message: "The input is not valid Email!"}: {} ],
                        })(
                            <Input  addonBefore={prefixSelector}
                                    placeholder={this.state.identifier=== 'email'? 'Email':'Username'}/>
                        )}
                    </Form.Item>
                    <Form.Item label="Your Lost Password" labelAlign="left">
                        {getFieldDecorator("password")(
                            <Input prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.5)"}}/>}
                                   disabled={true}  />
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 8}}>
                        <Button type="primary" className="forgot_password_button"
                                onClick={this.handleFindPassword}>
                            Find My Password
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>)
    }
}

const mapStateToProps =(state:any) =>{
    return{
        forgotPasswordVisible: state.conveyVisibleReducer.forgotPasswordVisible
    }
}

const wrappedForgotPassword=Form.create<Props>({name:'forgotpassword'})(ForgotPassword)
export default connect(mapStateToProps)(wrappedForgotPassword);