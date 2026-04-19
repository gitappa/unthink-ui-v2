// saga.js
import { put, takeEvery } from 'redux-saga/effects';
import { GUEST_POPUP_SHOW } from './constants';

function* handleGuestPopupShow(action) {
    // Saga can perform additional logic here if needed
    yield put({ type: GUEST_POPUP_SHOW, payload: action.payload });
}

export default function* watchGuestPopupShowSaga() {
    yield takeEvery(GUEST_POPUP_SHOW, handleGuestPopupShow);
}
