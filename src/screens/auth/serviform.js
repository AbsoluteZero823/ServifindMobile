import * as ImagePicker from 'expo-image-picker';
import React, { useState, useContext } from 'react';
import { ScrollView, View} from 'react-native';
import { Button, Card, Text, RadioButton, TextInput, HelperText, SegmentedButtons, Portal, Modal } from 'react-native-paper';
import { observer } from 'mobx-react';
import Error from '../../components/err/error';
import styles from '../../components/authentication/authentication.css';
import { initialasfreelancer, register } from '../../../services/apiendpoints';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import AuthStore from '../../models/authentication';

const ServiForm = observer(() => {
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();
    // Initializing Segmented Value
    const [value, setValue] = useState(['login']);
    const [active, setActive] = useState('login');
    // Segmented Button Setup
    const buttons = [
        {
            value: 'login',
            label: 'Login',
            uncheckedColor: 'white',
            style: {backgroundColor: active === 'login' ? '#9c6f6f' : value.includes('login') ? '#9c6f6f' : 'transparent'},
            disabled : value.includes('login') ? false : true,
        },
        {
            value: 'details',
            label: 'Details',
            uncheckedColor: 'white',
            style: {backgroundColor: active === 'details' ? '#9c6f6f' : value.includes('details') ? '#9c6f6f' : 'transparent'},
            disabled : value.includes('details') ? false : true,
        },
        ];
        if (AuthContext.WhatUserType === 'Freelancer') {
        buttons.push({
            value: 'payments',
            label: 'Payments',
            uncheckedColor: 'white',
            style: {backgroundColor: active === 'payments' ? '#9c6f6f' : value.includes('payments') ? '#9c6f6f' : 'transparent'},
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

    const [qrCode, setQrCode] = useState("");
    const [gcash_name, setGcashName] = useState("");
    const [gcash_number, setGcashNumber] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [course, setCourse] = useState("");
    const [resumePDF, setresumePDF] = useState(null);
    const [coursemenu, setcoursemenu] = useState(false);

    const courseitems = [
            // BACHELOR OF ENGINEERING TECHNOLOGY (BET) COURSES
            {id: 'BETAT' , name : "BET Major in Automotive Technology (BETAT-T)"},
            {id: 'BETChT' , name : "BET Major in Chemical Technology (BETChT-T)"},
            {id: 'BETCT' , name : "BET Major in Construction Technology (BETCT-T)"},
            {id: 'BETET' , name : "BET Major in Electrical Technology (BETET-T)"},
            {id: 'BETEMT' , name : "BET Major in Electromechanical Technology (BETEMT-T)"},
            {id: 'BETElxT' , name : "BET Major in Electronics Technology (BETElxT-T)"},
            {id: 'BETInCT' , name : "BET Major in Instrumentation and Control Technology (BETInCT-T)"},
            {id: 'BETMT' , name : "BET Major in Mechanical Technology (BETMT-T)"},
            {id: 'BETMecT' , name : "BET Major in Mechatronics Technology (BETMecT-T)"},
            {id: 'BETNDTT' , name : "BET Major in Non-Destructive Testing Technology (BETNDTT-T)"},
            {id: 'BETDMT' , name : "BET Major in Dies & Moulds Technology (BETDMT-T)"},
            {id: 'BETHVAC/RT' , name : "BET Major in Heating, Ventilation and Airconditioning/Refrigeration Technology (BETHVAC/RT-T)"},
            // ENGINEERING COURSES
            {id: 'BSCESEP',name: "Bachelor of Science in Civil Engineering (BSCESEP-T)"},
            {id: 'BSEESEP',name: "Bachelor of Science in Electrical Engineering (BSEESEP-T)"},
            {id: 'BSECESEP',name: "Bachelor of Science in Electronics Engineering (BSECESEP-T)"},
            {id: 'BSMESEP',name: "Bachelor of Science in Mechanical Engineering (BSMESEP-T)"},
            // OTHER SCIENCE COURSES
            {id: 'BSIT',name: "Bachelor of Science in Information Technology (BSIT-T)"},
            {id: 'BSIS',name: "Bachelor of Science in Information System (BSIS-T)"},
            {id: 'BSESSDP',name: "Bachelor of Science in Environmental Science (BSESSDP-T)"},
            // OTHERS
            {id: 'BGTAT',name: "Bachelor in Graphics Technology Major in Architecture Technology (BGTAT-T)"},
            {id: 'BTVTEdET',name: "BTVTE Major in Electrical Technology (BTVTEdET-T)"},
            {id: 'BTVTEdElxT',name: "BTVTE Major in Electronics Technology (BTVTEdElxT-T)"},
            {id: 'BTVTEdICT',name: "BTVTE Major in Information and Communication Technology (BTVTEdICT-T)"},
        ];

    const [validationErrors, setValidationErrors] = useState({});
    function handleLoginForm(){
        const errors = {};
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Invalid email address';

        } else if (AuthContext.WhatUserType === 'Freelancer' && !email.endsWith('@tup.edu.ph')) {
            errors.email = 'Invalid email domain. Please enter an email address from @tup.edu.ph domain';
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
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return false;
        } else {
            return true;
        }
    }

    function handleDetailsForm(){
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
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return false;
            } else {
            return true;
            }
    }

    function handlePaymentsForm(){
        const errors = {};
        if (!gcash_name) {
            errors.gcash_name = "Please enter your gcash name";
        }
        if (!gcash_number || gcash_number.length > 11) {
            errors.gcash_number = "Please enter your gcash number";
        }
        if (!qrCode) {
            errors.qrCode = "Please select your qr code";
        }
        if (!schoolId) {
            errors.schoolId = "Please select your School ID";
        }
        if (!course) {
            errors.course = "Please select a valid course";
        }
        if (!resumePDF) {
            errors.resumePDF = "Please select your resume";
        }
        setValidationErrors(errors);
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
            console.log(response)
            if(response.success === true){
                AuthContext.donewithload();
                alert("Your Account has been created, A confirmation link has been sent to your email account!.");
                reroute();
                return (response);
            }else if(response.success === false && response.message){
                alert(response.message)
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }

    function reroute(){
        navigation.navigate('Landingpage');
    }

    async function registermeasafreelancer(){
        AuthContext.letmeload();
        let name = firstName + ' ' + lastName;
        const userinfo = await register(email, password, name, contact, gender, age, avatar);
        if(userinfo.success){
            try{
                const formData = new FormData();
                formData.append("gcash_name", gcash_name);
                formData.append("gcash_number", gcash_number);
                formData.append("qrCode", qrCode);
                formData.append("schoolID", schoolId);
                formData.append("resume", resumePDF);
                formData.append("course", course);
                formData.append("user_id", userinfo.user._id);
                const response = await initialasfreelancer(formData);
                console.log(response)
                if (response.success) {
                    console.log(response)
                    alert(response.message);
                } else {
                    alert(response.message);
                }
            }catch(error){
                AuthContext.donewithload();
                console.log(error);
            }
            AuthContext.donewithload();
        }else if(response.success === false && response.message){
            alert(response.message)
            AuthContext.donewithload();
        }
    }

    async function pickImage(setFunction){
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
                setFunction(`${typePrefix}${result.assets[0].base64}`);
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
            <Modal visible={coursemenu} onDismiss={() => setcoursemenu(false)} contentContainerStyle={{height: '80%'}}>
                <Card>
                    <Card.Content>
                        <ScrollView>
                        {
                            courseitems.map((courseitems)=>
                                <Button key={courseitems.id} onPress={()=>{setcoursemenu(false), setCourse(courseitems.name)}}>{courseitems.name}</Button>
                            )
                        }
                        </ScrollView>
                    </Card.Content>
                </Card>
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
                            mode='contained' buttonColor='#9c6f6f' textColor='white' 
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
                                <RadioButton value="Male" color='#9c6f6f' />
                                <Text style={{ marginVertical: 8 }}>Male</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton value="Female" color='#9c6f6f' />
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
                            right={<TextInput.Icon icon="image-outline" onPress={() => pickImage(setAvatar)} />}
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
                            mode='contained' buttonColor='#9c6f6f' textColor='white' 
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
                        <TextInput
                            dense={true}
                            label='Gcash Name'
                            placeholder='Name'
                            onChangeText={(text) => {setValidationErrors({}),setGcashName(text)}}
                            mode='outlined'
                            error={validationErrors?.gcash_name}
                        />
                        {
                            validationErrors?.gcash_name && <HelperText type="error" >{validationErrors.gcash_name}</HelperText>
                        }
                        <TextInput
                            dense={true}
                            label='Gcash Number'
                            placeholder='Number'
                            // value={age}
                            onChangeText={(text) => {setValidationErrors({}),setGcashNumber(text)}}
                            mode='outlined'
                            maxLength={11}
                            keyboardType="numeric"
                            error={validationErrors?.gcash_number}
                        />
                        {
                            validationErrors?.gcash_number && <HelperText type="error" >{validationErrors.gcash_number}</HelperText>
                        }
                        <TextInput
                            dense={true}
                            label='QR Code'
                            placeholder='QR Code'
                            value={qrCode ? 'QR Code Selected' : 'No QR Code Selected'}
                            mode='outlined'
                            editable={false}
                            right={<TextInput.Icon icon="image-outline" onPress={() => pickImage(setQrCode)} />}
                            error={validationErrors?.qrCode}
                        />
                        {
                            validationErrors?.qrCode && <HelperText type="error" >{validationErrors.qrCode}</HelperText>
                        }
                        <TextInput
                            dense={true}
                            label='School ID'
                            placeholder='School ID...'
                            value={schoolId ? 'School ID Selected' : 'No School ID Selected'}
                            mode='outlined'
                            editable={false}
                            right={<TextInput.Icon icon="image-outline" onPress={() => pickImage(setSchoolId)} />}
                            error={validationErrors?.schoolId}
                        />
                        {
                            validationErrors?.schoolId && <HelperText type="error" >{validationErrors.schoolId}</HelperText>
                        }
                        <TextInput
                            dense={true}
                            label='Course'
                            placeholder='BS - XXXXX'
                            editable={false}
                            value={course}
                            mode='outlined'
                            error={validationErrors?.course}
                            right={<TextInput.Icon icon="menu" onPress={()=>setcoursemenu(true)}/>}
                        />
                        {
                            validationErrors?.course && <HelperText type="error" >{validationErrors.course}</HelperText>
                        }
                        <TextInput
                            dense={true}
                            label='Resume'
                            placeholder='Resume...'
                            value={resumePDF ? 'Resume Selected' : 'No Resume Selected'}
                            mode='outlined'
                            editable={false}
                            right={<TextInput.Icon icon="file-document-outline" onPress={() => pickImage(setresumePDF)} />}
                            error={validationErrors?.resumePDF}
                        />
                        {
                            validationErrors?.resumePDF && <HelperText type="error" >{validationErrors.resumePDF}</HelperText>
                        }
                        <Button 
                            style={styles.inputbutton} 
                            icon='chevron-double-right' 
                            mode='contained' buttonColor='#9c6f6f' textColor='white' 
                            onPress={()=>{
                                const isValid = handlePaymentsForm();
                                if (isValid){
                                    registermeasafreelancer();
                                }}
                            }
                            >
                                Submit
                        </Button>
                        </>
                        : null
                    }
                </View>
            </Card.Content>
            <Card.Actions>
                <View style={styles.cardaction}>
                    <Text>Already have an account?</Text>
                    <Button mode='text' textColor='#9c6f6f' onPress={() => {navigation.navigate('Login');}}>
                        Login
                    </Button>
                </View>
            </Card.Actions>
        </Card>
        </View>
    )
})

export default ServiForm;
