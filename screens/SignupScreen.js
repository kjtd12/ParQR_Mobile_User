import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native'
import {useNavigation} from '@react-navigation/core'
import React, {useState} from 'react'
import { firebase } from '../config'
import { database } from 'firebase/compat/database';

const db = firebase.database().ref('user_register_count');

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
        const paymentStatus = null
        try {
          const userCredential = await auth.createUserWithEmailAndPassword(
            email,
            password
          );
          const user = userCredential.user;
      
          await user.sendEmailVerification({
            handleCodeInApp: true,
            url: 'https://parqr-8d2fd.firebaseapp.com'
          });
      
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              const uid = user.uid;
              firebase.firestore().collection('users')
                .doc(uid)
                .set({
                  name,
                  number,
                  email,
                  e_wallet,
                  address,
                  paymentStatus
                });
            }
          });

            const today = new Date().toISOString().slice(0, 10);
            db.child(today).transaction((count) => (count || 0) + 1);
      
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
        <TouchableOpacity onPress={() => navigation.replace('Landing')}>
            <Image
                source={ require('../assets/profileIcons/left.png') }
                style={{ tintColor: 'white', position: 'absolute', top: -50, right: 150 }}
              />
          </TouchableOpacity>
        <Text style={[{fontWeight: 'bold', fontSize: 20, color: '#F3BB01', fontWeight: 'bold'}]}>
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
                placeholder="Enter your Phone Number  (Ex: 09561566338)"
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
                placeholder="Enter your password"
                onChangeText={(password) => setPassword(password)}
                autoCorrect={false}
                autoCapitalize = "none"
                secureTextEntry={true}
            />
            {errorMsgPassword && <Text style={styles.error}>{errorMsgPassword}</Text>}
            <Text style={styles.text}>Confirm Password</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter your password again to Verify"
                onChangeText={(password1) => setPassword1(password1)}
                autoCorrect={false}
                autoCapitalize = "none"
                secureTextEntry={true}
            />
            {errorMsgPassword1 && <Text style={styles.error}>{errorMsgPassword1}</Text>}
            {passWordMatch && <Text style={styles.error}>{passWordMatch}</Text>}

            <TouchableOpacity
            onPress={handleSignUp}
            >
                <Text style={[styles.button, {fontWeight: 'bold', fontSize: 12, marginTop: 20, paddingHorizontal: 150}, styles.text]}>Sign Up</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.line} />
        <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: 'white' }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={{ color: '#F3BB01' }}> Login</Text>
            </TouchableOpacity>
        </View>
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
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    line: {
        height: 1,
        width: '80%',
        backgroundColor: 'white',
        marginVertical: 10,
    },
    text: {
        color: 'white'
    },
    error: {
        color: 'red'
    }
})