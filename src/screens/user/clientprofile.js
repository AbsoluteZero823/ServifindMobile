import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet, ImageBackground, ScrollView, TouchableOpacity} from 'react-native';
import { Button, Card, Text, Avatar, Divider, TextInput, RadioButton, HelperText} from 'react-native-paper';
import { styles  } from '../../components/user/user.css';
import Loading from '../../components/loading';

import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import { update } from '../../../services/apiendpoints';

const ClientProfile = observer((props) => {
    const [isEditing, setisEditing ] = useState(false);
    const [isPassword, setisPassword ] = useState(false);
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const [validationErrors, setvalidationErrors] = useState({});
    
    function updatehandler(){
        AuthContext.letmeload();
        const errors = {};
        if(UserContext.users[0].UserDetails.age < 18 || UserContext.users[0].UserDetails.age > 100){
            errors.age = 'Valid Age is between 18-100';
        }
        if (!UserContext.users[0].UserDetails.contact || UserContext.users[0].UserDetails.contact.length < 11) {
            errors.contact = 'Contact is required';
        }
        setTimeout(async () => {
            if (Object.keys(errors).length > 0) {
                setvalidationErrors(errors);
            } else {
            const success = await update(UserContext.users[0].ProfileDetails);
            setisEditing(false);
            alert("Profile Updated Successfully");
            }
            AuthContext.donewithload();
        }, 2000);
        
    }
    return (
        <View style={styles.container}>
            <Loading/>
            <View style={{flex:1, alignItems:'center', alignSelf:'center'}}>
                <View style={{flexDirection:'row', marginBottom:10}}>
                    <Avatar.Image size={100} style={{backgroundColor:'deeppink', borderColor:'lightpink'}} source={{uri: UserContext.users[0]?.UserDetails?.avatar?.url}}/>
                    {
                        isEditing ? 
                        <TouchableOpacity style={{position:'absolute', right:-10, bottom:-10}} onPress={()=>{console.log("WOO!")}}>
                            <Avatar.Icon size={38} icon="camera" style={{backgroundColor:'salmon'}} color='white'/>
                        </TouchableOpacity>
                        : <></>
                    }
                </View>
                <Text variant='titleLarge'>{UserContext.users[0]?.UserDetails?.name}</Text>
            </View>
            <View style={{flex:3, margin:10, justifyContent: 'flex-start'}}>
                <Card>
                    <Card.Title
                        title={UserContext.users[0]?.UserDetails?.name} 
                        subtitle={UserContext.users[0]?.UserDetails?.email}
                        style={{textAlign:'center'}}
                        right={(props) => 
                            // style={{position:'absolute', top:-25, left:-40}}
                            <TouchableOpacity style={{position:'absolute', top:-25, left:-40}} onPress={()=>{isEditing ? updatehandler() : setisEditing(!isEditing)}}>
                                <Avatar.Icon icon={isEditing ? 'check' : 'pencil'} size={28} color='white' style={{backgroundColor: isEditing ? 'green' : 'salmon'}}/>
                            </TouchableOpacity>
                        }
                        />
                    <Card.Content>
                        {
                            isEditing ? 
                            <>
                            <RadioButton.Group
                                onValueChange={(value) => UserContext.users[0].setGender(value)}
                                value={UserContext.users[0]?.UserDetails?.gender}
                                >
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text variant="titleLarge"
                                    style={{
                                    marginTop: 2,
                                    color: 'black'
                                    }}
                                >
                                    Gender:
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <RadioButton value="Male" color='deeppink' />
                                    <Text style={{ marginVertical: 8 }}>Male</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <RadioButton value="Female" color='deeppink' />
                                    <Text style={{ marginVertical: 8 }}>Female</Text>
                                </View>
                                </View>
                            </RadioButton.Group>
                            <TextInput 
                                mode='outlined' 
                                label='Age'
                                dense={true}
                                placeholder='Age'
                                value={UserContext.users[0]?.UserDetails?.age.toString()}
                                onChangeText={(text) => (setvalidationErrors(''), text ? UserContext.users[0].setAge(text) : UserContext.users[0].setAge('0'))}
                                maxLength={3}
                                keyboardType='numeric'
                                error={validationErrors.age}
                                />
                                {
                                    validationErrors.age && <HelperText type='error'>{validationErrors.age}</HelperText>
                                }
                            <TextInput 
                                mode='outlined' 
                                label='Contact'
                                dense={true}
                                placeholder='Contact'
                                value={UserContext.users[0]?.UserDetails?.contact}
                                onChangeText={(text) => (setvalidationErrors(''), UserContext.users[0].setContacts(text))}
                                maxLength={11}
                                keyboardType='numeric'
                                error={validationErrors.contact}
                                />
                                {
                                    validationErrors.contact && <HelperText type='error'>{validationErrors.contact}</HelperText>
                                }
                            </>
                            :
                            <View  style={{flexDirection:'row'}}>
                                <Avatar.Icon size={24} style={{backgroundColor:'transparent'}} color='black' icon={UserContext.users[0]?.UserDetails?.gender ? UserContext.users[0]?.UserDetails?.gender === 'Male' ? 'gender-male' : UserContext.users[0]?.UserDetails?.gender === 'Female' ? "gender-female" : "help-circle-outline"  : "help-circle-outline"}/>
                                <Text style={{alignSelf:'center'}}> - </Text>
                                <Text style={{alignSelf:'center'}}>{UserContext.users[0]?.UserDetails?.age}</Text>
                                <Text style={{alignSelf:'center'}}> - </Text> 
                                <Text style={{alignSelf:'center'}}>{UserContext.users[0]?.UserDetails?.contact}</Text>
                            </View>
                        }
                        <Divider/>
                        <View style={{marginVertical:10}}>
                            {
                                isPassword ? 
                                <View>
                                    <TextInput mode='outlined' label='Old Password'/>
                                    <TextInput mode='outlined' label='New Password'/>
                                    <TextInput mode='outlined' label='Confirm Password'/>
                                    <Button icon='check' style={{marginVertical:8}} mode='outlined' onPress={()=>{setisPassword(!isPassword)}} buttonColor='green' textColor='white'>Update Password</Button>
                                </View>
                                : 
                                <Button icon='lock' mode='outlined' onPress={()=>{setisPassword(!isPassword)}} buttonColor='salmon' textColor='white'>Change Password</Button>
                            }
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </View>
    )
})

export default ClientProfile;