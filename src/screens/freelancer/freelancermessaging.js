import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal, TextInput, HelperText, SegmentedButtons, List} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import ServiceStore from '../../models/service';
import { offerservices } from '../../../services/apiendpoints';
import UserStore from '../../models/user';


const FreelancerMessaging = observer(({route}) => {
    const UserContext = useContext(UserStore);
    const ServiceContext = useContext(ServiceStore);
    const item = route.params;

    const navigation = useNavigation();
    const [mainVisible, setmainVisible] = useState(true);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};
    const [message, setmessage] = useState();
    const [price, setprice] = useState();
    const [validationerrors, setvalidationerrors] = useState({});

    const [ServicesVisible, setServicesVisible] = useState(false);
    const [Service, setService] = useState('');
    const [ServiceID, setServiceID] = useState(0);

    async function sendhandler(){
        const errors = {};
        if(!message){
            errors.message = 'offer description is required';
        }

        if(price === 0){
            errors.price = 'Price is required';
        }
        
        if(Object.keys(errors).length > 0){
            setvalidationerrors(errors);
            return;
        }
        try{
            const offer = await offerservices({
                description: message,
                price: price,
                service_id: ServiceID,
                request_id: item._id,
            })
            if(offer.success){
                alert("Offer has been sent to "+item.requested_by.name);
                setmainVisible(false);
                navigation.goBack()
            }else{
                alert("An Error has occured!");
            }
        }catch(error){
            console.log(error);
        }
    }

    return (
        <Portal>
            <Modal visible={mainVisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
                <Card style={{borderColor:'#9c6f6f', borderWidth:1}}>
                    <Card.Title title={'Send Offer'} titleStyle={{color: '#9c6f6f', fontSize:20, marginVertical: 2}}/>
                    <Card.Content>
                        <Text style={{color:'dimgrey'}}>To: <Text style={{color:'#9c6f6f'}}>{item.requested_by.name}</Text></Text>
                        <TextInput
                            mode='outlined'
                            label='Service'
                            editable={false}
                            value={Service}
                            right={<TextInput.Icon icon={ServicesVisible ? "chevron-up" : "chevron-down"} iconColor='#9c6f6f' onPress={()=>setServicesVisible(!ServicesVisible)}/>}
                            error={validationerrors.serviceID}
                        />
                        <View style={{backgroundColor:'darksalmon', marginHorizontal:2, borderBottomRightRadius:20, borderBottomLeftRadius:20}}>
                        {
                        ServicesVisible &&
                        (ServiceContext.services.filter((service) => service.category._id === item.category._id).length === 0 ? (
                            <List.Item
                                title='No services available'
                                titleStyle={{ color: 'white' }}
                            />
                        ) 
                        :
                        (
                            ServiceContext.services
                            .filter((service) => service.category._id === item.category._id)
                            .map((service) => (
                                <List.Item
                                key={service._id}
                                onPress={() => {
                                    setService(service.title);
                                    setServiceID(service._id);
                                    setServicesVisible(false);
                                }}
                                title={service.title}
                                titleStyle={{ color: 'white' }}
                                />
                            ))
                        ))
                        }
                        </View>
                        {
                            validationerrors.serviceID && <HelperText type='error'>{validationerrors.serviceID}</HelperText>
                        }
                        <TextInput
                            label='Offer Description'
                            mode='outlined'
                            onChangeText={(text)=>{setvalidationerrors({}), setmessage(text)}}
                            placeholder={'Type your Offer Description here'}
                            multiline={true}
                            error={validationerrors.message}
                        />
                        {
                            validationerrors.message && <HelperText type='error'>{validationerrors.message}</HelperText>
                        }
                        <TextInput 
                            mode='outlined'
                            label='Price'
                            keyboardType='numeric'
                            placeholder='000.00'
                            onChangeText={(text) => setprice(text)}
                            value={price}
                            left={<TextInput.Icon icon='currency-php'/>}
                        />
                        {
                            validationerrors.price && <HelperText type='error'>{validationerrors.price}</HelperText>
                        }
                    </Card.Content>
                    <Card.Actions>
                        <Button
                        mode='outlined'
                        icon='chat-outline'
                        textColor='#9c6f6f'
                        onPress={()=>{
                            sendhandler();
                        }}
                            >
                            Send
                        </Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    )
})

export default FreelancerMessaging;