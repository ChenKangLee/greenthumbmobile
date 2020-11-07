import React from 'react';
import {TabNavigator, TabBarBottom} from 'react-navigation';

import HomeScreen from '../components/HomeScreen.js';
import InventoryScreen from '../components/InventoryScreen.js';

export const WateringHelperNavigator = TabNavigator({
    Home: {screen: HomeScreen},
    Inventory: {screen: InventoryScreen},
}, {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
        labelStyle: {
            fontSize: 15
        },
        activeTintColor: '#c7ad5d'
    }
});
