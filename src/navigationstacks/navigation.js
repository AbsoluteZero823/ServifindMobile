import React, { useContext, useState, useRef} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from "mobx-react";

import CaptureNavigator from './capturestack';
import ClientNavigator from "./userstack";
import FreelancerNavigator from "./freelancer";

import { View, DrawerLayoutAndroid } from 'react-native';
import { FreelancerDrawer } from '../components/freelancer/drawer';
import { UserDrawer } from '../components/user/drawer';
import AuthStore from '../models/authentication';
import { CustomAppBar } from '../components/appbar';
import { useEffect } from 'react';

const NavigationStack = observer(() => {
  const AuthContext = useContext(AuthStore);
  const [DrawerActive, setDrawerActive] = useState(false);
  const [AppbarTitle, setAppbarTitle] = useState("Browse Talent");
  const [active, setActive] = useState('Home');
  const [activeCategory, setActiveCategory] = useState([]);
  const [jobsearchquery, setjobsearchquery] = useState();

  const [jobsearch, setjobsearch] = useState('Services');
  const [jobsearchmenu, setjobsearchmenu] = useState([]);

  useEffect(()=>{
    AuthContext.myrole === 'customer' ? 
    setjobsearchmenu([
      {
        title:'Services',
        icon:'briefcase-variant-outline'
      },
      {
        title:'Freelancers',
        icon:'account-group-outline'
      },
    ]) 
    :
    setjobsearchmenu([
      {
        title:'Requests',
        icon:'briefcase-variant-outline'
      },
      {
        title:'Clients',
        icon:'account-group-outline'
      },
    ])
  },[AuthContext.myrole])
  const drawer = useRef(null);
  return (
    <NavigationContainer>
      {
        AuthContext.amiauthenticated ?
        <View style={{flex:1, backgroundColor:'mistyrose'}}>
          <CustomAppBar passed={[AppbarTitle, setActive, setAppbarTitle, drawer, DrawerActive, setDrawerActive, jobsearchquery, setjobsearchquery, jobsearchmenu, jobsearch, setjobsearch]} />
          <View style={{flexDirection:'row', flex: 1}}>
              <DrawerLayoutAndroid
                ref={drawer}
                drawerPosition='right'
                drawerBackgroundColor='transparent'
                drawerWidth={80}
                keyboardDismissMode='on-drag'
                onDrawerClose={() => setDrawerActive(false)}
                renderNavigationView={()=>(
                  AuthContext.myrole === 'customer' ?
                  <UserDrawer parameters={[active, setActive, setAppbarTitle, setDrawerActive]}/>
                  :
                  <FreelancerDrawer parameters={[active, setActive, setAppbarTitle, setDrawerActive, setjobsearch]}/>
                )
                }>
                {
                  AuthContext.myrole === 'customer' ?
                  <>
                  <ClientNavigator props={[setAppbarTitle, setActive, activeCategory, setActiveCategory, jobsearch, jobsearchquery, setjobsearch]}/>
                  </>
                  :
                  <>
                  <FreelancerNavigator props={[setAppbarTitle, setActive, activeCategory, setActiveCategory, jobsearch, jobsearchquery]}/>
                  </>
                }
                </DrawerLayoutAndroid>
          </View>
        </View>
        :
        <CaptureNavigator/> 
      }
      
    </NavigationContainer>
  )
});

export default NavigationStack;