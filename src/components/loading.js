import React, { useContext } from 'react';

import { ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import { observer } from 'mobx-react-lite';

import AuthStore from '../models/authentication';

export default LoadingScreen = observer(() => {
    const AuthContext = useContext(AuthStore);
    return (
        <Portal>
            <Dialog visible={AuthContext.loadingstate} style={{backgroundColor:'transparent', shadowColor:'transparent'}}>
            <Dialog.Content>
                <ActivityIndicator animating={AuthContext.loadingstate} size={100} color='#9c6f6f' />
            </Dialog.Content>
            </Dialog>
        </Portal>
        )
    })