import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Alert, ToastAndroid} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal, Divider, IconButton, TextInput} from 'react-native-paper';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { generateTransaction, completeTransaction, reportTransaction } from '../../../services/apiendpoints';

const FreelancerProject = observer(({route}) => {
    const item = route.params;
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();

    const [mainVisible, setmainVisible] = useState(true);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};
    const [modalstate, setmodalstate] = useState('default');


    async function completeHandler(){
        AuthContext.letmeload();
        try{
            const completeResponse = await completeTransaction({
                _id: item.transactions[0]?._id
            })
            if (completeResponse.success){
                AuthContext.donewithload();
                hideModal();
                ToastAndroid.show(completeResponse.message, ToastAndroid.SHORT);
            }else{
                AuthContext.donewithload();
                alert(completeResponse.message);
            }
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }

    const [generatePrice, setgeneratePrice] = useState(false);
    async function generateHandler(){
        AuthContext.letmeload();
        try{
            const generateResponse = await generateTransaction({
                price: generatePrice, 
                offer_id: item._id
                })
            if (generateResponse.success){
                AuthContext.donewithload();
                hideModal();
                ToastAndroid.show('Transaction Generated!', ToastAndroid.SHORT);
            }else{
                AuthContext.donewithload();
                alert(generateResponse.message);
            }
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }
    const [reportreason, setReportReason] = useState('');
    const [reportdescription, setReportDescription] = useState('');
    async function reportHandler(){
        AuthContext.letmeload();
        try{
            const reportResponse = await reportTransaction({
                reason: reportreason, 
                description: reportdescription, 
                _id: item.transactions[0]?._id, 
                user_reported: item.request_id.requested_by._id
            })
            if (reportResponse.success){
                AuthContext.donewithload();
                hideModal();
                ToastAndroid.show(reportResponse.message, ToastAndroid.SHORT);
            }else{
                AuthContext.donewithload();
                alert(reportResponse.message);
            }
        }catch(error){
            console.log(error);
        }
    }

    return (
        <Portal>
            <Loading/>
                
            <Modal visible={mainVisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
                {
                    modalstate === 'default' &&
                    <Card>
                        <Card.Title
                            title={item.request_id.requested_by.name}
                            subtitle={item.request_id.requested_by.contact}
                            subtitleStyle={{color:'dimgrey'}}
                            left={()=><Avatar.Image source={{uri: item.request_id.requested_by.avatar.url}} size={50}/>}
                            right={()=> 
                                item.request_id.request_status === 'granted' && item.transactions[0]?.reportedBy.freelancer === "false" &&
                                <IconButton 
                                    icon='alert-circle-outline' 
                                    iconColor='deeppink' 
                                    style={{marginHorizontal:10}} 
                                    size={30}
                                    onPress={()=>
                                        Alert.alert(
                                            'File Report',
                                            'Are you sure you want to file a report?',
                                            [
                                            {
                                                text: 'Cancel',
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'OK',
                                                onPress: () => setmodalstate('report'),
                                            },
                                            ],
                                            { cancelable: false }
                                        )
                                        }
                                    />}
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
                        (item.offer_status === 'cancelled') ? null :
                        (item.transactions.length === 0 ) ? 
                        <Button
                            mode='outlined'
                            textColor='deeppink'
                            onPress={() =>
                            Alert.alert(
                                'Generate Payment Details',
                                'Are you sure you want to generate payment details?',
                                [
                                { text: 'No', style: 'cancel' },
                                { text: 'Yes', onPress: () => setmodalstate('generate') },
                                ],
                                { cancelable: false },
                            )
                            }
                        >
                            Generate Payment Details
                        </Button>
                        :
                        (item.transactions[0].status !== 'completed' ) ? 
                        <Button
                            mode='outlined'
                            textColor='green'
                            onPress={() =>
                            Alert.alert(
                                'Payment Received?',
                                'Be Aware that this would complete the transaction and would not be possible to revert',
                                [
                                {
                                    text: 'No',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => completeHandler(),
                                },
                                ],
                                { cancelable: false },
                            )
                            }
                        >
                            Completed
                        </Button>
                        :
                        null
                        }
                        </Card.Actions>
                    </Card>
                }
                {
                    modalstate === 'report' &&
                    <Card>
                        <Card.Title title='File a Report' right={()=><IconButton icon='chevron-left' iconColor='deeppink' size={30} onPress={()=>setmodalstate('default')}/>}/>
                        <Card.Content>
                            <TextInput
                                label="Reason"
                                mode='outlined'
                                onChangeText={(text) => setReportReason(text)}
                            />
                            <TextInput
                                label="Description"
                                mode='outlined'
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(text) => setReportDescription(text)}
                            />
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={()=>setmodalstate('default')}>Cancel</Button>
                            <Button onPress={reportHandler}>Submit</Button>
                        </Card.Actions>
                    </Card>
                }
                {
                    modalstate === 'generate' &&
                    <Card>
                        <Card.Title title='Payment Details' right={()=><IconButton icon='chevron-left' iconColor='deeppink' size={30} onPress={()=>setmodalstate('default')}/>}/>
                        <Card.Content>
                            <TextInput
                                label="Price"
                                mode='outlined'
                                placeholder='₱ 0,000.00'
                                keyboardType='numeric'
                                onChangeText={(text) => setgeneratePrice(text)}
                            />
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={()=>setmodalstate('default')}>Cancel</Button>
                            <Button onPress={generateHandler}>Submit</Button>
                        </Card.Actions>
                    </Card>
                }
            </Modal>
        </Portal>
    )
})

export default FreelancerProject;