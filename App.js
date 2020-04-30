import React from 'react';

import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Navigator from './src/public/Navigators';

const App: () => React$Node = () => {
  return <Navigator />;
};

export default App;
