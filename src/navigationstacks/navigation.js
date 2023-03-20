import React, { useContext, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CaptureNavigator from './capturestack';
import ClientNavigator from "./userstack";
import FreelancerNavigator from "./freelancer";

import { observer } from "mobx-react";
import AuthStore from '../models/authentication';

import { Appbar, Avatar } from 'react-native-paper';
import { UserDrawer } from '../components/user/drawer';
import { TouchableOpacity, View, Animated } from 'react-native';
import UserStore from '../models/user';

const NavigationStack = observer(() => {
  const AuthContext = useContext(AuthStore);
  const UserContext = useContext(UserStore);
  const [DrawerActive, setDrawerActive] = useState(false);
  const [AppbarTitle, setAppbarTitle] = useState("Browse Talent");
  const [active, setActive] = useState('first');
  
  const pushleft = useRef(new Animated.Value(0)).current;
  const pushRight = useRef(new Animated.Value(0)).current;
  const DrawerOpen = () => {
    Animated.timing(pushleft, {
      toValue: 80,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };
  const DrawerClose = () => {
    Animated.timing(pushleft, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };
  const ContentPull = () => {
    Animated.timing(pushRight, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };
  const ContentPush = () => {
    Animated.timing(pushRight, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };
  function toggleDrawer(){
    setDrawerActive(!DrawerActive);
    if(DrawerActive){
      DrawerOpen();
      ContentPull();
    }else{
      DrawerClose();
      ContentPush();
    }
  }
  return (
    <NavigationContainer>
      {
        AuthContext.amiauthenticated ? 
          AuthContext.myrole === 'customer' ?
          <View style={{flex:1, backgroundColor:'mistyrose'}}>
            <Appbar.Header style={{justifyContent:'flex-end', backgroundColor:'transparent'}}>
              <Appbar.Content title={AppbarTitle} titleStyle={{color:'deeppink', fontWeight:'bold',fontSize:28}}/>
              <TouchableOpacity style={{marginRight:16}} onPress={() => {toggleDrawer()}}>
                <Avatar.Image size={34} source={{uri: UserContext.users[0]?.UserDetails?.avatar?.url}} style={{backgroundColor:'deeppink'}}/>
              </TouchableOpacity>
            </Appbar.Header>
            <View style={{flexDirection:'row', flex: 1}}>
              <Animated.View style={{flex:1, marginRight: pushRight}}>
                <ClientNavigator opacity={DrawerActive ? 0.5 : 1}/>
              </Animated.View>
              <Animated.View style={{transform:[{translateX:pushleft}]}}>
                {
                  DrawerActive && <UserDrawer setAppbarTitle={setAppbarTitle} ActiveAppbar={[active, setActive]} visible={DrawerActive}/>
                }
              </Animated.View>
            </View>
          </View>
          :
          <FreelancerNavigator />
        : 
        <CaptureNavigator/> 
      }
    </NavigationContainer>
  )
});

export default NavigationStack;