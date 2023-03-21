import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientHome from '../screens/user/clienthome';
import ClientProfile from '../screens/user/clientprofile';
import ClientChat from '../screens/user/clientchat';
import ClientReports from '../screens/user/clientreports';
import ClientJobs from '../screens/user/clientjobs';
import { JobsHeader } from '../components/user/jobsheader';

const ClientStack = createNativeStackNavigator();
export default function ClientNavigator(props) {
  return (
    <ClientStack.Navigator initialRouteName='ClientHome' screenOptions={{headerShown: false, animation:'slide_from_right', navigationBarHidden:true, statusBarTranslucent:true, statusBarStyle:'dark'}}>
      <ClientStack.Screen name="ClientHome" children={() => <ClientHome params={props} />}/>
      <ClientStack.Group screenOptions={{
        header: () => <JobsHeader params={props}/>,
        headerShown: true,
        }}>
        <ClientStack.Screen name="ClientJobs" children={() => <ClientJobs params={props} />}/>
        {/* 
        <ClientStack.Screen name="ClientJobsFreelancerCollection" children={() => <ClientJobs params={props} />}/>
        <ClientStack.Screen name="ClientJobs" children={() => <ClientJobs params={props} />}/> 
        */}
      </ClientStack.Group>
      <ClientStack.Screen name="ClientChat" children={() => <ClientChat params={props} />}/>
      <ClientStack.Screen name="ClientReports" children={() => <ClientReports params={props} />}/>
      <ClientStack.Screen name="ClientProfile" children={() => <ClientProfile params={props} />}/>
    </ClientStack.Navigator>
  );
}