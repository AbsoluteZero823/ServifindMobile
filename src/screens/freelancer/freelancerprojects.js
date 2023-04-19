import { observer } from 'mobx-react';
import React, { useContext, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, Card, Text, Avatar, Searchbar, Menu, IconButton} from 'react-native-paper';
import { styles } from '../../components/user/user.css';
import { useNavigation } from '@react-navigation/native';


import { myOffers } from '../../../services/apiendpoints';
import AuthStore from '../../models/authentication';
import OfferStore from '../../models/offer';
import Infoline from '../../components/infoline';
import Loading from '../../components/loading';

const FreelancerProjects = observer(() => {
    const navigation = useNavigation();
    const OfferContext = useContext(OfferStore);
    const AuthContext = useContext(AuthStore);

    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [searchquery, setsearchquery] = useState();
    const [statusquery, setstatusquery] = useState(null);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getmyOffers();
        setTimeout(() => {
        setRefreshing(false);
        }, 2000);
    }, []);

    async function getmyOffers(){
        AuthContext.letmeload();
        try{
            const response = await myOffers();
            if(response.success){
                OfferContext.offers = [];
                console.log(response.myoffers);
                response.myoffers.map((offer)=>{
                    OfferContext.offers.push(offer);
                })
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }
    
    return (
        <>
        <Loading/>
        <View style={styles.container}>
            <Searchbar
                placeholder="Search...."
                iconColor='deeppink'
                style={{borderColor:'deeppink', borderWidth: 1}}
                onChangeText={(text) => setsearchquery(text)}
                right={()=>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<IconButton icon='menu' iconColor='deeppink' onPress={openMenu}/>}
                        anchorPosition='bottom'
                        >
                        <Menu.Item onPress={() => setstatusquery(null)} title="All" titleStyle={statusquery === null && {color:'deeppink'}}/>
                        <Menu.Item onPress={() => setstatusquery('granted')} title="Granted" titleStyle={statusquery === 'granted' && {color:'deeppink'}}/>
                        <Menu.Item onPress={() => setstatusquery('waiting')} title="Waiting" titleStyle={statusquery === 'waiting' && {color:'deeppink'}}/>
                        <Menu.Item onPress={() => setstatusquery('cancelled')} title="Cancelled" titleStyle={statusquery === 'cancelled' && {color:'deeppink'}}/>
                    </Menu>
                }
                />
            <FlatList
                data={
                    OfferContext.offers?.filter((offer) => {
                    if (statusquery && offer.offer_status.toLowerCase() !== statusquery.toLowerCase()) {
                        // if statusquery is not empty and offer.offer_status does not match, return false
                        return false;
                    }
                    if (searchquery) {
                        return (
                            offer.request_id.requested_by.name.toLowerCase().includes(searchquery?.toLowerCase()) ||
                            offer.request_id.description.toLowerCase().includes(searchquery?.toLowerCase()) ||
                            offer.service_id.category.name.toLowerCase().includes(searchquery?.toLowerCase()) ||
                            offer.service_id.title.toLowerCase().includes(searchquery?.toLowerCase()) ||
                            offer.description.toLowerCase().includes(searchquery?.toLowerCase())
                        );
                    } else {
                        return true;
                    }
                })
                .sort((a, b) => {
                    const order = {
                      granted: 0,
                      waiting: 1,
                      cancelled: 2
                    };
                    const statusA = a.offer_status.toLowerCase();
                    const statusB = b.offer_status.toLowerCase();
                
                    if (statusA === statusB) {
                      return 0;
                    } else if (order[statusA] < order[statusB]) {
                      return -1;
                    } else {
                      return 1;
                    }
                  })
                }
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => 
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('FreelancerProject', item);
                    }}>
                    {
                        item.request_id ? 
                        <Card key={item._id} style={{minWidth:300, maxWidth:350, marginVertical:2, borderColor: item.offer_status === 'waiting' ? 'deeppink' : item.offer_status === 'granted' ? 'green' : 'black', borderWidth: 1}}>
                            <Card.Title 
                                title={item.request_id.requested_by.name} 
                                subtitle={
                                    <Text style={{
                                        color: item.offer_status === 'waiting' ? 'deeppink' : item.offer_status === 'granted' ? 'green' : 'red'
                                    }}>
                                        {
                                        item.offer_status === 'granted' && item.transactions[0]?.status !== 'completed' ? 
                                        item.offer_status
                                        :
                                        item.transactions[0]?.status === 'completed' ? 
                                        'Completed'
                                        :
                                        item.offer_status
                                        }
                                    </Text>}
                                left={()=><Avatar.Image size={40} source={{uri: item.request_id.requested_by.avatar.url}}/>}
                                />
                            <Card.Content>
                                <Infoline label="Requested:" value={item.request_id.description} />
                                <Infoline label="Category:" value={item.service_id.category.name} />
                                <Infoline label="Service:" value={item.service_id.title} />
                                <Infoline label="Price:" value={`₱ ${item.transactions[0]?.price || 'Not Set'}`} />
                                <Infoline label="Paid:" value={item.transactions.length > 0 ? (
                                        item.transactions[0].isPaid === 'true' && item.transactions[0].paymentSent === 'true' ? (
                                        'Yes'
                                        ) : (
                                        'Not Yet'
                                        )
                                    ) : (
                                        'No Payment Generated'
                                    )} />
                            </Card.Content>
                        </Card>
                        :
                        <Card key={item._id} style={{minWidth:300, maxWidth:350, marginVertical:2, borderColor: item.offer_status === 'waiting' ? 'deeppink' : item.offer_status === 'granted' ? 'green' : 'black', borderWidth: 1}}>
                            <Card.Title 
                                title={item.inquiry_id.customer.name} 
                                subtitle={<Text style={{color: item.offer_status === 'waiting' ? 'deeppink' : item.offer_status === 'granted' ? 'green' : 'red'}}>{item.offer_status}</Text>}
                                left={()=><Avatar.Image size={40} source={{uri: item.inquiry_id.customer.avatar.url}}/>}
                                />
                            <Card.Content>
                                <Infoline label="Inquiry:" value={item.inquiry_id.instruction} />
                                <Infoline label="Category:" value={item.service_id.category.name} />
                                <Infoline label="Service:" value={item.service_id.title} />
                                <Infoline label="Price:" value={`₱ ${item.transactions[0]?.price || 'Not Set'}`} />
                                <Infoline label="Paid:" value={item.transactions.length > 0 ? (
                                item.transactions[0].isPaid === 'true' && item.transactions[0].paymentSent === 'true' ? (
                                'Yes'
                                ) : (
                                'Not Yet'
                                )
                                ) : (
                                'No Payment Generated'
                                )} />
                            </Card.Content>
                        </Card>
                    }
                    </TouchableOpacity>

                }
                ListEmptyComponent={
                    <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: 300, marginBottom:20}}>
                        <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                        <Text variant='titleMedium'>No Projects Yet</Text>
                        <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Accept a Job Request on the marketplace and start earning</Text>
                        <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:200}} onPress={()=>(console.log("Redirect Me!"))}>Accept a Request</Button>
                    </SafeAreaView>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
        </>
    )
})

export default FreelancerProjects;