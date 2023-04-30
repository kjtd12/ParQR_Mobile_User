import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import {useNavigation} from '@react-navigation/core'
import React, {useState} from 'react'
import { firebase } from '../config'

const auth = firebase.auth()

function CustomBackButton() {
    const navigation = useNavigation();
  
    return (
      <TouchableOpacity onPress={() => navigation.replace('Landing')}>
        <Text style={{paddingLeft: 20}}>Back</Text>
      </TouchableOpacity>
    );
}

const SignupScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password1, setPassword1] = useState('')
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [address, setAddress] = useState('')
    const [errorMsgEmail, setErrorMsgEmail] = useState(null)
    const [errorMsgPassword, setErrorMsgPassword] = useState(null)
    const [errorMsgPassword1, setErrorMsgPassword1] = useState(null)
    const [errorName, setErrorMsgName] = useState(null)
    const [errorNumber, setErrorMsgNumber] = useState(null)
    const [errorAddress, setErrorMsgAddress] = useState(null)
    const [passWordMatch, setErrorMessagePasswordMatch] = useState(null)

    const navigation = useNavigation()

    const registerUser = async (email, password, name, number) => {

        const e_wallet = 0;
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(
              email,
              password
            );
            const user = userCredential.user;
            console.log(user.email);
        
            await user.sendEmailVerification({
              handleCodeInApp: true,
              url: 'https://fir-auth-81e51.firebaseapp.com'
            });
            // fir-auth-81e51.firebaseapp.com
            // https://parqr-8d2fd.firebaseapp.com
            
            await firebase.firestore().collection('users')
                .doc(firebase.auth().currentUser.uid)
                .set({
                    name,
                    number,
                    email,
                    e_wallet,
                    address
            });
            alert('Verification email sent!');
          } catch (error) {
            alert(error.message);
          }
    }

    const handleSignUp = () => {
        if (!email || !password || !password1 || !name || !number) {
            setErrorMsgEmail(!email ? 'Email is required' : '');
            setErrorMsgPassword(!password ? 'Password is required' : '');
            setErrorMsgPassword1(!password1 ? 'Password is required' : '');
            setErrorMsgName(!name ? 'Name is required' : '');
            setErrorMsgAddress(!name ? 'Name is required' : '');
            setErrorMsgNumber(!number? 'Number is required' : undefined);
            if (password.trim() !== password1.trim()) {
                setErrorMessagePasswordMatch('Passwords do not match');
                return;
            }
            return;
        } else {
            setErrorMsgEmail('');
            setErrorMsgPassword('');
            setErrorMsgPassword1('');
            setErrorMsgName('');
            setErrorMsgNumber('');

            registerUser(email, password, name, number);
            navigation.replace('Login')
        }
    }

  return (
    <View style={styles.container}>
        <Text style={[{fontWeight: 'bold', fontSize: 15}, styles.text]}>
            Account Sign Up
        </Text>
        <View style = {[{marginTop: 10}, styles.inputContainer]}>
            <Text style={styles.text}>Full Name</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter your Full Name"
                onChangeText={(name) => setName(name)}
                autoCorrect={false}
            />
            {errorName && <Text style={styles.error}>{errorName}</Text>}
            <Text style={styles.text}>Phone Number</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(number) => setNumber(number)}
                autoCorrect={false}
                autoCapitalize = "none"
            />
            {errorNumber && <Text style={styles.error}>{errorNumber}</Text>}
            <Text style={styles.text}>Address</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter your Address"
                onChangeText={(address) => setAddress(address)}
                autoCorrect={false}
                autoCapitalize = "none"
            />
            {errorAddress && <Text style={styles.error}>{errorAddress}</Text>}
            <Text style={styles.text}>Email Address</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter your Email"
                onChangeText={(email) => setEmail(email)}
                autoCorrect={false}
                autoCapitalize = "none"
                keyboardType="email-address"
            />
            {errorMsgEmail && <Text style={styles.error}>{errorMsgEmail}</Text>}
            <Text style={styles.text}>Password</Text>
            <TextInput
                style={styles.textInput}
                placeholder=""
                onChangeText={(password) => setPassword(password)}
                autoCorrect={false}
                autoCapitalize = "none"
                secureTextEntry={true}
            />
            {errorMsgPassword && <Text style={styles.error}>{errorMsgPassword}</Text>}
            <Text style={styles.text}>Confirm Password</Text>
            <TextInput
                style={styles.textInput}
                placeholder=""
                onChangeText={(password1) => setPassword1(password1)}
                autoCorrect={false}
                autoCapitalize = "none"
                secureTextEntry={true}
            />
            {errorMsgPassword1 && <Text style={styles.error}>{errorMsgPassword1}</Text>}
            {passWordMatch && <Text style={styles.error}>{passWordMatch}</Text>}
        </View>
        <TouchableOpacity
            onPress={handleSignUp}
        >
            <Text style={[styles.button, {fontWeight: 'bold', fontSize: 12, marginTop: 20}, styles.text]}>Sign Up</Text>
        </TouchableOpacity>
    </View>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#213A5C',
    },
    inputContainer: {
        width: '80%'
    },
    textInput :{
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 5
    },
    button: {
        backgroundColor: '#F3BB01',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    text: {
        color: 'white'
    },
    error: {
        color: 'red'
    }
})