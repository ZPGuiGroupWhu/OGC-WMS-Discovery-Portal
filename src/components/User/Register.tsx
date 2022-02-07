import * as React from 'react';
import { LockOutlined, MailOutlined, SafetyOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { AutoComplete, Button, Input, Modal, Checkbox, Select, message } from 'antd';
import $req from '../../util/fetch';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'react-redux';
import '../../style/_register.scss'
import {conveyRegisterVisible} from "../../redux/action";
import {reqUrl} from "../../util/util";

interface Props extends FormComponentProps{
    dispatch: (action:any) => void
}

interface State {
    registerVisible: boolean,
    confirmDirty: boolean,
    autoEmailComplete: string[],
}

class Register extends React.Component<Props, State>{
    // Instead of unsafe and not recommended componentWillReceiveProps,
    // use static getDerivedStateFromProps to get new state from props
    public static getDerivedStateFromProps(nextProps: any, prevState: any){
        if (nextProps.registerVisible !== prevState.registerVisible){
            return {
                registerVisible: nextProps.registerVisible
            }
        }
        // return null means do nothing on state
        return null
    }

    constructor(props:Props) {
        super(props);
        this.state = {
            registerVisible: false,
            confirmDirty: false,
            autoEmailComplete: [],
        }
    }

    // receive changed variable from redux
    // public componentWillReceiveProps(nextProps: any) {
    //     if (this.state.registerVisible !== nextProps.registerVisible){
    //         this.setState({
    //             registerVisible: nextProps.registerVisible
    //         })
    //     }
    // }

    // control register modal visible
    public handleCancel =()=>{
        this.props.dispatch(conveyRegisterVisible(false))
    }

    // handle register button
    public handleRegister =(e:any)=>{
        // prevent refresh page after form submission
        e.preventDefault();
        const {form,dispatch} = this.props

        form.validateFields(async (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values)
                // post registration information to back-end
                try {
                    const url = reqUrl({},'identify/register','8081')
                    console.log(url)

                    const config = {body: values, method: "POST", 'Content-Type': 'application/json'}
                    const res: any = await $req(url, config)
                    const resBody: any=JSON.parse(res)
                    if (resBody.errCode===0) {
                        message.success("Register successfully.")
                        dispatch(conveyRegisterVisible(false))
                        form.resetFields()
                    }
                    else if (resBody.errCode === 1002){
                        message.error("Service request failed. Please try again later!")
                        form.resetFields(['password','confirm password'])
                    }
                } catch (e) {
                    alert(e.message)
                    form.resetFields(['password','confirm password'])
                }
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

    // validate key property in the database is repeating or not when register
    public async validateValueIsRepeat(rule: any, val: any, callback: any){
        const url = reqUrl({property: rule.field, value: val},'identify/valueIsRepeat','8081')
        // console.log(url)
        try{
            const res: any = await $req(url,{method: "GET"})
            const resBody: any=JSON.parse(res)
            // console.log(resBody)
            if (resBody.errCode === 0 && resBody.resBody){
               callback("The " + rule.field + " is already registered. " + "Please try another one!")
                // return Promise.reject("The " + rule.field + " is already registered. " + "Please try another one!")
            }
            else if (resBody.errCode === 0 && !resBody){
                callback() // callback nothing mean validate successfully. Otherwise, there is something wrong
                // return Promise.resolve()
            }
        }catch (e) {
            alert(e.message)
            callback("Service request failed. Please try again later!")
        }
    }

    public render(){
        const {getFieldDecorator}=this.props.form
        const topic =["Agriculture","Biodiversity","Climate","Disaster","Ecosystem","Energy","Geology","Health","Water","Weather"];
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

        return (
            <Modal
                visible={this.state.registerVisible}
                title="Sign Up"
                footer={null}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <p>Hello, visitor! Welcome to the OGC WMS Discovery Portal. In order to receive better service,
                    you need to offer necessary information to create a new account.
                    Now,let's begin to explore the new world. &nbsp; &nbsp; &nbsp; &nbsp; ｯ!(๑•̀ㅂ•́)و✧
                </p>
                <Form className="register_form" {...formItemLayout}>
                    <Form.Item label={"E-mail"} labelAlign="right" hasFeedback={true} >
                        {getFieldDecorator("email",{
                            validateFirst: true,
                            validateTrigger: 'onBlur',
                            rules: [{required: true, message: "Please input your E-mail!"},
                                    {type: "email", message: "The input is not valid E-mail!"},
                                    {validator:this.validateValueIsRepeat}
                            ],
                        })(
                            <AutoComplete dataSource={emailOptions} onChange={this.handleEmailChange} >
                                <Input prefix={<MailOutlined style={{color: 'rgba(0,0,0,.5)'}} />}
                                       placeholder="E-mail"/>
                            </AutoComplete>
                        )}
                    </Form.Item>
                    <Form.Item label="Password" labelAlign="right" hasFeedback={true}>
                        {getFieldDecorator("password",{
                            validateTrigger: "onBlur",
                            rules: [{required: true, message: "Please input your password!"},
                                    {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
                                     message: 'Invalid password! Password must only contain numbers and letters between 6 and 18 in length'},
                                    {validator: this.validateToNextPassword}]
                        })(<Input.Password prefix={<LockOutlined style={{color: "rgba(0,0,0,.5)"}} />}
                                           placeholder="Password"/>)}
                    </Form.Item>
                    <Form.Item label="Confirm Password" labelAlign="right" hasFeedback={true} >
                        {getFieldDecorator("confirm password",{
                            validateTrigger: "onBlur",
                            rules:[{required: true, message: "Please input your password again!"},
                                   {validator:this.compareToFirstPassword}]
                        })(<Input.Password prefix={<SafetyOutlined style={{color: "rgba(0,0,0,.5)"}} />}
                                           placeholder="Confirm Password" onBlur={this.handleConfirmBlur}/>)}
                    </Form.Item>
                    <Form.Item label="Username" labelAlign="right" hasFeedback={true}>
                        {getFieldDecorator('username',{
                            validateFirst: true,
                            validateTrigger: "onBlur",
                            rules: [{required: true, message: "Please entitle for your account!"},
                                    {whitespace: true, message: "Whitespace isn't allowed in username!"},
                                    {validator: this.validateValueIsRepeat}]
                        })(<Input prefix={<UserOutlined style={{color: "rgba(0,0,0,.5)"}} />}
                                  placeholder="Username"/>)}
                    </Form.Item>
                    <Form.Item labelAlign="right" label="Career">
                        {getFieldDecorator('career')
                        (<Input prefix={<TagOutlined style={{color: "rgba(0,0,0,.5)"}} />} placeholder="Career"/>)}
                    </Form.Item>
                    <Form.Item labelAlign="right" label="Research Field">
                        {getFieldDecorator('field')
                        (<Select mode="tags"  placeholder="Research Field" tokenSeparators={[',','.']} showArrow={true}>
                            {topic.map((item:string)=>{
                                return(
                                    <Select.Option key={item} >{item}</Select.Option>
                                )
                            })}
                        </Select>)
                       }
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 6}}>
                        {getFieldDecorator('agreement',{
                            valuePropName: 'checked',
                            rules: [{required: true, message: "The agreement is required!"},]
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
        );
    }
}

const mapStateToProps =(state:any) =>{
    return{
        registerVisible: state.conveyVisibleReducer.registerVisible
    }
}

const wrappedRegister=Form.create<Props>({name:'login'})(Register);
export default connect(mapStateToProps)(wrappedRegister);