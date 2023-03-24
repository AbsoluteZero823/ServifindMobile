import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Portal, Modal, TextInput, List, HelperText} from 'react-native-paper';
import { createmyRequest } from '../../../services/apiendpoints';

import UserStore, { User } from '../../models/user';
import RequestStore, { Request } from '../../models/request';
import CategoryStore, { Category } from '../../models/category';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';


const ClientJobsRequest = observer(() => {
    const UserContext = useContext(UserStore);
    const RequestContext = useContext(RequestStore);
    const CategoryContext = useContext(CategoryStore);
    const AuthContext = useContext(AuthStore);
    const CategoryCollection = CategoryContext.categories;
    const navigation = useNavigation();

    const [mainVisible, setmainVisible] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');

    const [validationerrors, setvalidationerrors] = useState({});

    const hideModal = () => {setmainVisible(false), navigation.goBack()};

    async function requesthandler(){
        if (category && description) {
            AuthContext.letmeload();
        try{
            const requestresponse = await createmyRequest({category, description});
            if(requestresponse.success){
                setmainVisible(false);
                navigation.navigate('ClientHome');
                alert('Job Request Uploaded Successfully');
                const request = requestresponse.addeddata[0];
                RequestContext.requests.push(Request.create({
                    _id: request._id,
                    category: Category.create(request.category),
                    description: request.description,
                    created_At: new Date(request.created_At),
                    request_status: request.request_status,
                    requested_by: User.create(request.requested_by),
                }));
            }else{
                alert('Something Went Wrong!');
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
        }else{
            const errors = {};
            if (!category) {
                errors.category = 'Category is required';
            }
            if (!description) {
                errors.description = 'Description is required';
            }
            setvalidationerrors(errors);
            alert('Please fill all the fields');
        }
    }

    return (

        <Portal>
            <Loading/>
            <Modal visible={mainVisible} onDismiss={hideModal} contentContainerStyle={{marginHorizontal:10}}>
                <Card>
                    <Card.Title title="Post-a-Job"/>
                    <Card.Content>
                        <TextInput
                            label="Category"
                            mode='outlined'
                            value={categoryName}
                            placeholder='Search.....'
                            onChangeText={(text) => setCategoryName(text)}
                            right={<TextInput.Icon icon={expanded ? 'chevron-up' : 'chevron-down'} iconColor='deeppink' onPress={()=>setExpanded(!expanded)} />}
                            left={<TextInput.Icon icon='magnify' iconColor='deeppink'/>}
                            error={validationerrors.category}
                        />
                        <View style={{backgroundColor:'darksalmon', marginHorizontal:2, borderBottomRightRadius:20, borderBottomLeftRadius:20}}>
                        {   expanded && CategoryCollection.filter((category)=>category.name.toLowerCase().includes(categoryName?.toLowerCase())).map((category) => {
                            return (
                                <List.Item key={category._id} onPress={()=>{setCategoryName(category.name), setCategory(category._id), setExpanded(false)}} title={category.name} titleStyle={{color:'white'}}/>
                            )})
                        }
                        </View>
                        {
                            validationerrors.category && <HelperText type='error'>{validationerrors.category}</HelperText>
                        }
                        <TextInput
                            mode='outlined'
                            label='Description'
                            multiline={true}
                            dense={true}
                            onChangeText={(text) => setDescription(text)}
                            style={{marginVertical:5}}
                            right={<TextInput.Icon icon="window-close" iconColor='deeppink' onPress={()=>setDescription('')}/>}
                            numberOfLines={5}
                            error={validationerrors.description}
                        />
                        {
                            validationerrors.description && <HelperText type='error'>{validationerrors.description}</HelperText>
                        }
                    </Card.Content>
                    <Card.Actions> 
                        <Button 
                        mode='contained' 
                        icon='check'
                        iconColor='white'
                        buttonColor='green'
                        onPress={()=>{
                            requesthandler();
                        }}>
                            Submit
                        </Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
        
    )
})

export default ClientJobsRequest;