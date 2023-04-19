import React, { useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { observer } from 'mobx-react';
import { View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Button, Card, Text, Avatar, Divider, TextInput, RadioButton, HelperText, IconButton, SegmentedButtons} from 'react-native-paper';
import { styles  } from '../../components/user/user.css';
import Loading from '../../components/loading';

import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import { updatePassword, updateProfile, getmyReports, getmyTransactions} from '../../../services/apiendpoints';
import { useEffect } from 'react';

const ClientProfile = observer((props) => {
    const [isEditing, setisEditing ] = useState(false);
    const [isPassword, setisPassword ] = useState(false);
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const [validationErrors, setvalidationErrors] = useState({});
    
    /**
    * Handles the request to update a user's profile. This is called when the user clicks the update
    */
    function updatehandler(){
        AuthContext.letmeload();
        const errors = {};
        // Check if age is between 18 and 100
        if(UserContext.users[0].UserDetails.age < 18 || UserContext.users[0].UserDetails.age > 100){
            errors.age = 'Valid Age is between 18-100';
        }
        // Check if contact is required
        if (!UserContext.users[0].UserDetails.contact || UserContext.users[0].UserDetails.contact.length < 11) {
            errors.contact = 'Contact is required';
        }
        setTimeout(async () => {
            // updateProfile UserContext. users 0. ProfileDetails. ProfileDetails. ProfileDetails. success true
            if (Object.keys(errors).length > 0) {
                setvalidationErrors(errors);
            } else {
            const response = await updateProfile(UserContext.users[0].ProfileDetails);
            // if profile was successfully updated
            if (response.success) {
                setisEditing(false);
                alert("Profile Updated Successfully");
            }else{
                alert(response);
            }}
            AuthContext.donewithload();
        }, 2000);
        
    }
    const [ value, setValue ] = useState('');
    // Values
    const [ oldconfirmPassword, setoldconfirmPassword ] = useState('');
    const [ newPassword, setnewPassword ] = useState('');
    const [ newconfirmPassword, setnewconfirmPassword ] = useState('');
    
    // Visibility
    const [ oldconfirmPasswordVisibility, setoldconfirmPasswordVisibility ] = useState(false);
    const [ newPasswordVisibility, setnewPasswordVisibility ] = useState(false);
    const [ newconfirmPasswordVisibility, setnewconfirmPasswordVisibility ] = useState(false);

    
    /**
    * passwordhandler is used to change password. It checks if old and new passwords are valid
    */
    function passwordhandler(){
        AuthContext.letmeload();
        const errors = {};
        // This is required if the old confirm password is less than 6 characters
        if(oldconfirmPassword.length < 6 ){
            errors.oldconfirmPassword = 'This is required!';
        }
        // check that newPassword is at least 6 characters
        if(newPassword.length < 6){
            errors.newPassword = 'Password must be atleast 6 characters';
        }
        // Check if the old password and new password are the same as the old one.
        if(newPassword === oldconfirmPassword){
            errors.oldconfirmPassword = "Old Password can't be the same as the new one.";
            errors.newPassword = "New Password can't be the same as the old one.";
        }
        // if newconfirmPassword is less than 6 characters
        if(newconfirmPassword < 6){
            errors.newconfirmPassword = 'Password must be atleast 6 characters';
        }
        // check if the new password is correct
        if(newconfirmPassword !== newPassword && (newconfirmPassword.length !== newPassword.length || newconfirmPassword.length === newPassword.length) ){
            errors.newPassword='Password Mismatch!';
            errors.newconfirmPassword = 'Password Mismatch!';
        }
        setTimeout(async () => {
            // updatePassword function to update the password.
            if (Object.keys(errors).length > 0) {
                setvalidationErrors(errors);
            } else {
                const response = await updatePassword({oldPassword: oldconfirmPassword, password: newPassword});
                // if the password is successful
                if (response.success) {
                    setisPassword(false);
                    setoldconfirmPassword('');
                    setnewPassword('');
                    setnewconfirmPassword('');
                    alert("Password Updated Successfully");
                }else{
                    alert(response.errMessage);
                    errors.oldconfirmPassword = response.errMessage;
                    setvalidationErrors(errors);
                }
            }
            AuthContext.donewithload();
        }, 2000);
    }

    /**
    * Launch image picker and upload an image to the user's profile. This is a blocking call
    * 
    * 
    * @return Promise resolved when image is
    */
    async function pickImage(){
        AuthContext.letmeload();
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            // Upload a picture to the users profile.
            if (!result.canceled) {
                let typePrefix;
                // Returns true if the result is an image or PNG file.
                if (result.assets[0].type === "image") {
                    // Autoconverts to jpeg
                    typePrefix = "data:image/jpeg;base64,";
                } else {
                    alert("Unsupported file format. Please select a JPEG or PNG file.");
                    return;
                }
                const uploadresponse = await updateProfile({avatar: typePrefix + result.assets[0].base64});
                // if the user is successful display the profile picture
                if (uploadresponse.success) {
                    UserContext.users[0].setAvatar(uploadresponse.user.avatar);
                    alert("Profile Picture Successfully");
                }else{
                    alert(uploadresponse);
                }
                console.log(uploadresponse);
              }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
      };

    const [transaction_collection, set_transaction_collection] = useState([]);
    /**
    * Gets transactions from MyStudio and stores them in the database. This is a wrapper around getmyTransactions
    */
    async function getTransactions(){
        AuthContext.letmeload();
        try{
            const transaction_response = await getmyTransactions();
            // if transaction_response. success then alert the user if the transaction is successful
            if(transaction_response.success){
                AuthContext.donewithload();
                set_transaction_collection(transaction_response.transactions);
            }else{
                AuthContext.donewithload();
                alert(transaction_response.message);
            }
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
        
    }

    const [reports_collection, set_reports_collection] = useState([]);
    /**
    * Gets all reports from My Mentat and stores them in Reports collection
    */
    async function getAllmyReports(){
        AuthContext.letmeload();
        try{
            const report_response = await getmyReports();
            // if report_response. success true set the report collection to the report collection
            if(report_response.success){
                AuthContext.donewithload();
                set_reports_collection(report_response.reports);
            }else{
                AuthContext.donewithload();
                alert(report_response.message);
            }
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
        }
        
    }

    useEffect(()=>{
        getTransactions();
        getAllmyReports();
    },[])

    return (
        <ScrollView style={styles.container}>
            <Loading/>
            <View style={{flex:1, alignItems:'center', alignSelf:'center'}}>
                <View style={{flexDirection:'row', marginBottom:10}}>
                    <Avatar.Image size={100} style={{backgroundColor:'deeppink', borderColor:'lightpink'}} source={{uri: UserContext.users[0]?.UserDetails?.avatar?.url}}/>
                    {
                        isEditing ? 
                        <TouchableOpacity style={{position:'absolute', right:-10, bottom:-10}} onPress={()=>pickImage()}>
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
                            <View>
                                <TouchableOpacity style={{position:'absolute', top:-25, left:-40}} onPress={()=>setisEditing(!isEditing)}>
                                    <Avatar.Icon icon={isEditing ? 'window-close' : 'pencil'} size={28} color='white' style={{backgroundColor: isEditing ? 'maroon' : 'salmon'}}/>
                                </TouchableOpacity>
                                {
                                    isEditing ? 
                                <TouchableOpacity style={{position:'absolute', top:-25, left:-80}} onPress={()=>updatehandler()}>
                                    <Avatar.Icon icon='check' size={28} color='white' style={{backgroundColor: 'green'}}/>
                                </TouchableOpacity> 
                                : <></>
                                }
                            </View>
                        }
                        />
                    <Card.Content>
                        {/* PROFILE DETAILS */}
                        {
                            isEditing ? 
                            <View>
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
                            </View>
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
                        {/* PASSWORD */}
                        <View style={{marginVertical:10}}>
                        {
                            isPassword ? 
                            <View>
                                <TextInput 
                                    mode='outlined' 
                                    label='Old Password'
                                    dense={true}
                                    placeholder='Old Password'
                                    value={oldconfirmPassword}
                                    onChangeText={(text) => (setvalidationErrors(''), setoldconfirmPassword(text))}
                                    error={validationErrors.oldconfirmPassword}
                                    secureTextEntry={!oldconfirmPasswordVisibility}
                                    right={<TextInput.Icon icon={oldconfirmPasswordVisibility ? 'eye-off-outline' : 'eye-outline'} onPress={() => setoldconfirmPasswordVisibility(!oldconfirmPasswordVisibility)} />}
                                />
                                {
                                    validationErrors.oldconfirmPassword && <HelperText type='error'>{validationErrors.oldconfirmPassword}</HelperText>
                                }
                                <TextInput 
                                    mode='outlined' 
                                    label='New Password'
                                    dense={true}
                                    placeholder='New Password'
                                    value={newPassword}
                                    onChangeText={(text) => (setvalidationErrors(''), setnewPassword(text))}
                                    error={validationErrors.newPassword}
                                    secureTextEntry={!newPasswordVisibility}
                                    right={<TextInput.Icon icon={newPasswordVisibility ? 'eye-off-outline' : 'eye-outline'} onPress={()=>(setnewPasswordVisibility(!newPasswordVisibility))} />}
                                />
                                {
                                    validationErrors.newPassword && <HelperText type='error'>{validationErrors.newPassword}</HelperText>
                                }
                                <TextInput 
                                    mode='outlined' 
                                    label='Confirm Password'
                                    dense={true}
                                    placeholder='Confirm Password'
                                    value={newconfirmPassword}
                                    onChangeText={(text) => (setvalidationErrors(''), setnewconfirmPassword(text))}
                                    error={validationErrors.newconfirmPassword}
                                    secureTextEntry={!newconfirmPasswordVisibility}
                                    right={<TextInput.Icon icon={newconfirmPasswordVisibility ? 'eye-off-outline' : 'eye-outline'} onPress={()=>(setnewconfirmPasswordVisibility(!newconfirmPasswordVisibility))} />}
                                />
                                {
                                    validationErrors.newconfirmPassword && <HelperText type='error'>{validationErrors.newconfirmPassword}</HelperText>
                                }
                                <SegmentedButtons
                                value={value}
                                onValueChange={setValue}
                                style={{marginVertical:10}}
                                buttons={[
                                    {
                                      value: 'cancel',
                                      icon: 'window-close',
                                      label: 'Cancel',
                                      style: {backgroundColor:'salmon'},
                                      checkedColor: 'white',
                                      uncheckedColor: 'white',
                                      onPress: () => {
                                        setisPassword(false);
                                        setvalidationErrors('');
                                        setoldconfirmPasswordVisibility(false);
                                        setnewPasswordVisibility(false);
                                        setnewconfirmPasswordVisibility(false);
                                      }
                                    },
                                    {
                                      value: 'save',
                                      icon: 'check',
                                      label: 'Save',
                                      style: {backgroundColor:'green'},
                                      checkedColor: 'white',
                                      uncheckedColor: 'white',
                                      onPress: () => {
                                          passwordhandler();
                                      }
                                    },
                                  ]}
                                />
                            </View>
                            : 
                            <Button icon='lock' mode='outlined' onPress={()=>{setisPassword(!isPassword)}} buttonColor='salmon' textColor='white'>Change Password</Button>
                        }
                        </View>
                    </Card.Content>
                </Card>
                <Card style={{marginVertical: 6}}>
                    <Card.Title title='My Transactions'/>
                    <Card.Content>
                        <FlatList
                            data={transaction_collection}
                            horizontal={transaction_collection.length > 1 ? true : false}
                            renderItem={({item}) => 
                                <Card style={{borderWidth:1, borderColor:'green', minWidth: 250}}>
                                    <Card.Title 
                                        title={item.offer_id.service_id.title} 
                                        subtitle={item.isPaid ? "Paid" : "Not Paid"} 
                                        subtitleStyle={{color:'green'}}
                                        left={()=><Avatar.Image source={{ uri:item.offer_id.offered_by.avatar.url }} size={50} />}
                                        />
                                </Card>
                            }
                            ListEmptyComponent={()=>
                                <View style={{alignItems:'center', alignSelf:'center', maxWidth: 300, marginBottom:20}}>
                                    <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                                    <Text variant='titleMedium'>No Transactions Yet</Text>
                                </View>
                            }
                            />
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    )
})

export default ClientProfile;