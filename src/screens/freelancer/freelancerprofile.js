import React, { useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { observer } from 'mobx-react';
import { View, TouchableOpacity, ScrollView} from 'react-native';
import { Button, Card, Text, Avatar, Divider, TextInput, RadioButton, HelperText, Switch, SegmentedButtons} from 'react-native-paper';
import { styles  } from '../../components/user/user.css';
import Loading from '../../components/loading';

import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import FreelancerContext from '../../models/freelancer';
import { updatefreelancer } from '../../../services/apiendpoints';

const FreelancerProfile = observer((props) => {
    const FreelancerStore = useContext(FreelancerContext);
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);

    const [Availability, setAvailability] = useState(FreelancerStore.data[0].availability);

    async function toggleavailability(){
        try{
            AuthContext.letmeload();
            setAvailability(!Availability);
            const response = await updatefreelancer({availability: !Availability});
            if(response.success){
                alert(response.message);
            }else{
                alert("An Error has occured");
            }
            AuthContext.donewithload();
        }catch(error){
            console.log(error);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Loading/>
            <View style={{flex:1, alignItems:'center', alignSelf:'center'}}>
                <View style={{flexDirection:'row', marginBottom:10}}>
                    <Avatar.Image size={100} style={{backgroundColor:'deeppink', borderColor:'lightpink'}} source={{uri: UserContext.users[0]?.UserDetails?.avatar?.url}}/>
                </View>
                <Text variant='titleLarge'>{UserContext.users[0]?.UserDetails?.name}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text variant="titleMedium" style={{alignSelf:'center'}}>Available?</Text>
                    <Switch color='deeppink' value={Availability} onValueChange={()=>{toggleavailability()}}/>
                </View>
                
            </View>
            <View style={{flex:3, margin:10, justifyContent: 'flex-start'}}>
                <Card style={{marginVertical:10}}>
                    <Card.Title title='Payments'/>
                </Card>
                <Card style={{marginVertical:10}}>
                    <Card.Title title='Reports'/>
                </Card>
            </View>
        </ScrollView>
    )
})

export default FreelancerProfile;