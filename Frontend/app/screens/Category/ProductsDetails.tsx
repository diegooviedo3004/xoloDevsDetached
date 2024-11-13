import { useTheme } from '@react-navigation/native';
import React, {useEffect, useState} from 'react'
import { View, Text,Image, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ScrollView } from 'react-native-gesture-handler';
import CheckoutItems from '../../components/CheckoutItems';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/reducer/cartReducer';
import Swiper from 'react-native-swiper/src';
import { Feather } from '@expo/vector-icons';
import Tabs from "../Components/Tabs";
import {usePostStore} from "../../store/usePostStore";
import {useAuthStore} from "../../store/useAuthStore";
import {useChatStore} from "../../store/useChatStore";


const ItemImages = [IMAGES.vacasCards1, IMAGES.vacasCards1, IMAGES.vacasCards1];

type ProductsDetailsScreenProps = StackScreenProps<RootStackParamList, 'ProductsDetails'>;

const ProductsDetails = ({navigation} : ProductsDetailsScreenProps) => {

    const  { activePost, startSetActivePost, startSetActiveTraceability, activeTraceability } = usePostStore()
    const { startSetActiveChat } = useChatStore()
    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const dispatch = useDispatch();

    const addItemToCart = () => {
        dispatch(addToCart({
            id:"15",
            image:IMAGES.vacasCards1,
            title:"Razas Guernsey",
            price:"$1200",
            brand:"Guernsey",
        } as any ));
    }

    useEffect(() => {
        startSetActiveTraceability(activePost.id)
    }, []);

    console.log(activeTraceability)


    console.log(activePost)
    return (
        <View style={{backgroundColor:colors.background,flex:1}}>
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View
                    style={[styles.imagecard,]}
                >
                    <Swiper
                        autoplay={true}
                        autoplayTimeout={2}
                        showsPagination={Platform.OS === "android" ? false : false}
                        loop={false}
                    >
                        {activePost?.images.map((data, index) => (
                            <View
                                key={index}
                            >
                                <Image
                                    style={{
                                        height:350,
                                        width: '100%',
                                        resizeMode:'contain'
                                    }}
                                    src={data.image}
                                />
                            </View>
                        ))}
                    </Swiper>
                    <View
                        style={[styles.toparre]}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.backbtn,{backgroundColor:'rgba(246,246,246,.3)'}]}
                        >
                            <Feather size={24} color={COLORS.card} name={'arrow-left'} />
                        </TouchableOpacity>
                        <Text style={{...FONTS.fontSemiBold,fontSize:20,color:COLORS.card}}>Detalles</Text>
                        <TouchableOpacity
                            onPress={() => {addItemToCart(); navigation.navigate('MyCart')}}
                            style={[styles.backbtn,{backgroundColor:'rgba(246,246,246,.3)'}]}
                        >
                            <Feather size={20} color={COLORS.card} name={'shopping-cart'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.bottomcard,{backgroundColor:theme.dark ? colors.background :colors.card}]}>
                    <View style={[GlobalStyleSheet.container,{paddingHorizontal:30}]}>
                        <View style={{alignItems:'center',marginBottom:20}}>
                            <View
                                style={{
                                    height:6,
                                    width:60,
                                    borderRadius:20,
                                    backgroundColor:'#DDDDDD',

                                }}
                            />
                            <Tabs />

                        </View>
                        <View
                            style={[styles.rattingcard]}
                        >
                            <Text style={{...FONTS.fontSemiBold,fontSize:24,color:COLORS.card,lineHeight:34}}>4.5</Text>
                        </View>

                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{paddingTop:0,}]}>
                <Button
                    onPress={async () => {
                        await startSetActiveChat(activePost.user_id);
                        setTimeout(() => {

                            navigation.navigate('Singlechat', { presetMessage: `Hola, estoy interesado en tu publicación: "${activePost?.title} | ${activePost?.description}"` })
                        }, 100)
                    }}
                    title='Contactar'
                    color={COLORS.primary}
                    text={COLORS.card}
                    style={{borderRadius:50}}
                />
                <Button
                    onPress={() => navigation.navigate('AddBid')}
                    title='Hacer una oferta'
                    text={COLORS.primary}
                    style={{ marginTop: 5 , borderRadius:50, backgroundColor:COLORS.card, borderStyle: "solid",  borderWidth: 1, borderColor:COLORS.primary}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    subCard:{
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor:COLORS.inputborder,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginBottom: 5
    },
    imagecard:{
        width:'100%',
        height: SIZES.height / 2,
        paddingTop:60,
        backgroundColor:COLORS.primary,
        paddingBottom:30
    },
    backbtn:{
        height: 45,
        width: 45,
        borderRadius:45,
        alignItems:'center',
        justifyContent : 'center',
    },
    toparre:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        paddingHorizontal: 30,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    bottomcard:{
        backgroundColor:COLORS.card,
        flex:1,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        marginTop:-60
    },
    rattingcard:{
        height:64,
        width:64,
        borderRadius:50,
        backgroundColor:'#FF8730',
        alignItems:'center',
        justifyContent:'center',
        shadowColor: 'rgba(255,135,48,.4)',
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.34,
        shadowRadius: 31.27,
        elevation: 8,
        position:'absolute',
        right:40,
        top:-25,
    },
    subtitle:{
        ...FONTS.fontRegular,
        fontSize:14,
        color:COLORS.title,
    },
    bottombtn:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:COLORS.secondary,
        height:65,
        borderRadius:50,
        padding:0
    },
    brandTitle:{
        ...FONTS.fontMedium,
        fontSize:20,
        color:COLORS.title,
    },
    subtitle2:{
        ...FONTS.fontSemiBold,
        fontSize:24,
        color:COLORS.title
    }
})

export default ProductsDetails