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
import { updatefreelancer, FreelancerFetchTransaction, freelancerstatus } from '../../../services/apiendpoints';
import Infoline from '../../components/infoline';
import { useNavigation } from '@react-navigation/native';

const FreelancerProfile = observer((props) => {
    const FreelancerStore = useContext(FreelancerContext);
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();

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
            }else{
                alert(fetchresponse.message);
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
                    <Avatar.Image size={100} style={{backgroundColor:'#9c6f6f', borderColor:'lightpink'}} source={{uri: UserContext.users[0]?.UserDetails?.avatar?.url}}/>
                </View>
                <Text variant='titleLarge'>{UserContext.users[0]?.UserDetails?.name}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text variant="titleMedium" style={{alignSelf:'center'}}>Available?</Text>
                    <Switch color='#9c6f6f' value={Availability} onValueChange={()=>{toggleavailability()}}/>
                </View>
                {
                    !FreelancerStore.data[0].isPremium && FreelancerStore.data[0].premiumReceipt === undefined &&
                    <Button mode='text' textColor='dimgrey' onPress={()=>{FreelancerStore.data.premiumReceipt === undefined ? navigation.navigate('FreelancerPremium') : alert("You may have a pending premium application. Wait for further updates")}}>
                        Go Premium
                    </Button>
                }
                
            </View>
            <View style={{flex:3, margin:10, justifyContent: 'flex-start'}}>
                <Card style={{marginVertical:10}}>
                    <Card.Title 
                        title='My Transactions'
                        titleStyle={{color:'#9c6f6f', fontWeight:'bold', fontSize:20}}
                        right={()=>transactionlist.length > 0 && <IconButton icon={visibletransaction ? 'chevron-up' : 'chevron-down'} iconColor='#9c6f6f' onPress={()=>setvisibletransaction(!visibletransaction)} style={{marginRight: 8 }}/>}
                        />
                    <Card.Content>
                        {   
                            transactionlist.length > 0 ?
                            (visibletransaction &&
                            transactionlist.map((item, index)=>{
                                return (
                                    <Card key={index} style={{marginVertical:4, borderColor:'#9c6f6f', borderWidth: 1}}>
                                        <Card.Title 
                                        title={(item.offer_id.request_id?.requested_by?.name || item.offer_id.inquiry_id?.customer?.name)} 
                                        subtitle={<Text>{ item.isPaid === 'true' ? 'Paid' : 'Not Yet Paid' }</Text>}
                                        titleStyle={{ color:'#9c6f6f' }}
                                        subtitleStyle={{ color:'dimgrey' }}
                                        left={()=><Avatar.Image size={50} source={{ uri: (item.offer_id.request_id?.requested_by?.avatar.url || item.offer_id.inquiry_id?.customer?.avatar.url)}}/>}
                                        />
                                        
                                        <Card.Content>
                                            <Text style={{color: '#9c6f6f', fontWeight:'bold'}}>PAYMENT DETAILS:</Text>
                                            <Infoline label="Paid:" value={item.paymentSent === 'true' ? 'Yes' : 'No'} />
                                            <Infoline label="Amount:" value={`₱ ${item.price}`} />
                                            <Infoline label="Sent: " value={item.paymentSent === 'true' ? 'Yes' : 'No' }/>
                                            <Infoline label="Received:" value={item.paymentReceived === 'true' ? 'Yes' : 'No' } />
                                            <Infoline label="Client Rated:" value={item.isRated === 'true' ? 'Yes' : 'No' } />
                                            <Infoline label="Status:" value={
                                                item.status === 'processing' && item.transaction_done?.client === 'false' && item.transaction_done?.freelancer === 'false'
                                                ?
                                                'Processing / On-Going'
                                                :
                                                item.status === 'processing' && item.transaction_done?.client === 'true' && item.transaction_done?.freelancer === 'false'
                                                ?
                                                'Waiting for your confirmation'
                                                :
                                                item.status === 'completed' && 'Completed'
                                                } />
                                            <Infoline label="Date Generated:" value={format(new Date(item.created_At), 'MMM dd, yyyy')} />
                                        </Card.Content>
                                    </Card>
                                )
                            }))
                            :
                            <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: '100%', marginBottom:20}}>
                                <IconButton icon='view-grid-plus' size={30} iconColor='#9c6f6f'/>
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