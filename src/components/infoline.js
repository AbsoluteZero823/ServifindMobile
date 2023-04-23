import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    color: '#9c6f6f',
    width: '30%',
  },
  text: {
    alignSelf: 'flex-end',
    flexShrink: 1,
    textAlign: 'right',
  },
});

export default InfoLine = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}
