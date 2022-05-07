import {IQueryPar} from '../util/interface'

// action type
export const CONVEY_LAYER_ID='CONVEY_LAYER_ID'
export const CONVEY_SERVICE_ID='CONVEY_SERVICE_ID'
export const CONVEY_QUERYPAR='CONVEY_QUERYPAR'
export const CONVEY_LOGIN_VISIBLE='CONVEY_LOGIN_VISIBLE'
export const CONVEY_REGISTER_VISIBLE='CONVEY_REGISTER_VISIBLE'
export const CONVEY_FORGOT_PASSWORD_VISIBLE='CONVEY_FORGOT_PASSWORD_VISIBLE'
export const CONVEY_IS_LOGIN='CONVEY_IS_LOGIN'
export const CONVEY_INTENT='CONVEY_INTENT'

// action function
export function conveyLayerID(layerID:number){
    return {
        type: CONVEY_LAYER_ID,
        layerID
    }
}

export function conveyServiceID(serviceID:number){
    return{
        type: CONVEY_SERVICE_ID,
        serviceID
    }
}

export function conveyQueryPar(queryPar:IQueryPar){
    return {
        type:CONVEY_QUERYPAR,
        queryPar
    }
}

export function conveyLoginVisible(loginVisible:boolean){
    return{
        type: CONVEY_LOGIN_VISIBLE,
        loginVisible
    }
}

export function conveyRegisterVisible(registerVisible: boolean){
    return{
        type: CONVEY_REGISTER_VISIBLE,
        registerVisible
    }
}

export function conveyForgotPasswordVisible(forgotPasswordVisible: boolean){
    return{
        type: CONVEY_FORGOT_PASSWORD_VISIBLE,
        forgotPasswordVisible
    }
}

export function conveyIsLogin(isLogin: boolean){
    return{
        type: CONVEY_IS_LOGIN,
        isLogin
    }
}

export function conveyIntentData(intentData:object){
    return {
        type: CONVEY_INTENT,
        intentData
    }
}
