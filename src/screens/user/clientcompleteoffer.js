import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal} from 'react-native-paper';

import AuthStore from '../../models/authentication';
import UserStore from '../../models/user';
import Loading from '../../components/loading';
import { useNavigation } from '@react-navigation/native';

const ClientCompleteOffer = observer(({route}) => {
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();
    console.log(route.params);
    const item = route.params;

    const [appstate, setappstate] = useState('Disclaimer');
    const [mainVisible, setmainVisible] = useState(true);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};

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

                        </Card.Content>
                        <Card.Actions>
                            <Button mode='outlined' onPress={()=>console.log("YEY")}>Confirm</Button>
                            <Button mode='outlined' onPress={hideModal}>Cancel</Button>
                        </Card.Actions>
                    </Card>
                }
            </Modal>
        </Portal>
    )
})

export default ClientCompleteOffer;