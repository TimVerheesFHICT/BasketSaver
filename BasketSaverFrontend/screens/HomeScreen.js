import { View, Text, Button, StyleSheet, Image, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback, NativeModules, BackHandler, Dimensions, ScrollView, Linking } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import { useFonts } from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { Shadow } from 'react-native-shadow-2';
import axios from "axios";
export function HomeScreen() {
    var height = Dimensions.get('window').height;
    var width = Dimensions.get('window').width
    const [searchText, setSearchText] = useState('')
    const [identifier, setIdentifier] = useState('home')
    const [searchFocused, setSearchFocused] = useState("#CACACA")
    const [hasSearched, setHasSearched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [fontsLoaded, fontsError] = useFonts({
        'Source Sans Pro': require('../assets/fonts/SourceSansPro-Regular.otf'),
        'Source Sans Pro Italic': require('../assets/fonts/SourceSansPro-It.otf'),
        'Source Sans Pro Light': require('../assets/fonts/SourceSansPro-Light.otf'),
        'Source Sans Pro Light Italic': require('../assets/fonts/SourceSansPro-LightIt.otf'),
        'Staatliches': require('../assets/fonts/Staatliches-Regular.ttf')
    })
    
    async function check_logged_in(){
        let token = await SecureStore.getItemAsync('JWT_token')
        if(!token){
            navigation.navigate('Login')
        }
    }


    function ImageSwitcher(store){
        if (store == "ah"){
            return require("../assets/ah_logo.png")
        }
        else if (store == "jumbo"){
            return require("../assets/jumbo_logo.png")
        }
        else if (store == "coop"){
            return require("../assets/coop_logo.png")
        }
        else if (store == "janlinders"){
            return require("../assets/janlinders_logo.png")
        }
        else if (store == "hoogvliet"){
            return require("../assets/hoogvliet_logo.png")
        }
        else if (store == "dirk"){
            return require("../assets/dirk_logo.png")
        }
        else if (store == "picnic"){
            return require("../assets/picnic_logo.png")
        }
        else if (store == "dekamarkt"){
            return require("../assets/dekamarkt_logo.png")
        }
        else if (store == "spar"){
            return require("../assets/spar_logo.png")
        }
        else if (store == "vomar"){
            return require("../assets/vomar_logo.jpg")
        }
        else if (store == "aldi"){
            return require("../assets/aldi_logo.png")
        }
    }

    function SearchFocused(){
        setSearchFocused("#006475")
    }
    function SearchUnFocused(){
        setSearchFocused("#CACACA")
    }
    // Function to extract euros from a price
    function extractEuros(price) {
        // Convert the price to a string
        let priceStr = price.toString();
        
        // Split the string by the decimal point
        let parts = priceStr.split(".");
        
        // Return the euros part (first part)
        return parseInt(parts[0]);
    }
    function extractCents(price) {
        // Convert the price to a string
        let priceStr = price.toString();
        
        // Split the string by the decimal point
        let parts = priceStr.split(".");
        
        // If there's no cents part, return 0
        if (parts.length < 2) {
            return 0;
        }
        if (parts[1].length < 2){
            parts[1] = parts[1] + "0"
        }
        // Return the cents part (second part)
        return parts[1];
    }
    function SiteSwitcher(store){
        if (store === "jumbo"){
            return "View on jumbo.com"
        }
        else if (store === "ah"){
            return "View on ah.nl"
        }
        else if (store === "janlinders"){
            return ""
        }
        else if (store === "dirk"){
            return "View on dirk.nl"
        }
        else if (store === "hoogvliet"){
            return "View on hoogvliet.com"
        }
        else if (store === "picnic"){
            return ""
        }
        else if (store === "dekamarkt"){
            return "View on dekamarkt.nl"
        }
        else if (store === "coop"){
            return "View on coop.nl"
        }
    }
    function HandleSiteClick(store, url){
        if (store === "ah"){
            Linking.openURL("https://www.ah.nl/producten/product/" + url)
        }
        else if (store === "jumbo"){
            Linking.openURL("https://www.jumbo.com/producten/" + url)
        }
        else if (store === "coop"){
            Linking.openURL("https://www.coop.nl/product/" + url)
        }
        else if (store === "dirk"){
            Linking.openURL("https://www.dirk.nl/zoeken/producten/" + url)
        }
        else if (store === "hoogvliet"){
            Linking.openURL("https://www.hoogvliet.com/product/" + url)
        }
        else if (store === "aldi"){
            Linking.openURL("https://www.aldi.nl/producten/" + url)
        }
    }
    async function HandleSearch(query){
        if (searchText){
            console.log(query)
            setIsLoading(true)
            setHasSearched(true)
            const axiosInstance = axios.create();
            try{
                const promise1 = await new Promise(async (resolve, reject) => {
                    axiosInstance.get(
                    process.env.EXPO_PUBLIC_BASE_API_URL + 
                    process.env.EXPO_PUBLIC_CATALOG_PORT +
                    "/catalog_service/get_items?search_query=" + query)
                    .then(async (res) => {
                        setSearchResults(res.data)
                        resolve("promise1")
                    })
                    .catch((error) => {
                        console.log( "ERROR: Could not fetch products", error );
                    })
                })
                if(promise1){
                    console.log("Success")
                    setIsLoading(false)
                }
            }
            catch (error){
                console.log("ERROR:"+ error)
            }
        }
    }

    useEffect(() => {
    //     check_logged_in()
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    //     return () => backHandler.remove()
        console.log(width)
      }, [])
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontsError) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded, fontsError]);

    if (!fontsLoaded && !fontsError) {
        return null;
    }

