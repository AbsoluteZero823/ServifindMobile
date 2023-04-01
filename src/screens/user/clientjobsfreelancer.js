import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';

const ClientJobsFreelancer = observer(({route}) => {
    console.log(route.params);
    return (
        <View style={styles.container}>
            <Text>YO!</Text>
        </View>
    )
})

export default ClientJobsFreelancer;