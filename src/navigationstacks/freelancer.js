import { createNativeStackNavigator } from '@react-navigation/native-stack';

const FreelancerStack = createNativeStackNavigator();

export function FreelancerNavigator() {
  return (
    <FreelancerStack.Navigator>
      <FreelancerStack.Screen name="FreelancerHome" component={FreelancerHome} />
    </FreelancerStack.Navigator>
  );
}