return(
    <View 
        style={styles.background} 
        onLayout={onLayoutRootView}>
        <View style={styles.top_logo_container}>
            <Image style={styles.top_logo} source={require('../assets/Logo Long White.png')} resizeMode="contain"></Image>
        </View>
        {identifier === 'home' && (
            <>
                <TextInput 
                style={[styles.search_bar, {borderColor: searchFocused, fontFamily:  searchText ? "Source Sans Pro": "Source Sans Pro Light"}]}
                placeholder="Search BasketSaver"
                onChangeText={newText => setSearchText(newText)}
                defaultValue={searchText}
                onFocus={SearchFocused}
                onBlur={SearchUnFocused}
                autoCapitalize='none'
                onSubmitEditing={() => HandleSearch(searchText)}
                >
                </TextInput>
                <Image style={styles.search_logo} source={require('../assets/SearchIcon.png')} resizeMode="contain"/>
                <TouchableOpacity style={{alignItems: 'flex-end', width: "100%", height: 32}}>
                    <Image style={styles.filter_logo} source={require('../assets/FilterIcon.png')} resizeMode="contain"/>
                </TouchableOpacity>
                    <View style={[{flex: 1, overflow: 'scroll', marginBottom: 78}]}>
                    <ScrollView>
                        {hasSearched === false ? (
                            <>
                                <Text>Please enter product name at the top to begin searching.</Text>
                            </>
                        ):(
                            isLoading === true ? (
                                <>
                                    <Image style={[styles.loading_gif, {marginTop: height * 0.3}]} source={require("../assets/Loading.gif")} resizeMode="contain"></Image>
                                </>
                            ):
                            searchResults.map((store, index) => {
                            return(
                                <>
                                    <Image style={[store.store === "ah" || store.store === "dirk" || store.store === "picnic" || store.store === "aldi" || store.store === "vomar" || store.store === "spar" ? styles.store_logo_small : styles.store_logo_long, {marginLeft: 15}]} source={ImageSwitcher(store.store)} resizeMode="contain"></Image>
                                    {store.items.map((product, index) => (
                                        <>
                                            <View key={product.id} style={[styles.product_card, {width: width, height: 200}]}>
                                                <Text style={styles.product_name}>{product.name}</Text>
                                                {index === 0 && (
                                                    <Text style={styles.cheapest_product}>CHEAPEST</Text>
                                                )}
                                                <Text style={styles.product_weight}>{product.weight === "0" ? "" : product.weight}</Text>
                                                <View style={styles.price_container}>
                                                    <Text style={styles.product_price_euros}>{extractEuros(product.price)}</Text>
                                                    <Text style={styles.product_price_cents}>{extractCents(product.price)}</Text>
                                                </View>
                                                <Text onPress={() => HandleSiteClick(product.store, product.url)} style={styles.site_link}>{SiteSwitcher(store.store)}</Text>
                                                <View style={styles.add_button_container}>
                                                    <Text style={styles.add_text}>Add to shopping list</Text>
                                                    <Image resizeMode='contain' style={styles.add_button} source={require("../assets/add_button.png")}></Image>
                                                </View>
                                            </View>
                                        </>
                                    ))}
                                    
                                </>);
                        })
                        )} 
                    </ScrollView>
                </View>
            </>
        )}
        
            <View style={styles.navigation_bar}>
                {identifier === 'home' ? (
                <>
                    <Image style={styles.nav_logo} source={require('../assets/HomeIconFocused.png')} resizeMode="contain"></Image> 
                    <View style={styles.select_bar}/>
                </>
                    ) : ( 
                    <TouchableOpacity onPress={() => setIdentifier('home')} >
                        <Image style={styles.nav_logo} source={require('../assets/HomeIcon.png')} resizeMode="contain"></Image>
                    </TouchableOpacity>
                )}
                {identifier === 'grocery_lists' ? (
                <>
                    <Image style={styles.nav_logo} source={require('../assets/ListIconFocused.png')} resizeMode="contain"></Image>
                    <View style={[styles.select_bar, {right: 183}]}/>
                </>
                    ) : (
                <TouchableOpacity onPress={() => setIdentifier('grocery_lists')} >
                    <Image style={styles.nav_logo} source={require('../assets/ListIcon.png')} resizeMode="contain"></Image>
                </TouchableOpacity>
                )}
                {identifier === 'profile' ? (
                <>
                    <Image style={styles.nav_logo} source={require('../assets/UsernameFocused.png')} resizeMode="contain"></Image>
                    <View style={[styles.select_bar, {right: 46}]}/>
                </>
                    ) : (
                <TouchableOpacity onPress={() => setIdentifier('profile')} >
                    <Image style={styles.nav_logo} source={require('../assets/UsernameUnfocused.png')} resizeMode="contain"></Image>
                </TouchableOpacity>
                )}
                
            </View>
    </View>
)
}

