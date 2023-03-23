import { observer } from 'mobx-react';
import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, FlatList, RefreshControl} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Text, Avatar, Portal, Modal, IconButton, TextInput, Menu, List, Searchbar} from 'react-native-paper';
import { getmyRequests } from '../../../services/apiendpoints';

import UserStore, { User } from '../../models/user';
import RequestStore, { Request } from '../../models/request';
import CategoryStore, { Category } from '../../models/category';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';
import Jobpostcard from '../../components/user/jobpostcard';

const ClientHomePostings = observer(() => {
    const AuthContext = useContext(AuthStore);
    const RequestContext = useContext(RequestStore);
    const [RequestCollection, setRequestCollection] = useState(RequestContext.requests);

    const [searchquery, setsearchquery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        AuthContext.letmeload();
        setRefreshing(true);
        const requestCollection = await getmyRequests();
          RequestContext.requests = [];
          if(requestCollection.success){
           requestCollection.requests?.map((request) => {
             RequestContext.requests.push(Request.create({
              _id: request._id,
              category: Category.create(request.category),
              description: request.description,
              created_At: new Date(request.created_At),
              request_status: request.request_status,
              requested_by: User.create(request.requested_by),
            }));
           })
          };
          setRequestCollection(RequestContext.requests);
        setTimeout(() => {
            AuthContext.donewithload();
            setRefreshing(false);
        }, 500);
      }, []);
      
    return (
        <View style={{marginHorizontal:5, flex:1}}>
            <Loading/>
            <Searchbar
                placeholder="Search..."
                onChangeText={(text) => setsearchquery(text)}
                mode='bar'
                style={{borderColor:'deeppink', borderWidth:1}}
            />
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={RequestCollection.filter(request => request.description.toLowerCase().includes(searchquery.toLowerCase()))}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <Jobpostcard item={item}/>
                )}
            />
        </View>
    )
})

export default ClientHomePostings;