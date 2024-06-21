import { View, Text, Alert, Button, StyleSheet, Image, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback, NativeModules, BackHandler, Dimensions, ScrollView, Linking } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import { useFonts } from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { Shadow } from 'react-native-shadow-2';
import axios from "axios";
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
export function HomeScreen() {
    var height = Dimensions.get('window').height;
    var width = Dimensions.get('window').width
    const [searchText, setSearchText] = useState('')
    const [identifier, setIdentifier] = useState('home')
    const [searchFocused, setSearchFocused] = useState("#CACACA")
    const [hasSearched, setHasSearched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [gcLoading, setGcLoading] = useState(true)
    const [batchLoading, setBatchLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [groceryList, setGroceryList] = useState([])
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [fontsLoaded, fontsError] = useFonts({
        'Source Sans Pro': require('../assets/fonts/SourceSansPro-Regular.otf'),
        'Source Sans Pro Italic': require('../assets/fonts/SourceSansPro-It.otf'),
        'Source Sans Pro Light': require('../assets/fonts/SourceSansPro-Light.otf'),
        'Source Sans Pro Light Italic': require('../assets/fonts/SourceSansPro-LightIt.otf'),
        'Staatliches': require('../assets/fonts/Staatliches-Regular.ttf')
    })
    const navigation = useNavigation();
    
    async function check_logged_in(){
        let token = await SecureStore.getItemAsync('JWT_token')
        if(!token){
            navigation.navigate('Login')
        }
    }
    function getUserId(){
        const decoded = jwtDecode(SecureStore.getItem('JWT_token'))
        return decoded["user_id"]
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
    function handleAddProduct(store, itemID, name, url, price, weight){
        if (SecureStore.getItem("localGroceryAdditions") == undefined){
            SecureStore.setItem("localGroceryAdditions", "[]")
        }
        let previousAdditionsList = JSON.parse(SecureStore.getItem("localGroceryAdditions"))
        previousAdditionsList = previousAdditionsList.concat({
            "user_id": getUserId(),
            "store": store,
            "item": itemID,
            "amount": 1
        })
        SecureStore.setItem("localGroceryAdditions", JSON.stringify(previousAdditionsList))
        const currentGorceryListData = JSON.parse(SecureStore.getItem("GroceryListData"))
        currentGorceryListData.map((listStore, index) =>{
            if (listStore.store == store){
                listStore.items = listStore.items.concat({
                    "item": itemID,
                    "amount": 1,
                    "name": name,
                    "url": url,
                    "price": price,
                    "weight": weight
                })
            } 
        })
        console.log(JSON.stringify(currentGorceryListData))
        setGroceryList(currentGorceryListData)
        SecureStore.setItem("GroceryListData", JSON.stringify(currentGorceryListData))
        console.log(groceryList)
    }
    const removeItemFromStore = (store, itemID) => {
        setGroceryList(prevData =>{
            const newData = prevData.map(entry =>{
                if (entry.store == store){
                    
                    const itemIndex = entry.items.findIndex(item => item.item === itemID);
                    
                    if (itemIndex !== -1) {
                        return {
                            ...entry,
                            items: entry.items.filter((_, index) => index !== itemIndex)
                        };
                    }
                }
                return entry
            })
            SecureStore.setItem("GroceryListData", JSON.stringify(newData))
            return newData
        })
    }
    function handleRemoveProduct(store, itemID, name){
        if (SecureStore.getItem("localGroceryRemovals") == undefined){
            SecureStore.setItem("localGroceryRemovals", "[]")
        }
        if (SecureStore.getItem("localGroceryAdditions") == undefined || JSON.parse(SecureStore.getItem("localGroceryAdditions")).find(entry => entry.item == itemID) == undefined){
            console.log("Reached1")
            let removeList = JSON.parse(SecureStore.getItem("localGroceryRemovals"))
            const currentStore = groceryList.find(storeEntry => storeEntry.store == store)
            console.log(currentStore)
            const gcItem = currentStore.items.find(itemEntry => itemEntry.item == itemID)
            const gcID = gcItem.id
            removeList = removeList.concat({
                "grocery_list_id": gcID,
                "name": name
            })
            SecureStore.setItem("localGroceryRemovals",JSON.stringify(removeList))
        }
        else{
            console.log("Reached2")
            let localAdditions = JSON.parse(SecureStore.getItem("localGroceryAdditions"))
            const foundItem = localAdditions.findIndex(itemEntry => itemEntry.item == itemID)
            if (foundItem !== -1){
                localAdditions.splice(foundItem, 1)
            }
            SecureStore.setItem("localGroceryAdditions",JSON.stringify(localAdditions))
            console.log(SecureStore.getItem("localGroceryAdditions"))
        }
        removeItemFromStore(store,itemID)
        console.log(SecureStore.getItem("localGroceryRemovals"))
    }
    async function HandleSearch(query){
        if (searchText){
            console.log(query)
            console.log(process.env.EXPO_PUBLIC_CATALOG_API_URL)
            setIsLoading(true)
            setHasSearched(true)
            const axiosInstance = axios.create();
            try{
                const promise1 = await new Promise(async (resolve, reject) => {
                    axiosInstance.get(
                    "http://" +
                    process.env.EXPO_PUBLIC_CATALOG_API_URL + 
                    process.env.EXPO_PUBLIC_ACCESS_PORT +
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
    function handleLogout(){
        SecureStore.deleteItemAsync("GroceryListData")
        SecureStore.deleteItemAsync("localGroceryAdditions")
        SecureStore.deleteItemAsync("JWT_token")
        SecureStore.deleteItemAsync("localGroceryRemovals")
        navigation.navigate('Login')
    }
    
    const handleBatchJob = () => {
        const axiosInstance = axios.create();
        if (SecureStore.getItem("localGroceryRemovals") != undefined && SecureStore.getItem("localGroceryRemovals") != "[]"){
            const temp = SecureStore.getItem("localGroceryRemovals")
            const temp2 = JSON.parse(temp)
            axiosInstance.delete(
                "http://"+
                process.env.EXPO_PUBLIC_GROCERY_API_URL + 
                process.env.EXPO_PUBLIC_ACCESS_PORT +
                "/grocery_service/grocery_list/item_delete",
                { data: temp2 }
            )
            .then(
                SecureStore.setItem("localGroceryRemovals", "[]"),
                console.log("reached1"),
            )
            .catch((e)=> console.log(e))
        }
        if (SecureStore.getItem("localGroceryAdditions") != undefined && SecureStore.getItem("localGroceryAdditions") != "[]"){
            axiosInstance.post(
                "http://"+
                process.env.EXPO_PUBLIC_GROCERY_API_URL + 
                process.env.EXPO_PUBLIC_ACCESS_PORT +
                "/grocery_service/grocery_list/item_add",
                JSON.parse(SecureStore.getItem("localGroceryAdditions"))
            )
            .then(
                SecureStore.setItem("localGroceryAdditions", "[]"),
                console.log("reached2"),
            )
        }
        Alert.alert('Grocery List Saved', 'Your grocery list has been saved successfully.',[
            {
                text: "Okay",
                style: 'cancel'
            }
        ])
    }
    useEffect(() => {
        check_logged_in()
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        
        if (SecureStore.getItem('GroceryListData') == undefined){
            console.log("in")
            const axiosInstance = axios.create();
            axiosInstance.get(
                "http://" +
                process.env.EXPO_PUBLIC_GROCERY_API_URL + 
                process.env.EXPO_PUBLIC_ACCESS_PORT +
                "/grocery_service/grocery_list/get_items?user_id=" + getUserId())
                .then(async (res) => {
                    const data = JSON.stringify(res.data)
                    SecureStore.setItem("GroceryListData", data)
                    const unparsedData = SecureStore.getItem("GroceryListData")
                    const parsedData = JSON.parse(unparsedData)
                    setGroceryList(parsedData)
                    console.log(groceryList)
                    setGcLoading(false)
                })
                .catch(error => console.log(error))
            
        }
        else{
            const glData = SecureStore.getItem("GroceryListData")
            const jsonGlData = JSON.parse(glData)
            setGroceryList(jsonGlData)
            setGcLoading(false)
        }
        console.log(width)
        return () => backHandler.remove()
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
                                    <Image key={index} style={[store.store === "ah" || store.store === "dirk" || store.store === "picnic" || store.store === "aldi" || store.store === "vomar" || store.store === "spar" ? styles.store_logo_small : styles.store_logo_long, {marginLeft: 15}]} source={ImageSwitcher(store.store)} resizeMode="contain"></Image>
                                    {store.items.map((product, index) => (
                                            <View key={index} style={[styles.product_card, {width: width, height: 200}]}>
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
                                                    <TouchableOpacity style={{marginTop: 0, maxHeight: 50, maxWidth: 50 }} onPress={()=> handleAddProduct(product.store, product.id, product.name, product.url, product.price, product.weight)} >
                                                        <Image id={product.id} style={styles.add_button} resizeMode='contain' source={require("../assets/add_button.png")}></Image>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                    ))}
                                </>);
                        })
                        )} 
                    </ScrollView>
                </View>
            </>
        )}
        {identifier === 'grocery_lists' && (
            <View style={[{flex: 1, overflow: 'scroll', marginBottom: 78, width: width}]}>
                <ScrollView>
                    {gcLoading === true ? (
                        <>
                        <Image style={[styles.loading_gif, {marginTop: height * 0.3, left: width * 0.25}]} source={require("../assets/Loading.gif")} resizeMode="contain"></Image>
                        </>
                    ):(
                        groceryList.map((store, index) => {
                            return(
                                <>
                                <Image key={index} style={[store.store === "ah" || store.store === "dirk" || store.store === "picnic" || store.store === "aldi" || store.store === "vomar" || store.store === "spar" ? styles.store_logo_small : styles.store_logo_long, {marginLeft: 15}]} source={ImageSwitcher(store.store)} resizeMode="contain"></Image>
                            {store.items.length == 0 ? (
                                <>
                                <Text>This Grocery list is empty</Text>
                                </>
                        ):(
                            store.items.map((product, index) => (
                                <View key={index} style={[styles.product_card, {width: width, height: 200}]}>
                                    <Text style={styles.product_name}>{product.name}</Text>
                                    <Text style={styles.product_weight}>{product.weight === "0" ? "" : product.weight}</Text>
                                    <View style={styles.price_container}>
                                        <Text style={styles.product_price_euros}>{extractEuros(product.price)}</Text>
                                        <Text style={styles.product_price_cents}>{extractCents(product.price)}</Text>
                                    </View>
                                    <Text onPress={() => HandleSiteClick(product.store, product.url)} style={styles.site_link}>{SiteSwitcher(store.store)}</Text>
                                    <View style={styles.add_button_container}>
                                        <Text style={styles.add_text}>Remove</Text>
                                        <TouchableOpacity style={{marginTop: 0, maxHeight: 50, maxWidth: 50 }} onPress={()=> handleRemoveProduct(store.store, product.item, product.name)} >
                                            <Image id={product.id} style={styles.add_button} resizeMode='contain' source={require("../assets/remove_button.png")}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )
                                }
                                </>
                            )
                        }
                    )
                    )}
                    
        </ScrollView>
            <TouchableOpacity onPress={() => handleBatchJob()} style={styles.save_button_container}>
                <Image style={styles.save_button} source={require("../assets/save_button.png")}></Image>
            </TouchableOpacity>
        </View>
        )}
        {identifier === 'profile' && (
                <>
                <Text onPress={() => handleLogout()} style={styles.logout}>Logout</Text>
                </>
            )
        }
        
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
        width: "100%"
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
        alignItems: "center",
        textAlign: "center"
    },
    add_text:{
        fontFamily: 'Source Sans Pro Light',
        fontSize: 20
    },
    add_button:{
        maxHeight: 50,
        maxWidth: 50
    },
    logout:{
        fontSize: 20,
        fontFamily: 'Source Sans Pro Light',
        color: "#0492A9",
    },
    save_button_container:{
        position: "absolute",
        bottom: 10,
        right: 25,
        borderRadius: 150,
        overlayColor: '#0097B2',
    },
    save_button:{
        width: 75,
        height: 75,
        
    }
  });