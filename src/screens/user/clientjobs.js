import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';

import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';

const ClientJobs = observer((props) => {
    return (
        <View style={styles.container}>
            <View>
              <Text>WOOO!</Text>
            </View>
        </View>
    )
})

export default ClientJobs;