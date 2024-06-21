import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
     KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

export function LoginScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fontsLoaded, fontsError] = useFonts({
        'Source Sans Pro': require('../assets/fonts/SourceSansPro-Regular.otf'),
        'Source Sans Pro Italic': require('../assets/fonts/SourceSansPro-It.otf'),
        'Source Sans Pro Light': require('../assets/fonts/SourceSansPro-Light.otf'),
        'Source Sans Pro Light Italic': require('../assets/fonts/SourceSansPro-LightIt.otf'),
        'Staatliches': require('../assets/fonts/Staatliches-Regular.ttf')
    })
    const [userfieldFocus, setUserfieldFocus] = useState("#CACACA");
    const [passfieldFocus, setPassfieldFocus] = useState("#CACACA");

    function UserNameFocused(){
        setUserfieldFocus("#006475")
    }
    function UserNameUnFocused(){
        setUserfieldFocus("#CACACA")
    }
    function PasswordFocused(){
        setPassfieldFocus("#006475")
    }
    function PasswordUnFocused(){
        setPassfieldFocus("#CACACA")
    }
    useEffect(() => {
        async function check_logged_in(){
            let token = await SecureStore.getItemAsync('JWT_token')
            if(token){
                navigation.navigate('Home')
            }
        }
        check_logged_in();
    },[]);
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontsError) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded, fontsError]);

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    async function LoginNestedPromises() {
        if(username && password){
            const axiosInstance = axios.create();
            try{
                const promise1 = await new Promise(async (resolve, reject) => {
                    axiosInstance.post(
                    "http://" +
                    process.env.EXPO_PUBLIC_USER_API_URL + 
                    process.env.EXPO_PUBLIC_ACCESS_PORT +
                    "/user_service/account/login",
                    {
                        "username": username,
                        "password": password,
                    })
                    .then(async (res) => {
                        await SecureStore.setItemAsync('JWT_token', res.data["access"])
                        resolve("promise1")
                    })
                    .catch((error) => {
                        console.log( "ERROR: Could not login", error );
                    })
                })
                if(promise1){
                    navigation.navigate("Home")
                }
            }
            catch (error){
                console.log("ERROR:"+ error)
            }
        }
        else{
            if(!username){
                setUserfieldFocus("red")
            }
            if(!password){
                setPassfieldFocus("red")
            }
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.background} onLayout={onLayoutRootView}>
                <Image source={require('../assets/Logo White.png')} style={styles.logo} resizeMode="contain"/>
                <View style={styles.login_container}>
                    <TextInput
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
                    {userfieldFocus ? (
                        <Image source={require('../assets/UsernameFocused.png')} style={styles.username_logo} resizeMode="contain"></Image>
                    ) : (
                        <Image source={require('../assets/UsernameUnfocused.png')} style={styles.username_logo} resizeMode="contain"></Image>
                    )}
                    
                    <TextInput
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
                    {passfieldFocus ? (
                        <Image source={require('../assets/PasswordFocused.png')} style={styles.password_logo} resizeMode="contain"></Image>
                    ) : (
                        <Image source={require('../assets/PasswordUnfocused.png')} style={styles.password_logo} resizeMode="contain"></Image>
                    )}
                    <Text style={styles.forgot_text}>Forgot Password?</Text>
                    <TouchableOpacity 
                    style={styles.sign_in_btn_container}
                    activeOpacity={0.7}
                    onPress={LoginNestedPromises}>
                        <Text style={styles.sign_in_btn}>Sign In</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                    keyboardVerticalOffset={-100}>
                    <Text style={styles.btm_txt}>Don't have an account?
                    <Text style={styles.btm_text_register} onPress={() => navigation.navigate('Register')}> Register</Text></Text>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
  };
  const styles = StyleSheet.create({
    background:{
        backgroundColor: '#0097B2',
        alignItems: 'center',
        flex: 1,
    },
    login_container:{
        height: '30%',
        width:'90%',
    },
    logo:{
        width: "70%",
        marginTop: "-10%",
        marginBottom: -20
    },
    text_input:{
        height: 70,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius:10,
        fontSize:20,
        borderWidth: 2,
    },
    username_logo:{
        position: "absolute",
        height: 35,
        left: "78%",
        top: 16
    },
    password_logo:{
        position: "absolute",
        height: 35,
        left: "77%",
        top: 105
    },
    forgot_text:{
        color: "#FFFFFF", 
        textDecorationLine: "underline", 
        textAlign: "center",
        fontFamily: "Source Sans Pro",
        fontSize: 18,
        letterSpacing: 1
    },
    sign_in_btn_container:{
        backgroundColor: "#006475",
        height: 80,
        width: 300,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        borderRadius: 25,
        marginTop:28
    },
    sign_in_btn:{
        fontFamily: "Staatliches",
        color: "#FFFFFF",
        fontSize: 35
    },
    btm_txt:{
        color: "#FFFFFF",
        position: "absolute",
        bottom: 4,
        fontFamily: "Source Sans Pro",
        fontSize: 17,
        flex: 1,
        justifyContent: 'flex-end',
        textAlign: "center",
        width: "100vw"
    },
    btm_text_register:{
        color: "#2825AE",
        textDecorationLine: "underline"
    },
    container:{
        flex:1,
        alignItems: "center",
        height: "auto"
    }
  });
  