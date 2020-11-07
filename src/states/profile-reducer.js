const initProfileState = {
    userInfo: null
    // userInfo: {
    //     googleId: '101531827605196051368',
    //     name: 'kevin'
    // }
};

export function profile(state = initProfileState, action) {
    switch (action.type) {
        case "@PROFILE/SET_INFO":
            return {
                ...state,
                userInfo: {
                    googleId: action.googleId,
                    name: action.name
                }
            };
        default:
            return state;
    }
}
