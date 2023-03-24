import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';

const ClientFreelancerRegistration = observer(() => {
    return (
        <Card style={{marginHorizontal:20, marginBottom:30, borderWidth:1, borderColor:'deeppink'}}>
            <Card.Title
                title={<Text variant='titleMedium' style={{color:'deeppink'}}>Freelancer Registration</Text>}
                subtitle={<Text variant='bodySmall' style={{color:'dimgray'}}>Please fill in the form below</Text>}
            />
            <Card.Content>

            </Card.Content>
            <Card.Actions>
                <Button
                    icon='check'
                    mode='outlined'
                    textColor='deeppink'
                    onPress={() => {
                        console.log("Woo")
                    }}
                >
                    Submit
                </Button>
            </Card.Actions>
        </Card>
    )
})

export default ClientFreelancerRegistration;