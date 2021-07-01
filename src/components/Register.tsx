import * as React from 'react';
import {AutoComplete, Button, Form, Input, Modal, Tooltip, Icon} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import { connect } from 'react-redux';
import '../style/_register.scss'

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

    public componentWillReceiveProps(nextProps: any) {
        this.setState({
            registerVisible: nextProps.registerVisible
        })
    }

    public handleCancel =()=>{
        this.setState({
            registerVisible: false
        })
    }

    public handleRegister =()=>{
        this.setState({
            registerVisible: false
        })
    }

    public validateToNextPassword =(rule: any,value: any,callback: any)=>{
        const {form} = this.props
        if(value && this.state.confirmDirty){
            form.validateFields(['confirm password'],{force: true})
        }
        callback()
    }

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

        return(
            <Modal
                visible={this.state.registerVisible}
                title="Sign Up"
                footer={null}
                onCancel={this.handleCancel}
            >
                <Form className="register_form">
                    <Form.Item label={"E-mail"} labelAlign="left">
                        {getFieldDecorator("email",{
                            validateTrigger: 'onBlur',
                            rules: [{required: true, message: "Please input your E-mail!"},
                                    {type: "email", message: "The input is not valid E-mail!"}],
                        })(
                            <AutoComplete dataSource={emailOptions} onChange={this.handleEmailChange} >
                                <Input  />
                            </AutoComplete>
                        )}
                    </Form.Item>
                    <Form.Item label="Password" labelAlign="left" hasFeedback={true}>
                        {getFieldDecorator("password",{
                            validateTrigger: "onBlur",
                            rules: [{required: true, message: "Please input your password!"},
                                    {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
                                     message: 'Invalid password! Password must contain numbers and letters between 6 and 18 in length'},
                                    {validator: this.validateToNextPassword}]
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="Confirm Password" labelAlign="left" hasFeedback={true}>
                        {getFieldDecorator("confirm password",{
                            validateTrigger: "onBlur",
                            rules:[{required: true, message: "Please input your password again!"},
                                   {validator:this.compareToFirstPassword}]
                        })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                    </Form.Item>
                    <Form.Item label="Username" labelAlign="left" hasFeedback={true}>
                        {getFieldDecorator('username',{
                            validateTrigger: "onBlur",
                            rules: [{required: true, message: "Please entitle for your account!"},
                                    {whitespace: true, message: "Whitespace isn't allowed in username!"}]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item labelAlign="left" label={
                        <span>Description&nbsp;
                           <Tooltip title="In order to better service for you, could you tell us this portal?">
                             <Icon type="question-circle-o" />
                           </Tooltip>
                        </span>} >
                        {getFieldDecorator('description')(<Input.TextArea rows={3}/>)}
                    </Form.Item>
                    <Form.Item>
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