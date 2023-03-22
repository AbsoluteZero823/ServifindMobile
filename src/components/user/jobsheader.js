import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';

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

export const JobsHeader = observer((props) => {
    const [active, setActive] = useState('');
    const [ setAppbarTitle, setDrawerActive, activeCategory, setActiveCategory ] = props.params.props;
    if(activeCategory.length > 0 && !active ){
        // console.log(activeCategory[0].name);
        setActive(activeCategory[0].name);
    }
    function pushtoactiveCategory(item){
        activeCategory.push(item);
        setActive(item.name);
    }
    function backtoHome(){
        setActiveCategory([]);
        setActive('');
    }
    return (
        <View style={{ flexDirection:'row', marginHorizontal:10}}>
            <Avatar.Icon icon='home-outline' size={20} style={{backgroundColor:'transparent'}} color='deeppink'/>
            <TouchableOpacity onPress={()=>{backtoHome()}}>
                <Text>Categories</Text>
            </TouchableOpacity>
            <Avatar.Icon icon='chevron-double-right' size={20} style={{backgroundColor:'transparent'}} color='deeppink'/>
            {
                active ? 
                <Text>{active}</Text> 
                : 
                <FlatList
                data={ CategoryCollection}
                keyExtractor={item => item._id}
                horizontal={true}
                ItemSeparatorComponent={() => <Avatar.Icon icon='align-horizontal-distribute' size={20} style={{backgroundColor:'transparent'}} color='deeppink'/>}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => 
                    <TouchableOpacity onPress={()=>pushtoactiveCategory(item)}>
                        <Text style={{marginHorizontal:4}}>{item.name}</Text>
                    </TouchableOpacity>}
                />
            }
        </View>
    )
})