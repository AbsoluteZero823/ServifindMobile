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
    const [validationerrors, setvalidationerrors] = useState({});

    const [ServicesVisible, setServicesVisible] = useState(false);
    const [Service, setService] = useState('');
    const [ServiceID, setServiceID] = useState();

    async function sendhandler(){
        const errors = {};
        if(!message){
            errors.message = segmentedvalue+' is required';
        }
        if(segmentedvalue === 'Offer' && !ServiceID ){
            errors.serviceID = 'Service is required';
        }
        
        if(Object.keys(errors).length > 0){
            setvalidationerrors(errors);
            return;
        }
        try{
            const offer = await offerservices({
                description: message,
                service_id: ServiceID,
                request_id: item._id,
            })
            if(offer.success){
                alert(segmentedvalue+"  has been sent to "+item.requested_by.name);
                setmainVisible(false);
                navigation.goBack()
            }else{
                alert("An Error has occured!");
            }
        }catch(error){
            console.log(error);
        }
    }
    const [segmentedvalue, setValue] = useState('Message');

    return (
        <Portal>
            <Modal visible={mainVisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
                <Card style={{borderColor:'deeppink', borderWidth:1}}>
                    <Card.Content>
                        <SegmentedButtons
                            value={segmentedvalue}
                            onValueChange={setValue}
                            buttons={[
                                {
                                    value: 'Message',
                                    icon: 'chat-outline',
                                    label: 'Message',
                                },
                                {
                                    value: 'Offer',
                                    icon: 'tag',
                                    label: 'Offer'
                                }
                            ]}
                        />
                        <Text style={{color:'dimgrey'}}>To: <Text style={{color:'deeppink'}}>{item.requested_by.name}</Text></Text>
                        {
                            segmentedvalue === 'Offer' && 
                            <>
                            <TextInput
                                mode='outlined'
                                label='Service'
                                editable={false}
                                value={Service}
                                right={<TextInput.Icon icon={ServicesVisible ? "chevron-up" : "chevron-down"} iconColor='deeppink' onPress={()=>setServicesVisible(!ServicesVisible)}/>}
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
                            </>
                        }
                        <TextInput
                            label={segmentedvalue === 'Message' ? 'Message' : 'Offer'}
                            mode='outlined'
                            onChangeText={(text)=>{setvalidationerrors({}), setmessage(text)}}
                            placeholder={segmentedvalue === 'Message' ? 'Type your Message here' : 'Type your Offer here'}
                            multiline={segmentedvalue === 'Message' ? false : true}
                            error={validationerrors.message}
                            />
                            {
                                validationerrors.message && <HelperText type='error'>{validationerrors.message}</HelperText>
                            }
                        
                    </Card.Content>
                    <Card.Actions>
                        <Button
                        mode='outlined'
                        icon='chat-outline'
                        textColor='deeppink'
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