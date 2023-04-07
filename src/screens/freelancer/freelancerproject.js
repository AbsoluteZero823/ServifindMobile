import { observer } from 'mobx-react';
import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground} from 'react-native';
import { Button, Card, Text, Avatar, Portal, Modal} from 'react-native-paper';
import AuthStore from '../../models/authentication';
import Loading from '../../components/loading';

const FreelancerProject = observer(() => {
    return (
        <Portal>
            <Loading/>
            <Modal>
                <Card>

                </Card>
            </Modal>
        </Portal>
    )
})

export default FreelancerProject;