const styles = StyleSheet.create({
    background:{
        backgroundColor: '#FCFCFC',
        alignItems: 'center',
        flex: 1,
    },
    top_logo_container:{
        height: 75,
        width: "100%",
        backgroundColor: "#0097B2",
        zIndex: 9
    },
    top_logo:{
        height: 40,
        width: 300,
        alignSelf: "center",
        bottom: -30,
    },
    search_bar:{
        width: "95%",
        height: 56,
        backgroundColor: "#FFFFFF",
        marginTop: 25,
        borderRadius: 36,
        borderWidth: 2,
        fontSize: 20,
        paddingLeft: 75,
        paddingRight: 75
    },
    search_logo:{
        width: 32,
        height: 32,
        marginTop: -44,
        alignSelf: "flex-start",
        marginLeft: 35
    },
    filter_logo:{
        width: 32,
        height: 32,
        marginTop: -33,
        alignSelf: "flex-end",
        marginRight: 42
    },
    navigation_bar:{
        height: 68,
        width: "100%",
        bottom: 0,
        backgroundColor: "#FFFFFF",
        position: "absolute",
        borderTopWidth: 1,
        borderColor: "#E3E3E3",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    nav_logo:{
        height: 45,
        width: 45
    },
    select_bar:{
        height: 3,
        width: 45,
        backgroundColor: "#0097B2",
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    loading_gif:{
        maxHeight: 50
    },
    search_container:{
        flex: 1,
    },
    product_card:{
        backgroundColor: "#FFFFFF",
        marginBottom: 10,
        paddingLeft: 10
    },
    store_logo_small:{
        height: 65,
        maxWidth: 65,
        marginTop: 10
    },
    store_logo_long:{
        height: 50,
        maxWidth: 100,
        marginTop: 10
    },
    product_name:{
        fontFamily: "Source Sans Pro",
        fontSize: 30,
        width: "70%",
        lineHeight: 25,
        paddingTop: 10
    },
    cheapest_product:{
        position:"absolute",
        fontFamily: "Source Sans Pro",
        fontWeight: "600",
        fontSize: 20,
        right: 10,
        top: 5,
        color: "#0097B2",
        letterSpacing: 2
    },
    product_weight:{
        fontFamily: "Source Sans Pro",
        fontSize: 21,
        letterSpacing: 1,
        paddingLeft: 5,
    },
    price_container:{
        position: "absolute",
        left: 125,
        bottom: 35,
        display: "flex",
        flexDirection: "row"
    },
    product_price_euros:{
        fontFamily: "Source Sans Pro",
        fontSize: 100,
        fontWeight: "bold",
    },
    product_price_cents:{
        fontSize: 35,
        paddingTop: 25
    },
    site_link:{
        color: "#0492A9",
        fontSize: 18,
        fontFamily: "Source Sans Pro Light",
        textDecorationLine: "underline",
        position: "absolute",
        bottom: 0,
        left: 10
    },
    add_button_container:{
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        right: 10,
        bottom: 10,
        gap: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    add_text:{
        fontFamily: 'Source Sans Pro Light',
        fontSize: 20
    },
    add_button:{
        maxHeight: 50,
        maxWidth: 50
    }
  });