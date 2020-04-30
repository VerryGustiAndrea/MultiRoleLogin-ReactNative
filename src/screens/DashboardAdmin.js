import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DataUser from '../dataUser/DataUser';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

export default class DashboardUser extends Component {
  constructor() {
    super();
    this.state = {
      name: DataUser.name,
      role: DataUser.role,
    };
  }

  getNameUser = async () => {
    await AsyncStorage.getItem('name', (error, result) => {
      if (result) {
        this.setState({
          name: result,
        });
      }
    });
  };

  getRoleUser = async () => {
    await AsyncStorage.getItem('role', (error, result) => {
      if (result == 1) {
        this.setState({
          role: 'Admin',
        });
      } else {
        this.setState({
          role: 'Users',
        });
      }
    });
  };

  logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  componentDidMount() {
    this.getNameUser();
    this.getRoleUser();
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Halo</Text>
        <Text>{this.state.role}</Text>
        <Text>{this.state.name}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.getNameUser()}>
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => this.logOut()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 300,

    backgroundColor: '#1c313a',

    borderRadius: 25,

    marginVertical: 10,

    paddingVertical: 13,
  },

  buttonText: {
    fontSize: 16,

    fontWeight: '500',

    color: '#ffffff',

    textAlign: 'center',
  },
});
