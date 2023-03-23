import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import CategoryStore from '../../models/category';

export const JobsHeader = observer((props) => {
    const CategoryContext = useContext(CategoryStore);
    const [active, setActive] = useState('');
    const activeCategory = props.params.props[2];
    const setActiveCategory = props.params.props[3];
    if(activeCategory.length > 0 && !active){
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
        <View style={{ flexDirection:'row', marginHorizontal:10, marginVertical:5}}>
            <Avatar.Icon icon='account-multiple' size={20} style={{backgroundColor:'transparent'}} color='deeppink'/>
            <TouchableOpacity onPress={()=>{backtoHome()}}>
                <Text>Freelancers</Text>
            </TouchableOpacity>
            <Avatar.Icon icon='chevron-double-right' size={20} style={{backgroundColor:'transparent'}} color='deeppink'/>
            {
                active ? 
                <Text>{active}</Text> 
                : 
                <FlatList
                data={ CategoryContext.categories }
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