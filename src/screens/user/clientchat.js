import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground, FlatList} from 'react-native';
import { Button, Card, Text, Avatar, Searchbar, IconButton} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';

const ClientChat = observer(() => {
    const [search, setSearch] = useState('');
    return (
        <View style={styles.container}>
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

export default ClientChat;