import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal, TextInput, HelperText, SegmentedButtons} from 'react-native-paper';
import UserStore from '../../models/user';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../components/user/user.css';


const FreelancerMessaging = observer(({route}) => {
    const item = route.params
    console.log(item);
    const navigation = useNavigation();
    const [mainVisible, setmainVisible] = useState(true);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};
    const [message, setmessage] = useState();
    const [validationerrors, setvalidationerrors] = useState({});

    async function sendhandler(){
        const errors = {};
        if(!message){
            errors.message = segmentedvalue+' is required';
        }
        if(segmentedvalue === 'Offer'){
            
        }
        setvalidationerrors(errors);
        if(Object.keys(errors).length === 0){
            alert(message);
        }
    }
    const [segmentedvalue, setValue] = useState('Message');
    return (
        <Portal>
            <Modal visible={mainVisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
                <Card style={{borderColor:'deeppink', borderWidth:1}}>
                    {/* <Card.Title title="Send Message" subtitle={ */}
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
                            <TextInput
                                mode='outlined'
                                label='Service'
                                disabled={true}
                                right={<TextInput.Icon icon="chevron-down" iconColor='deeppink'/>}
                            />
                        }
                        <TextInput
                            label={segmentedvalue === 'Message' ? 'Message' : 'Offer'}
                            mode='outlined'
                            onChangeText={(text)=>{setvalidationerrors({}), setmessage(text)}}
                            placeholder={segmentedvalue === 'Message' ? 'Type your Message here' : 'Type your Offer here'}
                            right={<TextInput.Icon icon="chat-outline" iconColor='deeppink'/>}
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