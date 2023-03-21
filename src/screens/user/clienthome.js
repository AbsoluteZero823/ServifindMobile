import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { View, FlatList, SafeAreaView } from 'react-native';
import { styles } from '../../components/user/user.css';
import { Button, Card, IconButton, Text} from 'react-native-paper';
import CategoryCard from '../../components/categorycard';

import CategoryStore, { Category } from '../../models/category';
const CategoryCollection = [
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
const TestRequestCollection = [
  // Empty Check
]
const ClientHome = observer((props) => {
    const CategoryContext = useContext(CategoryStore);
    // Using the CategoryCollection Loop through all objects in the array and instantiate as a Category object to be pushed to CategoryStore Array
    CategoryCollection.map(category => {
      const existingCategory = CategoryContext.categories.find(c => c.id === category._id);
      if (!existingCategory) {
        CategoryContext.categories.push(Category.create({id: category._id, name: category.name}));
      }
    });
    return (
      <View style={styles.container}>
          <View style={{flex:1}}>
            <FlatList
            data={CategoryCollection}
            style={{overflow:'hidden'}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => <CategoryCard key={item._id} category={item} params={props.params.props}/>}
            />
          </View>
          <View style={{flex:1, padding:10}}>
            <Card style={[styles.cardStyle]}>
              <Card.Title title={<Text variant='headlineSmall'>Your Job Drafts</Text>} right={(props) => <Button mode='text' textColor='deeppink'>See all drafts</Button>}/>
              <Card.Content>
                <SafeAreaView>
                  <FlatList
                    data={CategoryCollection}
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


