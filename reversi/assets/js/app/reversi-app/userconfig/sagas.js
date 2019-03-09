import {userConfigActions, REQUEST_STATUS} from './modules'
import {call, put, take} from 'redux-saga/effects';
const {recieveChange, requestChange} =  userConfigActions

const ERROR_EMPTY_PAYLOAD = "変更内容が入力されていません。"
const ERROR_SERVER_ERROR = "サーバとの通信に失敗しました。"

const USER_CHANAGE_URL = "users/change_user/"

function* userConfigSaga(){
    while(true) {
        const action = yield take([requestChange]);
        const currentConfigs = action.payload;
        if(currentConfigs.displayName == "" && currentConfigs.emailAddress == ""){
            yield put(recieveChange(
                {
                    status: REQUEST_STATUS.FAIL,
                    errMsg: ERROR_EMPTY_PAYLOAD
                }));
        }else{
            const {payload, err} = yield call(fetchChangeResponse, currentConfigs);
            if(payload && !err){
                yield put(recieveChange(payload));
            }else{
                yield put(recieveChange(err));
            }
        }
    }
}

async function fetchChangeResponse(currentConfigs) {
    const csrfToken = document.getElementsByName('csrfmiddlewaretoken').item(0).value;
    const data = new FormData();
    data.append('displayName', currentConfigs.displayName);;
    data.append('emailAddress', currentConfigs.emailAddress);
    // add form input from hidden input elsewhere on the page
    data.append('csrfmiddlewaretoken', csrfToken)
    return fetch(USER_CHANAGE_URL, {
        method : "POST",
        body:data,
        credentials: 'same-origin'
    }).then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error(ERROR_SERVER_ERROR);
        }
    }).then((responseObj) => {
        let result;
        if(responseObj.err == true){
            result = {status: REQUEST_STATUS.FAIL, errMsg: responseObj.err_msg};
        }else{
            result = { status: REQUEST_STATUS.SUCCESS, errMsg: null};
        }
        return {payload:result}
    }).catch((error) => {
        const err = {status: REQUEST_STATUS.FAIL, errMsg: ERROR_SERVER_ERROR};
        return {err}
    });
  }

export default userConfigSaga();
