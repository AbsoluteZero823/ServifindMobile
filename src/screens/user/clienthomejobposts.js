import { observer } from 'mobx-react';
import React, { useContext, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import { IconButton, Menu, Searchbar, Text} from 'react-native-paper';
import { getmyRequests } from '../../../services/apiendpoints';

import UserStore, { User } from '../../models/user';
import RequestStore, { Request } from '../../models/request';
import CategoryStore, { Category } from '../../models/category';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';
import Jobpostcard from '../../components/user/jobpostcard';
import { FAB } from '../../components/user/fab';

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

      

    const [menuactive, setmenuactive] = useState('');
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
      
    return (
        <View style={{marginHorizontal:5, flex:1}}>
            <Loading/>
            <Searchbar
                placeholder="Search..."
                onChangeText={(text) => setsearchquery(text)}
                mode='bar'
                iconColor='deeppink'
                style={{borderColor:'deeppink', borderWidth:1}}
                right={()=>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        style={{marginRight: 20}}
                        anchorPosition='bottom'
                        anchor={
                            <IconButton icon='menu' iconColor='deeppink' onPress={()=>openMenu()}/>
                        }
                        >
                        <Menu.Item onPress={() => setmenuactive('')} title={<Text style={{color: menuactive === '' ? 'deeppink' : 'black'}}>All</Text>} />
                        <Menu.Item onPress={() => setmenuactive('waiting')} title={<Text style={{color: menuactive === 'waiting' ? 'deeppink' : 'black'}}>Waiting</Text>} />
                        <Menu.Item onPress={() => setmenuactive('granted')} title={<Text style={{color: menuactive === 'granted' ? 'deeppink' : 'black'}}>Granted</Text>} />
                        <Menu.Item onPress={() => setmenuactive('cancelled')} title={<Text style={{color: menuactive === 'cancelled' ? 'deeppink' : 'black'}}>Cancelled</Text>} />
                    </Menu>
                }
            />
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={
                    RequestCollection.filter(request => {
                        const hasSearchQuery = request.description.toLowerCase().includes(searchquery.toLowerCase()) || request.category.name.toLowerCase().includes(searchquery.toLowerCase());
                        const hasMenuActive = request.request_status.toLowerCase().includes(menuactive.toLowerCase());
                        return hasSearchQuery && hasMenuActive;
                      }).sort((a, b) => {
                        const statuses = ["waiting", "granted", "cancelled"];
                        return statuses.indexOf(a.request_status) - statuses.indexOf(b.request_status);
                      })
                }
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <Jobpostcard item={item}/>
                )}
            />
            <FAB/>
        </View>
    )
})

export default ClientHomePostings;