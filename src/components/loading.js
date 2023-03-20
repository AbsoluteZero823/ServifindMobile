import React, { useContext } from 'react';

import { ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import { observer } from 'mobx-react-lite';

import AuthStore from '../models/authentication';

export default LoadingScreen = observer(() => {
    const AuthContext = useContext(AuthStore);
    return (
        <Portal>
        <Dialog visible={AuthContext.loadingstate}>
        <Dialog.Content>
        <ActivityIndicator animating={AuthContext.loadingstate} size={100} color='deeppink' />
        </Dialog.Content>
        </Dialog>
        </Portal>
        )
    })