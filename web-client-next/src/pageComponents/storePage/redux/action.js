import { Loader_PDP } from "./constant";


export function PDPloader (payload){
    return{
        type:Loader_PDP,
        payload:payload,
    }
} 