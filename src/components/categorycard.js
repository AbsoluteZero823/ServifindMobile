import React from "react"
import { TouchableOpacity, View } from "react-native";
import { Card, Avatar, Text } from "react-native-paper"
import styles from "./authentication/authentication.css";

import { useNavigation } from "@react-navigation/native";

export default function CategoryCard(props){
    const [setAppbarTitle, setActive, activeCategory] = props.params;
    const navigation = useNavigation();
    return (
    <TouchableOpacity onPress={()=>{
        setAppbarTitle('Jobs'),
        setActive('Jobs'),
        activeCategory.push(props.category)
        navigation.navigate('ClientJobs')
        }}>
        <Card style={{alignSelf:'center', minHeight: 100, maxHeight: 100, marginHorizontal:2.5, minWidth: 220, borderColor:'#9c6f6f', borderWidth:1}}>
            <Card.Title title={props.category.name} titleStyle={{ color: '#9c6f6f' }} />
            <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center' }}>
                    <Avatar.Icon icon="face-agent" size={32} style={{backgroundColor:'transparent'}} color='#9c6f6f' />
                    <Text><Text style={styles.highlight}>{props.category.serviceCount} </Text>Freelancer Services</Text>
                </View>
            </Card.Content>
        </Card>
    </TouchableOpacity>
    )
}