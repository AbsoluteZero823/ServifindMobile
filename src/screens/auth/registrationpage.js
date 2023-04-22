import React, { useContext, useRef } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Card, Text, RadioButton } from 'react-native-paper';
import { observer } from 'mobx-react';

import styles from '../../components/authentication/authentication.css';
import { useNavigation } from '@react-navigation/native';

import AuthStore from '../../models/authentication';

const Registration = observer(() => {
    const AuthContext = useContext(AuthStore);
    const navigation = useNavigation();
    const UserTypeList = [
        { id: '1', type: 'Client', description: 'I am a Client, Looking to Hire someone' },
        { id: '2', type: 'Freelancer', description: 'I am a Freelancer, Looking for Work' }
        ];
  const handleSelectUserType = (type, index) => {
    AuthContext.setUserType(type);
    flatListRef.current.scrollToIndex({ index });
  };
  const flatListRef = useRef(null);
    return (
      <View style={styles.container}>
        <Card style={styles.registrationpage}>
        <Card.Title title={
          <Text>Join as <Text style={styles.highlight}>Client</Text> or <Text style={styles.highlight}>Freelancer</Text></Text>
        } titleStyle={{textAlign:'center', fontSize: 20, fontWeight: 'bold'}} />
        <Card.Content>
          <RadioButton.Group onValueChange={(value) => AuthContext.setUserType(value)} value={AuthContext.WhatUserType}>
            <FlatList
              ref={flatListRef} 
              data={UserTypeList}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({item, index}) => (
                <Card style={{ margin: 10, maxWidth:250, maxHeight: 200 }} onPress={() => handleSelectUserType(item.type, index)}>
                  <Card.Title
                    title={item.type}
                    titleStyle={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}
                    right={() => (
                      <RadioButton
                        color='#9c6f6f'
                        value={item.type}
                        status={AuthContext.WhatUserType === item.type ? 'checked' : 'unchecked'}
                      />
                    )}
                  />
                  <Card.Content>
                    <Text style={{ textAlign: 'center' }}>
                      {item.description}
                    </Text>
                  </Card.Content>
                </Card>
              )}
                                          
            />
          </RadioButton.Group>
          <Button style={styles.inputbutton} disabled={!AuthContext.WhatUserType} onPress={() => {navigation.navigate('Serviform');}} buttonColor='#9c6f6f' textColor='white'>{AuthContext.WhatUserType ? `Apply as a ${AuthContext.WhatUserType}` : 'Create Account' }</Button>
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
    );
  }); 

export default Registration;