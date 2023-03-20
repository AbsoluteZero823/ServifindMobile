import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { Button, Card, Text, TextInput, HelperText, Portal, Modal } from 'react-native-paper';
import { observer } from 'mobx-react';
import Loading from '../../components/loading';
import Error from '../../components/err/error';
import styles from '../../components/authentication/authentication.css';
import { login } from '../../../services/apiendpoints';
import UserStore, { User } from '../../models/user';

import { useNavigation } from '@react-navigation/native';

import AuthStore from '../../models/authentication';

const LoginPage = observer(() => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [validationErrors, setValidationErrors] = useState({});
    const [visible, setVisible] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [errorCode, setErrorCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);

    async function handleLoginForm(){
        AuthContext.letmeload();
        const errors = {};
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Invalid email address';
        }
        if (!password || password.length < 6) {
            errors.password = '6 Character Minimum';
        }
        if (validationErrors.email) {
            errors.email = validationErrors.email;
        }
        if (validationErrors.password) {
            errors.password = validationErrors.password;
        }
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            AuthContext.donewithload();
            return;
        }else{
            const response = await login(email, password);
            if (response.success === false && response.error) {
                setErrorCode(response.error.statusCode);
                setErrorMessage(response.errMessage);
                setVisible(true);
            }else if(response.success === true && response.token){
                const UserInstance = User.create({
                    id: response.user._id,
                    email: response.user.email,
                    name: response.user.name,
                    contact: response.user.contact,
                    gender: response.user.gender,
                    role: response.user.role,
                    age: response.user.age,
                    avatar: response.user.avatar,
                })
                if(UserContext.users.length === 0){
                    UserContext.users.push(UserInstance);
                    AuthContext.donewithload();
                    AuthContext.loggedin(response.token, response.user.role);
                }
                
            }
        }
    }
    return (
        <View style={styles.container}>
        <Loading/>
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)}>
                <Error ErrorCode={errorCode} ErrorMessage={errorMessage}/>
            </Modal>
        </Portal>
        
        <Card style={styles.registrationpage}>
            <Card.Title title="Log in to ServiFind" titleStyle={{textAlign:'center', fontSize: 20, fontWeight: 'bold', color:'deeppink'}} />
            <Card.Content>
                <TextInput
                    style={styles.input}
                    dense={true}
                    label='Email'
                    placeholder='JuanDelaCruz@gmail.com'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    left={<TextInput.Icon icon="account-outline"/>}
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
                    left={<TextInput.Icon icon="lock-outline"/>}
                    mode='outlined'
                    secureTextEntry={!visiblePassword}
                    right={<TextInput.Icon icon={visiblePassword ? 'eye-off-outline' : 'eye-outline'} onPress={() => setVisiblePassword(!visiblePassword)}/>}
                    error={validationErrors.password}
                />
                {validationErrors.password && (
                    <HelperText type='error' visible={validationErrors.password}>
                    {validationErrors.password}
                    </HelperText>
                )}
                <Button style={styles.inputbutton} icon='login' onPress={() => {handleLoginForm()}} buttonColor='deeppink' textColor='white'>Login</Button>
            </Card.Content>
            <Card.Actions>
            <View style={{flexDirection:'row', alignItems:'center',flex: 1, justifyContent:'center'}}>
                <Text>Don't have an account?</Text>
                <Button mode='text' textColor='deeppink' onPress={() => {navigation.navigate('Register');}}>
                Register
                </Button>
            </View>
            </Card.Actions>
        </Card>
        </View>
    );
  }); 
export default LoginPage;

