import { put, takeEvery } from "redux-saga/effects";
import { Loader_PDP } from "./constant";



function* handlePDPLoader(action){
    yield put({type:Loader_PDP,payload:action.payload})
}

export default function* watchhandlePDPLoader (){
    yield takeEvery(Loader_PDP,handlePDPLoader)
}