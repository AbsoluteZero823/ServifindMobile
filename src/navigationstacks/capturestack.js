import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landingpage from '../screens/auth/landingpage';
import LoginPage from '../screens/auth/loginpage';
import Registration from '../screens/auth/registrationpage';
import ServiForm from '../screens/auth/serviform';

const CaptureStack = createNativeStackNavigator();

/**
* Captures the Navigator component. This component is used to navigate through the stack to the landingpage and register pages.
* 
* 
* @return { ReactElement } The Navigator component wrapped in a capture stack component with a navigation option to allow the user to navigate
*/
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