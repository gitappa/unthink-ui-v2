import { takeEvery } from "redux-saga/effects";
import { VTO_ICON, VTO_ICON_SUCCESS } from "./constants";


function* handleButton  (action) {
    yield put({type:VTO_ICON,payload:action.payload})
}

// function* handleButtonSuccess (action) {
//     yield put ({type:VTO_ICON_SUCCESS,payload:action.payload})
// }

// function handleButtonFailure

export default function* watchhandleButton (){
    yield takeEvery (VTO_ICON,handleButton)
}