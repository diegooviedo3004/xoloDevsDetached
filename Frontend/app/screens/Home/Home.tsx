import React, {useEffect, useRef, useState} from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import ImageSwiper from '../../components/ImageSwiper';
import Cardstyle4 from '../../components/Card/Cardstyle4';
import { openDrawer } from '../../redux/actions/drawerAction';
import {usePostStore} from "../../store/usePostStore";


const ArrivalData = [
    {
        id:"1",
        title: "Bovino",
        image:IMAGES.vacaCategories
    },
    {
        id:"1",
        title: "Guernsey",
        image:IMAGES.vacaCategories
    },
    {
        id:"1",
        title: "Holstein",
        image:IMAGES.vacaCategories
    },

]

const profilecartData = [
    {
        id:"1",
        title: "Razas \nGuernsey",
        subtitle:"Beverages",
        image:IMAGES.vacasCards1
    },
    {
        id:"2",
        title: "Razas Holstein \n Frisona",
        subtitle:"Beverages",
        image:IMAGES.vacasCards2
    },

]

const CardStyleData =[
    {
        id:"0",
        image:IMAGES.vacasCards1,
        title:"Guernsey",
        price:"$1200",
        countnumber:"765 kg",
    },
    {
        id:"1",
        image:IMAGES.cerdoCards1,
        title:"Holstein",
        price:"$1300",
        countnumber:"590 kg",
    },
    {
        id:"2",
        image:IMAGES.vacasCards2,
        title:"Landrace",
        price:"$600",
        countnumber:"320 kg",
    },{
        id:"2",
        image:IMAGES.vacasCards2,
        title:"Landrace",
        price:"$600",
        countnumber:"320 kg",
    },{
        id:"2",
        image:IMAGES.vacasCards2,
        title:"Landrace",
        price:"$600",
        countnumber:"320 kg",
    },{
        id:"2",
        image:IMAGES.vacasCards2,
        title:"Landrace",
        price:"$600",
        countnumber:"320 kg",
    },
]

const SwiperData = [
    {
        id:"1",
        image:IMAGES.vacasCards1,
        title:"Razas Guernsey",
        price:"1200",
        discount:"$1200"
    },
    {
        id:"2",
        image:IMAGES.vacasCards2,
        title:"Razas Holstein Frisona",
        price:"1580",
        discount:"$460"
    },
    {
        id:"3",
        image:IMAGES.cerdoCards1,
        title:"Raza Landrace",
        price:"1380",
        discount:"$8.0"
    }
]

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>

