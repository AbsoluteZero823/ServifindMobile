import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { View, SectionList} from 'react-native';
import { Button, Card, Text, Avatar, IconButton} from 'react-native-paper';
import Loading from '../../components/loading';
import { getClientInquiries } from '../../../services/apiendpoints';

import AuthStore from '../../models/authentication';
import FreelancerStore from '../../models/freelancer';
import UserStore from '../../models/user';

const FreelancerChats = observer(() => {
    const AuthContext = useContext(AuthStore);
    const FreelancerContext = useContext(FreelancerStore)
    const [pendinginquirycollection, setpendinginquirycollection] = useState([]);

    async function fetchpendinginquiry(){
        AuthContext.letmeload();
        try{
            setpendinginquirycollection([]);
            const fetchpendinginquiry = await getClientInquiries({
                freelancer: FreelancerContext.data[0]._id
            })
            if(fetchpendinginquiry.success){
                let collection = []
                fetchpendinginquiry.inquiries.map((inquiry)=>{
                    collection.push(inquiry)
                })
                setpendinginquirycollection(collection);
            }
            AuthContext.donewithload();
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchpendinginquiry();
    },[])

    const DATACOLLECTION = [
        {
            title: 'Inquiries',
            data: pendinginquirycollection
        },
        {
            title: 'Messages',
            data: []
        },
        {
            title: 'Projects',
            data: []
        }
    ]

    return (
        <View style={{marginHorizontal:10}}>
            <Loading/>
            {
                pendinginquirycollection &&
                <SectionList
                sections={DATACOLLECTION}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => 
                    <Card key={item._id}>
                        <Card.Title
                            title={item.service_id.title}
                            titleStyle={{fontWeight: 'bold', color:'deeppink'}}
                            subtitle={item.service_id.category.name}
                            subtitleStyle={{color:'dimgrey'}}
                            left={()=><Avatar.Image size={50} source={{uri: item.customer.avatar.url}}/>}
                            right={()=><IconButton icon='chat-outline' iconColor='deeppink' onPress={()=>console.log('Yes Sir!')}/>}
                            />
                        <Card.Content>
                            <Text>{item.instruction}</Text>
                        </Card.Content>
                    </Card>
                }
                renderSectionHeader={({section: {title}}) => (
                    <Text variant='titleLarge' style={{color:'deeppink', marginVertical:5}}>{title}</Text>
                )}
                />
            }
            
        </View>
    )
})

export default FreelancerChats;