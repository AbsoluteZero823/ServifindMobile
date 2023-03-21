import React, { useContext, useState, useRef} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from "mobx-react";

import CaptureNavigator from './capturestack';
import ClientNavigator from "./userstack";
import FreelancerNavigator from "./freelancer";

import { View, DrawerLayoutAndroid } from 'react-native';
import { UserDrawer } from '../components/user/drawer';
import AuthStore from '../models/authentication';
import { CustomAppBar } from '../components/user/appbar';

const NavigationStack = observer(() => {
  const AuthContext = useContext(AuthStore);
  const [DrawerActive, setDrawerActive] = useState(false);
  const [AppbarTitle, setAppbarTitle] = useState("Browse Talent");
  const [active, setActive] = useState('first');
  const [activeCategory, setActiveCategory] = useState([]);
  const drawer = useRef(null);
  return (
    <NavigationContainer>
      {
        AuthContext.amiauthenticated ? 
          AuthContext.myrole === 'customer' ?
          <View style={{flex:1, backgroundColor:'mistyrose'}}>
            <CustomAppBar passed={[AppbarTitle, setActive, setAppbarTitle, drawer, DrawerActive, setDrawerActive]} />
            <View style={{flexDirection:'row', flex: 1}}>
              <DrawerLayoutAndroid
                ref={drawer}
                drawerPosition='right'
                drawerBackgroundColor='transparent'
                drawerWidth={80}
                onDrawerClose={() => setDrawerActive(false)}
                renderNavigationView={()=>(<UserDrawer parameters={[active, setActive, setAppbarTitle, setDrawerActive]}/>)}
              >
                <ClientNavigator props={[setAppbarTitle, setActive, activeCategory, setActiveCategory]}/>
              </DrawerLayoutAndroid>
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