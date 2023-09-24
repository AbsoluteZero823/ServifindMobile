import React, { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { Portal, Modal, Card, TextInput, Divider, Text, Menu, Button } from 'react-native-paper';
import Loading from '../../components/loading';

import { AddOfferandTransactionbyInquiry, getSingleInquiry } from '../../../services/apiendpoints';

import AuthStore from '../../models/authentication';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';



const FreelancerMessageTransactionOfferModal = ({route}) => {
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();

    const [inquirydata, setinquirydata] = useState();
    const [modalvisible, setModalvisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const hideModal = () => {
        setModalvisible(false);
        navigation.goBack();
    }

    const hidemodalhere = () => {
        setModalvisible(false);
    }

    const openmodalhere = () => {
        setModalvisible(true);
    }

    useEffect(()=>{
        console.log("route.params", route.params);
        if(route.params.inquiry_id){
            fetchInquiry();
        }
    },[]);

    async function fetchInquiry(){
        AuthContext.letmeload();
        hidemodalhere();
        try{
            const response = await getSingleInquiry(route.params.inquiry_id._id);
            if(response.success){
                setinquirydata(response.inquiry.service_id);
            }
            openmodalhere();
            AuthContext.donewithload();
        }catch(error){
            hideModal();
            AuthContext.donewithload();
            console.log(error);
        }
    }

    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');

    async function SendOfferandTransactionbyInquiry(){
        AuthContext.letmeload();
        try{
            hidemodalhere();
            const response = await AddOfferandTransactionbyInquiry({...route.params, service_id: inquirydata._id, price, description, expected_Date: date});
            if(response.success){
                AuthContext.donewithload();
                alert(response.message);
                hideModal()
            }else{
                console.log(response);
                alert("An Error Occurred!");
                openmodalhere();
            }
            AuthContext.donewithload();
        }catch(error){
            openmodalhere()
            AuthContext.donewithload();
            console.log(error);
        }
    }



    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onTextInputFocus = () => {
        setShowDatePicker(true);
    };
    const hideDateTimePicker = () => {
        setShowDatePicker(false);
      };

    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 30); // limit to 30 days from today

    useEffect(()=>{
        if(route.params.transactiondetails){
            setDate(new Date(route.params.transactiondetails.expected_Date));
            setPrice(route.params.transactiondetails.price);
            setDescription(route.params.transactiondetails.offer_id.description);
        }
    },[])

    return (
        <KeyboardAvoidingView>
        <Loading/>
        <Portal>
            <Modal visible={modalvisible} onDismiss={hideModal} style={{marginHorizontal:10}}>
                <KeyboardAvoidingView>
                <Card>
                    <Card.Title title='Send Offer' titleStyle={{color:'#9c6f6f'}}/>
                    <Card.Content>
                        {
                            inquirydata &&
                            <TextInput 
                            mode='outlined'
                            label='Service Inquired'
                            editable={false}
                            value={inquirydata.title || inquirydata.name}
                            />
                        }
                        {
                            inquirydata?.priceStarts_At &&
                            <TextInput 
                            mode='outlined'
                            label='Price'
                            editable={false}
                            value={inquirydata.priceStarts_At.toString()}
                            />
                        }
                        <TextInput 
                            mode='outlined'
                            label='Offer Description'
                            onChangeText={(text) => setDescription(text)}
                            value={description}
                            multiline={true}
                        />
                        <Text style={{color:'#9c6f6f'}}>Payment Details</Text>
                        <TextInput 
                            mode='outlined'
                            label='Price'
                            keyboardType='numeric'
                            placeholder='000.00'
                            onChangeText={(text) => setPrice(text)}
                            value={price}
                            left={<TextInput.Icon icon='currency-php'/>}
                        />
                        <TextInput 
                            mode='outlined'
                            label='Expected Date'
                            keyboardType='numeric'
                            placeholder='000.00'
                            onFocus={onTextInputFocus}
                            onBlur={hideDateTimePicker}
                            value={date.toLocaleDateString()}
                            left={<TextInput.Icon icon='calendar-month-outline' onPress={onTextInputFocus}/>}
                        />
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                onRequestClose={hideDateTimePicker}
                                minimumDate={currentDate}
                                maximumDate={maxDate}
                                onChange={onDateChange}
                            />
                        )}
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode='outlined'
                            onPress={()=>SendOfferandTransactionbyInquiry()}
                            >
                            Submit
                        </Button>
                    </Card.Actions>
                </Card>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
        </KeyboardAvoidingView>
    );
};

export default FreelancerMessageTransactionOfferModal;
