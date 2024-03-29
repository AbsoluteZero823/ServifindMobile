import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientHome from '../screens/user/clienthome';
import ClientProfile from '../screens/user/clientprofile';
import ClientChat from '../screens/user/clientchat';
import ClientReports from '../screens/user/clientreports';
import ClientJobs from '../screens/user/clientjobs';
import ClientSingleJob from '../screens/user/clientjobssingle';
import ClientJobsFreelancer from '../screens/user/clientjobsfreelancer';
import { JobsHeader } from '../components/user/jobsheader';
import ClientJobsRequest from '../screens/user/clientjobspost';
import ClientHomePostings from '../screens/user/clienthomejobposts';
import ClientSingleJobPosts from '../screens/user/clienthomejobpost';
import ClientFreelancerRegistration from '../screens/user/clientfreelancerregistration';
import ClientCompleteOffer from '../screens/user/clientcompleteoffer';
import ClientMessage from '../screens/user/clientmessage';
import ClientInquiries from '../screens/user/clientinquiries';
import ClientInquiry from '../screens/user/clientinquiry';

const ClientStack = createNativeStackNavigator();
/**
* Client navigation component for the client. This component is used to display the top - level page of the client's app.
* 
* @param props - props to pass to the component. This is an object with the following properties : screenOptions : { Object } a component's options. initialParams
*/
export default function ClientNavigator(props) {
  return (
    <ClientStack.Navigator initialRouteName='ClientHome' screenOptions={{headerShown: false, animation:'slide_from_right', navigationBarHidden:true, statusBarTranslucent:true, statusBarStyle:'dark', contentStyle:{backgroundColor:'mistyrose'}}}>
      <ClientStack.Group>
        <ClientStack.Screen name="ClientHome" children={() => <ClientHome params={props} />}/>
        <ClientStack.Screen name="ClientInquiries" component={ClientInquiries}/>
        <ClientStack.Screen name="ClientInquiry" component={ClientInquiry}/>
        <ClientStack.Screen name="ClientPostaJob" component={ClientJobsRequest} options={{presentation:'transparentModal', contentStyle:{backgroundColor:'transparent'}}}/>
        <ClientStack.Screen name="ClientJobPosting" component={ClientHomePostings}/>
        <ClientStack.Screen name="ClientSingleJobPosts" component={ClientSingleJobPosts}/>
        <ClientStack.Screen name="ClientFreelancerRegistration" component={ClientFreelancerRegistration} initialParams={props}/>
      </ClientStack.Group>
      
      <ClientStack.Group screenOptions={{
        header: () => <JobsHeader params={props}/>,
        headerShown: true,
        }}>
        <ClientStack.Screen name="ClientJobs" children={() => <ClientJobs params={props} options={{headerShown: false}}/>}/>
        <ClientStack.Screen name="ClientFreelancer" component={ClientJobsFreelancer} options={{headerShown: false}}/>
        <ClientStack.Screen name="ClientSingleJob" component={ClientSingleJob} options={{presentation:'transparentModal', headerShown: false, contentStyle:{backgroundColor:'transparent'}}}/>
      </ClientStack.Group>
      <ClientStack.Screen name="ClientCompleteOffer" component={ClientCompleteOffer} options={{presentation:'transparentModal', contentStyle:{backgroundColor:'transparent'}}}/>
      <ClientStack.Screen name="ClientChat" children={() => <ClientChat params={props} />}/>
      <ClientStack.Screen name="ClientMessage" component={ClientMessage} />
      <ClientStack.Screen name="ClientReports" children={() => <ClientReports params={props} />}/>
      <ClientStack.Screen name="ClientProfile" children={() => <ClientProfile params={props} />}/>
    </ClientStack.Navigator>
  );
}