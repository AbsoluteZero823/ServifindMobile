import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useContext } from 'react';
import { Image, ToastAndroid } from 'react-native';
import Loading from '../../components/loading';
import { Modal, Portal, Text, Button, Card, TextInput, HelperText } from 'react-native-paper';
import { upgradefreelancer } from '../../../services/apiendpoints';

import FreelancerStore from '../../models/freelancer';
import AuthStore from '../../models/authentication';

const FreelancerPremium = () => {
  const navigation = useNavigation();
  const FreelancerContext = useContext(FreelancerStore);
  const AuthContext = useContext(AuthStore);

  const [visible, setVisible] = useState(true);
  const [modalstate, setmodalstate] = useState('prompt');
  const [validationErrors, setValidationErrors] = useState([]);
  const [receipt, setreceipt] = useState();
  const hideModal = () => {setVisible(false), navigation.goBack()};

  async function upgradeToPremium(){
      AuthContext.letmeload();
      const Errors = {};
      if(!receipt){
          Errors.receipt = 'Please select a receipt';
          setValidationErrors(Errors);
          AuthContext.donewithload();
          return;
      }else{
          try{
            const upgraderesponse = await upgradefreelancer({receipt});
            if (upgraderesponse.success){
              AuthContext.donewithload();
              FreelancerContext.data[0] = upgraderesponse.freelancer;
              ToastAndroid.show(upgraderesponse.message, ToastAndroid.SHORT);
              hideModal();
            }
          }catch(error){
            AuthContext.donewithload();
            console.log(error);
          }
      }
      AuthContext.donewithload();
  };

  async function pickImage(){
    try{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [3,4],
            quality: 1
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
            setreceipt(`${typePrefix}${result.assets[0].base64}`);
          }
    }catch(error){
        console.log(error);
    }
  };

  return (
    <Portal>
      <Loading/>
      <Modal visible={visible} onDismiss={hideModal}>
        <Card style={{padding: 10, margin:8}}>
          <Card.Title title="Upgrade to Premium" titleStyle={{color:'#9c6f6f'}} />
          {
            modalstate === 'prompt' &&
            <>
            <Card.Content>
              <Text>In Premium you get the following benefits:</Text>
              <Text>- Unlimited Services (Create as many Services as you like)</Text>
              <Text>- Unlimited Projects (Accept as many Job Requests as you want)</Text>
            </Card.Content>
            <Card.Actions style={{justifyContent: 'flex-end'}}>
              <Button mode="contained" onPress={()=>setmodalstate('payment')} style={{marginRight: 10}}>Yes</Button>
              <Button mode="outlined" onPress={hideModal}>No</Button>
            </Card.Actions>
            </>
          }
          {
            modalstate === 'payment' &&
            <>
            <Card.Content>
              <Text variant='titleMedium' style={{textAlign:'center', color:'#9c6f6f'}}>ADMIN GCASH ACCOUNT</Text>
              <Image source={require('../../../assets/placeholderQR.png')} style={{width: '100%', marginVertical:4}} />
              <Text variant='titleMedium' style={{textAlign:'center', color:'#9c6f6f'}}>₱ 50.00</Text>
              <TextInput
                style={{marginTop:12}}
                dense={true}
                label='Upload a Valid GCash Receipt'
                placeholder='GCash Receipt'
                value={receipt ? 'Image Selected' : 'No Image Selected'}
                mode='outlined'
                editable={false}
                right={<TextInput.Icon icon="image-outline" onPress={() => pickImage()} />}
                error={validationErrors.receipt}
            />
            {validationErrors.receipt && (
                <HelperText type='error' visible={validationErrors.receipt}>
                {validationErrors.receipt}
                </HelperText>
            )}
            
            </Card.Content>
            <Card.Actions style={{justifyContent: 'flex-end'}}>
              <Button mode="contained" onPress={()=>upgradeToPremium()} style={{marginRight: 10}}>Submit</Button>
              <Button mode="outlined" onPress={hideModal}>Cancel</Button>
            </Card.Actions>
            </>
          }
        </Card>
      </Modal>
    </Portal>
  );
};

export default FreelancerPremium;
