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
        <Card style={{alignSelf:'center', minHeight: 140, maxHeight: 150, marginHorizontal:2.5, minWidth: 220, borderColor:'deeppink', borderWidth:1}}>
            <Card.Title title={props.category.name} titleStyle={{ color: 'deeppink' }} />
            <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center' }}>
                    <Avatar.Icon icon="star" size={24} style={{backgroundColor:'transparent'}} color='deeppink' />
                    <Text>10 / 10 Satisfaction</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-evenly' }}>
                <Text style={{ textAlign:'center' }}>
                    <Text style={styles.highlight}>{props.category.servicescount}+</Text>{`\n`}Services
                </Text>
                <Text style={{ textAlign:'center' }}>
                    <Text style={styles.highlight}>{props.category.freelancercount}+</Text>{`\n`}Freelancers
                </Text>
                </View>
            </Card.Content>
        </Card>
    </TouchableOpacity>
    )
}