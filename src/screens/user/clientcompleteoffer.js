import * as ImagePicker from 'expo-image-picker';
import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground, Image} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal, TextInput, SegmentedButtons, HelperText, IconButton} from 'react-native-paper';

import { completeanOffer, ratefreelancer, reportfreelancer } from '../../../services/apiendpoints';

import AuthStore from '../../models/authentication';
import UserStore from '../../models/user';
import Loading from '../../components/loading';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const ClientCompleteOffer = observer(({route}) => {
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();
    const item = route.params;
    const [segmentedvalue, setsegmentedValue] = useState('cash');
    const [price, setprice] = useState('');
    const [gcashreceipt, setgcashreceipt] = useState();

    const [appstate, setappstate] = useState('');

    useEffect(()=>{
        if (item.transactions[0]?.isPaid === "true") {
            setappstate('Rate/Report Disclaimer');
            settransactioninfo(item.transactions[0]);
        }else if ((item.transactions[0] !== null || item.transactions[0] !== undefined) && item.transactions[0]?.isPaid === "false"){
            setappstate('Disclaimer');
        }else{
            setappstate('Disclaimer');
        }
    },[]);

    const [mainVisible, setmainVisible] = useState(true);
    const hideModal = () => {setprice(''), setgcashreceipt(), setmainVisible(false), navigation.goBack()};

    const [validationerrors, setValidationErrors] = useState({});
    const [transactioninfo, settransactioninfo] = useState();

    async function pickImage(){
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
                allowsEditing: true,
                aspect: [6, 9],
                quality: 1,
            });
            if (!result.canceled) {
                let typePrefix;
                if (result.assets[0].type === "image") {
                    // Autoconverts to jpeg
                    typePrefix = "data:image/jpeg;base64,";
                } else {
                    alert("Unsupported file format. Please select a JPEG or PNG file.");
                    return;
                }
                setgcashreceipt(`${typePrefix}${result.assets[0].base64}`);
              }
        }catch(error){
            console.log(error);
        }
      };

    async function submithandler(){
        const Errors = {};
        try{
            if (!price){
                Errors.price = 'Price not set';
            }
            if (parseInt(price) < (parseInt(item.transactions[0]?.price) || parseInt(item.price))){
                Errors.price = 'Payment too low';
            }
            if (segmentedvalue === 'gcash'){
                if (gcashreceipt === undefined){
                    Errors.gcashreceipt = 'Select a GCash Receipt';
                }
            }

            if (Object.keys(Errors).length > 0) {
                setValidationErrors(Errors);
                return false;
            } else {
                setValidationErrors({});
                AuthContext.letmeload();
                const completeresponse = await completeanOffer({
                    offer_id: item._id,
                    price: price,
                    expected_Date: new Date(),
                })
                if (completeresponse.success){
                    settransactioninfo(completeresponse.transaction);
                    setappstate("Rate/Report");
                    alert(completeresponse.message);
                    AuthContext.donewithload();
                }else{
                    alert("Error");
                    AuthContext.donewithload();
                }
            }
        }catch(error){
            console.log(error)
        }
    }

    const [starrating, setstarrating] = useState(0);
    const [freelancerfeedback, setFreelancerFeedback] = useState();
    async function Feedbackhandler(){
        AuthContext.letmeload();
        const Errors = {};
        try{
            if (starrating === 0){
                Errors.starrating = 'Please select a star rating'
            }
            if (typeof freelancerfeedback === 'undefined'){
                Errors.feedback = 'Please fill in the feedback form'
            }
            if (Object.keys(Errors).length > 0){
                setValidationErrors(Errors);
            }else{
                const feedbackresponse = await ratefreelancer({
                    rating: starrating,
                    comment: freelancerfeedback,
                    service_id: (item.service_id?._id || item.transactions[0].offer_id.service_id._id),
                    transaction_id: (transactioninfo?._id || item.transactions[0]?._id)
                });
                if (feedbackresponse.success){
                    AuthContext.donewithload();
                    alert(feedbackresponse.message);
                    hideModal;
                    navigation.goBack();
                }else{
                    AuthContext.donewithload();
                    alert(feedbackresponse.message);
                }
            }
            AuthContext.donewithload();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }

    const [freelancerreason, setFreelancerReason] = useState();
    const [freelancerreport, setFreelancerReport] = useState();
    async function Reporthandler(){
        const Errors = {};
        try{
            if (freelancerreport === undefined){
                Errors.report = 'Must have a description';
            }
            if (freelancerreason === undefined){
                Errors.reason = 'Must have a valid reason';
            }
            if (Object.keys(Errors).length > 0){
                setValidationErrors(Errors);
            }else{
                AuthContext.letmeload();
                console.log(item.transactions[0])
                const reportresponse = await reportfreelancer({
                    _id: (item.service_id?._id || item.transactions[0].offer_id.service_id._id),
                    reason: freelancerreason,
                    description: freelancerreport,
                    user_reported: (item.offered_by?._id || item.transactions[0].offer_id?.offered_by)
                });
                if(reportresponse.success){
                    AuthContext.donewithload();
                    hideModal;
                    alert(reportresponse.message);
                }else{
                    AuthContext.donewithload();
                    alert(reportresponse.message);

                }
                AuthContext.donewithload();
            }
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }

    return (
        <Portal>
            <Loading/>
            <Modal visible={mainVisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
                {
                    appstate === 'Disclaimer' &&
                    <Card>
                        <Card.Title title="Disclaimer"/>
                        <Card.Content>
                            <Text style={{color:'dimgrey', lineHeight: 24, textAlign:'center',}}>
                            Please be advised that payments made between parties are not facilitated or processed by our application. Our application serves only as a database and receives a copy of the payment receipt as proof of payment. Once payment has been processed, it cannot be cancelled or refunded. By proceeding with payment, you acknowledge and accept these terms. We cannot be held liable for any issues or disputes that may arise between the parties involved in the payment transaction. If you have any questions or concerns, please contact the parties involved in the payment transaction directly. Thank you.    
                            </Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button mode='outlined' onPress={()=>setappstate('Proceed')}>Proceed</Button>
                            <Button mode='outlined' onPress={hideModal}>Cancel</Button>
                        </Card.Actions>
                    </Card>
                }
                {
                    appstate === 'Proceed' &&
                    <Card>
                        <Card.Title title="Freelancer Payment Info" subtitle="Pay your Freelancer" subtitleStyle={{color:'dimgrey'}}/>
                        <Card.Content>
                            {
                                item.transactions[0]?.offer_id?.price &&
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text>Price:</Text>
                                    <Text>₱ {item.transactions[0]?.offer_id?.price}</Text>
                                </View>
                            }
                            {
                                 // check the type of item.price
                                item.price && (
                                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text>Price:</Text>
                                    <Text>₱ {item.price}</Text>
                                  </View>
                                )
                            }
                            <TextInput
                                label={'Payment'}
                                mode='outlined'
                                placeholder='₱0,000.00'
                                keyboardType='number-pad'
                                onChangeText={(text) => setprice(text)}
                                error={validationerrors.price}
                            />
                            {
                                validationerrors.price && 
                                <HelperText type='error' visible={validationerrors.price}>
                                    {validationerrors.price}
                                </HelperText>
                            }
                            <View style={{marginVertical:5}}>
                                <Text>Payment Method:</Text>
                                <SegmentedButtons
                                    value={segmentedvalue}
                                    onValueChange={setsegmentedValue}
                                    density='high'
                                    buttons={[
                                    {
                                        value: 'gcash',
                                        label: 'GCash',
                                    },
                                    {
                                        value: 'cash',
                                        label: 'Cash',
                                    }
                                    ]}
                                />
                                <View style={{marginVertical:5}}>
                                {
                                    segmentedvalue === 'gcash' ? 
                                    <>
                                    <Image
                                        source={{uri: (item.service_id?.freelancer_id?.qrCode?.url || item.transactions[0]?.offer_id?.service_id?.freelancer_id?.qrCode.url)}}
                                        style={{height: 300, width: 300, borderRadius: 10, marginVertical: 10}}
                                        />
                                        <Text variant='headlineSmall' style={{alignSelf:'center', textAlign:'center'}}>
                                            GCASH NUMBER: {item.service_id?.freelancer_id?.gcash_num || item.transactions[0]?.offer_id?.service_id?.freelancer_id?.gcash_num}
                                        </Text>
                                    <TextInput
                                        label='GCash Receipt'
                                        mode='outlined'
                                        value={ gcashreceipt ? 'GCash Receipt Selected' : null}
                                        editable={false}
                                        placeholder='Upload GCash Receipt'
                                        right={<TextInput.Icon icon="cloud-upload-outline" iconColor='#9c6f6f' onPress={()=>pickImage()}/>}
                                        error={validationerrors.gcashreceipt}
                                        />
                                    {
                                        validationerrors.gcashreceipt && 
                                        <HelperText type='error' visible={validationerrors.gcashreceipt}>
                                            {validationerrors.gcashreceipt}
                                        </HelperText>
                                    }
                                    </>
                                    :
                                    <Text style={{color:'#9c6f6f', textAlign:'center'}}> Cash Transactions are not covered by our application </Text>
                                }
                                </View>
                            </View>
                        </Card.Content>
                        <Card.Actions>
                            <Button mode='outlined' onPress={()=>submithandler()}>Confirm</Button>
                            <Button mode='outlined' onPress={hideModal}>Cancel</Button>
                        </Card.Actions>
                    </Card>
                }
                {
                    appstate === 'Rate/Report Disclaimer' &&
                    <Card>
                        <Card.Title title="Disclaimer"/>
                        <Card.Content>
                            <Text style={{color:'dimgrey', lineHeight: 24, textAlign:'center',}}>
                            This is a reminder that you have already paid for the service.
                            </Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button mode='outlined' onPress={()=>setappstate('Rate/Report')}>Understood</Button>
                        </Card.Actions>
                    </Card>
                }
                {
                    appstate === 'Rate/Report' &&
                    <Card>
                        <Card.Title title="Freelancer Feedback"/>
                        <Card.Content>
                            <View style={{marginVertical: 10}}>
                            <Text style={{lineHeight: 24, textAlign:'center',}}>
                            We appreciate your business and would like to know how your experience was working with your freelancer. If you were satisfied with their work, please rate them and let them know they did a good job.
                            </Text>
                            <Button mode='outlined' onPress={()=>setappstate('Rate')}>Rate</Button>
                            </View>
                            <View style={{marginVertical: 10}}>
                            <Text style={{lineHeight: 24, textAlign:'center',}}>
                            On the other hand, if you had a negative experience and found them difficult to work with, please report your experience to us so we can take the necessary steps to address the issue.
                            </Text>
                            <Button mode='outlined' onPress={()=>setappstate('Report')}>Report</Button>
                            </View>
                        </Card.Content>
                    </Card>
                }
                {
                    appstate === 'Rate' && 
                    <Card>
                        <Card.Title 
                            title="Freelancer Rating"
                            right={()=><IconButton icon='chevron-left' iconColor='#9c6f6f' onPress={()=>setappstate("Rate/Report")}/>}
                            />
                        <Card.Content>
                            <Text>Rate:</Text>
                            <View style={[{flexDirection:'row', justifyContent:'space-around'}, validationerrors.starrating ? {borderWidth: 2, borderColor: 'darkred', borderRadius: 5} : null]}>
                                <IconButton icon='star' onPress={()=>setstarrating(1)} iconColor={starrating >= 1 ? '#9c6f6f' : 'dimgrey'}/>
                                <IconButton icon='star' onPress={()=>setstarrating(2)} iconColor={starrating >= 2 ? '#9c6f6f' : 'dimgrey'}/>
                                <IconButton icon='star' onPress={()=>setstarrating(3)} iconColor={starrating >= 3 ? '#9c6f6f' : 'dimgrey'}/>
                                <IconButton icon='star' onPress={()=>setstarrating(4)} iconColor={starrating >= 4 ? '#9c6f6f' : 'dimgrey'}/>
                                <IconButton icon='star' onPress={()=>setstarrating(5)} iconColor={starrating >= 5 ? '#9c6f6f' : 'dimgrey'}/>
                            </View>
                            {
                                validationerrors.starrating && <HelperText type='error' visible={validationerrors.starrating}>{validationerrors.starrating}</HelperText>
                            }
                            <TextInput
                                label='Feedback'
                                mode='outlined'
                                placeholder='Freelancer Feedback'
                                onChangeText={(text)=>setFreelancerFeedback(text)}
                                multiline={true}
                                error={validationerrors.feedback}
                                />
                                {
                                    validationerrors.feedback && <HelperText type='error' visible={validationerrors.feedback}>{validationerrors.feedback}</HelperText>
                                }
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                textColor='red'
                                mode='outlined'
                                onPress={()=>setappstate('Rate/Report')}
                                >
                                Back
                            </Button>
                            <Button
                                textColor='#9c6f6f'
                                mode='outlined'
                                onPress={()=>Feedbackhandler()}
                                >
                                Submit
                            </Button>
                        </Card.Actions>
                    </Card>
                }
                {
                    appstate ==='Report' &&
                    <Card>
                        <Card.Title 
                            title="Report Freelancer"
                            right={()=><IconButton icon='chevron-left' iconColor='#9c6f6f' onPress={()=>setappstate("Rate/Report")}/>}
                            />
                        <Card.Content>
                            <TextInput
                                label='Reason'
                                mode='outlined'
                                style={{marginVertical:5}}
                                placeholder='Harassment'
                                onChangeText={(text)=>setFreelancerReason(text)}
                                error={validationerrors.reason}
                            />
                            {
                                validationerrors.reason && <HelperText type='error' visible={validationerrors.reason}>{validationerrors.reason}</HelperText>
                            }
                            <TextInput
                                label='Description'
                                mode='outlined'
                                style={{marginVertical:5}}
                                placeholder='Freelancer Deficiencies'
                                onChangeText={(text)=>setFreelancerReport(text)}
                                multiline={true}
                                error={validationerrors.report}
                                />
                            {
                                validationerrors.report && <HelperText type='error' visible={validationerrors.report}>{validationerrors.report}</HelperText>
                            }
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                textColor='red'
                                mode='outlined'
                                onPress={()=>setappstate('Rate/Report')}
                                >
                                Back
                            </Button>
                            <Button
                                textColor='#9c6f6f'
                                mode='outlined'
                                onPress={()=>Reporthandler()}
                                >
                                Submit
                            </Button>
                        </Card.Actions>
                    </Card>
                }
            </Modal>
        </Portal>
    )
})

export default ClientCompleteOffer;