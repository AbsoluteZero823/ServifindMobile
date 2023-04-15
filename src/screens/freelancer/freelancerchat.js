import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Avatar, Searchbar, IconButton } from 'react-native-paper';
import AuthStore from '../../models/authentication';
import { useNavigation } from '@react-navigation/native';
import { fetchChats } from '../../../services/apiendpoints';
import UserStore from '../../models/user';

const FreelancerChat = observer(() => {
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();
    const [ChatsCollection, setChatsCollection] = useState([]);
    const [search, setSearch] = useState('');

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
        setRefreshing(false);
        }, 2000);
    }, []);

    async function fetchmyChats(){
        AuthContext.letmeload();
        try{
            const fetchmychatsresponse = await fetchChats();
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
                iconColor='deeppink'
                traileringIconColor='deeppink'
                style={{borderWidth:2, borderColor:'dimgrey'}}
            />
            <FlatList
            data={
            ChatsCollection.filter((chat)=>{
                if (chat.chatName.toLowerCase().includes(search.toLowerCase())){
                    if (!chat.offer_id && !chat.inquiry_id) {
                        return false;
                    }
                    if (chat.inquiry_id && chat.users[1]._id === UserContext.users[0]._id) {
                        return true;
                    }
                    if (chat.offer_id && chat.users[1]._id === UserContext.users[0]._id) {
                        return true;
                    }
                }
            })}
            keyExtractor={(item) => item._id}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (
                <TouchableOpacity onPress={()=>navigation.navigate('FreelancerMessage',{
                    offer_id: item.offer_id,
                    receiver: item.users[1]._id,
                    inquiry_id: item.inquiry_id
                    })}>
                    <View style={{flexDirection:'row', marginHorizontal: 4, marginVertical: 8}}>
                        <Avatar.Image source={{uri:  item.latestMessage.sender.avatar.url}} size={60}/>
                        <View style={{marginHorizontal: 4, alignSelf: 'center'}}>
                            <Text variant='titleMedium' style={{color:'deeppink'}}>{item.chatName}</Text>
                            {
                                item.latestMessage.sender._id === item.users[1]._id &&
                                <Text style={{color:'dimgrey'}}>You: {item.latestMessage.content}</Text>
                            }
                            {
                                item.latestMessage.sender._id === item.users[0]._id &&
                                <Text style={{color:'dimgrey'}}>{item.latestMessage.sender.name}: {item.latestMessage.content}</Text>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
                <View style={{alignSelf:'center', backgroundColor:'white', padding:20, marginVertical:20, borderRadius:20}}>
                    <IconButton icon='chat-processing-outline' iconColor='deeppink' size={60} style={{alignSelf:'center'}}/>
                    <Text style={{textAlign:'center', color:'black', fontWeight:'bold'}}>Once you connect with a freelancer{`\n`}your messages will appear here{`\n\n`}To get started{`\n`}<Text style={{color:'deeppink'}}>Search for Freelancers</Text>{`\n`}or{`\n`}<Text style={{color:'deeppink'}}>Post a Job</Text></Text>
                </View>
            )}
            />
        </View>
    )
})

export default FreelancerChat;