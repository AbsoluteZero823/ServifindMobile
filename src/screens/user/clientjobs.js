import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';

import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';

const ClientJobs = observer((props) => {
    console.log(props.params);
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../../assets/pngegg.png')} resizeMethod='resize' resizeMode='cover' style={{flex:1, margin:-50}}/>
        </View>
    )
})

export default ClientJobs;