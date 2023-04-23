import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, FlatList} from 'react-native';
import { Button, Card, Text, Avatar, Divider, IconButton, Portal, Modal, TextInput} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createanInquiry, getChat, sendMessage } from '../../../services/apiendpoints';
import { format } from 'date-fns';
import AuthStore from '../../models/authentication';
import LoadingScreen from '../../components/loading';

const ClientSingleJob = observer(({route}) => {
    const AuthContext = useContext(AuthStore);
    const data = route.params.item;
    const navigation = useNavigation();
    const [mainvisible, setmainVisible] = useState(true);
    const [Inquirevalue, setInquirevalue] = useState('');
    const [Inquirevisible, setInquirevisible] = useState(false);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};

    /**
    * Send an Inquiry to Freelancer and set visibility to
    */
    async function sendInquiry() {
        AuthContext.letmeload();
        let body = {};
        body.instruction = Inquirevalue;
        body.attachments = 'Placeholder';
        body.freelancer = data.freelancer_id;
        body.service_id = data._id;
        try{
            const sendresponse = await createanInquiry(body);
            // This method is called when the server sends a response to the Freelancer.
            if(sendresponse.success){
                const fetchchatresponse = await getChat({userId: data.user._id, inquiryId: sendresponse.inquiry._id});
                if (fetchchatresponse.success) {
                    sendMessage({content: Inquirevalue, chatId: fetchchatresponse.FullChat._id});
                }
                setInquirevisible(false);
                setmainVisible(false);
                setInquirevalue('');
                navigation.goBack();
                alert("Inquiry sent successfully! Check your Chats for Updates");
            }else{
                setInquirevisible(false);
                setmainVisible(false);
                setInquirevalue('');
                navigation.goBack();
                alert("You probably have already sent an Inquiry to this Freelancer");
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }

    return (
        <Portal>
            <LoadingScreen/>
            <Modal visible={mainvisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
            <Card style={{marginTop:50, borderWidth: 1, borderColor:'#9c6f6f'}}>
                <Card.Cover source={{uri: data.images?.url || data.image || 'https://res.cloudinary.com/dawhmjhu1/image/upload/v1651110818/shelter/avatar_rk4v2w.jpg'}}/>
                <Card.Title title={data.title || data.name} titleStyle={{color:'#9c6f6f'}} />
                <Card.Content>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
                        <View style={{flexDirection:'row'}}>
                            <Avatar.Image size={40} source={{ uri: data.user.avatar.url }} style={{alignItems:'center'}}/>
                            <View style={{marginHorizontal:5}}>
                                <Text>{data.user.name}</Text>
                                <Text style={{color:'#9c6f6f'}}>{data.freelancer_id.availability ? 'Available' : 'Not Available'}</Text>
                            </View>
                        </View>
                        <View>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Avatar.Icon icon='star' size={20} color='#9c6f6f' style={{backgroundColor:'transparent'}}/>
                                <Text>{data.avgRating !== null ? data.avgRating : '0'} / 5</Text>
                                <Text style={{color:'dimgrey'}}>({data.ratings !== undefined ? data.ratings.length : '0'})</Text>
                            </View>
                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between'}} onPress={()=>{setmainVisible(false),navigation.navigate('ClientFreelancer',{freelancer_id: data.freelancer_id._id})}}>
                                <Avatar.Icon icon='eye' size={20} color='#9c6f6f' style={{backgroundColor:'transparent'}}/>
                                <Text style={{color:'#9c6f6f'}}>See Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Divider/>
                    {
                        console.log(data)
                    }
                    {
                        data.experience &&
                        <View style={{marginVertical:10}}>
                            <Text style={{color:'#9c6f6f', marginBottom: 4}}>Experience:</Text>
                            <Text>{data.experience}</Text>
                        </View>
                    }
                    {
                        data.description &&
                        <View style={{marginVertical:10}}>
                            <Text style={{color:'#9c6f6f', marginBottom: 4}}>Description:</Text>
                            <Text>{data.description}</Text>
                        </View>
                    }
                    {
                        data.priceStarts_At &&
                        <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:10}}>
                            <Text style={{color:'#9c6f6f'}}>Price Starts At:</Text>
                            <Text>₱ {data.priceStarts_At}</Text>
                        </View>
                    }
                    <Text style={{color:'#9c6f6f', marginVertical: 2}}>Reviews:</Text>
                    <FlatList
                        data={data.ratings}
                        horizontal={data.ratings.length > 1 ? true : false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => (
                            <Card style={{marginVertical:4, marginHorizontal: data.ratings.length > 1 ? 4 : 0, width: data.ratings.length > 1 ? 300 : '100%', borderWidth:1, borderColor:'#9c6f6f'}}>
                                <Card.Title 
                                    title={item.user.name}
                                    subtitle={format(new Date(item.created_At),"MMM. dd (EEEE), yyyy")}
                                    subtitleStyle={{fontSize:12, color:'dimgrey', marginTop: -10}}
                                    left={()=><Avatar.Image size={40} source={{ uri: item.user.avatar.url }} style={{alignItems:'center'}}/>}
                                    />
                                <Card.Content>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Text style={{color:'#9c6f6f'}}>Rating:</Text>
                                        <Text>{item.rating}</Text>
                                    </View>
                                    <Text style={{color:'#9c6f6f'}}>Comment:</Text>
                                    <Text style={{textAlign:'right'}}>{item.comment}</Text>
                                </Card.Content>
                            </Card>
                        )}
                        ListEmptyComponent={() => (
                            <Text style={{textAlign:'center', fontWeight:'bold', color: '#9c6f6f'}}>No Reviews Available</Text>
                        )} 
                    />
                    
                </Card.Content>
                <Card.Actions>
                    {
                        data.freelancer_id.availability &&
                        <Button icon="chat" mode="contained" buttonColor="green" onPress={() => {setInquirevisible(true)}}>
                            Inquire
                        </Button>
                    }
                </Card.Actions>
            </Card>
        </Modal>
        <Modal visible={Inquirevisible} onDismiss={()=>{setInquirevisible(false)}} contentContainerStyle={{marginHorizontal:10}}>
            <Card style={{borderWidth:1, borderColor:'#9c6f6f'}}>
                <Card.Title title='Send Inquire Message' subtitle={'To: '+data.user.name} right={()=><IconButton style={{marginHorizontal:20}} iconColor='maroon' icon='window-close' onPress={()=>{setInquirevisible(false)}}/>}/>
                <Card.Content>
                    <TextInput
                        mode='outlined'
                        label='Message'
                        placeholder='Type here...'
                        dense={true}
                        onChangeText={(text) => setInquirevalue(text)}
                        right={<TextInput.Icon icon='send' iconColor='#9c6f6f' onPress={()=>{sendInquiry()}}/>}
                    />
                </Card.Content>
            </Card>
        </Modal>
        </Portal>
    )
})
export default ClientSingleJob;