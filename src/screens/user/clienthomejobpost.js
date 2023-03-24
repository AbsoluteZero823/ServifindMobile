import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect } from 'react';
import { View, SafeAreaView, Alert, FlatList } from 'react-native';
import { Button, Card, Text, Avatar, IconButton } from 'react-native-paper';

import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import { styles } from '../../components/user/user.css';
import { cancelmyRequest } from '../../../services/apiendpoints';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../../components/loading';
import RequestStore from '../../models/request';

const ClientSingleJobPosts = observer(({route}) => {
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const RequestContext = useContext(RequestStore);
    const navigation = useNavigation();
    const [requestdata, setrequestdata] = useState();
    const [offersdata, setoffersdata] = useState([]);

    function getSingleRequest(){
        const singledata = RequestContext.requests.find((request) => request._id === route.params._id);
        setrequestdata(singledata);
    }

    async function cancelhandler(){
        AuthContext.letmeload();
        try{
            const response = await cancelmyRequest(route.params._id);
            if(response.success){
                alert('Job Request Cancelled Successfully');
                requestdata.setCancel();
                navigation.goBack();
            }else{
                alert(response);
            }
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
        AuthContext.donewithload();
    }

    useEffect(() => {
        getSingleRequest();
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
                    left={()=><Avatar.Image source={{uri: UserContext.users[0].avatar.url }}/>}
                    right={()=><Avatar.Icon style={{backgroundColor:'transparent'}} color={requestdata?.request_status === 'waiting' ? 'salmon' : requestdata?.request_status === 'granted' ? 'green' : 'red'} icon={requestdata?.request_status === 'waiting' ? 'clock-outline' : requestdata?.request_status === 'granted' ? 'check-decagram' : 'cancel'}/>}
                />
                <Card.Content>
                    <FlatList
                        data={offersdata}
                        renderItem={({item})=><Text>Yo!</Text>}
                        ListEmptyComponent={()=>
                            <SafeAreaView style={{alignItems:'center', alignSelf:'center', justifyContent:'center'}}>
                                <IconButton icon='chat-processing-outline' size={30} iconColor='deeppink'/>
                                <Text variant='titleMedium'>No Offers as of yet!</Text>
                                <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Wait for a freelancer to make an offer</Text>
                            </SafeAreaView> 
                        }
                    />
                </Card.Content>
                <Card.Actions>
                    <Button 
                    icon='cancel' 
                    mode='contained'
                    buttonColor='salmon'
                    onPress={()=>Alert.alert('Cancel Post?','Are you sure you want to cancel this posting?',[
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {text: 'OK', onPress: () => cancelhandler()},
                    ])}>
                        Cancel Request
                    </Button>
                </Card.Actions>
            </Card>
        </View>
    )
})

export default ClientSingleJobPosts;