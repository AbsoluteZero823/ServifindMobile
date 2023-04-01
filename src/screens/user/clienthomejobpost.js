import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect } from 'react';
import { View, SafeAreaView, Alert, FlatList } from 'react-native';
import { Button, Card, Text, Avatar, IconButton } from 'react-native-paper';

import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import { styles } from '../../components/user/user.css';
import { cancelmyRequest, getoffersRequest } from '../../../services/apiendpoints';
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

    async function getoffers(){
        AuthContext.letmeload();
        try{
            const response = await getoffersRequest(route.params._id);
            if(response.success){
                setoffersdata(response.requestoffers);
            }else{
                alert("An Error has Occured");
            }
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
        AuthContext.donewithload();
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
        getoffers();
    },[]);

    return (
        <View style={styles.container}>
            <LoadingScreen/>
            <Card style={{borderColor:'deeppink', borderWidth:1}}>
                <Card.Title 
                    title={requestdata?.description} 
                    subtitle={requestdata?.category.name}
                    titleStyle={{marginLeft:10}}
                    subtitleStyle={{marginLeft:10, color:'dimgrey'}}
                    left={()=><Avatar.Image size={50} source={{uri: UserContext.users[0].avatar.url }}/>}
                    right={()=><Avatar.Icon style={{backgroundColor:'transparent'}} color={requestdata?.request_status === 'waiting' ? 'salmon' : requestdata?.request_status === 'granted' ? 'green' : 'red'} icon={requestdata?.request_status === 'waiting' ? 'clock-outline' : requestdata?.request_status === 'granted' ? 'check-decagram' : 'cancel'}/>}
                />
                <Card.Content>
                    <FlatList
                        data={offersdata}
                        renderItem={({item})=>
                            <Card key={item._id} style={{borderColor:'deeppink', borderWidth:1}}>
                                <Card.Title 
                                    title={item.offered_by.name}
                                    titleStyle={{color:'deeppink'}}
                                    subtitle={item.offered_by.contact}
                                    subtitleStyle={{color:'dimgrey'}}
                                    left={()=><Avatar.Image size={40} source={{uri: item.offered_by.avatar.url }}/>}
                                    />
                                <Card.Content style={{flex:1}}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text variant='bodyLarge' style={{color:'deeppink'}}>Service:</Text>
                                        <Text>{item.service_id.title}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text variant='bodyLarge' style={{color:'deeppink'}}>Offer:</Text>
                                        <Text>{item.description}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text variant='bodyLarge' style={{color:'deeppink'}}>Experience:</Text>
                                        <Text>{item.service_id.experience}</Text>
                                    </View>
                                    
                                </Card.Content>
                            </Card>
                        }
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
                    {
                        requestdata?.request_status === 'waiting' && <Button 
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
                    }
                </Card.Actions>
            </Card>
        </View>
    )
})

export default ClientSingleJobPosts;