import * as React from 'react';
import { Button,  Form, Icon, Input, Modal} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'react-redux';
import {conveyForgotPasswordVisible} from "../redux/action";
import '../style/_forgotPassword.scss'

interface Props extends FormComponentProps {
    dispatch: (action: any)=>void
}

interface State{
    forgotPasswordVisible: boolean,
}

class ForgotPassword extends React.Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            forgotPasswordVisible: false,
        }
    }

    // receive changed variable from redux
    public componentWillReceiveProps(nextProps: any) {
        console.log(nextProps.forgotPasswordVisible)
        this.setState({
            forgotPasswordVisible: nextProps.forgotPasswordVisible
        })
    }

    // handle find my password button
    public handleFindPassword =(e:any)=>{
        // prevent form submission
        e.preventDefault();
        const {form,dispatch}=this.props
        form.validateFields((err,values)=>{
            if(!err){
                console.log('Received values of form: ', values)
                dispatch(conveyForgotPasswordVisible(false))
                form.resetFields()
            }
        })

    }

    // handle cancel button
    public handleCancel =()=>{
        this.props.dispatch(conveyForgotPasswordVisible(false))
    }

    public render (){
        const {getFieldDecorator}=this.props.form
        return(
            <Modal
                visible={this.state.forgotPasswordVisible}
                title={"Find Password"}
                footer={null}
                maskClosable={false}
                onCancel={this.handleCancel}
            >
                <p>Forgot your Password?</p>
                <p>Don't worry. Let's help you to refine your password by your registered E-mail   </p>
                <Form className="forgot_password_form">
                    <Form.Item label="E-mail" labelAlign="right">
                        {getFieldDecorator("email",{
                            validateTrigger: 'onBlur',
                            rules: [{required: true, message: "Please input your E-mail!"},
                                {type: "email", message: "The input is not valid E-mail!"}],
                        })(
                            <Input prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.5)'}}/>}
                                   placeholder="E-mail"/>
                        )}
                    </Form.Item>
                    <Form.Item label="Your Lost Password" labelAlign="right">
                        <Input prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.5)"}}/>}
                               placeholder="password" disabled={true}/>
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