import * as React from 'react';
import { Modal, Portal, Text, Button, Card, Provider } from 'react-native-paper';

const FreelancerPremium = () => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const upgradeToPremium = () => {
    // Send money to GCash account with note
    // 'User' Freelancer Premium Upgrade
  };

  return (
    <Provider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <Card style={{padding: 10}}>
            <Card.Title title="Upgrade to Premium" />
            <Card.Content>
              <Text>In Premium you get the following benefits:</Text>
              <Text>- Unlimited Services (Create as many Services as you like)</Text>
              <Text>- Unlimited Projects (Accept as many Job Requests as you want)</Text>
            </Card.Content>
            <Card.Actions style={{justifyContent: 'flex-end'}}>
              <Button mode="contained" onPress={upgradeToPremium} style={{marginRight: 10}}>Yes</Button>
              <Button mode="outlined" onPress={hideModal}>No</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
      <Button mode="contained" onPress={showModal}>Show Modal</Button>
    </Provider>
  );
};

export default FreelancerPremium;
