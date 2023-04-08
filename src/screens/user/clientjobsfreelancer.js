import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, FlatList, RefreshControl} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import Loading from '../../components/loading';
import { format } from 'date-fns';

import AuthStore from '../../models/authentication';
import { getFreelancer } from '../../../services/apiendpoints';

const ClientJobsFreelancer = observer(({route}) => {
    const AuthContext = useContext(AuthStore);
    const [servicescollection, setservicescollection] = useState([]);
    const [freelancerinfo, setfreelancerinfo] = useState({});

    /**
    * function to get freelancer info and service list from Freelancer
    */
    async function getfreelancer(){
        AuthContext.letmeload();
        try{
            const freelancerresponse = await getFreelancer(route.params.freelancer_id);
            // This method is called when the server is successful.
            if (freelancerresponse.success) {
                setfreelancerinfo(freelancerresponse.freelancer);
                setservicescollection(freelancerresponse.services);
            }else{
                alert(freelancerresponse.message);
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }

    useEffect(()=>{
        getfreelancer();
    },[])

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getfreelancer();
        setTimeout(() => {
        setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <>
        <Loading/>
        <View style={{margin:10}}>
            {
            freelancerinfo !== undefined &&
            <Card style={{borderColor:'deeppink', borderWidth: 1}}>
                <Card.Title 
                    title={freelancerinfo?.user_id?.name || ''} 
                    subtitle={freelancerinfo?.user_id?.gender || ''}
                    subtitleStyle={{color:'dimgrey'}}
                    
                    left={()=>
                        freelancerinfo?.user_id?.avatar?.url ? <Avatar.Image size={50} source={{uri: freelancerinfo?.user_id?.avatar?.url}}/> : null
                    }
                    style={{alignContent:'center'}}
                />
                <Card.Content>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginVertical:8}}>
                        <Text style={{color:'deeppink', fontWeight:'bold'}}>Email:</Text>
                        <Text>{freelancerinfo?.user_id?.email}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginVertical:8}}>
                        <Text style={{color:'deeppink', fontWeight:'bold'}}>Contact:</Text>
                        <Text>{freelancerinfo?.user_id?.contact}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginVertical:8}}>
                        <Text style={{color:'deeppink', fontWeight:'bold'}}>Joined At:</Text>
                        <Text>{freelancerinfo?.approved_date !== undefined ? format(new Date(freelancerinfo?.approved_date), "MMM. dd (EEEE), yyyy") : null}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginVertical:8}}>
                        <Text style={{color:'deeppink', fontWeight:'bold'}}>Available:</Text>
                        <Text>{freelancerinfo?.availability ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginVertical:8}}>
                        <Text style={{color:'deeppink', fontWeight:'bold'}}>Resume:</Text>
                        <Text style={{color:'dimgrey'}}>Download</Text>
                    </View>
                    <Text variant='titleLarge'>Services Offered:</Text>
                    {
                        servicescollection &&
                        <FlatList
                            data={servicescollection}
                            horizontal={servicescollection.length > 1 ? true : false} 
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={{alignContent:'center'}}
                            renderItem={({item})=> (
                                <Card style={{margin:5, borderWidth:1, borderColor: 'deeppink', minWidth:250}}>
                                    <Card.Cover source={{uri: item.images.url}} />
                                    <Card.Title 
                                        title={item.title} 
                                        titleStyle={{color:'deeppink'}}
                                        subtitle={item.category.name} 
                                        subtitleStyle={{color:'dimgrey'}}
                                        />
                                    <Card.Content>
                                        <Text style={{color:'deeppink'}}>Experience:</Text>
                                        <Text>{item.experience}</Text>
                                    </Card.Content>
                                </Card>
                            )}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                    }
                    
                </Card.Content>
            </Card>
            }
        </View>
        </>
    )
})

export default ClientJobsFreelancer;
