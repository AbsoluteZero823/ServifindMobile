import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import { Drawer, Text} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AuthStore from '../../models/authentication';
import UserStore, { User } from '../../models/user';
import ServiceStore, { ServiceModel } from '../../models/service';
import { Category } from '../../models/category';
import FreelancerStore, { Freelancer } from '../../models/freelancer';
import { freelancerstatus, getmyServices } from '../../../services/apiendpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserDrawer = (props) => {
  const FreelancerContext = useContext(FreelancerStore);
  const AuthContext = useContext(AuthStore);
  const UserContext = useContext(UserStore);
  const ServicesContext = useContext(ServiceStore);
  const navigation = useNavigation();

  const [active, setActive, setAppbarTitle, setDrawerActive] = props.parameters;

  async function switchover() {
    AuthContext.letmeload();
    try {
      const userEmail = UserContext.users[0].email;
      if (!userEmail.endsWith('@tup.edu.ph')) {
        alert('You must have an email address from @tup.edu.ph domain to use this feature');
        AuthContext.donewithload();
        return;
      }
      const response = await freelancerstatus();
      if (!response.success) {
        alert(response.errMessage);
        AuthContext.donewithload();
        return;
      }

      const freelancer = response.freelancer[0];
      if (freelancer){
        if (freelancer.approved_date === undefined && freelancer.status === 'applying') {
          AuthContext.donewithload();
          alert("Your Application is still being processed, Please wait for a while.");
          return;
        }else if (freelancer.status === 'approved'){
          const servicesresponse = await getmyServices();
          FreelancerContext.data[0] = Freelancer.create(freelancer);
          ServicesContext.services = servicesresponse.services.map(service => ({
            _id: service._id,
            title: service.title,
            name: service.name,
            category: Category.create(service.category),
            user: User.create(service.user),
            experience: service.experience,
            freelancer_id: Freelancer.create({
              ...service.freelancer_id, 
            }),
            status: service.status,
            images: { 
              public_id: service.images.public_id, 
              url: service.images.url, 
            }
          }));
          AuthContext.setmyrole('Freelancer');
          navigation.navigate('FreelancerHome');
          AuthContext.donewithload();
        }else if(freelancer.status === 'rejected'){
          alert('Your application has been rejected');
        }
      } else {
        AuthContext.donewithload();
        alert("You need to apply first for a freelancer status!");
        navigation.navigate("ClientFreelancerRegistration");
      }
      
    } catch (error) {
      AuthContext.donewithload();
      console.log(error);
    }
  }
  
  
  return (
    <Drawer.Section style={{paddingTop:20, marginBottom:20,  marginTop:20, flex:1, backgroundColor:'#e28743', borderTopLeftRadius:30, borderBottomLeftRadius:20}} showDivider={false}>
      <Drawer.CollapsedItem 
          focusedIcon="home-outline"
          unfocusedIcon="home"
          label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Home</Text>}
          active={active === 'Home'}
          onPress={() => {
              setAppbarTitle('Browse Talent');
              setActive('Home');
              navigation.navigate('ClientHome');
          }}
          style={{color: 'white'}}
      />
      <Drawer.CollapsedItem 
        focusedIcon="feature-search-outline"
        unfocusedIcon="feature-search"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Services</Text>}
        active={active === 'Jobs'}
        onPress={() => {
          setAppbarTitle('Jobs');
          setActive('Jobs');
          navigation.navigate('ClientJobs');
        }} />
      <Drawer.CollapsedItem 
        focusedIcon="chat-outline"
        unfocusedIcon="chat"
        label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Chat</Text>}
        active={active === 'Chat'}
        onPress={() => {
          setAppbarTitle('Chat')
          setActive('Chat');
          navigation.navigate('ClientChat');
        }} />
      <View style={{flex:1, justifyContent:'flex-end'}}>
        <Drawer.CollapsedItem 
          focusedIcon="account-cog-outline"
          unfocusedIcon="account-cog"
          label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Profile</Text>}
          active={active === 'Profile'}
          onPress={() => {
            setAppbarTitle('Profile');
            setActive('Profile');
            navigation.navigate('ClientProfile');
          }} />
        <Drawer.CollapsedItem 
          unfocusedIcon="account-reactivate"
          label={<Text style={{color:'white', fontWeight:'600', fontSize:14}}>Switch</Text>}
          onPress={() => {
            Alert.alert('Switching Out?', "Are you sure you want to switch to Freelancer?", [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Yes', 
                onPress: () => {
                  switchover();
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
                onPress: async () => {
                  setDrawerActive(false);
                  setActive('Home');
                  await AsyncStorage.removeItem('token');
                  await AsyncStorage.removeItem('userinfo');
                  AuthContext.logout();
                  UserContext.users = [];
                  alert('Signed Out');
                }}]);
          }} />
        </View>
    </Drawer.Section>
  )
};