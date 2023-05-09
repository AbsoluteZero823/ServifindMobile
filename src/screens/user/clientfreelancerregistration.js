import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Card, Text, TextInput, HelperText, Modal, Portal } from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { freelancerstatus, registerasfreelancer, getmyServices } from '../../../services/apiendpoints';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { User } from '../../models/user';
import { Category } from '../../models/category';
import  FreelancerStore, { Freelancer } from '../../models/freelancer';
import ServiceStore, { ServiceModel } from '../../models/service';


const ClientFreelancerRegistration = observer(({route}) => {
    const setjobsearch = route.params.props[6];
    const navigation = useNavigation();
    const ServicesContext = useContext(ServiceStore);
    const AuthContext = useContext(AuthStore);
    const FreelancerContext = useContext(FreelancerStore);
    const [schoolId, setSchoolId] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [gcash_name, setGcashName] = useState("");
    const [gcash_number, setGcashNumber] = useState("");
    const [course, setCourse] = useState("");
    const [resumePDF, setresumePDF] = useState(null);
    const [coursemenu, setcoursemenu] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

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
  ]
  
    async function pickImage(setFunction) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled) {
          if (result.assets[0].type !== "image") {
            alert("Unsupported file format. Please select a JPEG or PNG file.");
            return;
          }
          setValidationErrors({});
          setFunction(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    async function submitHandler() {
      AuthContext.letmeload();
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
      if (Object.keys(errors).length === 0) {
        const formData = new FormData();
        formData.append("gcash_name", gcash_name);
        formData.append("gcash_number", gcash_number);
        formData.append("qrCode", qrCode);
        formData.append("schoolID", schoolId);
        formData.append("resume", resumePDF);
        formData.append("course", course);
        try {
          const response = await registerasfreelancer(formData);
          if (response.success === true) {
            console.log(response)
            alert(response.message);
            freelancerstatus();
          } else {
            alert(response.errMessage);
          }
        } catch (error) {
          console.log(error);
        }
      }
      AuthContext.donewithload();
    }

    const [status, setstatus] = useState('');

    async function FreelancerStatus(){
      AuthContext.letmeload();
      try {
        const response = await freelancerstatus();
        
        if (!response.success) {
          alert(response.errMessage);
          AuthContext.donewithload();
          return;
        }

        const freelancer = response.freelancer[0];
        if (freelancer) {
          setstatus('Existing');
          if (freelancer.approved_date === undefined && freelancer.status !== 'applying') {
            AuthContext.donewithload();
            alert("Your Application is still being processed, Please wait for a while.");
            navigation.goBack();
            return;
          }
          if (freelancer.status === 'approved'){
            const servicesresponse = await getmyServices();
            FreelancerContext.data = [Freelancer.create(freelancer)];
            ServicesContext.services = servicesresponse.services.map(service => ({
              _id: service._id,
              title: service.title,
              name: service.name,
              category: Category.create(service.category),
              user: User.create(service.user),
              experience: service.experience,
              freelancer_id: Freelancer.create({
                ...service.freelancer_id, 
              }),
              status: service.status,
              images: { 
                public_id: service.images.public_id, 
                url: service.images.url, 
              }
            }));
            AuthContext.setmyrole('Freelancer');
            navigation.navigate('FreelancerHome');
            AuthContext.donewithload();
          }else if(freelancer.status === 'rejected'){
            alert('Your application has been rejected');
            AuthContext.letmeload();
          }
        } else {
          AuthContext.donewithload();
          setstatus('None');
          return;
        }
      } catch (error) {
        AuthContext.donewithload();
        console.log(error);
      }
      AuthContext.letmeload();
    }

    useEffect(()=>{
      FreelancerStatus();
    },[])

    return (
        <>
        <Loading/>
        <Portal>
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
        {
          status === 'None' ? 
          <Card style={{marginHorizontal:20, borderWidth:1, borderColor:'#9c6f6f'}}>
            <Card.Title
                title={<Text variant='titleMedium' style={{color:'#9c6f6f'}}>Freelancer Registration</Text>}
                subtitle={<Text variant='bodySmall' style={{color:'dimgray'}}>Please fill in the form below</Text>}
            />
            <Card.Content>
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
              </Card.Content>
              <Card.Actions>
                  <Button
                      icon='check'
                      mode='outlined'
                      textColor='#9c6f6f'
                      onPress={() => {
                          submitHandler();
                      }}
                  >
                      Submit
                  </Button>
              </Card.Actions>
          </Card>
          :
          <View style={{flex:1, justifyContent:'center'}}>
              <Card style={{marginHorizontal:20, borderWidth:1, borderColor:'#9c6f6f'}}>
                  <Card.Content>
                      <Text variant='titleMedium' style={{color:'#9c6f6f'}}>You're freelancer application is under consideration</Text>
                  </Card.Content>
              </Card>
          </View>
        }
        </>
    )
})

export default ClientFreelancerRegistration;