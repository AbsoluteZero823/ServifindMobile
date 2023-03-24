import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import { Button, Card, Text, Avatar, Divider, IconButton, Portal, Modal, TextInput} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createanInquiry } from '../../../services/apiendpoints';
import AuthStore from '../../models/authentication';
import LoadingScreen from '../../components/loading';

const ClientSingleJob = observer(({route}) => {
    const AuthContext = useContext(AuthStore);
    const data = route.params.item;
    const navigation = useNavigation();
    const [mainvisible, setmainVisible] = useState(true);
    const [Inquirevalue, setInquirevalue] = useState('');
    const [Inquirevisible, setInquirevisible] = useState(false);
    const hideModal = () => {setmainVisible(false), navigation.goBack()};

    async function sendInquiry() {
        AuthContext.letmeload();
        let body = {};
        body.instruction = Inquirevalue;
        body.attachments = 'Placeholder';
        body.freelancer = data.freelancer_id;
        body.service_id = data._id;
        try{
            const sendresponse = await createanInquiry(body);
            if(sendresponse.success){
                setInquirevisible(false);
                setmainVisible(false);
                setInquirevalue('');
                navigation.goBack();
                alert("Inquiry sent successfully!");
            }else{
                setInquirevisible(false);
                setmainVisible(false);
                setInquirevalue('');
                navigation.goBack();
                alert("You probably have already sent an Inquiry to this Freelancer");
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }

    return (
        <Portal>
            <LoadingScreen/>
            <Modal visible={mainvisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
            <Card style={{marginTop:50}}>
                <Card.Cover source={{uri: data.images.url}}/>
                <Card.Title title={data.title}/>
                <Card.Content>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
                        <View style={{flexDirection:'row'}}>
                            <Avatar.Image size={40} source={{ uri: data.user.avatar.url }} style={{alignItems:'center'}}/>
                            <View style={{marginHorizontal:5}}>
                                <Text>{data.user.name}</Text>
                                <Text>Something Else</Text>
                            </View>
                        </View>
                        <View>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Avatar.Icon icon='star' size={20} color='green' style={{backgroundColor:'transparent'}}/>
                                <Text> 3.2 </Text>
                                <Text style={{color:'dimgrey'}}>(200)</Text>
                            </View>
                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between'}} onPress={()=>{setmainVisible(false),navigation.navigate('ClientFreelancer',{freelancer_id: data.freelancer_id})}}>
                                <Avatar.Icon icon='eye' size={20} color='green' style={{backgroundColor:'transparent'}}/>
                                <Text style={{color:'green'}}>View Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Divider/>
                    <View style={{marginVertical:10}}>
                        <Text>{data.experience}</Text>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button icon="chat" mode="contained" buttonColor="green" onPress={() => {setInquirevisible(true)}}>
                        Inquire
                    </Button>
                </Card.Actions>
            </Card>
        </Modal>
        <Modal visible={Inquirevisible} onDismiss={()=>{setInquirevisible(false)}} contentContainerStyle={{marginHorizontal:10}}>
            <Card style={{borderWidth:1, borderColor:'green'}}>
                <Card.Title title='Send Inquire Message' subtitle={'To: '+data.user.name} right={()=><IconButton style={{marginHorizontal:20}} iconColor='maroon' icon='window-close' onPress={()=>{setInquirevisible(false)}}/>}/>
                <Card.Content>
                    <TextInput
                        mode='outlined'
                        label='Message'
                        placeholder='Type here...'
                        dense={true}
                        onChangeText={(text) => setInquirevalue(text)}
                        right={<TextInput.Icon icon='send' iconColor='green' onPress={()=>{sendInquiry()}}/>}
                    />
                </Card.Content>
            </Card>
        </Modal>
        </Portal>
    )
})
export default ClientSingleJob;