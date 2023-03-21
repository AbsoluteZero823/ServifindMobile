import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';

const ClientChat = observer(() => {
    return (
        <View style={styles.container}>

        </View>
    )
})

export default ClientChat;