import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';

import UserStore from '../../models/user';

export const CustomAppBar = observer((props) => {
    const navigation = useNavigation();
    const UserContext = useContext(UserStore);
    const [AppbarTitle, setActive, setAppbarTitle, drawer, DrawerActive, setDrawerActive] = props.passed;
    return (
        <Appbar.Header style={{justifyContent:'flex-end', backgroundColor:'transparent'}}>
            <Appbar.Content title={AppbarTitle} titleStyle={{color:'deeppink', fontWeight:'bold',fontSize:28}}/>
            <TouchableOpacity onPress={()=>{setActive('Jobs'), setAppbarTitle('Jobs'),navigation.navigate('ClientJobs')}}>
                <Appbar.Action icon='magnify' color='deeppink' size={30}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight:16}} onPress={() => {
                setDrawerActive(!DrawerActive),
                    DrawerActive ? 
                        drawer.current.closeDrawer() 
                        : 
                        drawer.current.openDrawer()
                }}>
                <Avatar.Image size={34} source={{uri: UserContext.users[0]?.UserDetails?.avatar?.url}} style={{backgroundColor:'deeppink'}}/>
            </TouchableOpacity>
        </Appbar.Header>
    )
})