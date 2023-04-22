import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { View, FlatList, ToastAndroid, Keyboard, RefreshControl } from 'react-native';
import { Button, Text, Avatar, TextInput, Banner } from 'react-native-paper';
import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import { getChat, fetchMessages, sendMessage, FetchTransactionbyOfferorInquiry, URL } from '../../../services/apiendpoints';
import { format } from 'date-fns';
import Loading from '../../components/loading';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';

const FreelancerMessage = observer(({route}) => {

    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();

    const [ChatInfo, setChatInfo] = useState();
    const [ReceiverProfile, setReceiverProfile] = useState();
    const [MessagesCollection, setMessagesCollection] = useState([]);
    const [chatId, setChatId] = useState('');
    const [content, setContent] = useState('');

    const socket = io(URL);
    
    useEffect(()=>{
        if(chatId){
            socket.emit('setup', UserContext.users[0]);
            socket.on('connected', async() => {
                socket.emit('join chat', chatId);
                ToastAndroid.show('Connected', ToastAndroid.SHORT);
            });
        }
    }, [chatId]);

    useEffect(()=>{
        socket.on('message received', () => {
            FetchorCreateChat();
        });
        return () => {
            socket.disconnect();
        };
    },[])

    

    const { offer_id, receiver, inquiry_id } = route.params;

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        FetchorCreateChat();
        FetchOfferAndTransaction();
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
                    setReceiverProfile(chatresponse.isChat.users[0]);
                    setChatInfo(chatresponse.isChat);
                    setChatId(chatresponse.isChat._id);
                    const messageresponse = await fetchMessages(chatresponse.isChat._id);
                    if(messageresponse.length > 0){
                        setMessagesCollection(messageresponse);
                    }else{
                        alert("An Error has Occured");
                    }
                }else if(chatresponse.FullChat !== undefined){
                    console.log("Empty for now!");
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
                setContent('');
                socket.emit('new message',sendmessageresponse.message);
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

    const [completedtransaction, setcompletedtransaction] = useState(false);
    const [bannermainvisibility, setbannermainvisibility] = useState(false);
    const [existingtransaction, setexistingtransaction] = useState(false);
    const [existingtransactionbanner, setexistingtransactionbanner] = useState(false);
    const [transactiondetails, settransactiondetails] = useState({});
    const [actionsarray, setactionsarray] = useState([]);
    
    
    async function FetchOfferAndTransaction(){
        try{
            AuthContext.letmeload();
            const transactionresponse = await FetchTransactionbyOfferorInquiry({offer_id, inquiry_id});
            if(transactionresponse.success){
                if(transactionresponse.transaction.status === 'completed'){
                    setbannermainvisibility(true);
                    setcompletedtransaction(true);
                }else{
                    settransactiondetails(transactionresponse.transaction)
                    if (transactionresponse.transaction.offer_id?.offer_status === 'processing') {
                        setactionsarray([
                            {
                            label: 'Hide',
                            onPress: () => setexistingtransactionbanner(false),
                            },
                        ])
                    } else if (transactionresponse.transaction.offer_id?.offer_status === 'cancelled') {
                        setactionsarray([
                            {
                            label: 'Edit',
                            onPress: () => navigation.navigate('FreelancerMessageTransactionOffer', { offer_id, inquiry_id, transactiondetails }),
                            },
                            {
                            label: 'Hide',
                            onPress: () => setexistingtransactionbanner(false),
                            },
                        ])
                    }
                    setexistingtransaction(true);
                    setexistingtransactionbanner(true);
                }
            }
            AuthContext.donewithload();
        }catch(error){
            console.log(error);
        }
    }

    const flatListRef = useRef(null);

    return (
        <>
        <Loading/>
        <View style={{flex: 1}}>
        <Banner
            visible={existingtransactionbanner}
            actions={
                actionsarray
            }
            icon='archive'
            >
            Your Offer of <Text style={{color:'deeppink'}}>₱ {transactiondetails.price}</Text> <Text>{transactiondetails.offer_id?.offer_status === 'granted' ? 'has been Accepted by the Client' : `is currently ${transactiondetails.offer_id?.offer_status}`}</Text>
        </Banner>

        <Banner
            visible={bannermainvisibility}
            actions={[
                {
                  label: 'Yes',
                  onPress: () => {setbannermainvisibility(false), console.log('Archived')},
                },
                {
                  label: 'No',
                  onPress: () => setbannermainvisibility(false),
                },
              ]}
            icon='archive'
            >
            This Transaction is already completed. Archive?
        </Banner>

        <FlatList
            ref={flatListRef}
            style={{ marginHorizontal: 8 }}
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
            renderItem={({item, index}) => {
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
                    <View style={{marginLeft: showAvatar ? 12 : 52}}>
                    {showName && <Text style={{color: 'dimgrey', marginBottom: 4, textAlign}}>{item.sender.name}</Text>}
                    <Text style={{backgroundColor: 'salmon', paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20, color: 'white', fontWeight: '500', textAlign, flexShrink: 1}}>
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
                            textColor='deeppink'
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
                    editable={!completedtransaction}
                    numberOfLines={2}
                    right={
                        content.length === 0 && inquiry_id !== undefined && !existingtransaction ?
                        <TextInput.Icon icon='ticket-outline' iconColor='deeppink' onPress={()=>navigation.navigate('FreelancerMessageTransactionOffer', {offer_id, inquiry_id})}/>
                        :
                        content.length === 0 && offer_id !== undefined && !existingtransaction ?
                        <TextInput.Icon icon='tag' iconColor='deeppink' onPress={()=>{}}/>
                        :
                        <TextInput.Icon icon='send-outline' iconColor='deeppink' onPress={()=>SendMessage()}/>
                    }
                />
            </View>
        </View>
        </>
    )
})

export default FreelancerMessage;