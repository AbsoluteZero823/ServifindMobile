import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, TextInput, HelperText} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { freelancerstatus, registerasfreelancer } from '../../../services/apiendpoints';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import  FreelancerStore, { Freelancer } from '../../models/freelancer';


const ClientFreelancerRegistration = observer(({route}) => {
    const setjobsearchmenu = route.params.props[6];
    const setjobsearch = route.params.props[7];
    const navigation = useNavigation();
    const AuthContext = useContext(AuthStore);
    const FreelancerContext = useContext(FreelancerStore);
    const [qrCode, setQrCode] = useState("");
    const [gcash_name, setGcashName] = useState("");
    const [gcash_number, setGcashNumber] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [resumeName, setresumeName] = useState("");
    const [resumeFile, setresumeFile] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
  
    async function pickImage(setFunction) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
          allowsEditing: true,
          aspect: [4, 4],
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
  
    async function pickDocument() {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/pdf",
        });
        if (result.type === "success") {
            setValidationErrors({});
            setresumeName(result.name);
            setresumeFile(result);
        }
      } catch (err) {
        console.log("Error picking document:", err);
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
      if (!resumeFile) {
        errors.resumeFile = "Please select your resume";
      }
      setValidationErrors(errors);
      if (Object.keys(errors).length === 0) {
        const formData = new FormData();
        formData.append("gcash_name", gcash_name);
        formData.append("gcash_number", gcash_number);
        formData.append("qrCode", qrCode);
        formData.append("schoolID", schoolId);
        formData.append("resume", {
          uri: resumeFile.uri,
          name: resumeFile.name,
          type: "application/pdf",
        });
        try {
          const response = await registerasfreelancer(formData);
          if (response.success === true) {
            alert(
              "Your Account has been created, A confirmation link has been sent to your email account!."
            );
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
        if (response.success === true) {
            if(response.freelancer.length > 0){
                if(response.freelancer[0].approved_date === null){
                    setstatus('Pending')
                }else{
                    setjobsearchmenu([
                      {
                        title:'Requests',
                        icon:'briefcase-variant-outline'
                      },
                      {
                        title:'Clients',
                        icon:'account-group-outline'
                      },
                    ])
                    setjobsearch('Requests');
                    FreelancerContext.data = ([]);
                    response.freelancer[0].approved_date = new Date(response.freelancer[0].approved_date);
                    const freelancerinfo = Freelancer.create(response.freelancer[0]);
                    FreelancerContext.data.push(freelancerinfo);
                    AuthContext.setmyrole('Freelancer');
                    navigation.navigate('FreelancerHome');
                }
            }else{
                alert("We need you to register first as a Freelancer");
                setstatus('None')
            }
        } else {
          alert(response.errMessage);
        }
      } catch (error) {
        console.log(error);
      }
      AuthContext.donewithload();
    }

    useEffect(()=>{
      FreelancerStatus();
    },[])

    return (
        <>
        <Loading/>
        {
            status === 'None' ? 
            <Card style={{marginHorizontal:20, borderWidth:1, borderColor:'deeppink'}}>
                <Card.Title
                    title={<Text variant='titleMedium' style={{color:'deeppink'}}>Freelancer Registration</Text>}
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
                    label='Resume'
                    placeholder='Resume...'
                    value={resumeName ? resumeName : 'No Resume Selected'}
                    mode='outlined'
                    editable={false}
                    right={<TextInput.Icon icon="file-document-outline" onPress={() => pickDocument()} />}
                    error={validationErrors?.resumeFile}
                />
                {
                    validationErrors?.resumeFile && <HelperText type="error" >{validationErrors.resumeFile}</HelperText>
                }
                </Card.Content>
                <Card.Actions>
                    <Button
                        icon='check'
                        mode='outlined'
                        textColor='deeppink'
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
                <Card style={{marginHorizontal:20, borderWidth:1, borderColor:'deeppink'}}>
                    <Card.Content>
                        <Text variant='titleMedium' style={{color:'deeppink'}}>You're freelancer application is under consideration</Text>
                    </Card.Content>
                </Card>
            </View>

        }
        </>
    )
})

export default ClientFreelancerRegistration;