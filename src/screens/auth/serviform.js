import * as ImagePicker from 'expo-image-picker';
import React, { useState, useContext } from 'react';
import { View} from 'react-native';
import { Button, Card, Text, RadioButton, TextInput, HelperText, SegmentedButtons, Portal, Modal } from 'react-native-paper';
import { observer } from 'mobx-react';
import Error from '../../components/err/error';
import styles from '../../components/authentication/authentication.css';
import { login, register } from '../../../services/apiendpoints';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import AuthStore from '../../models/authentication';

const ServiForm = observer(() => {
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();
    // Initializing Segmented Value
    const [value, setValue] = useState(['login']);
    const [active, setActive] = useState('login');
    console.log(value);
    console.log(active)
    // Segmented Button Setup
    const buttons = [
        {
            value: 'login',
            label: 'Login',
            uncheckedColor: 'white',
            style: {backgroundColor: active === 'login' ? 'deeppink' : value.includes('login') ? 'salmon' : 'transparent'},
            disabled : value.includes('login') ? false : true,
        },
        {
            value: 'details',
            label: 'Details',
            uncheckedColor: 'white',
            style: {backgroundColor: active === 'details' ? 'deeppink' : value.includes('details') ? 'salmon' : 'transparent'},
            disabled : value.includes('details') ? false : true,
        },
        ];
        if (AuthContext.WhatUserType === 'Freelancer') {
        buttons.push({
            value: 'payments',
            label: 'Payments',
            uncheckedColor: 'white',
            style: {backgroundColor: active === 'payments' ? 'deeppink' : value.includes('payments') ? 'salmon' : 'transparent'},
            disabled : value.includes('payments') ? false : true,
        });
        }
    // Data to be filled in the form
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [contact, setContact] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [avatar, setAvatar] = useState(null);

    const [validationErrors, setValidationErrors] = useState({});
    function handleLoginForm(){
        AuthContext.letmeload();
        const errors = {};
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Invalid email address';
        }
        if (!password || password.length < 8) {
            errors.password = '8 Character Minimum';
        }
        if (!confirmpassword || confirmpassword.length < 8) {
            errors.confirmpassword = '8 Character Minimum';
        }
        if (password !== confirmpassword) {
            errors.confirmpassword = 'Passwords do not match';
        }
        AuthContext.donewithload();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return false;
            } else {
            return true;
            }
    }

    function handleDetailsForm(){
        AuthContext.letmeload();
        const errors = {};
        if (!firstName) {
            errors.firstName = 'First name is required';
        }
        if (!lastName) {
            errors.lastName = 'Last name is required';
        }
        if (!contact || contact.length < 11) {
            errors.contact = 'Contact is required';
        } else if (!/^\d{11}$/.test(contact)) {
            errors.contact = 'Invalid contact number';
        }
        if (!gender) {
            errors.gender = 'Gender is required';
        }
        if (!age || age < 18 || age > 100) {
            errors.age = 'Valid Age is between 18-100';
        } else if (!/^\d{1,3}$/.test(age)) {
            errors.age = 'Invalid age';
        }
        if (!avatar) {
            errors.avatar = 'Avatar is required';
        }
        AuthContext.donewithload();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return false;
            } else {
            return true;
            }
    }

    const [visible, setVisible] = useState(false);
    const [errorCode, setErrorCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function registerClient(){
        AuthContext.letmeload();
        try{
            let name = firstName + ' ' + lastName;
            const response = await register(email, password, name, contact, gender, age, avatar);
            if(response.success === true){
                alert("Your Account has been created, A confirmation link has been sent to your email account!.");
                navigation.navigate('Landingpage');
                // login(email, password);
                // Authentication MST
            }else if(response.success === false && response.error.statusCode){
                setErrorCode(response.error.statusCode);
                setErrorMessage(response.errMessage);
                setVisible(true);
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }

    function handlePaymentsForm(){

    }

    async function pickImage(){
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                let typePrefix;
                if (result.assets[0].type === "image") {
                    // Autoconverts to jpeg
                    typePrefix = "data:image/jpeg;base64,";
                } else {
                    alert("Unsupported file format. Please select a JPEG or PNG file.");
                    return;
                }
                setAvatar(`${typePrefix}${result.assets[0].base64}`);
              }
        }catch(error){
            console.log(error);
        }
      };

    const [passwordvisible, setPasswordVisible] = useState(false);
    const [confirmpasswordvisible, setConfirmPasswordVisible] = useState(false);
    return (
        <View style={styles.container}>
        <Loading/>
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)}>
                <Error ErrorCode={errorCode} ErrorMessage={errorMessage}/>
            </Modal>
        </Portal>
        <Card>
            <Card.Title 
                title={AuthContext.WhatUserType === 'Client' ? 
                    <Text>Sign up to <Text style={styles.highlight}>hire</Text> a <Text style={styles.highlight}>talent</Text></Text> 
                    : 
                    <Text>Sign Up to <Text style={styles.highlight}>find work</Text> you <Text style={styles.highlight}>love</Text></Text>}
                titleStyle={{textAlign:'center', fontSize: 20}}
                />
            <Card.Content>
            <SegmentedButtons
                value={value}
                onValueChange={(buttonvalue)=> setActive(buttonvalue)}
                density='small'
                buttons={buttons}
            />
                <View>
                    {
                        active === 'login' ? 
                        <>
                        <TextInput
                            style={styles.input}
                            dense={true}
                            label={AuthContext.WhatUserType === 'Client' ? 'Email' : 'Work Email'}
                            placeholder='JuanDelaCruz@gmail.com'
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            mode='outlined'
                            error={validationErrors.email}
                        />
                        {validationErrors.email && (
                            <HelperText type='error' visible={validationErrors.email}>
                            {validationErrors.email}
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            dense={true}
                            label='Password'
                            placeholder='Password'
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            mode='outlined'
                            secureTextEntry={!passwordvisible}
                            right={<TextInput.Icon icon={passwordvisible ? 'eye-off-outline' : 'eye-outline'} onPress={() => setPasswordVisible(!passwordvisible)} />}
                            error={validationErrors.password}

                        />
                        {validationErrors.password && (
                            <HelperText type='error' visible={validationErrors.password}>
                            {validationErrors.password}
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            dense={true}
                            label='Confirm Password'
                            placeholder='Confirm Password'
                            value={confirmpassword}
                            onChangeText={(text) => setConfirmPassword(text)}
                            mode='outlined'
                            secureTextEntry={!confirmpasswordvisible}
                            right={<TextInput.Icon icon={confirmpasswordvisible ? 'eye-off-outline' : 'eye-outline'} onPress={() => setConfirmPasswordVisible(!confirmpasswordvisible)} />}
                            error={validationErrors.confirmpassword}
                        />
                        {validationErrors.confirmpassword && (
                            <HelperText type='error' visible={validationErrors.confirmpassword}>
                            {validationErrors.confirmpassword}
                            </HelperText>
                        )}
                        <Button 
                            style={styles.inputbutton} 
                            icon='chevron-double-right' 
                            mode='contained' buttonColor='deeppink' textColor='white' 
                            onPress={()=>{
                                const isValid = handleLoginForm(); 
                                if (isValid) value.push('details'),setActive('details');
                                }}
                            >
                                    Next
                        </Button>
                        </>
                        : active === 'details' ? 
                        <>
                        <TextInput
                            style={styles.input}
                            dense={true}
                            label='First Name'
                            placeholder='Juan'
                            value={firstName}
                            onChangeText={(text) => setFirstName(text)}
                            mode='outlined'
                            error={validationErrors.firstName}
                        />
                        {validationErrors.firstName && (
                            <HelperText type='error' visible={validationErrors.firstName}>
                            {validationErrors.firstName}
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            dense={true}
                            label='Last Name'
                            placeholder='Dela Cruz'
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                            mode='outlined'
                            error={validationErrors.lastName}
                        />
                        {validationErrors.lastName && (
                            <HelperText type='error' visible={validationErrors.lastName}>
                            {validationErrors.lastName}
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            dense={true}
                            label='Contact'
                            placeholder='09XX - XXX - XXXX'
                            value={contact}
                            onChangeText={(text) => setContact(text)}
                            mode='outlined'
                            keyboardType="numeric"
                            maxLength={11}
                            error={validationErrors.contact}
                        />
                        {validationErrors.contact && (
                            <HelperText type='error' visible={validationErrors.contact}>
                            {validationErrors.contact}
                            </HelperText>
                        )}
                        <RadioButton.Group
                            onValueChange={(value) => setGender(value)}
                            value={gender}
                        >
                            <View 
                            style={[styles.radiobuttongroup, {
                                borderColor: validationErrors.gender ? '#B22D1D' : 'transparent',
                                borderWidth: validationErrors.gender ? 2 : 0,
                            }]}
                            >
                            <Text variant="titleLarge"
                                style={{
                                marginTop: 2,
                                color: validationErrors.gender ? '#B22D1D' : 'black'
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
                        {validationErrors.gender && (
                            <HelperText type='error' visible={validationErrors.gender}>
                            {validationErrors.gender}
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            dense={true}
                            label='Age'
                            placeholder='Age'
                            value={age}
                            onChangeText={(text) => setAge(text)}
                            mode='outlined'
                            keyboardType="numeric"
                            maxLength={3}
                            error={validationErrors.age}
                        />
                        {validationErrors.age && (
                            <HelperText type='error' visible={validationErrors.age}>
                            {validationErrors.age}
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            dense={true}
                            label='Avatar'
                            placeholder='Avatar'
                            value={avatar ? 'Avatar Selected' : 'No Avatar Selected'}
                            mode='outlined'
                            editable={false}
                            right={<TextInput.Icon icon="image-outline" onPress={() => pickImage()} />}
                            error={validationErrors.avatar}
                        />
                        {validationErrors.avatar && (
                            <HelperText type='error' visible={validationErrors.avatar}>
                            {validationErrors.avatar}
                            </HelperText>
                        )}
                        <Button 
                            style={styles.inputbutton} 
                            icon={AuthContext.WhatUserType === 'Freelancer' ? 'chevron-double-right' : 'account-plus' }
                            mode='contained' buttonColor='deeppink' textColor='white' 
                            onPress={()=>{
                                const isValid = handleDetailsForm();
                                if (isValid){
                                    if(AuthContext.WhatUserType === 'Freelancer'){
                                        value.push('payments'),setActive('payments');
                                    }else{
                                        registerClient();
                                    }
                                }
                                }}
                            >
                                {
                                    AuthContext.WhatUserType === 'Freelancer' ? 'Next' : 'Create Account'
                                }
                        </Button>
                        </>
                        : active === 'payments' ? 
                        <>
                        {/* <Button style={styles.inputbutton} icon='account-plus' mode='contained' buttonColor='deeppink' textColor='white' onPress={()=>{handleFormSubmit()}}>Create Account</Button> */}
                        </>
                        : null
                    }
                </View>
            </Card.Content>
            <Card.Actions>
                <View style={styles.cardaction}>
                    <Text>Already have an account?</Text>
                    <Button mode='text' textColor='deeppink' onPress={() => {navigation.navigate('Login');}}>
                        Login
                    </Button>
                </View>
            </Card.Actions>
        </Card>
        </View>
    )
})

export default ServiForm;
