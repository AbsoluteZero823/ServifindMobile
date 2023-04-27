import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { View, FlatList, ToastAndroid, Keyboard, RefreshControl, Alert } from 'react-native';
import { Button, Text, Avatar, TextInput, Banner } from 'react-native-paper';
import AuthStore from '../../models/authentication';
import { getChat, fetchMessages, sendMessage, FetchTransactionbyOfferorInquiry, acceptanOffer, refuseanOffer, refuseaPrice, URL } from '../../../services/apiendpoints';
import { format } from 'date-fns';
import Loading from '../../components/loading';
import UserStore from '../../models/user';
import io from 'socket.io-client';

const ClientMessage = observer(({route}) => {
    const { offer_id, receiver, inquiry_id } = route.params;
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);

    const [ChatInfo, setChatInfo] = useState();
    const [ReceiverProfile, setReceiverProfile] = useState();
    const [MessagesCollection, setMessagesCollection] = useState([]);
    const [chatId, setChatId] = useState('');
    const [content, setContent] = useState('');

    const [refreshing, setRefreshing] = useState(false);

    const socket = io(URL);
    
    useEffect(()=>{
        if(chatId){
            socket.emit('setup', UserContext.users[0]);
            socket.on('connected', () => {
                socket.emit('join chat', chatId);
                ToastAndroid.show('Connected', ToastAndroid.SHORT);
            });
        }
    }, [chatId]);

    useEffect(()=>{
        socket.on('message received', () => {
            onRefresh();
        });
        return () => {
            socket.disconnect();
        }
    },[]);

    

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        FetchorCreateChat();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);
    
    useEffect(() => {
        FetchorCreateChat();
        FetchOfferAndTransaction();
    },[])

    async function FetchorCreateChat(){
        try{
            AuthContext.letmeload();
            const chatresponse = await getChat({offerId: offer_id, userId: receiver, inquiryId: inquiry_id});
            if(chatresponse.success){
                if(chatresponse.isChat !== undefined){
                    setReceiverProfile(chatresponse.isChat.users[1]);
                    setChatInfo(chatresponse.isChat);
                    setChatId(chatresponse.isChat._id);
                    const messageresponse = await fetchMessages(chatresponse.isChat._id);
                    if(messageresponse.length > 0){
                        setMessagesCollection(messageresponse);
                    }else{
                        ToastAndroid.show('No Messages', ToastAndroid.SHORT);
                    }
                }else if(chatresponse.FullChat !== undefined){
                    console.log(chatresponse.FullChat);
                }
            }else{
                alert('An Error has Occured');
            }
            AuthContext.donewithload();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }

    async function SendMessage(){
        try{
            Keyboard.dismiss();
            AuthContext.letmeload();
            const sendmessageresponse = await sendMessage({content: content, chatId: chatId});
            if(sendmessageresponse.success){
                socket.emit('new message',sendmessageresponse.message);
                setContent('');
                MessagesCollection.push(sendmessageresponse.message);
                ToastAndroid.show('Message Sent', ToastAndroid.SHORT);
            }else{
                ToastAndroid.show('An Error has Occurred', ToastAndroid.SHORT);
            }
            AuthContext.donewithload();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }

    const [transactiondetails, settransactiondetails] = useState();
    const [bannervisibility, setbannervisibility] = useState(false);

    async function FetchOfferAndTransaction(){
        try{
            AuthContext.letmeload();
            const transactionresponse = await FetchTransactionbyOfferorInquiry({offer_id, inquiry_id});
            if(transactionresponse.success && transactionresponse.transaction.offer_id.offer_status === 'waiting'){
                setbannervisibility(true);
                settransactiondetails(transactionresponse.transaction);
            }
            AuthContext.donewithload();
        }catch(error){
            console.log(error);
        }
    }

    async function refusehandler(){
        AuthContext.letmeload();
        try {
            Alert.alert(
            "Refuse?",
            'Select an Option',
            [
            {text: 'Refuse the Offer', onPress: async () => {
                AuthContext.letmeload();
                const response = await refuseanOffer({offer_id, inquiry_id});
                alert(response.message);
                AuthContext.donewithload();
            }},
            {text: 'Refuse the Price', onPress: async () => {
                AuthContext.letmeload();
                const response = await refuseaPrice({offer_id, inquiry_id});
                alert(response.message);
                AuthContext.donewithload();
            }},
            {text: 'Cancel', onPress: () => {
                // do nothing
            }}
            ]
            );
        } catch (error) {
        AuthContext.donewithload();
        console.log(error);
        }
        AuthContext.donewithload();
    }

    async function accepthandler(){
        AuthContext.letmeload();
        try{
            const response = await acceptanOffer({offer_id, inquiry_id});
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

    const flatListRef = useRef();

    useEffect(()=>{
        console.log(transactiondetails)
    },[])

    return (
        <>
        <Loading/>
        <Banner
            visible={bannervisibility}
            actions={[
                {
                    label: 'Accept',
                    onPress: () => {setbannervisibility(false), accepthandler()},
                },
                {
                    label: 'Refuse',
                    onPress: () => {setbannervisibility(false), refusehandler()},
                },
                {
                    label: 'Hide',
                    onPress: () => setbannervisibility(false),
                },
              ]}
            icon='tag'
            >
            <Text>Freelancer made an Offer with the Price at{`\n`}
            <Text variant='titleSmall' style={{color:'#9c6f6f'}}>₱ {transactiondetails?.price}</Text>, 
            {`\n`}with an Expected Completion Date at{`\n`}
            <Text variant='titleSmall' style={{color:'#9c6f6f'}}>{transactiondetails && format(new Date(transactiondetails?.expected_Date),"MMM, dd, yyyy")}</Text>,
            {`\n`}Would you like to proceed?</Text>
        </Banner>
        {
            !bannervisibility && transactiondetails?.status === 'waiting' &&
            <Banner
            visible={!bannervisibility}
            actions={[
                {
                    label: 'Show',
                    onPress: () => {setbannervisibility(true)},
                },
              ]}
            >
            <Text>Freelancer has an Active Offer</Text>
        </Banner>
        }
        <View style={{flex: 1}}>
            <FlatList
                ref={flatListRef}
                style={{ marginHorizontal: 10 }}
                data={MessagesCollection}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                getItemLayout={(data, index) => (
                    {length: MessagesCollection.length, offset: MessagesCollection.length * index, index}
                )}
                initialScrollIndex={MessagesCollection.length - 1}
                onContentSizeChange={() => {
                    MessagesCollection.length > 0 && flatListRef.current.scrollToIndex({index: MessagesCollection.length - 1 ,animated: true});
                }}
                renderItem={({ item, index }) => {
                    const loggedInUser = UserContext.users[0];
                    const isLastMessage = index === MessagesCollection.length - 1;
                    const isFirstMessage = index === 0 || MessagesCollection[index - 1].sender._id !== item.sender._id;
                    const isLastFromSender = isLastMessage || MessagesCollection[index + 1]?.sender._id !== item.sender._id;
                    const showAvatar = (isLastFromSender && item.sender._id !== loggedInUser._id);
                    const showName = isFirstMessage;
                    const avatarSource = {uri: item.sender.avatar.url};
                    const flexDirection = item.sender._id !== ReceiverProfile._id ? 'row-reverse' : 'row';
                    const textAlign = item.sender._id !== ReceiverProfile._id ? 'right' : 'left';

                    return (
                    <View style={{flexDirection, alignItems: 'center', marginVertical: 4}}>
                        {showAvatar && item.sender._id !== loggedInUser._id && <Avatar.Image source={avatarSource} size={40} />}
                        <View style={{marginLeft: showAvatar ? 12 : 52, maxWidth: '80%'}}>
                            {showName && <Text style={{color: 'dimgrey', marginBottom: 4, textAlign}}>{item.sender.name === UserContext.users[0].name ? 'You' : item.sender.name }</Text>}
                            <Text style={{
                                    backgroundColor: '#9c6f6f',
                                    paddingHorizontal: 20,
                                    paddingVertical: 4,
                                    borderRadius: 20,
                                    color: 'white',
                                    fontWeight: '500',
                                    textAlign,
                                    flexShrink: 1,
                                    fontSize: 16,
                                    }}>
                                {item.content}
                            </Text>
                        </View>
                    </View>
                    );    
            }}/>
            <View style={{width:'100%'}}>
                {
                    MessagesCollection.length === 0 && 
                    <View style={{alignSelf:'center',alignItems:'center', marginVertical: 20}}>
                        {
                            ReceiverProfile && 
                            <Avatar.Image 
                                size={100}
                                source={{uri: ReceiverProfile.avatar.url}}
                                style={{marginVertical:4}}
                                />
                        }
                        <Text variant='titleMedium' style={{marginVertical:4}}>{ReceiverProfile?.name}</Text>
                        <Button 
                            mode='outlined'
                            style={{width:200, marginVertical: 4}}
                            textColor='#9c6f6f'
                            >
                            View Profile
                        </Button>
                        <Text style={{marginVertical:4, color:'dimgrey'}}>{ChatInfo?.createdAt ? format(new Date(ChatInfo?.createdAt), "MMM. dd, yyyy 'AT' hh:mm a", {timeZone: "Asia/Hong_Kong"}) : null}</Text>
                        <Text style={{marginVertical:4, color:'dimgrey'}}>You are now connected</Text>
                    </View>
                }
                <TextInput
                    placeholder="Type your message..."
                    label='Send Message'
                    value={content}
                    onChangeText={(text)=>setContent(text)}
                    multiline
                    numberOfLines={2}
                    right={<TextInput.Icon icon='send-outline' iconColor='#9c6f6f' onPress={()=>SendMessage()}/>}
                />
            </View>
        </View>
        </>
    )
})

export default ClientMessage;