import {
    CONVEY_LAYER_ID,
    CONVEY_SERVICE_ID,
    CONVEY_QUERYPAR,
    CONVEY_LOGIN_VISIBLE,
    CONVEY_REGISTER_VISIBLE,
    CONVEY_IS_LOGIN, CONVEY_FORGOT_PASSWORD_VISIBLE,
    CONVEY_INTENT
} from '../redux/action'
import {combineReducers} from 'redux'

const initialStateID={
    layerID:1,
    serviceID:1,
    
}

const initialStateQueryPar={
    queryPar: {
        bound: [],
          continent: '',
          keywords: '',
          organization: '',
          organization_type: '', 
          topic: ''
    },
}

const initialVisible={
    loginVisible: false,
    registerVisible: false,
    forgotPasswordVisible: false,
    isLogin: false,
}

const initialIntent={
    confidence: [],
    encodingLen: [],
    filtration: 0,
    intent: [],
    mergeNum: 0
}

function conveyIDReducer (state=initialStateID,action:any) {
   // console.log(action);
    switch(action.type){
        case CONVEY_LAYER_ID:
            return JSON.parse(JSON.stringify({
                    layerID: action.layerID,
                    serviceID: state.serviceID,
                    }))
            // Cannot use the following forms, becasue these forms are shallow copy. 
            // Here, we must use deep copy to make sure componentWillReceiveProps function in React Component can detect the change of props to update view(re-render).
            // Wrong forms: return Object.assign({},state,{layerID: action.layerID})
            // Wrong forms: return {
            //     ...state,
            //     layerID: action.layerID,
            // }
        case CONVEY_SERVICE_ID:
            return JSON.parse(JSON.stringify({
                    layerID: state.layerID,
                    serviceID: action.serviceID,
                    }))
            // return Object.assign({},state,{serviceID: action.serviceID})
            // return{
            //     ...state,
            //     serviceID: action.serviceID,
            // }
        default:
            return state;
    }
}

function conveyQueryParReducer (state=initialStateQueryPar,action:any) {
    switch(action.type){
        case CONVEY_QUERYPAR:
                return JSON.parse(JSON.stringify({
                    queryPar: action.queryPar}))
        default:
                return state;
    }
}

function conveyVisibleReducer(state=initialVisible,action:any){
    switch(action.type){
        case CONVEY_LOGIN_VISIBLE:
            return JSON.parse(JSON.stringify({
                loginVisible: action.loginVisible
            }))
        case CONVEY_REGISTER_VISIBLE:
            return JSON.parse(JSON.stringify({
                registerVisible: action.registerVisible
            }))
        case CONVEY_FORGOT_PASSWORD_VISIBLE:
            return JSON.parse(JSON.stringify({
                forgotPasswordVisible: action.forgotPasswordVisible
            }))
        case CONVEY_IS_LOGIN:
            return JSON.parse(JSON.stringify({
                isLogin: action.isLogin
            }))
        default:
            return state;
    }
}

function conveyIntentDataReducer(state=initialIntent,action:any){
    switch (action.type) {
        case CONVEY_INTENT:
            return JSON.parse(JSON.stringify(
                action.intentData
            ))
        default:
            return state
    }
}

const rootReducer=combineReducers({
    conveyIDReducer,
    conveyQueryParReducer,
    conveyVisibleReducer,
    conveyIntentDataReducer
})

export default rootReducer