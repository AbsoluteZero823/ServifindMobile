import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { View, SectionList, FlatList} from 'react-native';
import { Button, Card, Text, Avatar, IconButton, Searchbar, Menu} from 'react-native-paper';
import Loading from '../../components/loading';
import { getClientInquiries } from '../../../services/apiendpoints';

import AuthStore from '../../models/authentication';
import FreelancerStore from '../../models/freelancer';
import UserStore from '../../models/user';

const FreelancerChats = observer(() => {
    const AuthContext = useContext(AuthStore);
    const FreelancerContext = useContext(FreelancerStore)
    const [query, setQuery] = useState('');
    const [visible, setVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('All');
    const handleQueryChange = query => setQuery(query);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleOptionSelect = option => {
        setSelectedOption(option);
        closeMenu();
    };

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
                    console.log(inquiry);
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
            <Searchbar
                mode='bar'
                iconColor='deeppink'
                placeholder="Search"
                onChangeText={handleQueryChange}
                style={{borderColor:'deepink', borderWidth:1}}
                right={()=>
                    <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <IconButton icon="menu" iconColor='deeppink' onPress={openMenu}/>
                    }
                    anchorPosition="bottom"
                    >
                    <Menu.Item
                    onPress={() => handleOptionSelect('All')}
                    title="All"
                    titleStyle={{color: selectedOption === 'All' ? 'deeppink' : 'black' }}
                    />
                    <Menu.Item
                    onPress={() => handleOptionSelect('Projects')}
                    title="Projects"
                    titleStyle={{color: selectedOption === 'Projects' ? 'deeppink' : 'black' }}
                    />
                    <Menu.Item
                    onPress={() => handleOptionSelect('Inquiries')}
                    title="Inquiries"
                    titleStyle={{color: selectedOption === 'Inquiries' ? 'deeppink' : 'black' }}
                    />
                </Menu>
                }
            />
            <FlatList
                data={ selectedOption === 'All' ? [] : selectedOption === 'Projects' ? [] : selectedOption === 'Inquiries' ? pendinginquirycollection : null}
                style={{ marginVertical: 8 }}
                renderItem={({item}) => 
                    <Card style={{backgroundColor:'transparent', shadowColor: 'transparent', borderWidth: 1}}>
                        <Card.Title 
                            title={item.customer.name+"  -  "+item.service_id.title}
                            titleStyle={{fontWeight: 'bold', color:'deeppink', marginLeft: 4 }}
                            subtitle={item.service_id.category.name}
                            subtitleStyle={{color:'dimgrey'}}
                            left={()=><Avatar.Image size={50} source={{uri: item.customer.avatar.url}}/>}
                            />
                    </Card>
                }
            />
            {/* {
                pendinginquirycollection &&
                <SectionList
                sections={DATACOLLECTION}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => 
                    <Card key={item._id}>
                        <Card.Title
                            title={item.customer.name+"    "+item.service_id.title}
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
            } */}
        </View>
    )
})

export default FreelancerChats;