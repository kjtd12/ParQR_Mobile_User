import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native'
import {useNavigation} from '@react-navigation/core'
import React from 'react'

const LandingScreen = () => {

    const navigation = useNavigation()

    const redirectSignUp = () => {
        navigation.replace('Signup')
    }

    const redirectLogIn = () => {
        navigation.replace('Login')
    }

    return (
        <View style={[styles.container, styles.shadow]}>
        {/* <Text>Landing</Text> */}
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image 
                    source={require('../assets/login.png')}
                    style={{width: 250, height: 200}}
                />
        </View>
        <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    onPress={redirectSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutineText}>Create an Account</Text>
                </TouchableOpacity>
                <Text style={styles.text}>Or</Text>
                <TouchableOpacity 
                    onPress={redirectLogIn}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LandingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#213A5C',
        width: '100%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#213A5C',
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutineText: {
        color: '#213A5C',
        fontWeight: '700',
        fontSize: 16,
    },
    shadow: {
        shadowColor: "#7F5DF0",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5
    },
    text: {
        marginTop: 20,
        marginBottom: 20,
    }
})