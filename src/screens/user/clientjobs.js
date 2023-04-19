
import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { View, FlatList, TouchableOpacity, RefreshControl,} from 'react-native';
import { Card, Text, Avatar} from 'react-native-paper';

import ServiceStore, {ServiceModel} from '../../models/service';
import { Category } from '../../models/category';
import { User } from '../../models/user';
import AuthStore from '../../models/authentication';
import UserStore from '../../models/user';

import { styles } from '../../components/user/user.css';
import { useEffect } from 'react';
import { getServices } from '../../../services/apiendpoints';
import { useNavigation } from '@react-navigation/native';
import { FAB } from '../../components/user/fab';
import { Freelancer } from '../../models/freelancer';

const ClientJobs = observer((props) => {
    const navigation = useNavigation();
    const Filterby = props.params.props[4];
    const Filterwith = props.params.props[5];
    const activeCategory = props.params.props[2][0]?.name;
    const ServiceContext = useContext(ServiceStore);
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const [servicescollection, setservicescollection] = useState();
    const [refreshing, setRefreshing] = useState(false);

    /**
    * get all services and store in ServiceContext. services for use in next page
    */
    async function getAllServices() {
        AuthContext.letmeload();
        try{
            const servicesresponse = await getServices();
            // This method is called when the services response is successful.
            if(servicesresponse.success){
                ServiceContext.services = [];
                servicesresponse.services.map((service) => {
                    // Add a service to the services list
                    if (service.user._id !== UserContext.users[0]._id) {
                        ServiceContext.services.push(service)
                    }
                })
            }
            setservicescollection(ServiceContext.services);
            setTimeout(() => {
                AuthContext.donewithload();
            },200);
        }catch(error){
            console.error(error);
            AuthContext.donewithload();
        }
    }

    useEffect(() => {
        getAllServices();
    },[])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getAllServices();
            setRefreshing(false);
        }, 500);
      }, []);

    useEffect(() => {
        setservicescollection(ServiceContext.services.filter((service) => {
        const { title, user } = service;
        // check if title or user name match the search query
        // Returns true if the filterby is services or Freelancers
        if (Filterby === 'Services' && Filterwith) {
            const titleMatch = title?.toLowerCase().includes(Filterwith.toLowerCase());
            return titleMatch;
        // Returns true if the user is a user name or user name
        } else if (Filterby === 'Freelancers' && Filterwith) {
            const nameMatch = user?.name?.toLowerCase().includes(Filterwith.toLowerCase());
            return nameMatch;
        }else{
            return true;
        }
        }))
    },[Filterwith, Filterby])

    return (
        <>
        <View style={styles.container}>
            <FlatList
                style={{flex:3, alignSelf:'center'}}
                data={
                  servicescollection?.filter((service) => {
                    const { category } = service;
                    // check if activeCategory is set and filter by it
                    if (activeCategory) {
                        const filterbycategory = category?.name?.toLowerCase().includes(activeCategory.toLowerCase());
                        return filterbycategory;
                    }else{
                        return true;
                    }})
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={()=>navigation.navigate('ClientSingleJob',{item: item})}>
                        <Card key={item._id} style={{marginVertical:10, width: 300}}>
                            <Card.Cover source={{ uri: (item.images?.url || item.image) }}/>
                            <Card.Title title={(item.title || item.name)}/>
                            <Card.Content>
                            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
                                <View style={{flexDirection:'row'}}>
                                    <Avatar.Image size={40} source={{ uri: item.user.avatar.url }} style={{alignItems:'center'}}/>
                                    <View style={{marginHorizontal:5}}>
                                        <Text>{item.user.name}</Text>
                                        <Text style={{color:'deeppink'}}>{item.freelancer_id.availability ? 'Available' : 'Not Available'}</Text>
                                    </View>
                                </View>
                                <View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Avatar.Icon icon='star' size={20} color='green' style={{backgroundColor:'transparent'}}/>
                                        <Text>{item.avgRating !== null ? item.avgRating : '0'} / 5</Text>
                                        <Text style={{color:'dimgrey'}}>({item.ratings !== undefined ? item.ratings.length : '0'})</Text>
                                    </View>
                                </View>
                            </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <Card style={{minWidth: 250, maxWidth:300, justifyContent:'center', alignSelf:'center'}}>
                        <Card.Title title="No Services Available" titleStyle={{alignSelf:'center', color:'deeppink'}}/>
                    </Card>
                )}    
            />
            <FAB/>
        </View>
        </>
    )
})

export default ClientJobs;