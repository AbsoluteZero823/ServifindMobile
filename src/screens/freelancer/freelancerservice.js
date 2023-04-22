import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, FlatList} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal} from 'react-native-paper';
import Loading from '../../components/loading';
import AuthStore from '../../models/authentication';
import { useNavigation } from '@react-navigation/native';

import { getmyServiceRatings } from '../../../services/apiendpoints';

const FreelancerService = observer(({route}) => {
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();
    const [serviceratings, setServiceRatings] = useState([]);


    const [mainVisible, setmainVisible] = useState(true);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};

    async function fetchRatings(){
        AuthContext.letmeload();
        try{
            const ratingsresponse = await getmyServiceRatings(route.params);
            if (ratingsresponse.success){
                AuthContext.donewithload();
                setServiceRatings(ratingsresponse.ratings);
            }else{
                AuthContext.donewithload();
                alert(ratingsresponse.message);
            }
        }catch(error){
            AuthContext.donewithload();
            return error.response.data;
        }
    }
    useEffect(()=>{
        fetchRatings();
    },[])
    return (
        <Portal>
            <Loading/>
            <Modal visible={mainVisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
                <Card>
                    <Card.Title title="Service Reviews"/>
                    <Card.Content>
                        <FlatList
                            data={serviceratings}
                            horizontal={serviceratings.length > 1 ? true : false}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item})=>
                                <Card key={item._id} style={{borderWidth:1, borderColor: '#9c6f6f', minWidth: 250, maxWidth: 300}}>
                                    <Card.Title 
                                        title={item.user.name} 
                                        subtitle={item.user.email}
                                        subtitleStyle={{color: 'dimgrey', fontSize: 12}}
                                        left={()=><Avatar.Image source={{uri: item.user.avatar.url}} size={50}/>}
                                        />
                                    <Card.Content>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{color:'#9c6f6f'}}>Rating:</Text>
                                            <Text>{item.rating}</Text>
                                        </View>
                                        <Text style={{color:'#9c6f6f'}}>Review:</Text>
                                        <Text style={{textAlign:'right'}}>{item.comment}</Text>
                                        
                                    </Card.Content>
                                </Card>
                            }
                            ListEmptyComponent={()=>
                                <Text style={{textAlign:'center', color:'#9c6f6f', fontWeight:'bold'}}>No Reviews Yet</Text>
                            }
                        />
                    </Card.Content>
                </Card>
            </Modal>
        </Portal>
    )
})

export default FreelancerService;