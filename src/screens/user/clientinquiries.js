import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { Button, Card, Text, Avatar, IconButton, Searchbar, Menu, Divider } from 'react-native-paper';
import { ServiceModel } from '../../models/service';
import UserStore, { User } from '../../models/user';
import Loading from '../../components/loading';
import AuthStore from '../../models/authentication';
import { styles } from '../../components/user/user.css';
import InquiryStore, { Inquiry } from '../../models/inquiry';
import { getmyInquiries } from '../../../services/apiendpoints';
import { useNavigation } from '@react-navigation/native';


const ClientInquiries = observer(() => {
    const AuthContext = useContext(AuthStore);
    const InquiryContext = useContext(InquiryStore);
    const [InquiryCollection, setInquiryCollection] = useState([]);
    const navigation = useNavigation();

    async function inquiryinit() {
        AuthContext.letmeload();
        try {
            const inquiriesCollection = await getmyInquiries();
            InquiryContext.inquiries = [];
            if (inquiriesCollection.success) {
                inquiriesCollection.inquiries?.map((inquiry) => {
                    InquiryContext.inquiries.push(Inquiry.create({
                        _id: inquiry._id,
                        instruction: inquiry.instruction,
                        // attachments: inquiry.attachments,
                        customer: User.create(inquiry.customer),
                        freelancer: inquiry.freelancer,
                        service: ServiceModel.create({ ...inquiry.service_id, freelancer_id: { ...inquiry.service_id.freelancer_id } }),
                        status: inquiry.status,
                    }));
                })
            };
            setInquiryCollection(InquiryContext.inquiries);
            AuthContext.donewithload();
        } catch (error) {
            console.log(error);
            AuthContext.donewithload();
        }
        AuthContext.donewithload();
    }
    const [searchquery, setsearchquery] = useState('');
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        inquiryinit();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        inquiryinit();
    }, []);

    const [menuactive, setmenuactive] = useState('');
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View style={styles.container}>
            <Loading />
            <Searchbar
                placeholder="Search..."
                onChangeText={(text) => setsearchquery(text)}
                mode='bar'
                iconColor='#9c6f6f'
                style={{ borderColor: '#9c6f6f', borderWidth: 1 }}
                right={() =>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        style={{ marginRight: 20 }}
                        anchorPosition='bottom'
                        anchor={
                            <IconButton icon='menu' iconColor='#9c6f6f' onPress={() => openMenu()} />
                        }
                    >
                        <Menu.Item onPress={() => setmenuactive('')} title={<Text style={{ color: menuactive === '' ? '#9c6f6f' : 'black' }}>All</Text>} />
                        <Menu.Item onPress={() => setmenuactive('pending')} title={<Text style={{ color: menuactive === 'pending' ? '#9c6f6f' : 'black' }}>pending</Text>} />
                        <Menu.Item onPress={() => setmenuactive('granted')} title={<Text style={{ color: menuactive === 'granted' ? '#9c6f6f' : 'black' }}>Granted</Text>} />
                        <Menu.Item onPress={() => setmenuactive('cancelled')} title={<Text style={{ color: menuactive === 'cancelled' ? '#9c6f6f' : 'black' }}>Cancelled</Text>} />
                    </Menu>
                }
            />
            <Divider style={{ marginVertical: 4 }} />
            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={InquiryCollection.filter(inquiry => {
                    const hasSearchQuery = inquiry.instruction.toLowerCase().includes(searchquery.toLowerCase()) || inquiry.service.name.toLowerCase().includes(searchquery.toLowerCase());
                    const hasMenuActive = inquiry.status.toLowerCase().includes(menuactive.toLowerCase());
                    return hasSearchQuery && hasMenuActive;
                }).sort((a, b) => {
                    const statuses = ["pending", "granted", "cancelled"];
                    return statuses.indexOf(a.status) - statuses.indexOf(b.status);
                })}
                keyExtractor={(item) => item._id}
                renderItem={(inquiries) => {
                    let item = inquiries.item
                    return (
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("ClientChat");
                        }}
                        >
                            <Card style={{ marginHorizontal: 4, marginBottom: 4, borderColor: item.status === "pending" ? '#9c6f6f' : item.status === "granted" ? 'green' : 'red', borderWidth: 1 }}>
                                <Card.Title title={item.service.title || item.service.name} subtitle={<Text style={{ color: 'grey' }}>{item.service.category.name}</Text>} right={(props) => <Avatar.Icon
                                    icon={item.status === 'pending' ? 'clock-outline' : item.status === 'granted' ? 'check-decagram-outline' : 'cancel'}
                                    color={item.status === 'pending' ? '#9c6f6f' : item.status === 'granted' ? 'green' : 'red'}
                                    size={40}
                                    style={{ marginRight: 10, backgroundColor: 'transparent' }} />} />
                                <Card.Content>
                                    <Text>{item.instruction}</Text>
                                </Card.Content>
                                <Card.Actions>
                                    <Button mode='outlined' onPress={()=>navigation.navigate("ClientChat")}>
                                        Message
                                    </Button>
                                </Card.Actions>
                            </Card>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
})

export default ClientInquiries;