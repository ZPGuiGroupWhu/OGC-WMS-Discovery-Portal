import {CONVEY_LAYER_ID,CONVEY_SERVICE_ID, CONVEY_QUERYPAR} from '../redux/action'
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

const rootReducer=combineReducers({
    conveyIDReducer,
    conveyQueryParReducer
})

export default rootReducer