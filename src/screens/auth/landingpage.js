import React from 'react';
import { View, Image} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { observer } from "mobx-react";
import { useNavigation } from '@react-navigation/native';
import styles from '../../components/authentication/authentication.css';

const Landingpage = observer(()=>{
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.landingpage}>
            <Image source={require('../../../assets/icon.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome to <Text style={styles.highlight}>ServiFind</Text></Text>
            <View style={{flexDirection:'row', alignSelf:'center'}}>
                <View>
                    <Text style={[styles.highlight,{fontSize:25}]}>Right</Text>
                </View>
                <View style={{paddingLeft:5}}>
                    <Text style={{fontWeight:'bold'}}>Time</Text>
                    <Text style={{fontWeight:'bold'}}>Person</Text>
                </View>
            </View>
            <Button style={styles.button} icon="login-variant" mode="outlined" textColor='black' onPress={() => navigation.navigate('Login')}>
                Login
            </Button>
            <Button style={styles.button} icon="account-plus" mode="contained" buttonColor='deeppink' textColor='white' onPress={() => navigation.navigate('Register')}>
                Register
            </Button>
        </View>
        </View>
    )
})
export default Landingpage;
