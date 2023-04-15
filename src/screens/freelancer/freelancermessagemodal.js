import React, { useContext, useEffect, useState } from 'react';
import { Portal, Modal, Card, TextInput, Divider, Text, Menu, Button } from 'react-native-paper';
import Loading from '../../components/loading';

import { AddOfferandTransactionbyInquiry, getSingleInquiry } from '../../../services/apiendpoints';

import AuthStore from '../../models/authentication';
import { useNavigation } from '@react-navigation/native';



const FreelancerMessageTransactionOfferModal = ({route}) => {
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();

    const [inquirydata, setinquirydata] = useState();
    const [modalvisible, setModalvisible] = useState(true);
    const hideModal = () => {
        setModalvisible(false);
        navigation.goBack();
    }

    useEffect(()=>{
        fetchInquiry();
    },[]);

    async function fetchInquiry(){
        AuthContext.letmeload();
        try{
            const response = await getSingleInquiry(route.params.inquiry_id);
            if(response.success){
                setinquirydata(response.inquiry.service_id);
            }
            AuthContext.donewithload();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }

    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');

    async function SendOfferandTransactionbyInquiry(){
        AuthContext.letmeload();
        try{
            const response = await AddOfferandTransactionbyInquiry({...route.params, service_id: inquirydata._id, price, description});
            if(response.success){
                AuthContext.donewithload();
                alert(response.message);
                hideModal;
            }else{
                alert("An Error Occurred!");
            }
            AuthContext.donewithload();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
    }

    return (
        <>
        <Loading/>
        <Portal>
            <Modal visible={modalvisible} onDismiss={hideModal} style={{marginHorizontal:10}}>
                <Card>
                <Card.Title title='Send Offer' />
                <Card.Content>
                    {
                        inquirydata &&
                        <TextInput 
                        mode='outlined'
                        label='Service Inquired'
                        editable={false}
                        value={inquirydata.title}
                        />
                    }
                    <TextInput 
                        mode='outlined'
                        label='Offer Description'
                        onChangeText={(text) => setDescription(text)}
                        multiline={true}
                    />
                    <Divider/>
                    <Text style={{color:'deeppink'}}>Payment Details</Text>
                    <TextInput 
                        mode='outlined'
                        label='Price'
                        keyboardType='numeric'
                        placeholder='000.00'
                        onChangeText={(text) => setPrice(text)}
                        left={<TextInput.Icon icon='currency-php'/>}
                    />
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
            </Modal>
        </Portal>
        </>
    );
};

export default FreelancerMessageTransactionOfferModal;
