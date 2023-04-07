import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, SafeAreaView, Alert, FlatList, RefreshControl } from 'react-native';
import { Button, Card, Text, Avatar, IconButton, SegmentedButtons, Menu } from 'react-native-paper';

import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import { styles } from '../../components/user/user.css';
import { cancelmyRequest, getoffersRequest, refuseanOffer, acceptanOffer } from '../../../services/apiendpoints';
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
    const [menucollection, setMenuCollection] = useState({});

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
                alert(response.message);
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

    async function refusehandler(id){
        AuthContext.letmeload();
        try{
            const response = await refuseanOffer(id);
            if(response.success){
                alert(response.message);
            }else{
                alert(response);
            }
            onRefresh();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
        AuthContext.donewithload();
    }

    async function accepthandler(id, request_id){
        AuthContext.letmeload();
        try{
            const response = await acceptanOffer({id});
            if(response.success){
                alert(response.message);
            }else{
                alert(response);
            }
            onRefresh();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
        AuthContext.donewithload();
    }

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getSingleRequest();
        getoffers();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

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
                        data={offersdata.sort((a, b) => {
                            if (a.offer_status === 'granted' && b.offer_status !== 'granted') {
                              return -1; // a comes first
                            } else if (a.offer_status !== 'granted' && b.offer_status === 'granted') {
                              return 1; // b comes first
                            } else if (a.offer_status === 'waiting' && b.offer_status === 'cancelled') {
                              return -1; // a comes first
                            } else if (a.offer_status === 'cancelled' && b.offer_status === 'waiting') {
                              return 1; // b comes first
                            } else {
                              return 0; // no sorting needed
                            }
                          })}
                        style={{ height: '80%' }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item})=>
                            <Card key={item._id} style={{borderColor:'deeppink', borderWidth:1, marginVertical:5}}>
                                <Card.Title 
                                    title={item.offered_by.name}
                                    titleStyle={{color:'deeppink'}}
                                    subtitle={item.offered_by.contact}
                                    subtitleStyle={{color:'dimgrey'}}
                                    left={()=><Avatar.Image size={40} source={{uri: item.offered_by.avatar.url }}/>}
                                    right={()=>
                                    item.offer_status === 'granted' ?
                                    <Menu
                                        visible={menucollection[item._id]}
                                        anchor={
                                            <IconButton icon='dots-vertical' iconColor='deeppink' onPress={() => setMenuCollection({...menucollection, [item._id]: !menucollection[item._id]})}/>
                                        }
                                        anchorPosition='bottom'
                                        onDismiss={() => setMenuCollection({...menucollection, [item._id]: false})}
                                        >
                                        <Menu.Item onPress={() => navigation.navigate('ClientCompleteOffer',item)} title="Complete" />
                                        <Menu.Item onPress={() => {}} title="Cancel" />
                                    </Menu>
                                    :
                                    <IconButton 
                                        icon={item.offer_status === 'cancelled' ? 'cancel' : 'check'} 
                                        iconColor={item.offer_status === 'cancelled' ? 'red' : item.offer_status === 'granted' ? 'deeppink' : 'green'}/>
                                    }
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
                                    <Text variant='bodyLarge' style={{color:'deeppink'}}>Experience:</Text>
                                    <Text>{item.service_id.experience}</Text>
                                </Card.Content>
                                <Card.Actions>
                                    {
                                        item.offer_status === 'waiting' && 
                                        <SegmentedButtons
                                        buttons={[
                                            {
                                                label: 'Accept',
                                                onPress: ()=>{accepthandler(item._id, requestdata._id)}
                                            },
                                            {
                                                label: 'Refuse',
                                                onPress: ()=>{refusehandler(item._id)}
                                            }
                                        ]}
                                        value={null}
                                        onValueChange={()=>null}
                                        />
                                    }
                                    {
                                        item.offer_status === 'granted' &&
                                        <>
                                        <Button
                                            mode='contained'
                                            icon='chat'
                                            textColor='white'
                                            buttonColor='blue'
                                            onPress={()=>{
                                                navigation.navigate('ClientChat')
                                            }}
                                            >
                                            Message
                                        </Button>
                                        </>
                                    }
                                </Card.Actions>
                            </Card>
                        }
                        ListFooterComponent={()=>
                            <SafeAreaView style={{alignItems:'center', alignSelf:'center', justifyContent:'center'}}>
                                {
                                (offersdata.length > 0 & requestdata?.request_status === 'waiting' ) ?
                                <>
                                <IconButton icon='tag' size={30} iconColor='deeppink'/>
                                <Text variant='titleMedium'>Not satisfied with the current offers?</Text>
                                <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Wait for another freelancer to make an offer</Text>
                                </>
                                :
                                null
                                } 
                            </SafeAreaView>
                        }
                        ListEmptyComponent={()=>
                            <SafeAreaView style={{alignItems:'center', alignSelf:'center', justifyContent:'center'}}>
                                <IconButton icon='chat-processing-outline' size={30} iconColor='deeppink'/>
                                <Text variant='titleMedium'>No Offers as of yet!</Text>
                                <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Wait for a freelancer to make an offer</Text>
                            </SafeAreaView> 
                        }
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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