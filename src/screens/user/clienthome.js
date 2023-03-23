import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView } from 'react-native';
import { Button, Card, IconButton, Text} from 'react-native-paper';

import CategoryCard from '../../components/categorycard';
import Loading from '../../components/loading';
import { styles } from '../../components/user/user.css';

import AuthStore from '../../models/authentication';
import CategoryStore, { Category } from '../../models/category';
import { getCategories } from '../../../services/apiendpoints';

const CategoryTestCollection = [
  {
    _id: '635e432f462eafff9564f601',
    name:'Writing & Translation',
    averagestars: 4.5,
    freelancercount: '2000',
    servicescount: '150',
  },{
    _id: '635e432f462eafff9564f602',
    name:'Graphic Design and Multimedia',
    averagestars: 4.5,
    freelancercount: '200',
    servicescount: '10',
  },{
    _id: '635e432f462eafff9564f603',
    name:'Programming and IT',
    averagestars: 4.5,
    freelancercount: '500',
    servicescount: '30',
  },{
    _id: '635e432f462eafff9564f604',
    name:'Creative and Artistic',
    averagestars: 4.5,
    freelancercount: '7000',
    servicescount: '120',
  },{
    _id: '635e432f462eafff9564f605',
    name:'Engineering and Architecture',
    averagestars: 4.5,
    freelancercount: '200',
    servicescount: '10',
  },{
    _id: '635e432f462eafff9564f606',
    name:'Education and Training',
    averagestars: 4.5,
    freelancercount: '8000',
    servicescount: '1000',
  }]

const ClientHome = observer((props) => {
    const CategoryContext = useContext(CategoryStore);
    const AuthContext = useContext(AuthStore);
    const [categorycollection, setcategorycollection] = useState();
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
          setcategorycollection(CategoryContext.categories);
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
          <View style={{flex:1}}>
            <FlatList
            data={categorycollection}
            style={{overflow:'hidden'}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => <CategoryCard key={item._id} category={item} params={props.params.props}/>}
            />
          </View>
          <View style={{flex:1, padding:10}}>
            <Card style={[styles.cardStyle]}>
              <Card.Title title={<Text variant='headlineSmall'>Your Contracts</Text>} right={(props) => <Button mode='text' textColor='deeppink'>See all contracts</Button>}/>
              <Card.Content>
                <SafeAreaView>
                  <FlatList
                    data={CategoryTestCollection}
                    keyExtractor={(item) => item._id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <Card style={{backgroundColor:'mistyrose', marginHorizontal:10, marginBottom:5}}>
                        <Card.Title title={item.name} subtitle={<Text style={{color:'grey'}}>Descriptions......</Text>} right={(props) => <IconButton icon='arrange-bring-forward' mode='outlined' iconColor='black' style={{borderColor:'deeppink'}}/>}/>
                      </Card>
                    )}
                    ListEmptyComponent={() => <Text>No Postings</Text>}
                  />
                </SafeAreaView>
              </Card.Content>
            </Card>
          </View>
          <View style={{flex:2, padding:10}}>
            <Card style={[styles.cardStyle]}>
              <Card.Title title={<Text variant='headlineSmall'>Your Postings</Text>} right={(props) => <Button mode='text' textColor='deeppink'>See all postings</Button>}/>
              <Card.Content style={{justifyContent:'center'}}>
              <FlatList
                data={[]}
                style={{overflow:'hidden', height:'80%'}}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                  <Card style={{backgroundColor:'mistyrose', width:'100%', marginVertical:5}}>
                    <Card.Title title={item.name} subtitle={<Text style={{color:'grey'}}>Descriptions......</Text>} right={(props) => <IconButton icon='arrange-bring-forward' mode='outlined' iconColor='black' style={{borderColor:'deeppink'}}/>}/>
                  </Card>
                )}
                ListEmptyComponent={() => (
                <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: 300}}>
                  <IconButton icon='view-grid-plus' size={70} iconColor='deeppink'/>
                  <Text variant='titleMedium'>No active job posts</Text>
                  <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Post a Job on the marketplace and let a freelancer come to you</Text>
                  <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:150}}>Post a Job</Button>
                </SafeAreaView>
                )}
              />
              </Card.Content>
            </Card>
          </View>
      </View>
    );
  });



export default ClientHome;


