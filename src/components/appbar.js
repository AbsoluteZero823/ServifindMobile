import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect } from 'react';
import { Keyboard, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Searchbar, Button, Menu, IconButton, Text } from 'react-native-paper';

import UserStore from '../models/user';
import AuthStore from '../models/authentication';

export const CustomAppBar = observer((props) => {
    const navigation = useNavigation();
    const UserContext = useContext(UserStore);
    const AuthContext = useContext(AuthStore);
    const [menuvisible, setmenuvisible] = useState(false);
    const [AppbarTitle, setActive, setAppbarTitle, drawer, DrawerActive, setDrawerActive, jobsearchquery, setjobsearchquery, jobsearchmenu, jobsearch, setjobsearch] = props.passed;
    const [searchisLoading, setjobisLoading] = useState(false);
    useEffect(()=>{
        setjobisLoading(true);
        setTimeout(()=>{
            setjobisLoading(false);
        }, 1000)
    },[jobsearchquery])

    const [ShorthandName, setShorthandName] = useState('');

    useEffect(()=>{
        if (UserContext && UserContext.users && UserContext.users[0] && UserContext.users[0].UserDetails) {
            const name = UserContext.users[0].UserDetails.name;
            const firstInitial = name[0];
            const lastSpaceIndex = name.lastIndexOf(' ');
            const lastInitial = lastSpaceIndex > 0 ? name[lastSpaceIndex + 1] : '';
            const initials = `${firstInitial}${lastInitial}`.toUpperCase();
            setShorthandName(initials);
          }
    },[UserContext])

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
                        iconColor='#9c6f6f' 
                        onFocus={()=> DrawerActive ? Keyboard.dismiss() : <></> }
                        style={{marginRight:10, borderColor:'dimgrey', borderWidth:2}} 
                        right={()=>
                            searchisLoading ? null : 
                            <>
                            {
                                jobsearchquery && <IconButton icon='window-close' size={20} iconColor='#9c6f6f' onPress={()=>setjobsearchquery('')}/>
                            }
                            <Menu
                                visible={menuvisible}
                                onDismiss={()=>setmenuvisible(false)}
                                anchorPosition='bottom'
                                anchor={
                                    <Button 
                                    mode='text' 
                                    icon='chevron-down' 
                                    textColor='#9c6f6f' 
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
                <Appbar.Content title={AppbarTitle} titleStyle={{color:'#9c6f6f', fontWeight:'bold',fontSize:28, marginLeft:10}}/>
                <TouchableOpacity onPress={()=>{setActive('Jobs'), setAppbarTitle('Jobs'),navigation.navigate(AuthContext.myrole === 'customer' ? 'ClientJobs' : 'FreelancerJobPosts')}}>
                    <Appbar.Action icon='magnify' color='#9c6f6f' size={26}/>
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
                
                
                {
                    UserContext.users[0]?.UserDetails?.avatar?.url ?
                    <Avatar.Image size={34} source={{uri: UserContext.users[0]?.UserDetails?.avatar?.url}} style={{backgroundColor:'#9c6f6f'}}/>
                    :
                    <Avatar.Text size={34} label={ShorthandName || 'SF'} />
                }
            </TouchableOpacity>
        </Appbar.Header>
    )
})