import React, { useRef } from 'react';
import {Animated, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import TabButtonStyle1 from '../../components/Tabs/TabButtonStyle1';
import TabButtonStyle2 from '../../components/Tabs/TabButtonStyle2';
import CheckoutItems from "../../components/CheckoutItems";
import {IMAGES} from "../../constants/Images";

const Tabs = () => {

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    const scrollViewHome = useRef<any>();

    const scrollViewHome2 = useRef<any>();

    const buttons = ['Detalles', 'Trazabilidad'];

    const scrollX = useRef(new Animated.Value(0)).current;
    const onCLick = (i:any) => scrollViewHome.current.scrollTo({ x: i * SIZES.width - 60 });
    const scrollX2 = useRef(new Animated.Value(0)).current;
    const onCLick2 = (i:any) => scrollViewHome2.current.scrollTo({ x: i * SIZES.width - 60 });

    return (
        <View
            style={{
                flex:1,
                marginTop: 20
            }}
        >
            <View style={{flex:1}}>
                <ScrollView>

                    <View style={[GlobalStyleSheet.card]}>

                        <View style={[GlobalStyleSheet.cardBody, {paddingHorizontal: 0}]}>
                            <View style={{paddingBottom:15}}>
                                <TabButtonStyle1
                                    buttons={buttons}
                                    onClick={onCLick}
                                    scrollX={scrollX}
                                />
                            </View>
                            <ScrollView
                                ref={scrollViewHome}
                                //ref={(e:any) => {console.log(e)}}
                                horizontal
                                pagingEnabled
                                scrollEventThrottle={16}
                                scrollEnabled={false}
                                decelerationRate="fast"
                                showsHorizontalScrollIndicator={false}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                    { useNativeDriver: false },
                                )}
                                >

                                <View style={[styles.tabBody]} >
                                    <View style={[styles.tabBody]} >
                                        <View style={[GlobalStyleSheet.flex,{paddingVertical:15}]}>
                                            <View
                                                style={{
                                                    flexDirection:'row',
                                                    alignItems:'center',
                                                    gap:10
                                                }}
                                            >
                                                <View style={{flexDirection:'row', gap:5 }}>
                                                    <Text style={[styles.subtitle2,{color:colors.title,lineHeight:30}]}>$1200</Text>
                                                </View>
                                            </View>

                                        </View>
                                        <Text style={[styles.brandTitle,{color:colors.title}]}>Guernsey</Text>


                                        <Text style={[styles.subtitle,{color:theme.dark ? 'rgba(255,255,255,.7)':'#4E4E4E',paddingVertical:15}]}>“En venta, ofrecemos una vaca de raza Guernsey con trazabilidad completa y garantizada. Esta vaca cuenta con un seguimiento exhaustivo desde su nacimiento, garantizando su origen, estado de salud y alimentación controlada. {"\n"}Se garantiza libre de mastitis y otras afecciones que puedan afectar su productividad.
                                            Movimientos: Todos los movimientos de la vaca han sido registrados, facilitando la trazabilidad en caso de inspección o para satisfacer los estándares de exportación.</Text>
                                        <Text style={{...FONTS.fontLight,fontSize:12,color:theme.dark ? 'rgba(255,255,255,.7)':'#4E4E4E',marginTop:5}}> Alimentación: Alimentada con una dieta equilibrada y controlada, lo que asegura que produce leche rica en grasa y beta-caroteno, característica distintiva de la leche de vaca Guernsey. Todos los detalles de su alimentación están documentados para garantizar la máxima calidad de la leche.</Text>
                                    </View>
                                </View>

                                <View style={[styles.tabBody]} >
                                        <Text style={{...FONTS.font,color:colors.text, textAlign: "center"}}>
                                            No hay información de trazabilidad.
                                        </Text>
                                </View>



                            </ScrollView>
                        </View>
                    </View>

                </ScrollView>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    tabBody: {
        width: SIZES.width - 60,
    },
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

export default Tabs;