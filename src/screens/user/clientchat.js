import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, Card, Text, Avatar, Searchbar, IconButton } from 'react-native-paper';
import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import { useNavigation } from '@react-navigation/native';
import { fetchChats } from '../../../services/apiendpoints';


const ClientChat = observer(() => {
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();
    const [ChatsCollection, setChatsCollection] = useState([]);
    const [search, setSearch] = useState('');

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchmyChats();
        setTimeout(() => {
        setRefreshing(false);
        }, 2000);
    }, []);

    async function fetchmyChats(){
        AuthContext.letmeload();
        try{
            const fetchmychatsresponse = await fetchChats();
            console.log(fetchmychatsresponse.chats[0])
            if(fetchmychatsresponse.success){
                setChatsCollection(fetchmychatsresponse.chats);
            }else{
                alert("An Error has Occured");
            }
            AuthContext.donewithload();
        }catch(error){
            AuthContext.donewithload();
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchmyChats();
    },[]);

    return (
        <View style={{marginHorizontal: 4}}>
            <Searchbar
                value={search}
                onChangeText={(text) => setSearch(text)}
                mode='bar'
                placeholder='Search...'
                iconColor='#9c6f6f'
                traileringIconColor='#9c6f6f'
                style={{borderWidth:2, borderColor:'dimgrey'}}
            />
            <FlatList
            data={ ChatsCollection.filter((chat)=>{
                if (chat.chatName.toLowerCase().includes(search.toLowerCase())){
                    if (chat.inquiry_id && chat.users[0]._id === UserContext.users[0]._id) {
                        return true;
                    }
                    if (chat.offer_id && chat.users[0]._id === UserContext.users[0]._id) {
                        return true;
                    }
                }
            })}
            keyExtractor={(item) => item._id}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (
                <TouchableOpacity onPress={()=>navigation.navigate('ClientMessage',{
                    offer_id: item.offer_id,
                    receiver: item.users[1]._id,
                    inquiry_id: item.inquiry_id
                    })}>
                    <View style={{flexDirection:'row', marginHorizontal: 4, marginVertical: 8}}>
                        <Avatar.Image source={{uri: item.users[1].avatar.url}} size={60}/>
                        <View style={{marginHorizontal: 4, alignSelf: 'center'}}>
                            <Text variant='titleMedium' style={{color:'#9c6f6f'}}>{item.chatName}</Text>
                            {
                                item.latestMessage ?
                                    item.latestMessage.sender?._id === item.users[0]._id ?
                                    <Text style={{color:'dimgrey'}}>You: {item.latestMessage.content}</Text>
                                    :
                                    item.latestMessage.sender._id === item.users[1]._id &&
                                    <Text style={{color:'dimgrey'}}>{item.latestMessage.sender.name}: {item.latestMessage.content}</Text>
                                :
                                <Text style={{color:'dimgrey'}}>Start Chatting Now</Text>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
                <View style={{alignSelf:'center', backgroundColor:'white', padding:20, marginVertical:20, borderRadius:20}}>
                    <IconButton icon='chat-processing-outline' iconColor='#9c6f6f' size={60} style={{alignSelf:'center'}}/>
                    <Text style={{textAlign:'center', color:'black', fontWeight:'bold'}}>Once you connect with a freelancer{`\n`}your messages will appear here{`\n\n`}To get started{`\n`}<Text style={{color:'#9c6f6f'}}>Search for Freelancers</Text>{`\n`}or{`\n`}<Text style={{color:'#9c6f6f'}}>Post a Job</Text></Text>
                </View>
            )}
            />
        </View>
    )
})

export default ClientChat;