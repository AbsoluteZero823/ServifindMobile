// This is called by React to ensure that we don't accidentally get a reference to the AnimatedFAB
import React from 'react';
import { AnimatedFAB } from "react-native-paper"
import { useNavigation } from '@react-navigation/native';

export const FAB = () => {
    const navigation = useNavigation();
    return(
        <AnimatedFAB
            icon='plus'
            label='Create Job'
            style={{position:'absolute', bottom:40, right:20, backgroundColor:'green'}}
            color='white'
            onPress={() => {navigation.navigate('ClientPostaJob')}}
        />
    )
    
}

