
import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native'; 
import { Card, Avatar, Text, TextInput } from 'react-native-paper';
import { format } from "date-fns";
import { cancelmyRequest, editmyRequest } from '../../../services/apiendpoints';
import { useNavigation } from '@react-navigation/native';

export default Jobpostcard = (passeddata) => {
    const navigation = useNavigation();
    const item = passeddata.item;
    const [isEditing, setisEditing] = useState(false);  
    const [newdescription, setnewdescription] = useState(item.description);
    const [newstatus, setnewstatus] = useState(item.request_status);
    /**
    * Updates the description of a job request and shows a success / failure message to the user if the job request was
    */
    async function updatehandler(){
        try{
            const response = await editmyRequest({_id: item._id, description: newdescription});
            // if the job was successfully updated
            if(response.success){
                setisEditing(false);
                alert('Job Request Updated Successfully');
                setnewdescription(response.requests.description);
            }else{
                alert(response.errMessage);
            }
        }catch(error){
            console.log(error);
        }
    }
    /**
    * Function to handle cancelmyRequest ( item ) This function is called when user clicks on Cancel button in
    */
    async function cancelhandler(){
        try{
            const response = await cancelmyRequest(item._id);
            // if the request was successful
            if(response.success){
                setisEditing(false);
                alert('Job Request Cancelled Successfully');
                setnewstatus(response.deleterequests.request_status);
            }else{
                alert(response);
            }
        }catch(error){
            console.log(error);
        }
    }
    return(
        <TouchableOpacity onPress={()=>(navigation.navigate('ClientSingleJobPosts',{_id: item._id}))}>
            <Card key={item._id} style={{margin:5}}>
                <Card.Title 
                    title={item.category.name} 
                    subtitle={format(item.created_At, 'MMMM. dd, yyyy')}
                    left={() => (
                        <Avatar.Icon 
                            icon={item.request_status === 'waiting' ? 'clock-outline' : item.request_status === 'granted' ? 'check-decagram-outline' : 'cancel'} 
                            color={item.request_status === 'waiting' ? '#9c6f6f' : item.request_status === 'granted' ? 'green' : 'red'}
                            size={40} 
                            style={{marginRight:10, backgroundColor:'transparent'}} />
                    )}
                    right={() => 
                        (
                            isEditing 
                            ? 
                            <View style={{flexDirection:'row-reverse', marginHorizontal:5}}>
                                <TouchableOpacity 
                                onPress={() => setisEditing(false)}
                                onLongPress={()=>{
                                    Alert.alert('Cancel Request?', 'Are you sure you want to cancel your request?', [
                                        {
                                            text: 'No',
                                            onPress: () => alert('Close Call!'),
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'OK', 
                                            onPress: () => cancelhandler()},
                                        ]);
                                    }}>
                                    <Avatar.Icon icon='window-close' size={40} color='red' style={{marginHorizontal:2, backgroundColor:'transparent'}}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>updatehandler()}>
                                    <Avatar.Icon icon='check' size={40} color='green' style={{marginHorizontal:2, backgroundColor:'transparent'}}/>
                                </TouchableOpacity>
                            </View>
                            :
                            item.request_status === 'waiting' 
                            ?
                            <View style={{flexDirection:'row-reverse', marginHorizontal:5}}>
                                <TouchableOpacity onPress={()=>{setisEditing(true)}}>
                                    <Avatar.Icon icon='pencil' size={40} color='green' style={{marginHorizontal:2, backgroundColor:'transparent'}}/>
                                </TouchableOpacity>
                            </View>
                            :
                            <></>
                        )}
                />
                <Card.Content>
                    {
                        isEditing ? 
                        <TextInput
                            mode='outlined'
                            label='Description'
                            multiline={true}
                            dense={true}
                            value={newdescription}
                            onChangeText={(text) => setnewdescription(text)}
                            style={{marginVertical:5}}
                            right={<TextInput.Icon icon="window-close" iconColor='#9c6f6f' onPress={()=>setnewdescription('')}/>}
                            numberOfLines={5}
                        />
                        :
                        <Text>{newdescription}</Text>
                    }
                    
                </Card.Content>
                <Card.Actions>
                    <Text style={{color: item.request_status === 'waiting' ? '#9c6f6f' : item.request_status === 'granted' ? 'green' : 'red'}}>{item.request_status.toUpperCase()}</Text>
                </Card.Actions>
            </Card>                                           
        </TouchableOpacity>
    )
}