import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground, Alert} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';

import AuthStore from '../../models/authentication';
import { styles } from '../../components/user/user.css';
import { getmySingleRequest } from '../../../services/apiendpoints';
import { useEffect } from 'react';
import LoadingScreen from '../../components/loading';

const ClientSingleJobPosts = observer(({route}) => {
    const AuthContext = useContext(AuthStore);
    const [requestdata, setrequestdata] = useState();
    async function getSingleRequest(){
        AuthContext.letmeload();
        try{
            const response = await getmySingleRequest(route.params._id);
            if(response.success){
                setrequestdata(response.request);
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }

    useEffect(() => {
        getSingleRequest();
        console.log(requestdata);
    },[]);

    return (
        <View style={styles.container}>
            <LoadingScreen/>
            <Card>
                <Card.Title 
                    title={requestdata?.description} 
                    subtitle={requestdata?.category.name}
                    titleStyle={{marginHorizontal:20}}
                    subtitleStyle={{marginHorizontal:20, color:'dimgrey'}}
                    left={()=><Avatar.Image source={{uri: requestdata?.requested_by.avatar.url}}/>}
                    right={()=><Avatar.Icon style={{backgroundColor:'transparent'}} color={requestdata?.request_status === 'waiting' ? 'salmon' : requestdata?.request_status === 'granted' ? 'green' : 'red'} icon={requestdata?.request_status === 'waiting' ? 'clock-outline' : requestdata?.request_status === 'granted' ? 'check-decagram' : 'cancel'}/>}
                />
                <Card.Content>
                    <Text>No Offers Yet</Text>
                </Card.Content>
                <Card.Actions>
                    <Button icon='cancel' onPress={()=>Alert.alert('Cancel Post?','Are you sure you want to cancel this posting?',[
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ])}>
                        Cancel Request
                    </Button>
                </Card.Actions>
            </Card>
        </View>
    )
})

export default ClientSingleJobPosts;