import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Loading from '../../components/loading';
import Infoline from '../../components/infoline';
import { View, FlatList, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Card, Text, IconButton, Portal, Modal, TextInput, List, HelperText, Avatar} from 'react-native-paper';

import { getmyServices, createmyServices, editmyServices, myOffers } from '../../../services/apiendpoints';
import FreelancerStore from '../../models/freelancer';
import CategoryStore from '../../models/category';
import UserStore from '../../models/user';
import AuthStore from '../../models/authentication';
import ServiceStore from '../../models/service';
import OfferStore from '../../models/offer';
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
    const [serviceeditmodalvisibility, setserviceeditmodalvisibility] = useState(false);
    const [servicemodalvisibility, setservicemodalvisibility] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [validationErrors, setvalidationErrors] = useState({});

    const [_id, set_id] = useState('');
    const [price, setprice] = useState('');
    const [category, setCategory] = useState('');
    const [name, setname] = useState('');
    const [Description, setDescription] = useState('');
    const [image, setImage]= useState('');
    const [categoryName, setCategoryName] = useState('');

    async function submithandler(){
        const Errors = {};
        if(!category){
            Errors.category = "Category is required";
        }
        if(!name){
            Errors.name = "name is required";
        }
        if(!price){
            Errors.price = "price is required";
        }
        if(!Description){
            Errors.Description = "Description is required";
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
            const submitresponse = await createmyServices({
                name: name,
                category: category,
                user: UserContext.users[0]._id,
                description: Description,
                freelancer_id: FreelancerContext.data[0]._id,
                priceStarts_At: price,
                images: image
            });
            AuthContext.donewithload();
            setservicemodalvisibility(false);
            if(submitresponse.success){
                alert("Service Created Successfully");
            }else{
                alert(submitresponse.errMessage || submitresponse.message);
            }
        }catch(error){
            console.log(error);
        }
    }

    async function edithandler(){
        const Errors = {};
        if(!name){
            Errors.name = "name is required";
        }
        if(!price){
            Errors.price = "price is required";
        }
        if(!Description){
            Errors.Description = "Description is required";
        }
        if(Object.keys(Errors).length > 0){
            setvalidationErrors(Errors);
            return;
        }
        try{
            setserviceeditmodalvisibility(false);
            AuthContext.letmeload()
            const submitresponse = await editmyServices({
                _id: _id,
                name: name,
                priceStarts_At: price,
                description: Description,
                image: image
            });
            AuthContext.donewithload();
            if(submitresponse.success){
                alert("Service Edited Successfully");
            }else{
                alert(submitresponse.message);
            }
        }catch(error){
            console.log(error);
        }
    }

    return (
        <>
        <Loading/>
        <Portal>
            <Modal visible={servicemodalvisibility} onDismiss={()=>setservicemodalvisibility(false)}
                contentContainerStyle = {{marginHorizontal:20}}
            >
                {
                    servicemodalvisibility && 
                    <Card style={{borderColor:'#9c6f6f', borderWidth:1}}>
                        <Card.Title
                            title={'Add a Service'}
                            titleStyle={{color:'#9c6f6f'}}
                        />
                        <Card.Content>
                            <TextInput
                                label="Category"
                                mode='outlined'
                                value={categoryName}
                                editable={false}
                                right={<TextInput.Icon icon={expanded ? 'chevron-up' : 'chevron-down'} iconColor='#9c6f6f' onPress={()=>{setvalidationErrors({}), setExpanded(!expanded)}} />}
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
                                label='Name'
                                placeholder='Name'
                                onChangeText={(Text)=>{setvalidationErrors({}),setname(Text)}}
                                error={validationErrors.name}
                            />
                            {
                                validationErrors.name && <HelperText type="error" visible={true}>{validationErrors.name}</HelperText>
                            }
                            <TextInput
                                mode='outlined'
                                label='Pricing Reference'
                                placeholder='Your Reference for Pricing'
                                keyboardType='numeric'
                                onChangeText={(Text)=>{setvalidationErrors({}),setprice(Text)}}
                                error={validationErrors.price}
                            />
                            {
                                validationErrors.price && <HelperText type="error" visible={true}>{validationErrors.price}</HelperText>
                            }
                            <TextInput
                                mode='outlined'
                                label='Description'
                                placeholder='Description'
                                multiline={true}
                                onChangeText={(Text)=>{setvalidationErrors({}),setDescription(Text)}}
                                error={validationErrors.Description}
                            />
                            {
                                validationErrors.Description && <HelperText type="error" visible={true}>{validationErrors.Description}</HelperText>
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
                            <Button mode='outlined' textColor='#9c6f6f' onPress={()=>{submithandler()}}>Submit</Button>
                        </Card.Actions>
                    </Card>
                }
            </Modal>
            <Modal visible={serviceeditmodalvisibility} onDismiss={()=>setserviceeditmodalvisibility(false)}
                contentContainerStyle = {{marginHorizontal:20}}
            >
                {
                    serviceeditmodalvisibility && 
                    <Card style={{borderColor:'#9c6f6f', borderWidth:1}}>
                        <Card.Title
                            title={'Add a Service'}
                            titleStyle={{color:'#9c6f6f'}}
                        />
                        <Card.Content>
                            <TextInput
                                label="Category"
                                mode='outlined'
                                value={categoryName}
                                disabled={true}
                                editable={false}
                                right={<TextInput.Icon icon={expanded ? 'chevron-up' : 'chevron-down'} iconColor='#9c6f6f' onPress={()=>{setvalidationErrors({}), setExpanded(!expanded)}} />}
                                error={validationErrors.category}
                            />
                            <TextInput
                                mode='outlined'
                                label='Name'
                                placeholder='Name'
                                value={name}
                                onChangeText={(Text)=>{setvalidationErrors({}),setname(Text)}}
                                error={validationErrors.name}
                            />
                            {
                                validationErrors.name && <HelperText type="error" visible={true}>{validationErrors.name}</HelperText>
                            }
                            <TextInput
                                mode='outlined'
                                label='Pricing Reference'
                                placeholder='Your Reference for Pricing'
                                keyboardType='numeric'
                                value={price}
                                onChangeText={(Text)=>{setvalidationErrors({}),setprice(Text)}}
                                error={validationErrors.price}
                            />
                            {
                                validationErrors.price && <HelperText type="error" visible={true}>{validationErrors.price}</HelperText>
                            }
                            <TextInput
                                mode='outlined'
                                label='Description'
                                placeholder='Description'
                                value={Description}
                                multiline={true}
                                onChangeText={(Text)=>{setvalidationErrors({}),setDescription(Text)}}
                                error={validationErrors.Description}
                            />
                            {
                                validationErrors.Description && <HelperText type="error" visible={true}>{validationErrors.Description}</HelperText>
                            }
                            <TextInput
                                dense={true}
                                label='Image'
                                placeholder='Upload Image'
                                mode='outlined'
                                editable={false}
                                value={image ? "Image Selected" : null}
                                right={<TextInput.Icon icon="image-outline" onPress={() => {setvalidationErrors({}),pickImage()}} />}
                                error={validationErrors.image}
                            />
                            {
                                validationErrors.image && <HelperText type="error" visible={true}>{validationErrors.image}</HelperText>
                            }
                        </Card.Content>
                        <Card.Actions>
                            <Button mode='outlined' textColor='#9c6f6f' onPress={()=>{edithandler()}}>Submit</Button>
                        </Card.Actions>
                    </Card>
                }
            </Modal>
        </Portal>
        <View>
            <Loading/>
            <Card style={{borderWidth:1, borderColor:'#9c6f6f', margin: 5}}>
                <Card.Title 
                    title='My Services'
                    titleStyle={{color:'#9c6f6f', fontSize:24}}
                    right={()=>
                        <Button 
                            icon='eye' 
                            textColor='#9c6f6f' 
                            style={{marginHorizontal:20}}
                            onPress={()=>
                                navigation.navigate('FreelancerServices')
                            }
                            >See All</Button>}
                    />
                <Card.Content>
                <FlatList
                    data={servicescollection}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item})=>
                        <TouchableOpacity onPress={()=>navigation.navigate('FreelancerService',item._id)}>
                            <Card key={item._id} style={{borderColor:'#9c6f6f', borderWidth:1, minWidth:300, maxWidth: 300, minHeight:150, marginHorizontal: 5}}>
                                <Card.Title 
                                    title={item.name} 
                                    titleStyle={{color:'#9c6f6f'}} 
                                    subtitle={item.category.name}
                                    subtitleStyle={{color:'dimgrey'}}
                                    right={()=>
                                        <IconButton 
                                            icon='pencil'
                                            iconColor='#9c6f6f' 
                                            style={{marginHorizontal:20}}
                                            onPress={()=>{
                                                set_id(item._id),
                                                setserviceeditmodalvisibility(true),
                                                setCategoryName(item.category.name),
                                                setDescription(item.description),
                                                setname(item.name),
                                                setprice(item.price)
                                            }}
                                        />}
                                    />
                                <Card.Content>
                                    {
                                        item.description ?
                                        <>
                                        <Text style={{color:'#9c6f6f'}}>Description:</Text>
                                        <Text>{item.description}</Text>
                                        </>
                                        :
                                        item.experience ?
                                        <>
                                        <Text style={{color:'#9c6f6f'}}>Experience:</Text>
                                        <Text>{item.experience}</Text>
                                        </>
                                        :
                                        null
                                    }
                                </Card.Content>
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
                        <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: '100%', marginBottom:20}}>
                            <IconButton icon='view-grid-plus' size={30} iconColor='#9c6f6f'/>
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
            <Card style={{borderWidth:1, borderColor:'#9c6f6f', margin: 5}}>
                <Card.Title 
                    title='My Projects'
                    titleStyle={{color:'#9c6f6f', fontSize:24}}
                    right={()=><Button icon='eye' textColor='#9c6f6f' style={{marginHorizontal:20}} onPress={()=>navigation.navigate('FreelancerProjects')}>See All</Button>}
                />
                <Card.Content>
                <FlatList
                    data={offerscollection.filter((offer)=>{
                            if (offer.offer_status === 'cancelled'){
                                return;
                            }else{
                                return true;
                            }
                        }).sort((a, b) => {
                        const statusOrder = { granted: 0, waiting: 1};
                        const aStatus = a.offer_status.toLowerCase();
                        const bStatus = b.offer_status.toLowerCase();
                        return statusOrder[aStatus] - statusOrder[bStatus];
                        })
                    }
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item})=>
                        <TouchableOpacity onPress={()=>{
                            console.log(item)
                            navigation.navigate('FreelancerProject', item);
                        }}>
                        {
                            item.request_id ? 
                            <Card key={item._id} style={{minWidth:300, maxWidth:350, marginHorizontal:4, borderColor: item.offer_status === 'waiting' ? '#9c6f6f' : item.offer_status === 'granted' ? 'green' : 'black', borderWidth: 1}}>
                                <Card.Title 
                                    title={item.request_id.requested_by.name} 
                                    subtitle={<Text style={{color: item.offer_status === 'waiting' ? '#9c6f6f' : item.offer_status === 'granted' ? 'green' : 'red'}}>{item.offer_status}</Text>}
                                    left={()=><Avatar.Image size={40} source={{uri: item.request_id.requested_by.avatar.url}}/>}
                                    />
                                <Card.Content>
                                    <Infoline label="Requested:" value={item.request_id.description} />
                                    <Infoline label="Category:" value={item.service_id.category.name} />
                                    <Infoline label="Service:" value={item.service_id.title || item.service_id.name} />
                                    <Infoline label="Price:" value={`₱ ${item.transactions[0]?.price || 'Not Set'}`} />
                                    <Infoline label="Paid:" value={item.transactions.length > 0 ? (
                                            item.transactions[0].isPaid === 'true' && item.transactions[0].paymentSent === 'true' ? (
                                            'Yes'
                                            ) : (
                                            'Not Yet'
                                            )
                                        ) : (
                                            'No Payment Generated'
                                        )} />
                                </Card.Content>
                            </Card>
                            :
                            <Card key={item._id} style={{minWidth:300, maxWidth:350, marginRight:4, borderColor: item.offer_status === 'waiting' ? '#9c6f6f' : item.offer_status === 'granted' ? 'green' : 'black', borderWidth: 1}}>
                                <Card.Title 
                                    title={item.inquiry_id.customer.name} 
                                    subtitle={<Text style={{color: item.offer_status === 'waiting' ? '#9c6f6f' : item.offer_status === 'granted' ? 'green' : 'red'}}>{item.offer_status}</Text>}
                                    left={()=><Avatar.Image size={40} source={{uri: item.inquiry_id.customer.avatar.url}}/>}
                                    />
                                <Card.Content>
                                    <Infoline label="Inquiry:" value={item.inquiry_id.instruction} />
                                    <Infoline label="Category:" value={item.service_id.category.name} />
                                    <Infoline label="Service:" value={item.service_id.title || item.service_id.name} />
                                    <Infoline label="Price:" value={`₱ ${item.transactions[0]?.price || 'Not Set'}`} />
                                    <Infoline label="Paid:" value={item.transactions.length > 0 ? (
                                    item.transactions[0].isPaid === 'true' && item.transactions[0].paymentSent === 'true' ? (
                                    'Yes'
                                    ) : (
                                    'Not Yet'
                                    )
                                    ) : (
                                    'No Payment Generated'
                                    )} />
                                </Card.Content>
                            </Card>
                        }
                        </TouchableOpacity>
                    }
                    ListEmptyComponent={
                        <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: '100%', marginBottom:20}}>
                            <IconButton icon='view-grid-plus' size={30} iconColor='#9c6f6f'/>
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