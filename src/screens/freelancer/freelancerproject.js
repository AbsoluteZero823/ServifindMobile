import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect, Fragment } from 'react';
import { View, StyleSheet, ImageBackground, Alert, ToastAndroid} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal, Divider, IconButton, TextInput} from 'react-native-paper';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';
import Infoline from '../../components/infoline';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { generateTransaction, completeTransaction, reportTransaction, TransactionDone } from '../../../services/apiendpoints';

const FreelancerProject = observer(({route}) => {
    const item = route.params;
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();

    const [mainVisible, setmainVisible] = useState(true);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};
    const [modalstate, setmodalstate] = useState('default');


    async function completeHandler(id){
        
        AuthContext.letmeload();
        const formData = {};
        formData.freelancer= 'true';
        formData.client='false';
        console.log(id)
      
      
        try{
            const completeResponse = await TransactionDone(id, formData)
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
    async function paymentReceivedHandler(id){
        
        AuthContext.letmeload();
        const formData = {};
   
        // formData.workCompleted= item.transactions[0].transaction_done.workCompleted;
        
        
        console.log(id)
      
      
        try{
            const completeResponse = await completeTransaction({
                // offer_id: item._id,
                trans_id:id,
                workCompleted: item.transactions[0].transaction_done.workCompleted || item.transaction_done.workCompleted,
                transactionCompleted: new Date(),
                expected_Date: new Date(),
            })// payment sent to sa mobile
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
                offer_id: item._id,
                expected_Date: new Date()
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
                user_reported: item.request_id?.requested_by._id || item.inquiry_id.customer._id
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
                            title={item.request_id?.requested_by.name || item.inquiry_id.customer.name}
                            subtitle={item.request_id?.requested_by.contact || item.inquiry_id.customer.contact}
                            subtitleStyle={{color:'dimgrey'}}
                            left={()=><Avatar.Image source={{uri: (item.request_id?.requested_by.avatar.url || item.inquiry_id.customer.avatar.url)}} size={50}/>}
                            right={()=> 
                                (item.request_id?.request_status === 'granted' || item.inquiry_id?.status === 'granted') && item.transactions[0]?.reportedBy.freelancer === "false" &&
                                <IconButton 
                                    icon='alert-circle-outline' 
                                    iconColor='#9c6f6f' 
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
                                <Text style={{color: '#9c6f6f'}}>REQUEST DETAILS:</Text>
                                {
                                    item.request_id ?
                                    <>
                                    <Infoline label="Type:" value='Request' />
                                    <Infoline label="Created At:" value={format(new Date(item.request_id.created_At), 'MMM dd, yyyy')} />
                                    <Infoline label="Description: " value={item.request_id.description} />
                                    </>
                                    :
                                    <>
                                    <Infoline label="Type:" value='Inquiry' />
                                    <Infoline label="Created At:" value={format(new Date(item.created_At), 'MMM dd, yyyy')} />
                                    <Infoline label="Description: " value={item.description} />
                                    </>
                                }
                            </View>
                            <Divider style={{marginVertical: 8}} />
                            <View>
                                <Text style={{color: '#9c6f6f'}}>SERVICE OFFERED:</Text>
                                <Infoline label="Name:" value={item.service_id.title} />
                                <Infoline label="Category:" value={item.service_id.category.name} />
                                <View>
                                <Text style={{color: '#9c6f6f'}}>Experience:</Text>
                                <Text style={{textAlign: 'right'}}>{item.service_id.experience}</Text>
                                </View>
                            </View>
                            {
                                item.transactions?.length > 0 &&
                                <>
                                <Divider style={{marginVertical: 8}} />
                                <View>
                                <Text style={{color: '#9c6f6f'}}>PAYMENT DETAILS:</Text>
                                <Infoline label="Payment Sent:" value={item.transactions[0].paymentSent === 'true' ? 'Yes' : 'No'} />
                                <Infoline label="Amount:" value={`₱ ${item.transactions[0].price}`} />
                                <Infoline label="Status:" value={
                                    item.transactions[0].status === 'processing' && item.transactions[0].transaction_done.client === 'false' && item.transactions[0].transaction_done.freelancer === 'false'
                                    ?
                                    'Processing / On-Going'
                                    :
                                    item.transactions[0].status === 'processing' && item.transactions[0].transaction_done.client === 'true' && item.transactions[0].transaction_done.freelancer === 'false'
                                    ?
                                    'Waiting for your confirmation'
                                    :
                                    item.transactions[0].status === 'completed' && 'Completed'
                                    } />
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
                            textColor='#9c6f6f'
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
                        // (item.transactions[0].status !== 'completed' ) ? 
                        // (!item.transactions[0].transaction_done.workCompleted ) ? 
                        <Fragment>
                              {(item.transactions[0].paymentReceieved === "false") ? 
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
                                    onPress: () => paymentReceivedHandler((item.transactions[0]?._id)),
                                },
                                ],
                                { cancelable: false },
                            )
                            }
                        >
                            Payment Received
                        </Button>
                         : null}
                        {(!item.transactions[0].transaction_done.workCompleted ) ? 
                        <Button
                            mode='outlined'
                            textColor='green'
                            onPress={() =>
                            Alert.alert(
                                'Work Done?',
                                'Be Aware that this would complete the transaction and would not be possible to revert',
                                [
                                {
                                    text: 'No',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => completeHandler((item.transactions[0]?._id)),
                                },
                                ],
                                { cancelable: false },
                            )
                            }
                        >
                            Work Done
                        </Button>
                        : null}
                       
                        </Fragment>
                      
                        }
                        </Card.Actions>
                    </Card>
                }
                {
                    modalstate === 'report' &&
                    <Card>
                        <Card.Title title='File a Report' right={()=><IconButton icon='chevron-left' iconColor='#9c6f6f' size={30} onPress={()=>setmodalstate('default')}/>}/>
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
                        <Card.Title title='Payment Details' right={()=><IconButton icon='chevron-left' iconColor='#9c6f6f' size={30} onPress={()=>setmodalstate('default')}/>}/>
                        <Card.Content>
                            {
                                item.price &&
                                <TextInput
                                    label="Your Offer Price"
                                    mode='outlined'
                                    value={`${item.price}`}
                                    editable={false}
                                    disabled={true}
                                    left={<TextInput.Icon icon='currency-php' color='dimgrey'/>}
                                />
                            }
                            <TextInput
                                label="Your Transaction Price"
                                mode='outlined'
                                placeholder='0,000.00'
                                keyboardType='numeric'
                                onChangeText={(text) => setgeneratePrice(text)}
                                left={<TextInput.Icon icon='currency-php' color='dimgrey'/>}
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