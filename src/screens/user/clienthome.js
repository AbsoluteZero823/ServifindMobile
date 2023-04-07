import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState, useCallback} from 'react';
import { View, FlatList, SafeAreaView, RefreshControl, TouchableOpacity} from 'react-native';
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
import Freelancer from '../../models/freelancer';
import { ServiceModel } from '../../models/service';

const ClientHome = observer((props) => {
  const navigation = useNavigation();
    const CategoryContext = useContext(CategoryStore);
    const [CategoryCollection, setCategoryCollection] = useState([]);
    const InquiryContext = useContext(InquiryStore);
    const [InquiryCollection, setInquiryCollection] = useState([]);
    const RequestContext = useContext(RequestStore);

    const AuthContext = useContext(AuthStore);

    const setAppbarTitle = props.params.props[0];
    const setActive = props.params.props[1];
    const setActiveCategory = props.params.props[3];
    async function getData(){
      AuthContext.letmeload();
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
            InquiryContext.inquiries.push(Inquiry.create({
              _id: inquiry._id,
              instruction: inquiry.instruction,
              attachments: inquiry.attachments,
              customer: User.create(inquiry.customer),
              freelancer: inquiry.freelancer,
              service: ServiceModel.create({...inquiry.service_id, freelancer_id: {...inquiry.service_id.freelancer_id, approved_date: new Date(inquiry.service_id.freelancer_id.approved_date)}}),
              status: inquiry.status,
            }));
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
        setTimeout(() => {
          AuthContext.donewithload();
        },500);
      }catch(error){
        console.log(error);
        AuthContext.donewithload();
      }}
    useEffect(() => {
      getData();
    }, []);
    
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async() => {
      setRefreshing(true);
      getData();
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            />
          </View>
          <View style={{flex: 4, padding:5}}>
            <Card style={[styles.cardStyle]}>
              <Card.Title title={<Text variant='headlineSmall'>Your Job Posts</Text>} right={(props) => <Button mode='text' textColor='deeppink' onPress={()=>(setActive('Jobs'), setAppbarTitle('Job Posting'),navigation.navigate('ClientJobPosting'))}>See all postings</Button>}/>
              <Card.Content style={{justifyContent:'center'}}>
              <FlatList
                data={
                  RequestContext.requests
                  .filter((request) => request.request_status !== 'cancelled')
                  .sort((a, b) => {
                      if (a.request_status === 'granted') {
                          return -1;
                      } else if (b.request_status === 'granted') {
                          return 1;
                      } else {
                          return 0;
                      }
                  })
                }
                style={{overflow:'scroll', marginBottom:70}}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={()=>navigation.navigate('ClientSingleJobPosts',{_id: item._id})}>
                    <Card style={{width:'100%', marginBottom:5, borderColor: item.request_status === 'granted' ? 'green' : 'deeppink', borderWidth:1}}>
                      <Card.Title title={item.description} subtitle={<Text style={{color:'grey'}}>{item.category.name}</Text>}
                      right={(props) => <IconButton icon='open-in-new' iconColor='deeppink'/>}/>
                    </Card>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: 300, marginBottom:20}}>
                  <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                  <Text variant='titleMedium'>No active job posts</Text>
                  <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Post a Job on the marketplace and let a freelancer come to you</Text>
                  <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:150}} onPress={()=>(navigation.navigate('ClientPostaJob'))}>Post a Job</Button>
                </SafeAreaView>
                )}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              />
              </Card.Content>
            </Card>
          </View>
          <View style={{flex:4, padding:5}}>
            <Card style={[styles.cardStyle]}>
              <Card.Title title={<Text variant='headlineSmall'>Your Inquiries</Text>} right={(props) => <Button mode='text' textColor='deeppink' onPress={()=>(console.log("Empty"))}>See all inquiries</Button>}/>
              <Card.Content>
                <SafeAreaView>
                  <FlatList
                    data={InquiryCollection}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    style={{overflow:'hidden', marginBottom:70}}
                    renderItem={({item}) => (
                      <Card style={{marginHorizontal:5, marginBottom:5, borderColor:'deeppink', borderWidth:1}}>
                        <Card.Title title={item.service.title} subtitle={<Text style={{color:'grey'}}>{item.service.category.name}</Text>} right={(props) => <IconButton icon='open-in-new' mode='outlined' iconColor='deeppink' style={{borderColor:'transparent'}}/>}/>
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
                    refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
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


