import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientHome from '../screens/user/clienthome';
import ClientProfile from '../screens/user/clientprofile';

const ClientStack = createNativeStackNavigator();

export default function ClientNavigator(props) {
  return (
    <ClientStack.Navigator initialRouteName='ClientHome' screenOptions={{headerShown: false, animation:'slide_from_right', navigationBarHidden:true, statusBarTranslucent:true}}>
      <ClientStack.Screen name="ClientHome" children={() => <ClientHome params={props} />}/>
      <ClientStack.Screen name="ClientProfile" component={ClientProfile}/>
    </ClientStack.Navigator>
  );
}