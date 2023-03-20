import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landingpage from '../screens/auth/landingpage';
import LoginPage from '../screens/auth/loginpage';
import Registration from '../screens/auth/registrationpage';
import ServiForm from '../screens/auth/serviform';

const CaptureStack = createNativeStackNavigator();

export default function CaptureNavigator() {
  return (
    <CaptureStack.Navigator 
      screenOptions={{headerShown: false}}
      initialRouteName="Landingpage">
      <CaptureStack.Screen name="Landingpage" component={Landingpage}/>
      <CaptureStack.Screen name="Login" component={LoginPage}/>
      <CaptureStack.Screen name="Register" component={Registration}/>
      <CaptureStack.Screen name="Serviform" component={ServiForm}/>
    </CaptureStack.Navigator>
  );
}