import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal, Divider} from 'react-native-paper';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

const FreelancerProject = observer(({route}) => {
    const item = route.params;
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();

    const [mainVisible, setmainVisible] = useState(true);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};
    return (
        <Portal>
            <Loading/>
            <Modal visible={mainVisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
                <Card>
                    <Card.Title
                        title={item.request_id.requested_by.name}
                        subtitle={item.request_id.requested_by.contact}
                        subtitleStyle={{color:'dimgrey'}}
                        left={()=><Avatar.Image source={{uri: item.request_id.requested_by.avatar.url}} size={50}/>}
                        />
                    <Card.Content>
                        <View>
                            <Text>REQUEST DETAILS:</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color: 'deeppink'}}>Status: </Text>
                                {
                                    item.transactions?.length > 0 ? 
                                    <Text>{(item.transactions[0].isPaid && item.transactions[0].paymentSent) ? 'Payment Sent' : 'Payment Not Sent'}</Text>
                                    :
                                    <Text>{item.request_id.request_status}</Text>
                                }
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color: 'deeppink'}}>Created At: </Text>
                                <Text>{format(new Date(item.request_id.created_At), 'MMM dd, yyyy')}</Text>
                            </View>
                            <View>
                                <Text style={{color: 'deeppink'}}>Description: </Text>
                                <Text style={{textAlign: 'right'}}>{item.request_id.description}</Text>
                            </View>
                        </View>
                        <Divider style={{marginVertical:8}}/>
                        <View>
                            <Text>SERVICE OFFERRED:</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color: 'deeppink'}}>Name: </Text>
                                <Text>{item.service_id.title}</Text>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color: 'deeppink'}}>Category: </Text>
                                <Text>{item.service_id.category.name}</Text>
                            </View>
                            <View>
                                <Text style={{color: 'deeppink'}}>Experience: </Text>
                                <Text style={{textAlign: 'right'}}>{item.service_id.experience}</Text>
                            </View>
                        </View>
                        {
                            item.transactions?.length > 0 &&
                            <>
                            <Divider style={{marginVertical:8}}/>
                            <View>
                                <Text>PAYMENT DETAILS:</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={{color: 'deeppink'}}>Payment Sent: </Text>
                                    <Text>{item.transactions[0].paymentSent === 'true' ? 'Yes' : 'No'}</Text>
                                </View>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={{color: 'deeppink'}}>Amount: </Text>
                                    <Text>{item.transactions[0].price}</Text>
                                </View>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={{color: 'deeppink'}}>Status: </Text>
                                    <Text>
                                        {
                                            (item.transactions[0]?.transaction_done?.client === 'true' && item.transactions[0]?.transaction_done?.freelancer === 'false') ? 
                                            'Waiting Your Confirmation' 
                                            : 
                                            'Completed'
                                        }
                                    </Text>
                                </View>
                            </View>
                            </>
                        }
                    </Card.Content>
                    <Card.Actions>
                        {
                            item.request_id.request_status !== 'cancelled' &&
                            ((item.transactions[0]?.transaction_done?.client === 'true' && item.transactions[0]?.transaction_done?.freelancer === 'false') ?
                            <Button
                                mode='outlined'
                                textColor='green'
                                onPress={()=>{
                                    console.log("Eyyy");
                                }}
                                >
                                Confirm
                            </Button>
                            :
                            <Button
                                mode='outlined'
                                textColor='deeppink'
                                onPress={()=>{
                                    console.log("Eyyy");
                                }}
                                >
                                Generate Payment Details
                            </Button>)
                        }
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    )
})

export default FreelancerProject;