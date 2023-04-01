import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ImageBackground, FlatList, SafeAreaView} from 'react-native';
import { Button, Card, Text, Avatar, IconButton} from 'react-native-paper';
import UserStore from '../../models/user';
import { styles } from '../../components/user/user.css';
import { getmyServices } from '../../../services/apiendpoints';
import { useEffect } from 'react';

const FreelancerHome = observer(() => {
    const [servicescollection, setServicesCollection] = useState([]);
    async function getMYSERVICES(){
        try{
            const response = await getmyServices();
            console.log(response);
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getMYSERVICES();
    },[])
    return (
        <View>
            <Card style={{borderWidth:1, borderColor:'deeppink', margin: 5}}>
                <Card.Title title={<Text variant="titleLarge" style={{color:'deeppink'}}>My Services</Text>} />
                <Card.Content>
                <FlatList
                    data={servicescollection}
                    renderItem={({item})=>{
                        
                    }}
                    ListEmptyComponent={
                        <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: 300, marginBottom:20}}>
                        <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                        <Text variant='titleMedium'>No Services Yet</Text>
                        <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Post a Service on the marketplace and let a client come to you</Text>
                        <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:200}} onPress={()=>(console.log("WEE!"))}>Post a Service</Button>
                        </SafeAreaView>
                    }
                />
                </Card.Content>
            </Card>
            <Card style={{borderWidth:1, borderColor:'deeppink', margin: 5}}>
                <Card.Title title={<Text variant="titleLarge" style={{color:'deeppink'}}>My Projects</Text>} />
                <Card.Content>
                <FlatList
                    data={servicescollection}
                    renderItem={({item})=>{
                        
                    }}
                    ListEmptyComponent={
                        <SafeAreaView style={{alignItems:'center', alignSelf:'center', maxWidth: 300, marginBottom:20}}>
                        <IconButton icon='view-grid-plus' size={30} iconColor='deeppink'/>
                        <Text variant='titleMedium'>No Projects Yet</Text>
                        <Text style={{textAlign:'center', color:'dimgrey',marginVertical:6}}>Accept a Job Request on the marketplace and start earning</Text>
                        <Button mode='contained' buttonColor="salmon" style={{marginVertical:6, width:200}} onPress={()=>(console.log("WOO!"))}>Accept a Request</Button>
                        </SafeAreaView>
                    }
                />
                </Card.Content>
            </Card>
        </View>
    )
})

export default FreelancerHome;