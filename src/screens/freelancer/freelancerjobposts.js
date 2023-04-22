import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl} from 'react-native';
import { Button, Card, Text, Avatar} from 'react-native-paper';
import { styles } from '../../components/user/user.css';
import { getfreelancerjobs } from '../../../services/apiendpoints';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';
import { Category } from '../../models/category';
import { User } from '../../models/user';
import { Request } from '../../models/request';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

const FreelancerJobPosts = observer((props) => {
    const navigation = useNavigation();
    const activecategory = props.params.props[2][0]?.name || '';
    const jobsearchquery = props.params.props[5] || '';
    const jobsearchmenu = props.params.props[4];
    const AuthContext = useContext(AuthStore);
    const [requestcollection, setrequestcollection] = useState();
    async function getotherrequests(){
        try{
            AuthContext.letmeload()
            const response = await getfreelancerjobs();
            if(response.success){
                const collection = [];
                setrequestcollection();
                response.requests.map(request => {
                    const requestdata = Request.create({
                        _id: request._id,
                        category: Category.create(request.category),
                        created_At: new Date(request.created_At),
                        description: request.description,
                        request_status: request.request_status,
                        requested_by: User.create(request.requested_by),
                    })
                    collection.push(requestdata);
                })
                setrequestcollection(collection);
            }
            AuthContext.donewithload();
        }catch(error){
            AuthContext.donewithload();
            console.log(error);
            alert("An Error has Occured");
        }
    }
    useEffect(()=>{
        getotherrequests();
    },[])
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getotherrequests();
        setTimeout(() => {
        setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View style={styles.container}>
            <Loading/>
            <FlatList
                data={requestcollection?.filter(request=>{
                    let hasSearchQuery;
                    const isCategory = request.category.name.toLowerCase().includes(activecategory.toLowerCase());
                    const isWaiting = request.request_status.toLowerCase() === "waiting";
                    if(jobsearchmenu === "Requests"){
                        hasSearchQuery = request.description.toLowerCase().includes(jobsearchquery.toLowerCase());
                    }else if(jobsearchmenu === "Clients"){
                        hasSearchQuery = request.requested_by.name.toLowerCase().includes(jobsearchquery.toLowerCase());
                    }else{
                        hasSearchQuery = request.description.toLowerCase().includes(jobsearchquery.toLowerCase());
                    }
                    return hasSearchQuery && isWaiting && isCategory;
                }).sort((a, b) => {
                    return new Date(b.created_At) - new Date(a.created_At);
                })}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                    <Card key={item._id} style={[styles.cardStyle,{margin:5}]}>
                        <Card.Title
                            title={item.requested_by.name.toUpperCase()}
                            subtitle={<Text style={{color:'dimgrey'}}>{item.category.name}</Text>}
                            left={() => <Avatar.Image size={40} source={{uri: item.requested_by.avatar.url}} />}
                        />
                        <Card.Content>
                            <Text style={{color:'dimgrey'}}>
                                {
                                    format(item.created_At, 'dd MMM yyyy')
                                }
                            </Text>
                            <Text variant='titleMedium' style={{color:'#9c6f6f'}}>Description:</Text>
                            <Text>{item.description}</Text>
                            
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode='outlined'
                                icon='chat-outline'
                                textColor='#9c6f6f'
                                onPress={() => {
                                    navigation.navigate('FreelancerMessaging', item);
                                }}
                                >
                                Message
                            </Button>
                        </Card.Actions>
                    </Card>
                )}
                ListEmptyComponent={() => (
                    <Card style={[styles.cardStyle, {margin:5}]}>
                        <Card.Title title="No Requests" />
                    </Card>
                )}
            />
        </View>
    )
})

export default FreelancerJobPosts;