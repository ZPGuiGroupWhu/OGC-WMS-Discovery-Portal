import {IQueryPar} from '../util/interface'

// action type
export const CONVEY_LAYER_ID='CONVEY_LAYER_ID'
export const CONVEY_SERVICE_ID='CONVEY_SERVICE_ID'
export const CONVEY_QUERYPAR='CONVEY_QUERYPAR'

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
