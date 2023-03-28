import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';

const FreelancerHome = observer(() => {
    return (
        <View>
            <Text>My Services</Text>
            <Text>My Projects</Text>
        </View>
    )
})

export default FreelancerHome;