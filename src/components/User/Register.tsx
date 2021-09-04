import * as React from 'react';
import {AutoComplete, Button, Form, Input, Modal, Icon, Checkbox} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import { connect } from 'react-redux';
import '../../style/_register.scss'
import {conveyRegisterVisible} from "../../redux/action";

interface Props extends FormComponentProps{
    dispatch: (action:any) => void
}

interface State {
    registerVisible: boolean,
    confirmDirty: boolean,
    autoEmailComplete: string[],
}

class Register extends React.Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            registerVisible: false,
            confirmDirty: false,
            autoEmailComplete: [],
        }
    }

    // receive changed variable from redux
    public componentWillReceiveProps(nextProps: any) {
        this.setState({
            registerVisible: nextProps.registerVisible
        })
    }

    // control register modal visible
    public handleCancel =()=>{
        this.setState({
            registerVisible: false
        })
    }

    // handle register button
    public handleRegister =()=>{
        const {form,dispatch} = this.props

        form.validateFields((err,values)=>{
            if(!err){
                console.log('Received values of form: ', values)
                dispatch(conveyRegisterVisible(false))
                form.resetFields()
            }
        })
    }

    // validate for 'confirm password' when input new password firstly
    public validateToNextPassword =(rule: any,value: any,callback: any)=>{
        const {form} = this.props
        if(value ){
            form.validateFields(['confirm password'],{force: true})
        }
        callback()
    }

    // Compare to the first password to validate whether is consistent or not
    public compareToFirstPassword = (rule: any, value: any, callback: any) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    public handleConfirmBlur =(e:any)=>{
        const {value} =e.target
        this.setState({
            confirmDirty: this.state.confirmDirty || !!value
        })
    }

    // autocomplete email postfix
    public handleEmailChange =(value:any)=>{
        let autoEmailResult:string[];
        if(!value){
            autoEmailResult=[]
        } else {
            autoEmailResult=['@qq.com','@whu.edu.cn'].map(domain=>`${value}${domain}`)
        }
        this.setState({autoEmailComplete: autoEmailResult})
    }

    public render(){
        const {getFieldDecorator}=this.props.form
        const emailOptions=this.state.autoEmailComplete.map(email =>(
            <AutoComplete.Option key={email}>{email}</AutoComplete.Option>
        ))
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return(
            <Modal
                visible={this.state.registerVisible}
                title="Sign Up"
                footer={null}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <p>Hello, visitor! Welcome to the OGC WMS Discovery Portal. In order to receive better service,
                    you need to offer necessary information to create a new account.
                    Now,let's begin to explore the new world.
                </p>
                <Form className="register_form" {...formItemLayout}>
                    <Form.Item label={"E-mail"} labelAlign="right">
                        {getFieldDecorator("email",{
                            validateTrigger: 'onBlur',
                            rules: [{required: true, message: "Please input your E-mail!"},
                                    {type: "email", message: "The input is not valid E-mail!"}],
                        })(
                            <AutoComplete dataSource={emailOptions} onChange={this.handleEmailChange} >
                                <Input prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.5)'}}/>}
                                       placeholder="E-mail"/>
                            </AutoComplete>
                        )}
                    </Form.Item>
                    <Form.Item label="Password" labelAlign="right" hasFeedback={true}>
                        {getFieldDecorator("password",{
                            validateTrigger: "onBlur",
                            rules: [{required: true, message: "Please input your password!"},
                                    {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
                                     message: 'Invalid password! Password must contain numbers and letters between 6 and 18 in length'},
                                    {validator: this.validateToNextPassword}]
                        })(<Input.Password prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.5)"}}/>}
                                           placeholder="Password"/>)}
                    </Form.Item>
                    <Form.Item label="Confirm Password" labelAlign="right" hasFeedback={true}>
                        {getFieldDecorator("confirm password",{
                            validateTrigger: "onBlur",
                            rules:[{required: true, message: "Please input your password again!"},
                                   {validator:this.compareToFirstPassword}]
                        })(<Input.Password prefix={<Icon type="safety" style={{color: "rgba(0,0,0,.5)"}}/>}
                                           placeholder="Confirm Password" onBlur={this.handleConfirmBlur}/>)}
                    </Form.Item>
                    <Form.Item label="Username" labelAlign="right" hasFeedback={true}>
                        {getFieldDecorator('username',{
                            validateTrigger: "onBlur",
                            rules: [{required: true, message: "Please entitle for your account!"},
                                    {whitespace: true, message: "Whitespace isn't allowed in username!"}]
                        })(<Input prefix={<Icon type="user" style={{color: "rgba(0,0,0,.5)"}}/>}
                                  placeholder="Username"/>)}
                    </Form.Item>
                    <Form.Item labelAlign="right" label="Career">
                        {getFieldDecorator('career')
                        (<Input prefix={<Icon type="tag" style={{color: "rgba(0,0,0,.5)"}}/>} placeholder="Career"/>)}
                    </Form.Item>
                    <Form.Item labelAlign="right" label="Research Field">
                        {getFieldDecorator('field')
                        (<Input prefix={<Icon type="file-search" style={{color: "rgba(0,0,0,.5)"}}/>} placeholder="Research Field" />)}
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 6}}>
                        {getFieldDecorator('agreement',{
                            valuePropName: 'checked',
                        })(<Checkbox>
                            I have read the <a>agreement</a>
                           </Checkbox>)}
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 16, offset: 4}}>
                        <Button type="primary" htmlType="submit" className="register_form_button" onClick={this.handleRegister}>
                            Create a New Account
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        )
    }
}

const mapStateToProps =(state:any) =>{
    return{
        registerVisible: state.conveyVisibleReducer.registerVisible
    }
}

const wrappedRegister=Form.create<Props>({name:'login'})(Register);
export default connect(mapStateToProps)(wrappedRegister);