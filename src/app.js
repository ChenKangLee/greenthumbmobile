// react-native & redux & others
import React from 'react';
import {BackHandler} from 'react-native';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import {Provider, connect} from 'react-redux';
import {StackNavigator, NavigationActions, addNavigationHelpers} from 'react-navigation';

// native-base
import {StyleProvider} from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

// custom imports
import LoginScreen from './components/LoginScreen.js';
import PlantFormScreen from './components/PlantFormScreen.js';
import {WateringHelperNavigator} from './navigators/WateringHelperNavigator.js';

import {inventory} from './states/inventory-reducer.js';
import {profile} from './states/profile-reducer.js';


// nested navigators
const AppNavigator = StackNavigator({
    LoginScreen: {screen: LoginScreen},
    WateringHelper: {screen: WateringHelperNavigator},
    PlantForm: {screen: PlantFormScreen}
}, {
    headerMode: 'none'
});

class AppWithStyleAndNavigator extends React.Component {
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <AppNavigator navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.nav
                })}/>
            </StyleProvider>
        );
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            const {dispatch, nav} = this.props;
            if (nav.index === 0)
                return false;
            dispatch(NavigationActions.back())
            return true;
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }
}


const AppWithNavState = connect(state => ({
    nav: state.nav
}))(AppWithStyleAndNavigator);

// Nav reducer
const initialState = AppNavigator.router.getStateForAction(NavigationActions.navigate({routeName: 'Today'}));
const nav = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    return nextState || state;
};

// create App with redux store
const store = createStore(combineReducers({
    nav, inventory, profile
}), compose(applyMiddleware(thunkMiddleware/*, loggerMiddleware*/)));

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavState/>
            </Provider>
        );
    }
}
