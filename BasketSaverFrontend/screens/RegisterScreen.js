import { View,ScrollView, Text, Button, StyleSheet, Image, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback, Dimensions } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useState, useEffect} from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';

export function RegisterScreen(){
    
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardStatus(false);
        });

        return () => {
        showSubscription.remove();
        hideSubscription.remove();
        };
    }, []);
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [invalidPass, setInvalidPass] = useState(false);
    const [fontsLoaded, fontsError] = useFonts({
        'Source Sans Pro': require('../assets/fonts/SourceSansPro-Regular.otf'),
        'Source Sans Pro Italic': require('../assets/fonts/SourceSansPro-It.otf'),
        'Source Sans Pro Light': require('../assets/fonts/SourceSansPro-Light.otf'),
        'Source Sans Pro Light Italic': require('../assets/fonts/SourceSansPro-LightIt.otf'),
        'Staatliches': require('../assets/fonts/Staatliches-Regular.ttf')
    })
    const [userfieldFocus, setUserfieldFocus] = useState('#CACACA');
    const [passfieldFocus, setPassfieldFocus] = useState('#CACACA');
    const [firstfieldFocus, setFirstfieldFocus] = useState('#CACACA');
    const [lastfieldFocus, setLastfieldFocus] = useState('#CACACA');
    const [emailfieldFocus, setEmailfieldFocus] = useState('#CACACA');
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontsError) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded, fontsError]);

    if (!fontsLoaded && !fontsError) {
        return null;
    }
    const [buttonClicked, setButtonClicked] = useState('normal')
    function UserNameFocused(){
        setUserfieldFocus('#006475')
    }
    function UserNameUnFocused(){
        setUserfieldFocus('#CACACA')
    }
    function FirstNameFocused(){
        setFirstfieldFocus('#006475')
    }
    function FirstNameUnFocused(){
        setFirstfieldFocus('#CACACA')
    }
    function LastNameFocused(){
        setLastfieldFocus('#006475')
    }
    function LastNameUnFocused(){
        setLastfieldFocus('#CACACA')
    }
    function EmailFocused(){
        setEmailfieldFocus('#006475')
    }
    function EmailUnFocused(){
        setEmailfieldFocus('#CACACA')
    }
    function PasswordFocused(){
        setPassfieldFocus('#006475')
    }
    function PasswordUnFocused(){
        setPassfieldFocus('#CACACA')
    }

    async function handleRegister(){
        setButtonClicked('loading')
        if(password.length > 8 && firstName && lastName && email && email.includes("@") && username ){
            setInvalidPass(false)
            const axiosInstance = axios.create();
            try{
                const promise1 = await new Promise((resolve, reject) => {
                    axiosInstance
                        .post(
                            process.env.EXPO_PUBLIC_BASE_API_URL + 
                            process.env.EXPO_PUBLIC_USER_PORT +
                            "/user_service/account/register",
                            {
                                "username": username,
                                "password": password,
                                "email": email,
                                "first_name": firstName,
                                "last_name": lastName
                            }
                            )
                            .then((res)=> {
                                setButtonClicked('success')
                                resolve('promise1');
                            })
                            .catch((error) => {
                                console.log( "ERROR: Could not register", error );
                                setButtonClicked("normal")
                            })
                        })
                    if (promise1){
                        navigation.navigate('Login')
                    }
            }
            catch (error) {
                setButtonClicked("normal")
                console.error('Error:', error);
            }
        }
        else{
            await new Promise(r => setTimeout(r, 400));
            if (password.length < 8){
                setPassfieldFocus('red')
                setInvalidPass(true)
            }
            if(!firstName){
                setFirstfieldFocus('red')
            }
            if(!lastName){
                setLastfieldFocus('red')
            }
            if(!email || !email.includes("@")){
                setEmailfieldFocus('red')
            }
            if(!username){
                setUserfieldFocus('red')
            }
            setButtonClicked("normal")
        }
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.background} onLayout={onLayoutRootView}>
                <Image source={require('../assets/Logo Long White.png')} style={[styles.logo, {marginBottom: keyboardStatus ? -55 : 5}]} resizeMode="contain"></Image>
                <KeyboardAvoidingView style={{width: "100%", alignItems: "center"}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}/>
                <Text style={styles.register_header}>Register</Text>
                <View style={styles.name_container}>
                    <TextInput
                        id='firstField'
                        style={[styles.text_input_names,
                            {fontFamily: firstName ? "Source Sans Pro": "Source Sans Pro Light Italic",
                            borderColor: firstfieldFocus,
                            marginBottom: 20,}]}
                        placeholder="First Name"
                        onChangeText={newText => setFirstName(newText)}
                        defaultValue={firstName}
                        onFocus={FirstNameFocused}
                        onBlur={FirstNameUnFocused}
                    ></TextInput>
                    <TextInput
                        id='lastField'
                        style={[styles.text_input_names,
                            {fontFamily: lastName ? "Source Sans Pro": "Source Sans Pro Light Italic",
                            borderColor: lastfieldFocus,
                            marginBottom: 20,}]}
                        placeholder="Last Name"
                        onChangeText={newText => setLastName(newText)}
                        defaultValue={lastName}
                        onFocus={LastNameFocused}
                        onBlur={LastNameUnFocused}
                ></TextInput>
                </View>
                <TextInput
                    id='emailField'
                    style={[styles.text_input,
                        {fontFamily: email ? "Source Sans Pro": "Source Sans Pro Light Italic",
                        borderColor: emailfieldFocus,
                        marginBottom: 20,}]}
                    placeholder="E-mail"
                    onChangeText={newText => setEmail(newText)}
                    defaultValue={email}
                    onFocus={EmailFocused}
                    onBlur={EmailUnFocused}
                    autoCapitalize='none'
                >
                </TextInput>
                <TextInput
                    id='userField'
                    style={[styles.text_input,
                        {fontFamily: username ? "Source Sans Pro": "Source Sans Pro Light Italic",
                        borderColor: userfieldFocus,
                        marginBottom: 20,}]}
                    placeholder="Username"
                    onChangeText={newText => setUsername(newText)}
                    defaultValue={username}
                    onFocus={UserNameFocused}
                    onBlur={UserNameUnFocused}
                    autoCapitalize='none'
                >
                </TextInput>
                <TextInput
                    id='passField'
                    style={[styles.text_input,
                        {fontFamily: password ? "Source Sans Pro": "Source Sans Pro Light Italic",
                        borderColor: passfieldFocus,
                        marginBottom: 5}]}
                    placeholder="Password"
                    onChangeText={newText => setPassword(newText)}
                    defaultValue={password}
                    secureTextEntry={true}
                    onFocus={PasswordFocused}
                    onBlur={PasswordUnFocused}
                    autoCapitalize='none'
                />
                {invalidPass &&
                    <>
                        <Text style={[styles.error_text,{bottom : keyboardStatus ? 0 : "31%"}]}>Password should be longer than 8 characters!</Text>
                    </>}
                <TouchableOpacity 
                    style={styles.sign_in_btn_container}
                    activeOpacity={0.7}
                    onPress={handleRegister}>
                    {buttonClicked === "normal" &&
                        <Text style={styles.sign_in_btn}>Register</Text>
                    }
                    {buttonClicked === "loading" &&
                        <Image source={require('../assets/Loading.gif')} style={{height: 45, width: 45}}></Image>
                    }
                    {buttonClicked === "success" &&
                    <Image source={require('../assets/Checkmark.png')}></Image>}
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    background:{
        backgroundColor: '#0097B2',
        alignItems: 'center',
        flex: 1,
    },
    logo:{
        width: "92%",
        marginTop: "-8%",
    },
    register_header:{
        alignSelf: "flex-start",
        marginLeft: "6%",
        fontFamily: "Staatliches",
        color: "#FFFFFF",
        fontSize: 40,
        marginBottom: "5%"
    },
    text_input_names:{
        height: 70,
        width: "47.5%",
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius:10,
        fontSize:20,
        borderWidth: 2,
    },
    name_container:{
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-between"
    },
    text_input:{
        width: "90%",
        height: 70,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius:10,
        fontSize:20,
        borderWidth: 2,
    },
    sign_in_btn_container:{
        backgroundColor: "#006475",
        height: 80,
        width: 300,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        borderRadius: 25,
        marginTop:34
    },
    sign_in_btn:{
        fontFamily: "Staatliches",
        color: "#FFFFFF",
        fontSize: 35
    },
    error_text:{
        color: "red",
        fontSize: 15,
        position: "absolute",
    }
}
)