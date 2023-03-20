import React from "react"
import { View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper"

export default function CategoryCard(props){
return (
<Card style={{alignSelf:'center', minHeight: 50, maxHeight: 120, marginHorizontal:10, minWidth: 220, borderColor:'deeppink', borderWidth:1, opacity: props.opacity}}>
    <Card.Title title={props.category.name} titleStyle={{ color: 'deeppink' }} />
    <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon="star" size={20} iconColor='deeppink' />
            <Text>10 / 10</Text>
        </View>
        <Text style={{ textAlign:'center'}}>
            2000{`\n`}Freelancers.
        </Text>
        </View>
    </Card.Content>
</Card>
)
}