export const Home = ({ navigation }: HomeScreenProps) => {

    // const wishList = useSelector((state:any) => state.wishList.wishList);
    // console.log(wishList);

    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;

    const addItemToWishList = (data: any) => {
        dispatch(addTowishList(data));
    }

    const { posts,startLoadingPosts, startSetActivePost } = usePostStore();

    useEffect(() => {
        startLoadingPosts()
    }, []);
    
    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <View style={{}}>
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30,padding:0,paddingTop:30, paddingBottom: 20 }]}>
                    <View style={[GlobalStyleSheet.flex]}>
                        <View>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Buenas Noches</Text>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 24, color: colors.title }}>Ernesto Vargas</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Notification')}
                                activeOpacity={0.5}
                                style={[GlobalStyleSheet.background3, {}]}
                            >
                                <Image
                                   style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.card : '#5F5F5F'}]}
                                    source={IMAGES.Notification}
                                />
                                <View
                                    style={[styles.notifactioncricle,{
                                        backgroundColor:colors.card,
                                    }]}
                                >
                                    <View
                                        style={{
                                            height:13,
                                            width:13,
                                            borderRadius:13,
                                            backgroundColor:COLORS.primary
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                //onPress={() => navigation.openDrawer()}
                                onPress={() => dispatch(openDrawer())}
                                style={[GlobalStyleSheet.background3, {}]}
                            >
                                <Image
                                    style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.card : '#5F5F5F'}]}
                                    source={IMAGES.grid6}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{alignItems:'flex-start', marginTop: 25 }}>
                    <View style={[GlobalStyleSheet.flex,{paddingHorizontal:30}]}>
                        <Text style={[styles.brandsubtitle3,{fontSize: 18,color:colors.title}]}>Anuncios resaltados</Text>
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0,}]}>
                        <ImageSwiper
                            data={SwiperData}

                        />
                    </View>
                </View>

                <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingTop:0}]}>

                    <View style={{ marginHorizontal: -15, paddingHorizontal: 15, }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 30 }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginRight: 10,marginBottom:20 }}>
                                {ArrivalData.map((data: any, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {navigation.navigate('Products'); }}
                                            key={index}
                                            style={[styles.arrivaldata,{
                                                backgroundColor:theme.dark ? colors.background :colors.card,
                                                borderColor:'#EFEFEF',
                                                shadowColor: "rgba(4,118,78,.6)",
                                            }]}>
                                            <View style={[GlobalStyleSheet.flexcenter,{gap:20,justifyContent:'flex-start', padding: 3}]}>
                                                <Image
                                                    style={[GlobalStyleSheet.image3]}
                                                    source={data.image}
                                                />
                                                <View>
                                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color:  colors.title }}>{data.title}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {/* <View style={[GlobalStyleSheet.container,{padding:0}]}>
                    <View style={[GlobalStyleSheet.flex,{paddingHorizontal:30}]}>
                        <Text style={[styles.brandsubtitle3,{fontSize: 18,color:colors.title}]}>Mas Ordenes</Text>
                    </View>
                    <View style={{ marginHorizontal: -15, paddingHorizontal: 15, paddingTop: 25 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 30 }}
                        >
                            <View style={[styles.profilecard, { flexDirection: "row", gap: 10  }]}>
                                {profilecartData.map((data: any, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => navigation.navigate('ProductsDetails')}
                                            key={index}
                                            style={[styles.arrivaldata,{
                                                backgroundColor:COLORS.primary,
                                                borderColor:'#EFEFEF',
                                                width: "auto"
                                            }]}>
                                            <View style={[GlobalStyleSheet.flexcenter,{gap:20,justifyContent:'space-around'}]}>
                                                <Image
                                                    style={{height:100,width:100,resizeMode:'contain',}}
                                                    source={data.image}
                                                />
                                                <View>
                                                    <Text numberOfLines={1} style={{ ...FONTS.fontMedium, fontSize: 16, color:  COLORS.card}}>{data.title}</Text>
                                                    <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                                                        <Text style={{ ...FONTS.fontRegular, fontSize: 14, color:COLORS.card,opacity:.5 }}>{data.subtitle}</Text>
                                                        <Image
                                                            style={{height:16,width:16,resizeMode:'contain',}}
                                                            source={IMAGES.share}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>*/}

                {/*<View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingTop: 30, paddingBottom: 10 }]}>*/}
                {/*    <View style={[GlobalStyleSheet.flex, { paddingHorizontal: 30 }]}>*/}
                {/*        <TouchableOpacity*/}
                {/*            onPress={() => navigation.navigate('Products')}*/}
                {/*        >*/}
                {/*            <Text style={[styles.brandsubtitle3, { fontSize: 16, color:COLORS.primary }]}>Más</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*    </View>*/}
                {/*</View>*/}
                <View style={[GlobalStyleSheet.container,{paddingHorizontal:30,flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",  alignItems: "start", marginTop: 5 }]}>

                        {posts.map((data:any, index:any) => {
                            return (
                                    <Cardstyle4
                                        key={index}
                                        id={data.id}
                                        image={data.images[0].image}
                                        price={data.starting_price}
                                        countnumber={data.countnumber}
                                        title={data.title}
                                        onPress={async() => {
                                            await startSetActivePost(data.id);
                                            setTimeout(() => {

                                                navigation.navigate('ProductsDetails')
                                            }, 100)
                                        }}
                                        onPress5={() => addItemToWishList(data)}
                                    />
                            );
                        })}

                </View>
            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    notifactioncricle:{
        height:16,
        width:16,
        borderRadius:16,
        backgroundColor:COLORS.card,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top:2,
        right:2
    },
    flex:{
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'center'
    },
    TextInput:{
        ...FONTS.fontRegular,
        fontSize:16,
        color:COLORS.title,
        height:60,
        borderRadius:61,
        paddingHorizontal:40,
        paddingLeft:30,
        borderWidth:1,
        borderColor:'#EBEBEB',
        backgroundColor:'#FAFAFA'
    },
    brandsubtitle2:{
        ...FONTS.fontSemiBold,
        fontSize:12,
        color:COLORS.card
    },
    brandsubtitle3:{
        ...FONTS.fontMedium,
        fontSize:12,
        color:COLORS.title
    },
    title1:{
        ...FONTS.fontBold,
        fontSize:28,
        color:COLORS.title,
    },
    title2:{
        ...FONTS.fontRegular,
        fontSize:12,
        color:COLORS.title,
    },
    title3:{
        ...FONTS.fontSemiBold,
        fontSize:24,
        color:'#8ABE12',
        //textAlign:'right'
    },
    colorCard:{
        
    },
    colorCardTitle:{
        ...FONTS.fontMedium,
        fontSize:12,
        color:COLORS.title,
        lineHeight:20,
        textAlign:'center'
    },
    arrivaldata:{
        backgroundColor:COLORS.card,
        borderRadius: 18,
        width:199,
        paddingHorizontal: 10,
        paddingLeft:25,
        paddingVertical: 15,
        borderWidth:1,
        borderColor:'#EFEFEF',
        shadowColor: "rgba(4,118,78,.6)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 18.27,
        elevation: 4, 
    }
})

export default Home;
