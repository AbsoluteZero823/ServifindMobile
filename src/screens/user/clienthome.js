import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CategoryStore, { Category } from '../../models/category';
import { Button, Card, Text} from 'react-native-paper';

import CategoryCard from '../../components/categorycard';

const CategoryCollection = [
  {
    _id: '635e432f462eafff9564f601',
    name:'Writing & Translation'
  },{
    _id: '635e432f462eafff9564f602',
    name:'Graphic Design and Multimedia'
  },{
    _id: '635e432f462eafff9564f603',
    name:'Programming and IT'
  },{
    _id: '635e432f462eafff9564f604',
    name:'Creative and Artistic'
  },{
    _id: '635e432f462eafff9564f605',
    name:'Engineering and Architecture'
  },{
    _id: '635e432f462eafff9564f606',
    name:'Education and Training'
  }]

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
            data={CategoryContext.categories}
            style={{overflow:'hidden'}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => <CategoryCard key={item._id} category={item} opacity={props.params.opacity}/>}
            />
          </View>
          <View style={{flex:1, padding:10}}>
            <Card style={{flex:1, borderColor:'deeppink', borderWidth:1, opacity: props.params.opacity}}>
              <Card.Title title="Your Job Drafts" right={(props) => <Button mode='text' textColor='deeppink'>See all drafts</Button>}/>
              <Card.Content>

              </Card.Content>
            </Card>
          </View>
          <View style={{flex:2, padding:10}}>
            <Card style={{flex:1, borderColor:'deeppink', borderWidth:1, opacity: props.params.opacity}}>
              <Card.Title title="Your Job Posts" right={(props) => <Button mode='text' textColor='deeppink'>See all postings</Button>}/>
              <Card.Content>

              </Card.Content>
            </Card>
          </View>
      </View>
    );
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    alignContent:'center',
    backgroundColor:'mistyrose',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ClientHome;


