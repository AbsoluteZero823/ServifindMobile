import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'center',
      minWidth: 300,
      maxWidth: 500,
    },
    landingpage: {
      width: 300,
      alignItems:'center'
    },
    registrationpage:{
        height: "50%",
        width: "90%",

        minHeight: 300,
        maxHeight: 300,
        minWidth: 300,
        maxWidth: 300,
        
        alignSelf:'center',
        justifyContent: 'center',
    },
    input:{
        marginVertical:0,
    },
    inputbutton:{
        marginTop:10
    },  
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '400',
      marginBottom: 20,
    },
    highlight:{
        color: 'deeppink',
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
        maxWidth: 200,
    }
});

export default styles;