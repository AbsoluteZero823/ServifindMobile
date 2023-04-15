import 'react-native-gesture-handler';
import { useColorScheme } from "react-native";
import { Provider } from "react-native-paper";

import React from 'react';
import NavigationStack from './src/navigationstacks/navigation.js';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const scheme = useColorScheme();
  // Incorporating Themes into the App
  return (
      <Provider theme='light'>
        <StatusBar style='dark'/>
        <NavigationStack/>
      </Provider>
    
    
  );
}
