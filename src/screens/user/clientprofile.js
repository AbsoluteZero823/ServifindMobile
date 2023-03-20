import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import UserStore from '../../models/user';


const ClientProfile = observer(() => {
    const UserContext = useContext(UserStore);
    return (
        <View style={styles.container}>

        </View>
    )
})

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'mistyrose'
    },
    padded:{
        marginVertical:'5%', 
        marginHorizontal: '5%',
        fontWeight:'bold'
    },
    image: {
        flex: 1,
        resizeMode: 'center',
        zIndex: -1,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

export default ClientProfile;