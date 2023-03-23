import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState} from 'react';
import { View, FlatList, SafeAreaView} from 'react-native';
import { Button, Card, IconButton, Text} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import CategoryCard from '../../components/categorycard';
import Loading from '../../components/loading';
import { styles } from '../../components/user/user.css';

import AuthStore from '../../models/authentication';
import { User } from '../../models/user';
import CategoryStore, { Category } from '../../models/category';
import InquiryStore, { Inquiry } from '../../models/inquiry';
import RequestStore, { Request } from '../../models/request';
import { getCategories, getmyInquiries, getmyRequests } from '../../../services/apiendpoints';
import { FAB } from '../../components/user/fab';

const ClientHome = observer((props) => {
  const navigation = useNavigation();
    const CategoryContext = useContext(CategoryStore);
    const [CategoryCollection, setCategoryCollection] = useState([]);
    const InquiryContext = useContext(InquiryStore);
    const [InquiryCollection, setInquiryCollection] = useState([]);
    const RequestContext = useContext(RequestStore);
    const [RequestCollection, setRequestCollection] = useState([]);

    const AuthContext = useContext(AuthStore);

    const setAppbarTitle = props.params.props[0];
    const setActive = props.params.props[1];
    const setActiveCategory = props.params.props[3];
    useEffect(() => {
      AuthContext.letmeload();
      async function getData(){
        try{
          const categoryCollection = await getCategories();
          CategoryContext.categories = [];
          if(categoryCollection.success){
            categoryCollection.categories.map((category) => {
              CategoryContext.categories.push(Category.create(category));
            })
          };
          setCategoryCollection(CategoryContext.categories);
          const inquiriesCollection = await getmyInquiries();
          InquiryContext.inquiries = [];
          if(inquiriesCollection.success){
            inquiriesCollection.inquiries?.map((inquiry) => {
              InquiryContext.inquiries.push(Inquiry.create(inquiry));
            })
          };
          setInquiryCollection(InquiryContext.inquiries);
          const requestCollection = await getmyRequests();
          RequestContext.requests = [];
          if(requestCollection.success){
           requestCollection.requests?.map((request) => {
             RequestContext.requests.push(Request.create({
              _id: request._id,
              category: Category.create(request.category),
              description: request.description,
              created_At: new Date(request.created_At),
              request_status: request.request_status,
              requested_by: User.create(request.requested_by),
            }));
           })
          };
          setRequestCollection(RequestContext.requests);
          setTimeout(() => {
            AuthContext.donewithload();
          },500);
        }catch(error){
          console.log(error);
          AuthContext.donewithload();
        }}
      getData();
      
    }, []);
    
    return (
      <View style={styles.container}>
        <Loading/>
          <View>
            <FlatList
            data={CategoryCollection}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => <CategoryCard key={item._id} category={item} params={props.params.props}/>}
            />
          </View>
          <View style={{flex: 4, padding:5}}>
            <Card style={[styles.cardStyle]}>
              <Card.Title title={<Text variant='headlineSmall'>Your Job Posts</Text>} right={(props) => <Button mode='text' textColor='deeppink' onPress={()=>(setActive('Jobs'), setAppbarTitle('Job Posting'),navigation.navigate('ClientJobPosting'))}>See all postings</Button>}/>
              <Card.Content style={{justifyContent:'center'}}>
              <FlatList
                data={RequestCollection.filter((request) => request.request_status === 'waiting')}
                style={{overflow:'scroll', marginBottom:70}}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                  <Card style={{width:'100%', marginBottom:5, borderColor:'deeppink', borderWidth:1}}>
                    <Card.Title title={item.description} subtitle={<Text style={{color:'grey'}}>{item.category.name}</Text>}
                    right={(props) => <IconButton icon='open-in-new' iconColor='deeppink'/>}/>
                  </Card>
                )}
                ListEmptyComponent={() => (
                <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: 300, marginBottom:20}}>
                  <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                  <Text variant='titleMedium'>No active job posts</Text>
                  <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Post a Job on the marketplace and let a freelancer come to you</Text>
                  <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:150}} onPress={()=>(navigation.navigate('ClientPostaJob'))}>Post a Job</Button>
                </SafeAreaView>
                )}
              />
              </Card.Content>
            </Card>
          </View>
          <View style={{flex:4, padding:5}}>
            <Card style={[styles.cardStyle]}>
              <Card.Title title={<Text variant='headlineSmall'>Your Inquiries</Text>} right={(props) => <Button mode='text' textColor='deeppink'>See all inquiries</Button>}/>
              <Card.Content>
                <SafeAreaView>
                  <FlatList
                    data={InquiryCollection}
                    keyExtractor={(item) => item._id}
                    horizontal={InquiryContext.inquiries.length > 0 ? true : false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <Card style={{marginHorizontal:10, marginBottom:5, borderColor:'deeppink', borderWidth:1}}>
                        <Card.Title title={item.name} subtitle={<Text style={{color:'grey'}}>Descriptions......</Text>} right={(props) => <IconButton icon='open-in-new' mode='outlined' iconColor='black' style={{borderColor:'deeppink'}}/>}/>
                      </Card>
                    )}
                    ListEmptyComponent={() => (
                      <SafeAreaView style={{alignItems:'center', alignSelf:'center', justifyContent:'center'}}>
                        <IconButton icon='chat-processing-outline' size={30} iconColor='deeppink'/>
                        <Text variant='titleMedium'>No Active Inquiries Yet</Text>
                        <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Search for a job on the market place</Text>
                        <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:150}} onPress={()=>(
                          setAppbarTitle('Jobs'),
                          setActive('Jobs'),
                          setActiveCategory([]),
                          navigation.navigate('ClientJobs'))}>View Services</Button>
                      </SafeAreaView> 
                    )}
                  />
                </SafeAreaView>
              </Card.Content>
            </Card>
          </View>
          <FAB/>
      </View>
    );
  });



export default ClientHome;


