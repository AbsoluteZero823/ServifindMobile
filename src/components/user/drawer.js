import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import { Drawer, Text} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AuthStore from '../../models/authentication';
import UserStore from '../../models/user';

export const UserDrawer = (props) => {
  const AuthContext = useContext(AuthStore);
  const UserContext = useContext(UserStore);
  const [active, setActive] = props.ActiveAppbar;
  const setAppbarTitle= props.setAppbarTitle;
  const navigation = useNavigation();
  
  return (
    <Drawer.Section style={{paddingTop:30, marginBottom:20, flex:1, backgroundColor:'salmon', borderTopLeftRadius:30, borderBottomLeftRadius:20, zIndex:2}} showDivider={false}>
      <Drawer.CollapsedItem 
        focusedIcon="home-outline"
        unfocusedIcon="home"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Home</Text>}
        active={active === 'first'}
        onPress={() => {
          setAppbarTitle('Browse Talent')
          setActive('first');
          navigation.navigate('ClientHome');
        }} />
      <Drawer.CollapsedItem 
        focusedIcon="feature-search-outline"
        unfocusedIcon="feature-search"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Jobs</Text>}
        active={active === 'second'}
        onPress={() => {
          setAppbarTitle('Jobs');
          setActive('second');
        }} />
      <Drawer.CollapsedItem 
        focusedIcon="chat-outline"
        unfocusedIcon="chat"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>^_^</Text>}
        active={active === 'third'}
        onPress={() => {
          setAppbarTitle('EXTRA');
          setActive('third');
        }} />
      <Drawer.CollapsedItem 
        focusedIcon="chat-outline"
        unfocusedIcon="chat"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Chat</Text>}
        active={active === 'fourth'}
        onPress={() => {
          setAppbarTitle('Messages')
          setActive('fourth');
        }} />
      <Drawer.CollapsedItem 
        focusedIcon="account-alert-outline"
        unfocusedIcon="account-alert"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Reports</Text>}
        active={active === 'fifth'}
        onPress={() => {
          setAppbarTitle('Reports');
          setActive('fifth');
        }} />
      <View style={{flex:1, justifyContent:'flex-end'}}>
        <Drawer.CollapsedItem 
          focusedIcon="account-cog-outline"
          unfocusedIcon="account-cog"
          label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Settings</Text>}
          active={active === 'seventh'}
          onPress={() => {
            setAppbarTitle('Settings');
            setActive('seventh');
            navigation.navigate('ClientProfile');
          }} />
        <Drawer.CollapsedItem 
          unfocusedIcon="account-reactivate"
          label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Switch</Text>}
          active={active === 'sixth'}
          onPress={() => {
            Alert.alert('Switching Out?', "Are you sure you want to switch to Freelancer?", [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Yes', 
                onPress: () => {
                  console.log('Switching Out');
                }}]);
          }} />
        <Drawer.CollapsedItem 
          unfocusedIcon="logout"
          label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Sign Out</Text>}
          onPress={() => {
            Alert.alert('Signing Out?', "Are you sure you want to sign-out?", [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Yes', 
                onPress: () => {
                  AuthContext.logout();
                  UserContext.users = [];
                  alert('Signed Out');
                  navigation.navigate('Landingpage');
                }}]);
          }} />
        </View>
    </Drawer.Section>
  )
};