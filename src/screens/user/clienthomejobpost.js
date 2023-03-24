import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';
import { getmySingleRequest } from '../../../services/apiendpoints';
import { useEffect } from 'react';
import LoadingScreen from '../../components/loading';

const ClientSingleJobPosts = observer(({route}) => {
    async function getSingleRequest(){
        try{
            const response = await getmySingleRequest(route.params._id);
            console.log(response);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getSingleRequest();
    },[]);

    return (
        <View style={styles.container}>
            <LoadingScreen/>

        </View>
    )
})

export default ClientSingleJobPosts;