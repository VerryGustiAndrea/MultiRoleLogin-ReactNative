// Library
import React, {Component} from 'react';
import {ActivityIndicator, StatusBar, Text, View, Image} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
// Styles
// import styles from './AppStyle'

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
    // this.state = {};
  }
  _bootstrapAsync = async () => {
    token = await AsyncStorage.getItem('token');
    role = await AsyncStorage.getItem('role');
    // this.props.navigation.navigate(token ? 'DashboardUser' : 'Login');
    if (token != null) {
      this.props.navigation.navigate(
        role == 1 ? 'DashboardAdmin' : 'DashboardUser',
      );
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  // componentDidMount() {
  //   firebase;
  // }
  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          // backgroundColor: '#fcdcc8',
        }}>
        <ActivityIndicator style={{top: 0}} animating size="large" />
      </View>
    );
  }
}
