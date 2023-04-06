import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect } from 'react';
import { Keyboard, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Searchbar, Button, Menu, IconButton, Text } from 'react-native-paper';

import UserStore from '../models/user';

export const CustomAppBar = observer((props) => {
    const navigation = useNavigation();
    const UserContext = useContext(UserStore);
    const [menuvisible, setmenuvisible] = useState(false);
    const [AppbarTitle, setActive, setAppbarTitle, drawer, DrawerActive, setDrawerActive, jobsearchquery, setjobsearchquery, jobsearchmenu, jobsearch, setjobsearch] = props.passed;
    const [searchisLoading, setjobisLoading] = useState(false);
    useEffect(()=>{
        setjobisLoading(true);
        setTimeout(()=>{
            setjobisLoading(false);
        }, 1000)
    },[jobsearchquery])
    return (
        <Appbar.Header style={{justifyContent:'flex-end', backgroundColor:'transparent'}}>
            {
                AppbarTitle === 'Jobs' ?   
                <Appbar.Content title={
                    <Searchbar 
                        value={jobsearchquery} 
                        loading={searchisLoading}
                        onChangeText={(text)=>setjobsearchquery(text)} 
                        placeholder='Search...' 
                        icon='magnify' 
                        iconColor='deeppink' 
                        onFocus={()=> DrawerActive ? Keyboard.dismiss() : <></> }
                        style={{marginRight:10, borderColor:'dimgrey', borderWidth:2}} 
                        right={()=>
                            searchisLoading ? null : 
                            <>
                            {
                                jobsearchquery && <IconButton icon='window-close' size={20} iconColor='deeppink' onPress={()=>setjobsearchquery('')}/>
                            }
                            <Menu
                                visible={menuvisible}
                                onDismiss={()=>setmenuvisible(false)}
                                anchorPosition='bottom'
                                anchor={
                                    <Button 
                                    mode='text' 
                                    icon='chevron-down' 
                                    textColor='deeppink' 
                                    contentStyle={{flexDirection:'row-reverse'}}
                                    onPress={()=>setmenuvisible(true)}
                                    >
                                        {
                                            jobsearch
                                        }
                                        </Button>
                                        }>
                                {
                                    jobsearchmenu.map((item, index)=>(
                                        <Menu.Item key={index} dense={true} leadingIcon={item.icon} onPress={() => setjobsearch(item.title)} title={item.title}/>
                                    ))
                                }
                            </Menu>
                            </>
                        }/>
                }/>
                :  
                <>
                <Appbar.Content title={AppbarTitle} titleStyle={{color:'deeppink', fontWeight:'bold',fontSize:28, marginLeft:10}}/>
                <TouchableOpacity onPress={()=>{setActive('Jobs'), setAppbarTitle('Jobs'),navigation.navigate('ClientJobs')}}>
                    <Appbar.Action icon='magnify' color='deeppink' size={26}/>
                </TouchableOpacity>
                </>
            }
            
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