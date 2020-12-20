import React, {useState, useEffect} from 'react';
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
  BackHandler,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import firebase from 'react-native-firebase';
import Modal, {SlideAnimation, ModalContent} from 'react-native-modals';
import {set} from 'react-native-reanimated';
import JadwalHariIni from '../dataSample/data';
import News from '../dataSample/dataNews';
import AvailableTime from '../dataSample/dataAvailableTime';
import {CommonActions} from '@react-navigation/native';

const URL_UPDATE_TOKEN = 'http://172.20.10.6:4000/api/login/token/';

const DashboardUser = props => {
  const [name, setName] = useState(false);
  const [role, setRole] = useState(false);
  const [firstName, setFirstName] = useState(false);
  const [visible, setVisible] = useState(false);

  const getNameUser = async () => {
    await AsyncStorage.getItem('name', (error, result) => {
      if (result) {
        setName(result);
        setFirstName(result.substring(0, result.indexOf(' ')));
      }
    });
  };

  // //Back handler

  // let currentCount = 0;
  // const onBackPress = () => {
  //   if (currentCount < 3) {
  //     currentCount += 1;
  //     Toast.show('Press again to exit', Toast.LONG);
  //   } else {
  //     // exit the app here using BackHandler.exitApp();
  //     BackHandler.exitApp();
  //   }
  //   setTimeout(() => {
  //     currentCount = 0;
  //   }, 2000);
  // };
  // BackHandler.addEventListener('hardwareBackPress', onBackPress);

  const getRoleUser = async () => {
    await AsyncStorage.getItem('role', (error, result) => {
      if (result == 1) {
        setRole('Admin');
      } else {
        setRole('User');
      }
    });
  };

  const logOut = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate('Login');
  };

  const insertToken = async () => {
    let data = {
      token: await AsyncStorage.getItem('token'),
      fcmToken: await AsyncStorage.getItem('fcmToken'),
    };
    console.log(await AsyncStorage.getItem('email'));

    await axios
      .patch(URL_UPDATE_TOKEN + `${await AsyncStorage.getItem('email')}`, data)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getNameUser();
    getRoleUser();
    checkPermission();
    messageListener();
  }, []);

  //FCM START

  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getFcmToken();
    } else {
      requestPermission();
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      AsyncStorage.setItem('fcmToken', fcmToken);
      // showAlert('Your Firebase Token is:', fcmToken);
      insertToken();
    } else {
      showAlert('Failed', 'No token received');
    }
  };

  const requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  const channel = new firebase.notifications.Android.Channel(
    'invitation',
    'Invitation',
    firebase.notifications.Android.Importance.Max,
  ).setDescription('My apps test channel');

  // Create the channel
  firebase.notifications().android.createChannel(channel);

  let chat = (title, body) => {
    showAlert(title, body);
  };

  // let messageListener = async () => {
  //   const notificationListener = firebase
  //     .notifications()
  //     .onNotification(notification => {
  //       // const {title, body} = notification.data;
  //       // showAlert(title, body);
  //       // console.log(notification.data);

  //       // func parameter
  //       if (notification.data.identy === 'Chat') {
  //         chat(notification.data.contact, notification.data.content);
  //       } else {
  //       }
  //       if (notification.data.identy === 'ChatBriyan') {
  //         console.log('Chat Briyan');
  //       }

  //       //permision all notif
  //       notification.android
  //         .setChannelId('test-channel')
  //         .android.setSmallIcon('ic_launcher');

  //       firebase.notifications().displayNotification(notification);
  //     });

  //   const notificationOpenedListener = firebase
  //     .notifications()
  //     .onNotificationOpened(notificationOpen => {
  //       const {title, body} = notificationOpen.notification.data;
  //       showAlert(title, body);
  //       if (notificationOpen.notification.data.channelId === 'ChatFizhu') {
  //         console.log('Chat Fizhu');
  //       }
  //       if (notificationOpen.notification.data.channelId === 'ChatBriyan') {
  //         console.log('Chat Briyan');
  //       }
  //     });

  //   const notificationOpen = await firebase
  //     .notifications()
  //     .getInitialNotification();
  //   if (notificationOpen) {
  //     const {title, body} = notificationOpen.notification.data;
  //     // console.log('notificationOpen');
  //     showAlert(title, body);
  //   }

  //   messageListener = firebase.messaging().onMessage(message => {
  //     // console.log(JSON.stringify(message));
  //   });
  // };

  let messageListener = async () => {
    //KETIKA APLIKASI SEDANG DIBUKA
    notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body} = notification.data;
        showAlert(title, body);
      });

    //KETIKA NOTIF DI TOP BAR DI KLIK
    notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification.data;
        showAlert(title, body);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification.data;
      showAlert(title, body);
    }

    messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };

  //FCMEND

  //SendNotif
  let sendNotif = async () => {
    let FIREBASE_API_KEY =
      'AAAAdspQtls:APA91bF8Y4ZOjp_OHNyoleZi36vlM19XX2-UKc-dM4RbncURDx_VsoMxB4n-wv20Vg1xcQd65LESzUm-eLFMtsxh1wGI54Dn5-R5fQgBUPPWKoL3E9SqJNepIZ1wJmCmq8jP4oJY_7by';
    let message = {
      to:
        'fOArvGQb4ME:APA91bHufjGYaiSSZwhMKHFJvKG5i5oSJhGLWsYsQQSLjmKo4b5yTjkxx-mcvKKifvs3AfrM_LvBUGSULAKhtnHtEKPXTHd_bzgEFDdtMIKwfWEJu62XLaMB1t6NOkxE_FbY5I4BNZrm',
      notification: {
        body: 'Verry : Terimakasih kembali, mantap',
        title: 'Viwi ',
        content_available: true,
        priority: 'High',
        show_in_fore_ground: true,
        sound: 'default',
      },
      data: {
        body: 'Verry : Terimakasih kembali untuk kamu',
        title: 'Viwi ',
        identy: 'Chat',
        content_available: true,
        priority: 'High',
        show_in_fore_ground: true,
        sound: 'default',
        contact: 'Babang Fizhu',
        content: 'Ver lagi apa',
      },
    };

    await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      JSON.stringify(message),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=' + FIREBASE_API_KEY,
        },
      },
    );
  };

  //Send Notif End

  return (
    <ScrollView style={styles.mainLayer}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <Modal
        style={{
          height: '100%',
          width: '100%',
          // top: '-21%',
          marginTop: '-110%',
          paddingLeft: '38%',
          borderRadius: 50,
        }}
        transparent={true}
        visible={visible}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'top',
          })
        }
        onTouchOutside={() => {
          setVisible(false);
        }}>
        <View style={{width: 200, height: 210}}>
          <TouchableOpacity
            style={styles.profileDetail}
            onPress={() => {
              setVisible(false);
            }}>
            <Text style={styles.buttonTextProfile}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileDetail}
            onPress={() => {
              setVisible(false);
            }}>
            <Text style={styles.buttonTextProfile}>Ganti Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonLogout}
            onPress={() => {
              logOut(), setVisible(false);
            }}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Welcome  View */}
      <View
        style={{
          // top: 100,
          // height: '35%',
          height: 220,
          width: '100%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7,
          borderBottomEndRadius: 25,
          borderBottomStartRadius: 25,
        }}>
        {/* <Image style={styles.menu} source={require('../images/menu3.png')} /> */}
        <Image
          style={styles.dashboardImage}
          source={require('../images/dashboard.jpg')}
        />
        <TouchableOpacity
          style={styles.buttonProfile}
          onPress={() => setVisible(true)}>
          <Image
            style={styles.profile}
            source={require('../images/profile.jpg')}
          />
        </TouchableOpacity>
        <Text style={styles.helloUser}>Halo {firstName},</Text>
        <Text style={styles.helloUser2}>Semangat terus ya !!</Text>
      </View>

      {/* Saldo View */}

      <View
        style={{
          marginTop: '5%',
          // height: '10%',
          height: 80,
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7,
          borderRadius: 25,
          // borderBottomEndRadius: 25,
          // borderBottomStartRadius: 25,
        }}>
        {/* <Image style={styles.menu} source={require('../images/menu3.png')} /> */}
        {/* <Image
          style={styles.dashboardImage}
          source={require('../images/dashboard.jpg')}
        /> */}
        {/* <TouchableOpacity
          style={styles.buttonProfile}
          onPress={() => setVisible(true)}>
          <Image
            style={styles.profile}
            source={require('../images/profile.jpg')}
          />
        </TouchableOpacity> */}
        <Text style={styles.saldo}>Saldo</Text>
        <Text style={styles.nominalSaldo}>Rp. 1.000.000</Text>
        <Text style={styles.topup}>Top Up</Text>
      </View>

      {/* NEWS */}
      <View
        style={{
          marginTop: '2%',
          left: '1%',
          // right: '1%',
          width: '100%',
          height: 250,
          // backgroundColor: 'red',
        }}>
        <Text style={styles.categoriesNews}>News</Text>
        {/* <Text style={styles.filterNews}>Filter</Text> */}
        <ScrollView style={styles.titleNews} horizontal={true}>
          <View style={styles.boxNews}>
            {News.map(e => {
              return (
                <View style={styles.itemNews} key={e.name}>
                  <Text style={styles.textTitleNews} key={e.name}>
                    {e.title}
                  </Text>
                  <Text style={styles.textContentNews} key={e.name}>
                    {e.content}
                  </Text>
                  <Text style={styles.textDateNews} key={e.name}>
                    {e.date}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Jadwal Hari ini View */}
      <View
        style={{
          marginTop: '2%',
          left: '1%',
          // right: '1%',
          width: '100%',
          height: 250,
          // backgroundColor: 'red',
        }}>
        <Text style={styles.categoriesJadwalHariIni}>Today's Schedule</Text>
        {/* <Text style={styles.filterJadwalHariIni}>Filter</Text> */}
        <ScrollView style={styles.titleJadwalHariIni} horizontal={true}>
          <View style={styles.boxJadwalHariIni}>
            {JadwalHariIni.map(e => {
              return (
                <View style={styles.itemJadwalHariIni} key={e.name}>
                  <Text style={styles.textJadwalHariIni} key={e.name}>
                    Mengajar {e.name} Private {e.pelajaran}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* AVAILABLE TIME */}
      <View
        style={{
          marginTop: '2%',
          left: '1%',
          // right: '1%',
          // width: '100%',
          height: 170,
          // backgroundColor: 'red',
        }}>
        <Text style={styles.categoriesAvailableTime}>Available Time</Text>
        {/* <Text style={styles.filterAvailableTime}>Filter</Text> */}
        <ScrollView style={styles.titleAvailableTime}>
          <View style={styles.boxAvailableTime}>
            {AvailableTime.map(e => {
              if (e.desc == null) {
                e.desc = 'Available';
              }
              return (
                <View style={styles.itemAvailableTime} key={e.name}>
                  <Text style={styles.textDayAvailableTime} key={e.name}>
                    {e.day} |
                  </Text>
                  <Text style={styles.textTimeAvailableTime} key={e.name}>
                    {e.start} - {e.end}
                  </Text>
                  <Text style={styles.textDescAvailableTime} key={e.name}>
                    {e.desc}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* <View style={{height: '57%'}}>
          <ScrollView style={styles.courses}>
            <View style={styles.box}>
              <View style={styles.item}>
                <Text style={styles.textCourse}>
                  Praktikum Algoritma dan Pemrograman 1
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textCourse}>Praktikum Struktur Data</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textCourse}>Praktikum Embedded System</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textCourse}>
                  Praktikum Rekayasa Perangkat Lunak
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textCourse}>
                  Praktikum Jaringan Komputer
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textCourse}>
                  Praktikum Sistem Basis Data
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textCourse}>
                  Praktikum Keamanan Sistem Informasi
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textCourse}>Praktikum Pemrograman Web</Text>
              </View>
            </View>

            <Text>{name}</Text>

            <TouchableOpacity style={styles.button} onPress={() => sendNotif()}>
              <Text style={styles.buttonText}>Check</Text>
            </TouchableOpacity>
          </ScrollView>

          <TextInput
            style={styles.searchBox}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Search praktikum"
            placeholderTextColor="#A0A5BD"
            selectionColor="#e0e0e0"
            keyboardType="email-address"
            // onChangeText={e => this.setState({email: e})}
            // value={this.state.email}
          />
        </View> */}

      {/* <Text>{name}</Text>

      <TouchableOpacity style={styles.button} onPress={() => sendNotif()}>
        <Text style={styles.buttonText}>Check</Text>
      </TouchableOpacity>

       */}
      <View style={{zIndex: 10}}>
        <Text>asmpmapsfmpaofs</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    zIndex: 2,
  },

  mainLayer: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  dashboardImage: {
    position: 'absolute',
    top: '20%',
    right: '5%',
    width: '40%',
    height: '80%',
    opacity: 0.6,
  },
  helloUser: {
    position: 'absolute',
    width: '88%',
    height: '100%',
    left: '6%',
    top: '60%',

    fontFamily: 'Avenir LT Pro',
    fontWeight: 'bold',
    fontSize: 23,
    lineHeight: 34,

    /* identical to box height */

    color: '#0D1333',
  },

  helloUser2: {
    position: 'absolute',
    width: '88%',
    height: 36,
    left: '6%',
    top: '75%',

    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: 29,

    /* identical to box height */

    color: '#61688B',
  },

  menu: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: '6%',
    top: '5%',
  },

  profile: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#000',
    borderWidth: 0.2,
  },

  buttonProfile: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: '6%',
    top: '27%',
    borderRadius: 25,
    borderColor: '#000',
    borderWidth: 0.2,
  },

  searchBox: {
    // width: 300,
    // backgroundColor: 'rgba(255, 255,255,0.2)',
    // borderRadius: 25,
    paddingHorizontal: 30,
    // fontSize: 16,
    // color: '#ffffff',
    // marginVertical: 10,
    position: 'absolute',
    width: '85%',
    // height: '5%',
    // left: 24,
    top: '10%',
    backgroundColor: '#F5F5F7',
    borderRadius: 40,
  },

  // categories: {
  //   position: 'absolute',
  //   width: '60%',
  //   // height: 24,
  //   left: '6%',
  //   top: '23%',

  //   fontFamily: 'Avenir LT Pro',
  //   fontStyle: 'normal',
  //   fontWeight: 'bold',
  //   fontSize: 20,
  //   lineHeight: 24,

  //   /* identical to box height */

  //   color: '#0D1333',
  // },

  filter: {
    position: 'absolute',
    width: '40%',
    // height: 22,
    right: '6%',
    top: '23%',

    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 17,
    lineHeight: 22,

    /* identical to box height */
    textAlign: 'right',
    textTransform: 'capitalize',

    color: '#009688',
  },

  buttonLogout: {
    alignSelf: 'center',
    width: '90%',

    backgroundColor: '#FF6670',

    borderRadius: 25,

    marginVertical: 10,

    paddingVertical: 10,
  },

  button: {
    width: 300,

    backgroundColor: '#1c313a',

    borderRadius: 25,

    marginVertical: 10,

    paddingVertical: 13,
  },

  profileDetail: {
    alignSelf: 'center',
    width: '90%',

    // backgroundColor: '#FF6670',

    borderRadius: 25,

    marginVertical: 10,

    paddingVertical: 10,
  },

  buttonTextProfile: {
    fontSize: 16,

    fontWeight: '500',
    fontWeight: 'bold',
    color: '#0D1333',

    textAlign: 'center',
  },

  buttonText: {
    fontSize: 16,

    fontWeight: '500',

    color: '#ffffff',

    textAlign: 'center',
  },

  //JADWAL HARI INI

  categoriesJadwalHariIni: {
    position: 'absolute',
    width: '60%',
    // height: 24,
    left: '6%',
    marginTop: '3%',
    // backgroundColor: 'blue',
    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 21,
    lineHeight: 24,
    zIndex: 10,
    color: '#0D1333',
    // borderRadius: 20,
  },

  boxJadwalHariIni: {
    // top: 40,
    width: '60%',
    height: '20%',
    flexWrap: 'wrap',
    // flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  itemJadwalHariIni: {
    width: 350,
    height: 180,
    backgroundColor: '#B2DFDB',
    borderRadius: 25,
    margin: 8,
    marginVertical: 20,

    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },

  titleJadwalHariIni: {
    alignSelf: 'center',
    height: '100%',
    // width: '100%',
    marginTop: '6%',
    // paddingBottom: 10,
    // backgroundColor: 'red',
  },

  textJadwalHariIni: {
    // position: 'absolute',
    width: 400,
    // height: 22,
    left: '10%',
    top: '7%',

    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,

    /* identical to box height */

    color: '#0D1333',
  },

  //NEWS

  categoriesNews: {
    position: 'absolute',
    width: '60%',
    // height: 24,
    left: '6%',
    marginTop: '3%',
    // backgroundColor: 'blue',
    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 21,
    lineHeight: 24,
    zIndex: 10,
    color: '#0D1333',
    // borderRadius: 20,
  },

  boxNews: {
    // top: 40,
    width: '60%',
    height: '20%',
    flexWrap: 'wrap',
    // flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  itemNews: {
    width: 150,
    height: 180,
    backgroundColor: '#B2DFDB',
    borderRadius: 25,
    margin: 8,
    marginVertical: 20,

    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },

  titleNews: {
    alignSelf: 'center',
    height: '100%',
    // width: '100%',
    marginTop: '6%',
    // paddingBottom: 10,
    // backgroundColor: 'red',
  },

  textTitleNews: {
    width: 120,
    left: '10%',
    top: '7%',
    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 22,
    color: '#0D1333',
  },
  textContentNews: {
    width: 120,
    height: 100,
    left: '10%',
    top: '7%',
    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    // fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 22,
    color: '#0D1333',
  },
  textDateNews: {
    width: 120,
    left: '10%',
    top: '7%',
    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 22,
    color: '#0D1333',
  },

  //AVAILABLE TIME

  categoriesAvailableTime: {
    position: 'absolute',
    width: '60%',
    // height: 24,
    left: '6%',
    top: '3%',
    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 21,
    lineHeight: 24,
    zIndex: 10,
    color: '#0D1333',
    // borderRadius: 20,
  },

  boxAvailableTime: {
    // top: 40,

    width: '60%',
    height: '100%',
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  itemAvailableTime: {
    width: 350,
    height: 100,
    backgroundColor: '#B2DFDB',
    borderRadius: 25,
    // margin: 8,
    marginVertical: 7,

    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },

  titleAvailableTime: {
    alignSelf: 'center',
    height: '100%',
    // width: '100%',
    marginTop: '6%',
    // paddingBottom: 10,
    // backgroundColor: 'red',
  },

  textDayAvailableTime: {
    // position: 'absolute',
    // width: 400,
    // height: '100%',
    left: '7%',
    top: '20%',

    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 38,
    // lineHeight: 22,
    color: '#0D1333',
  },
  textTimeAvailableTime: {
    // position: 'absolute',
    // width: 400,
    // height: 22,
    left: '70%',
    top: '-47%',

    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 22,
    color: '#0D1333',
  },
  textDescAvailableTime: {
    // position: 'absolute',
    width: 400,
    // height: 22,
    left: '30%',
    top: '-30%',

    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: '#0D1333',
  },

  //SALDO
  saldo: {
    position: 'absolute',
    // width: '88%',
    // height: '100%',
    left: '10%',
    // marginTop: '10%',
    fontFamily: 'Avenir LT Pro',
    fontWeight: 'bold',
    fontSize: 23,
    lineHeight: 34,
    color: '#0D1333',
    // backgroundColor: 'red',
  },

  nominalSaldo: {
    position: 'absolute',
    // width: '88%',
    height: 36,
    right: '28%',
    // top: '45%',

    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: 29,

    /* identical to box height */

    color: '#61688B',
  },

  topup: {
    position: 'absolute',
    // width: '88%',
    height: 36,
    right: '10%',
    // top: '45%',

    fontFamily: 'Avenir LT Pro',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: 29,
    fontWeight: 'bold',

    /* identical to box height */

    color: '#009688',
  },
});

export default DashboardUser;
