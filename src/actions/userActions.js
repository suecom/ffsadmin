import * as types from './actionTypes';
import userApi from '../api/userApi';

import { loadImagesSuccess } from './imageActions';

export function loadUsersSuccess(users) {
    return {type: types.LOAD_USERS_SUCCESS, users};
}

export function loadUsers() {
    return function(dispatch) {
        const api = new userApi();

        return api.getUsers()
            .then(res => {
                dispatch(loadUsersSuccess(res.users));
                dispatch(loadImagesSuccess(res.images));
            })
            .catch(error => {throw(error)})
    };
}