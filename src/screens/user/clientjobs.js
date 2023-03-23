
import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { View, FlatList, TouchableOpacity, RefreshControl,} from 'react-native';
import { Card, Text, Avatar} from 'react-native-paper';

import ServiceStore, {ServiceModel} from '../../models/service';
import { Category } from '../../models/category';
import { User } from '../../models/user';
import AuthStore from '../../models/authentication';

import { styles } from '../../components/user/user.css';
import { useEffect } from 'react';
import { getServices } from '../../../services/apiendpoints';
import { useNavigation } from '@react-navigation/native';
import { FAB } from '../../components/user/fab';

const ClientJobs = observer((props) => {
    const navigation = useNavigation();
    const Filterby = props.params.props[4];
    const Filterwith = props.params.props[5];
    const activeCategory = props.params.props[2][0]?.name;
    const ServiceContext = useContext(ServiceStore);
    const AuthContext = useContext(AuthStore);
    const [servicescollection, setservicescollection] = useState();
    const [refreshing, setRefreshing] = useState(false);

    async function getAllServices() {
        AuthContext.letmeload();
        try{
            const servicesresponse = await getServices();
            if(servicesresponse.success){
                ServiceContext.Services = [];
                servicesresponse.services
                .map((service) => {
                    ServiceContext.Services.push(ServiceModel.create({
                        _id: service._id,
                        title: service.title,
                        name: service.name,
                        category: Category.create(service.category),
                        user: User.create(service.user),
                        experience: service.experience,
                        freelancer_id: service.freelancer_id,
                        status: service.status,
                        images: service.images,
                    }))
                })
            }
            setservicescollection(ServiceContext.Services);
            setTimeout(() => {
                AuthContext.donewithload();
            },500);
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

    return (
        <>
        <View style={styles.container}>
            <FlatList
                style={{flex:3, alignSelf:'center'}}
                data={
                    servicescollection?.filter((service) => {
                    const { category, title, user } = service;
                    // check if activeCategory is set and filter by it
                    if (activeCategory) {
                        const filterbycategory = category?.name?.toLowerCase().includes(activeCategory.toLowerCase());
                        return filterbycategory;
                    }
                    // check if title or user name match the search query
                    if (Filterby === 'Services' && Filterwith) {
                      const titleMatch = title?.toLowerCase().includes(Filterwith.toLowerCase());
                      return titleMatch;
                    } else if (Filterby === 'Freelancers' && Filterwith) {
                      const nameMatch = user?.name?.toLowerCase().includes(Filterwith.toLowerCase());
                      return nameMatch;
                    } else {
                      return true;
                    }
                  })
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={()=>navigation.navigate('ClientSingleJob',{item: item})}>
                        <Card key={item._id} style={{marginVertical:10, width: 300}}>
                            <Card.Cover source={{ uri: item.images.url }}/>
                            <Card.Title title={item.title}/>
                            <Card.Content>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Avatar.Image size={40} source={{ uri: item.user.avatar.url }} style={{alignItems:'center'}}/>
                                        <View style={{marginHorizontal:5}}>
                                            <Text>{item.user.name}</Text>
                                            <Text>Something Else</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Avatar.Icon icon='star' size={20} color='green' style={{backgroundColor:'transparent'}}/>
                                        <Text> 3.2 </Text>
                                        <Text style={{color:'dimgrey'}}>(200)</Text>
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