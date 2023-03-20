import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Text } from "react-native-paper";
import { observer } from "mobx-react";

const Error = observer(({ErrorCode, ErrorMessage}) => {
    console.log('WOO!');
    return (
    <View style={styles.container}>
        <Text style={styles.ErrorCode} variant="displayMedium">{ErrorCode}</Text>
        <Text style={styles.ErrorMessage} variant="titleSmall">{ErrorMessage}</Text>
    </View>
    )
})

const styles = StyleSheet.create({
    container: {
        minHeight: 200,
        maxHeight: 300,
        minWidth:300,
        maxWidth:500,
        width: '90%',
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "#F5FCFF",
        borderRadius: 30,
    },
    ErrorCode: {
        textAlign:'center',
        color:'#B22D1D',
        fontWeight:'bold',
        marginVertical: 30,
    },
    ErrorMessage: {
        alignSelf: 'center',
        textAlign: "center",
        width: '80%',
        color: "#B22D1D",
        marginBottom: 30,
    },
})

export default Error;