import {
    registLogin as registLoginApi
} from '../api/profileApi.js';

export function setInfo(googleId, name) {
    return {
        type: "@PROFILE/SET_INFO",
        googleId,
        name
    };
}

export function registLogin(id, name) {
    return (dispatch, getState) => {
        return registLoginApi(id, name).then(u_id => {
            console.log('[PROFILE] u_id:', u_id.userid);
        }).catch(err => {
            console.log('[PROFILE]', err);
        });
    };
}
