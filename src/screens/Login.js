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
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import DataUser from '../dataUser/DataUser';
import {NavigationContainer, CommonActions} from '@react-navigation/native';

// import {Value} from 'react-native-reanimated';
// impor index from './Index';
const URL_LOGIN = 'http://172.20.10.6:4000/api/login/loginuser/';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    login: false,
  };

  handleSubmitLogin = e => {
    e.preventDefault();
    this.postLogin();
  };

  postLogin = () => {
    let data = {
      email: this.state.email,
      password: this.state.password,
    };
    console.warn(data);

    axios
      .post(URL_LOGIN, data)
      .then(res => {
        console.log(res.data);
        if (!res.data.token) {
          alert('Username atau Password Salah');
        } else {
          DataUser.name = res.data.name;
          DataUser.email = res.data.email;
          DataUser.role = res.data.role;

          AsyncStorage.setItem('name', res.data.name);
          AsyncStorage.setItem('email', res.data.email);
          AsyncStorage.setItem('token', res.data.token);
          AsyncStorage.setItem('role', JSON.stringify(res.data.role));
          console.log(res.data.name);

          // this.props.navigation.navigate('SplashScreen');
          //Route Ke Dashboard dengan mereset State
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Login',
                },
                {name: 'SplashScreen'},
              ],
            }),
          );
          //
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="#0053AD"
          translucent={false}
          networkActivityIndicatorVisible={true}
        />

        <TextInput
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder="Email"
          placeholderTextColor="#212121"
          selectionColor="#fff"
          keyboardType="email-address"
          onChangeText={e => this.setState({email: e})}
          value={this.state.email}
        />

        <TextInput
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#212121"
          onChangeText={e => this.setState({password: e})}
          value={this.state.password}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.postLogin()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={{color: '#212121', marginBottom: 60}}>
          {' '}
          Credit Viwi App 2020{' '}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop:-20,
    paddingTop: 150,
    // justifyContent:'center',

    alignItems: 'center',
    backgroundColor: '#B2DFDB',
  },

  inputBox: {
    width: 300,

    backgroundColor: 'rgba(255, 255,255,0.3)',

    borderRadius: 25,

    paddingHorizontal: 16,

    fontSize: 16,

    color: '#212121',

    marginVertical: 10,
  },

  button: {
    width: 300,

    backgroundColor: '#607D8B',

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
