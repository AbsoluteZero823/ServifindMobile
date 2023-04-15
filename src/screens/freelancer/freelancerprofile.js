import React, { useContext, useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { observer } from 'mobx-react';
import { View, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import { Button, Card, Text, Avatar, Divider, TextInput, RadioButton, HelperText, Switch, SegmentedButtons, IconButton} from 'react-native-paper';
import { styles  } from '../../components/user/user.css';
import Loading from '../../components/loading';
import { format } from 'date-fns';

import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import FreelancerContext from '../../models/freelancer';
import { updatefreelancer, FreelancerFetchTransaction } from '../../../services/apiendpoints';

const FreelancerProfile = observer((props) => {
    const FreelancerStore = useContext(FreelancerContext);
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);

    const [Availability, setAvailability] = useState(FreelancerStore.data[0].availability);

    async function toggleavailability(){
        try{
            AuthContext.letmeload();
            setAvailability(!Availability);
            const response = await updatefreelancer({availability: !Availability});
            if(response.success){
                alert(response.message);
            }else{
                alert("An Error has occured");
            }
            AuthContext.donewithload();
        }catch(error){
            console.log(error);
        }
    }
    const [transactionlist, settransactionlist] = useState([]);
    async function fetchtransaction(){
        AuthContext.letmeload();
        try{
            const fetchresponse = await FreelancerFetchTransaction();
            if(fetchresponse.success){
                settransactionlist(fetchresponse.transactions);
                console.log(transactionlist);
            }else{
                alert(fetchresponse.message)
            }
            AuthContext.donewithload();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }

    const [visibletransaction, setvisibletransaction] = useState(false);

    useEffect(()=>{
        fetchtransaction();
    },[])

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Loading/>
            <View style={{flex:1, alignItems:'center', alignSelf:'center'}}>
                <View style={{flexDirection:'row', marginBottom:10}}>
                    <Avatar.Image size={100} style={{backgroundColor:'deeppink', borderColor:'lightpink'}} source={{uri: UserContext.users[0]?.UserDetails?.avatar?.url}}/>
                </View>
                <Text variant='titleLarge'>{UserContext.users[0]?.UserDetails?.name}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text variant="titleMedium" style={{alignSelf:'center'}}>Available?</Text>
                    <Switch color='deeppink' value={Availability} onValueChange={()=>{toggleavailability()}}/>
                </View>
                
            </View>
            <View style={{flex:3, margin:10, justifyContent: 'flex-start'}}>
                <Card style={{marginVertical:10}}>
                    <Card.Title 
                        title='My Transactions'
                        titleStyle={{color:'deeppink', fontWeight:'bold', fontSize:20}}
                        right={()=>transactionlist.length > 0 && <IconButton icon={visibletransaction ? 'chevron-up' : 'chevron-down'} iconColor='deeppink' onPress={()=>setvisibletransaction(!visibletransaction)} style={{marginRight: 8 }}/>}
                        />
                    <Card.Content>
                        {   
                            transactionlist.length > 0 ?
                            (visibletransaction &&
                            transactionlist.map((item, index)=>{
                                return (
                                    <Card key={index} style={{marginVertical:4, borderColor:'deeppink', borderWidth: 1}}>
                                        <Card.Title 
                                            title={item.offer_id.request_id.requested_by.name} 
                                            subtitle={<Text>{ item.isPaid === 'true' ? 'Paid' : 'Not Yet Paid' }</Text>}
                                            titleStyle={{ color:'deeppink' }}
                                            subtitleStyle={{ color:'dimgrey' }}
                                            left={()=><Avatar.Image size={50} source={{ uri: item.offer_id.request_id.requested_by.avatar.url }}/>}
                                            
                                        />
                                        <Card.Content>
                                            <Text style={{color:'deeppink', fontWeight:'bold'}}>Payment Details:</Text>
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text>Price:</Text>
                                                <Text>{item.price}</Text>
                                            </View>
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text>Sent:</Text>
                                                <Text>{item.paymentSent === 'true' ? 'Sent' : 'No' }</Text>
                                            </View>
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text>Received:</Text>
                                                <Text>{item.paymentReceived === 'true' ? 'Sent' : 'No' }</Text>
                                            </View>
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text>Client Rated:</Text>
                                                <Text>{item.isRated === 'true' ? 'Sent' : 'No' }</Text>
                                            </View>
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text>Status:</Text>
                                                <Text>{item.status}</Text>
                                            </View>
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text>Date Generated:</Text>
                                                <Text>{format(new Date(item.created_At), 'MMM dd, yyyy')}</Text>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                )
                            }))
                            :
                            <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: '100%', marginBottom:20}}>
                                <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                                <Text variant='titleMedium'>No Transactions Yet or Hidden</Text>
                                <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Post a Service on the marketplace and let a client come to you</Text>
                            </SafeAreaView>
                        }
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    )
})

export default FreelancerProfile;