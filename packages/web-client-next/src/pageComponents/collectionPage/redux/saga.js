// saga.js
import { put, takeEvery } from 'redux-saga/effects';
import { TOGGLE_SHOW_MORE } from './constants';

function* handleToggleShowMore() {
    // Saga can perform additional logic here if needed
    yield put({ type: TOGGLE_SHOW_MORE });
}

export default function* watchShowMoreSaga() {
    yield takeEvery(TOGGLE_SHOW_MORE, handleToggleShowMore);
}
