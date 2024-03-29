import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'center',
      width:'100%',
      backgroundColor: 'mistyrose',
    },
    landingpage: {
      alignItems:'center'
    },
    registrationpage:{
        width: "90%",
        minHeight: 300,
        minWidth: 300,
        maxWidth: 340,
        
        alignSelf:'center',
        justifyContent: 'center',
    },
    input:{
        marginVertical:0,
    },
    inputbutton:{
        marginTop:10,
    },  
    logo: {
      height: 100,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '400',
      marginBottom: 20,
      textAlign:'center'
    },
    highlight:{
        color: '#9c6f6f',
        fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign:'center'
    },
    cardaction:{
      flexDirection:'row', 
      alignItems:'center',
      flex: 1, 
      justifyContent:'center',
    },
    radiobuttongroup:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: 4,
      padding: 2
    },
    button: {
        margin:10,
        minWidth: 120,
        maxWidth: 220,
    }
});

export default styles;