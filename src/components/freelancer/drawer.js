// This is a copy of react - media - graph. js which has been moved to another module. We're going to need to move this in a more elegant way
import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import { Drawer, Text} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AuthStore from '../../models/authentication';
import UserStore from '../../models/user';
import ServiceStore from '../../models/service';

// Exports Freelancer's view drawer. It is used to build the view
export const FreelancerDrawer = (props) => {
  // Adds setjobsearch and / or auth context to the appbar. This is called from a constructor
  const setjobsearch = props.parameters[4];
  const AuthContext = useContext(AuthStore);
  const UserContext = useContext(UserStore);
  const navigation = useNavigation();

  const [active, setActive, setAppbarTitle, setDrawerActive] = props.parameters;
  
  return (
    // Adds the home and Board icons to the appbar. This is a bit hacky but I don't know how to make it
    <Drawer.Section style={{paddingTop:20, marginBottom:20,  marginTop:20, flex:1, backgroundColor:'darksalmon', borderTopLeftRadius:30, borderBottomLeftRadius:20}} showDivider={false}>
      <Drawer.CollapsedItem 
        focusedIcon="home-outline"
        unfocusedIcon="home"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Home</Text>}
        active={active === 'Home'}
        onPress={() => {
          setAppbarTitle('Dashboard');
          setActive('Home');
          navigation.navigate('FreelancerHome');
        }}
        />
      <Drawer.CollapsedItem 
        focusedIcon="feature-search-outline"
        unfocusedIcon="feature-search"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Job Board</Text>}
        active={active === 'Jobs'}
        onPress={() => {
          setAppbarTitle('Jobs');
          setActive('Jobs');
          navigation.navigate('FreelancerJobPosts');
        }} />
      <Drawer.CollapsedItem 
        focusedIcon="chat-outline"
        unfocusedIcon="chat"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Chat</Text>}
        active={active === 'Chat'}
        onPress={() => {
          setAppbarTitle('Chat')
          setActive('Chat');
          navigation.navigate('FreelancerChats');
        }} />
      <View style={{flex:1, justifyContent:'flex-end'}}>
        <Drawer.CollapsedItem 
          focusedIcon="account-cog-outline"
          unfocusedIcon="account-cog"
          label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Profile</Text>}
          active={active === 'Profile'}
          onPress={() => {
            setAppbarTitle('My Profile');
            setActive('Profile');
            navigation.navigate('FreelancerProfile');
          }} />
        <Drawer.CollapsedItem 
          unfocusedIcon="account-reactivate"
          label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Switch</Text>}
          onPress={() => {
            Alert.alert('Switching Out?', "Are you sure you want to switch to Client?", [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Yes', 
                onPress: () => {
                    setjobsearch('Services');
                    setAppbarTitle('Browse Talent');
                    setActive('Home');
                    AuthContext.setmyrole('customer');
                    navigation.navigate('ClientHome');
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
                  setDrawerActive(false);
                  setActive('Home');
                  AuthContext.logout();
                  UserContext.users = [];
                  alert('Signed Out');
                }}]);
          }} />
        </View>
    </Drawer.Section>
  )
};