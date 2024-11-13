import React, {useEffect, useRef} from 'react';
import {Animated, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import TabButtonStyle1 from '../../components/Tabs/TabButtonStyle1';
import TabButtonStyle2 from '../../components/Tabs/TabButtonStyle2';
import CheckoutItems from "../../components/CheckoutItems";
import {IMAGES} from "../../constants/Images";
import {usePostStore} from "../../store/usePostStore";
import {Feather} from "@expo/vector-icons";
import ListStyle1 from "../../components/List/ListStyle1";

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

    const  { activePost,activeTraceability} = usePostStore();




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
                                    <Text style={[styles.subtitle2,{color:colors.title,lineHeight:30}]}>${activePost?.starting_price}</Text>

                                    <Text style={[styles.subtitle,{color:theme.dark ? 'rgba(255,255,255,.7)':'#4E4E4E',paddingVertical:3, fontWeight: "bold"}]}>{activePost?.title}</Text>
                                        <Text style={{...FONTS.fontLight,fontSize:12,color:theme.dark ? 'rgba(255,255,255,.7)':'#4E4E4E',marginTop:0}}>{activePost?.description}</Text>

                                        <Text style={[styles.brandTitle,{color:colors.title}]}>
                                            <ListStyle1
                                                icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                title={`Raza: ${activePost?.breed}`}
                                            />
                                        </Text>
                                        <Text style={[styles.brandTitle,{color:colors.title}]}>
                                            <ListStyle1
                                                icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                title={`Peso: ${activePost?.weight}kg`}
                                            />
                                        </Text>
                                        <Text style={[styles.brandTitle,{color:colors.title}]}>
                                            <ListStyle1
                                                icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                title={`Sexo: ${activePost?.sex}`}
                                            />
                                        </Text><Text style={[styles.brandTitle,{color:colors.title}]}>
                                            <ListStyle1
                                                icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                title={`Ubicación: ${activePost?.location}`}
                                            />
                                        </Text>



                                </View>

                                <View style={[styles.tabBody]}>
                                    {!!activeTraceability && !!activePost.traceability ? (
                                        <>
                                            <Text style={[styles.subtitle, { color: theme.dark ? 'rgba(255,255,255,.7)' : '#4E4E4E', paddingVertical: 3, fontWeight: "bold" }]}>
                                                Información de trazabilidad.
                                            </Text>

                                            {/* Dairy Cow Data */}
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Producción diaria de leche: ${activeTraceability?.dairy_cow_data.daily_milk_production_in_liters} litros`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Días en leche: ${activeTraceability?.dairy_cow_data.days_in_milk}`}
                                                />
                                            </Text>

                                            {/* Reproductive Data */}
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Fecha de nacimiento: ${activeTraceability?.reproductive_data.birth_date}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Día de preñez: ${activeTraceability?.reproductive_data.beeding_date}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Días preñada: ${activeTraceability?.reproductive_data.days_pregnant}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Fecha de parto esperada: ${activeTraceability?.reproductive_data.expected_calving_date}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Último parto: ${activeTraceability?.reproductive_data.last_calving}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Último celo: ${activeTraceability?.reproductive_data.last_heat_date}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Producción de leche en litros: ${activeTraceability?.reproductive_data.milk_production_in_liters}`}
                                                />
                                            </Text>

                                            {/* Traceability Data */}
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Raza Materna: ${activeTraceability?.traceability_data.breed_M}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Raza Paterna: ${activeTraceability?.traceability_data.breed_P}`}
                                                />
                                            </Text>

                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Código de chapa: ${activeTraceability?.traceability_data.chapa_code}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Comentarios: ${activeTraceability?.traceability_data.comments}`}
                                                />
                                            </Text>
                                            <Text style={[styles.brandTitle, { color: colors.title }]}>
                                                <ListStyle1
                                                    icon={<Feather name={'check-circle'} size={15} color={COLORS.primary} />}
                                                    title={`Estado de salud: ${activeTraceability?.traceability_data.health_status}`}
                                                />
                                            </Text>

                                        </>
                                    ) : (
                                        <>
                                            <Text style={[styles.subtitle, { color: theme.dark ? 'rgba(255,255,255,.7)' : '#4E4E4E', paddingVertical: 3, fontWeight: "bold" }]}>
                                                No hay información de trazabilidad.
                                            </Text>
                                        </>
                                    )
                                    }
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