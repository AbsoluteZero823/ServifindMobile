import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Loading from '../../components/loading';
import { View, FlatList, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Card, Text, IconButton, Portal, Modal, TextInput, List, HelperText, Avatar} from 'react-native-paper';

import { getmyServices, createmyServices, myOffers } from '../../../services/apiendpoints';
import FreelancerStore from '../../models/freelancer';
import CategoryStore from '../../models/category';
import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import ServiceStore, { ServiceModel } from '../../models/service';
import OfferStore, { Offer } from '../../models/offer';
import { useNavigation } from '@react-navigation/native';


const FreelancerHome = observer(() => {
    const navigation = useNavigation();
    const FreelancerContext = useContext(FreelancerStore);
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const ServiceContext = useContext(ServiceStore);
    const OfferContext = useContext(OfferStore);
    
    const [servicescollection, setServicesCollection] = useState([]);
    const [offerscollection, setOffersCollection] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getMYSERVICES();
        getmyOffers();
        setTimeout(() => {
        setRefreshing(false);
        }, 2000);
    }, []);

    async function getMYSERVICES(){
        AuthContext.letmeload();
        try{
            const response = await getmyServices();
            if(response.success){
                setServicesCollection(response.services);
                ServiceContext.services = [];
                response.services.map((service)=>{
                    ServiceContext.services.push(service);
                })
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }

    async function getmyOffers(){
        AuthContext.letmeload();
        try{
            const response = await myOffers();
            if(response.success){
                setOffersCollection(response.myoffers);
                OfferContext.offers = [];
                response.myoffers.map((offer)=>{
                    OfferContext.offers.push(offer);
                })
            }
        }catch(error){
            console.log(error);
        }
        AuthContext.donewithload();
    }

    useEffect(()=>{
        getMYSERVICES();
        getmyOffers();
    },[]);

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
                setImage(`${typePrefix}${result.assets[0].base64}`);
              }
        }catch(error){
            console.log(error);
        }
      };

    const CategoryContext = useContext(CategoryStore);
    const CategoryCollection = CategoryContext.categories;
    const [servicemodalvisibility, setservicemodalvisibility] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [validationErrors, setvalidationErrors] = useState({});

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [shortname, setShortname] = useState('');
    const [experience, setExperience] = useState('');
    const [image, setImage]= useState('');
    const [categoryName, setCategoryName] = useState('');

    async function submithandler(){
        const Errors = {};
        if(!title){
            Errors.title = "Title is required";
        }
        if(!category){
            Errors.category = "Category is required";
        }
        if(!shortname){
            Errors.shortname = "Shortname is required";
        }
        if(!experience){
            Errors.experience = "Experience is required";
        }
        if(!image){
            Errors.image = "Image is required";
        }
        if(Object.keys(Errors).length > 0){
            setvalidationErrors(Errors);
            return;
        }
        try{
            AuthContext.letmeload()
            const submitreponse = await createmyServices({
                title: title,
                name: shortname,
                category: category,
                user: UserContext.users[0]._id,
                experience: experience,
                freelancer_id: FreelancerContext.data[0]._id,
                image: image
            });
            AuthContext.donewithload();
            setservicemodalvisibility(false);
            if(submitreponse.success){
                alert("Service Created Successfully");
            }else{
                alert("An Error has Occured");
            }
        }catch(error){
            console.log(error);
        }
    }
    return (
        <>
        <Portal>
            <Loading/>
            <Modal visible={servicemodalvisibility} onDismiss={()=>setservicemodalvisibility(false)}
                contentContainerStyle = {{marginHorizontal:20}}
            >
                {
                    servicemodalvisibility && 
                    <Card style={{borderColor:'deeppink', borderWidth:1}}>
                        <Card.Title
                            title={servicemodalvisibility ? 'Add a Service' : 'Add a Project'}
                            titleStyle={{color:'deeppink'}}
                        />
                        <Card.Content>
                            <TextInput
                                label="Category"
                                mode='outlined'
                                value={categoryName}
                                editable={false}
                                right={<TextInput.Icon icon={expanded ? 'chevron-up' : 'chevron-down'} iconColor='deeppink' onPress={()=>{setvalidationErrors({}), setExpanded(!expanded)}} />}
                                error={validationErrors.category}
                            />
                            <View style={{backgroundColor:'darksalmon', marginHorizontal:2, borderBottomRightRadius:20, borderBottomLeftRadius:20}}>
                            {   
                            expanded && CategoryCollection.map((category) => {
                                return (
                                    <List.Item key={category._id} onPress={()=>{setCategoryName(category.name), setCategory(category._id), setExpanded(false)}} title={category.name} titleStyle={{color:'white'}}/>
                                )})
                            }
                            </View>
                            {
                                validationErrors.category && <HelperText type="error" visible={true}>{validationErrors.category}</HelperText>
                            }
                            <TextInput
                                mode='outlined'
                                label='Title'
                                placeholder='Service Title'
                                onChangeText={(Text)=>{setvalidationErrors({}),setTitle(Text)}}
                                error={validationErrors.title}
                            />
                            {
                                validationErrors.title && <HelperText type="error" visible={true}>{validationErrors.title}</HelperText>
                            }
                            <TextInput
                                mode='outlined'
                                label='Short Name'
                                placeholder='Short Name'
                                onChangeText={(Text)=>{setvalidationErrors({}),setShortname(Text)}}
                                error={validationErrors.shortname}
                            />
                            {
                                validationErrors.shortname && <HelperText type="error" visible={true}>{validationErrors.shortname}</HelperText>
                            }
                            <TextInput
                                mode='outlined'
                                label='Experience'
                                placeholder='Experience'
                                multiline={true}
                                onChangeText={(Text)=>{setvalidationErrors({}),setExperience(Text)}}
                                error={validationErrors.experience}
                            />
                            {
                                validationErrors.experience && <HelperText type="error" visible={true}>{validationErrors.experience}</HelperText>
                            }
                            <TextInput
                                dense={true}
                                label='Image'
                                placeholder='Upload Image'
                                mode='outlined'
                                editable={false}
                                value={image? "Image Selected" : null}
                                right={<TextInput.Icon icon="image-outline" onPress={() => {setvalidationErrors({}),pickImage()}} />}
                                error={validationErrors.image}
                            />
                            {
                                validationErrors.image && <HelperText type="error" visible={true}>{validationErrors.image}</HelperText>
                            }
                        </Card.Content>
                        <Card.Actions>
                            <Button mode='outlined' textColor='deeppink' onPress={()=>{submithandler()}}>Submit</Button>
                        </Card.Actions>
                    </Card>
                }
            </Modal>
        </Portal>
        <View>
            <Loading/>
            <Card style={{borderWidth:1, borderColor:'deeppink', margin: 5}}>
                <Card.Title 
                    title='My Services'
                    titleStyle={{color:'deeppink', fontSize:24}}
                    right={()=><Button icon='eye' textColor='deeppink' style={{marginHorizontal:20}} onPress={()=>navigation.navigate('FreelancerServices')}>See All</Button>}
                    />
                <Card.Content>
                <FlatList
                    data={servicescollection}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item})=>
                        <TouchableOpacity onPress={()=>navigation.navigate('FreelancerService',item._id)}>
                            <Card key={item._id} style={{borderColor:'deeppink', borderWidth:1, minWidth:300, maxWidth: 300, minHeight:150, marginHorizontal: 5}}>
                                <Card.Title 
                                    title={item.title} 
                                    titleStyle={{color:'deeppink'}} 
                                    subtitle={item.name} 
                                    subtitleStyle={{color:'dimgrey'}}
                                    right={()=><IconButton icon='pencil' iconColor='deeppink' size={20} style={{marginRight:20}}/>}
                                    />
                                <Card.Content>
                                    <Text style={{color:'deeppink'}}>Experience:</Text>
                                    <Text>{item.experience}</Text>
                                </Card.Content>
                                <Card.Actions>
                                    <Text style={{color:'dimgrey'}}>Category: {item.category.name}</Text>
                                </Card.Actions>
                            </Card>
                        </TouchableOpacity>
                    }
                    ListFooterComponent={
                        servicescollection.length > 0 && 
                        <Card style={{borderColor:'dimgrey', borderWidth: 1, borderStyle:'dashed', width:'50%', minWidth:250, minHeight:150, marginRight:5}}>
                            <Card.Title
                                title="Add more services?"
                            />
                            <Card.Content style={{alignItems:'center'}}>
                            <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:200}} onPress={()=>(setservicemodalvisibility(true))}>Post a Service</Button>
                            </Card.Content>
                        </Card>
                    }
                    ListEmptyComponent={
                        <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: 300, marginBottom:20}}>
                        <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                        <Text variant='titleMedium'>No Services Yet</Text>
                        <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Post a Service on the marketplace and let a client come to you</Text>
                        <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:200}} onPress={()=>(setservicemodalvisibility(true))}>Post a Service</Button>
                        </SafeAreaView>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
                </Card.Content>
            </Card>
            <Card style={{borderWidth:1, borderColor:'deeppink', margin: 5}}>
                <Card.Title 
                    title='My Projects'
                    titleStyle={{color:'deeppink', fontSize:24}}
                    right={()=><Button icon='eye' textColor='deeppink' style={{marginHorizontal:20}} onPress={()=>navigation.navigate('FreelancerProjects')}>See All</Button>}
                />
                <Card.Content>
                <FlatList
                    data={offerscollection.sort((a, b) => {
                        const statusOrder = { granted: 0, waiting: 1, cancelled: 2 };
                        const aStatus = a.offer_status.toLowerCase();
                        const bStatus = b.offer_status.toLowerCase();
                        return statusOrder[aStatus] - statusOrder[bStatus];
                        })
                    }
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item})=>
                        <Card key={item._id} style={{minWidth:300, marginHorizontal:5, borderColor: item.offer_status === 'waiting' ? 'deeppink' : item.offer_status === 'granted' ? 'green' : 'black', borderWidth: 1}}>
                            <Card.Title 
                                title={item.request_id.requested_by.name} 
                                subtitle={<Text style={{color: item.offer_status === 'waiting' ? 'deeppink' : item.offer_status === 'granted' ? 'green' : 'red'}}>{item.offer_status}</Text>}
                                left={()=><Avatar.Image size={40} source={{uri: item.request_id.requested_by.avatar.url}}/>}
                                />
                            <Card.Content>
                                <Text style={{color:'deeppink'}}>Requested:</Text>
                                <Text style={{alignSelf:'flex-end'}}>{item.request_id.description}</Text>
                                <Text style={{color:'deeppink'}}>Category:</Text>
                                <Text style={{alignSelf:'flex-end'}}>{item.service_id.category.name}</Text>
                                <Text style={{color:'deeppink'}}>Service:</Text>
                                <Text style={{alignSelf:'flex-end'}}>{item.service_id.title}</Text>
                                <Text style={{color:'deeppink'}}>Offer:</Text>
                                <Text style={{alignSelf:'flex-end'}}>{item.description}</Text>
                            </Card.Content>
                        </Card>
                    }
                    ListEmptyComponent={
                        <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: 300, marginBottom:20}}>
                            <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                            <Text variant='titleMedium'>No Projects Yet</Text>
                            <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Accept a Job Request on the marketplace and start earning</Text>
                            <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:200}} onPress={()=>(console.log("Redirect Me!"))}>Accept a Request</Button>
                        </SafeAreaView>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
                </Card.Content>
            </Card>
        </View>
        </>
    )
})

export default FreelancerHome;