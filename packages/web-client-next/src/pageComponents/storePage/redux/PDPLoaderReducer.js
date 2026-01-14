import { Loader_PDP } from "./constant"


const initialState = {
    pdpLoader:true,
}

const PDP_LoaderReducer = (state = initialState, action) => {
    switch(action.type){
        case Loader_PDP:
            return{
                ...state,
                pdpLoader:action.payload
            }
            default: return state
    }
}
export default PDP_LoaderReducer