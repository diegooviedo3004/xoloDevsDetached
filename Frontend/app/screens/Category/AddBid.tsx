import React, { useState } from 'react'
import { useTheme } from '@react-navigation/native';
import {View, Text, ScrollView, StyleSheet, Image} from 'react-native'
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import CreditCard from '../../components/Card/CreditCard';
import Input from '../../components/Input/Input';
import { COLORS, FONTS } from '../../constants/theme';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import {Divider} from "react-native-paper";
import DividerIcon from "../../components/Dividers/DividerIcon";
import * as constants from "node:constants";
import {IMAGES} from "../../constants/Images";
import {FontAwesome} from "@expo/vector-icons";

type AddBidScreenProps = StackScreenProps<RootStackParamList, 'AddBid'>;

const AddBid = ({navigation} : AddBidScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [isFocused , setisFocused] = useState(false);
    const [isFocused1 , setisFocused1] = useState(false);
    const [isFocused2 , setisFocused2] = useState(false);
    const [isFocused3 , setisFocused3] = useState(false);

    const [inputValue, setInputValue] = useState("");

    const handleChange = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue(numericValue); 
    };

    const [inputValue1, setInputValue1] = useState("");

    const handleChange1 = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue1(numericValue); 
    };

    const [inputValue2, setInputValue2] = useState("");

    const handleChange2 = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue1(numericValue); 
    };

    return (
       <View style={{flex:1,backgroundColor:colors.background}}>
            <Header
                title='Hacer una oferta'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{flexGrow:1,padding:15,paddingTop:0}}>
                <View style={[styles.backgroundData,{ justifyContent: "center" }]}>

                    <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginBottom:10,borderRadius:15, alignItems: "center" }]}>
                        <Text style={{...FONTS.fontLight,fontSize:12,color:theme.dark ? 'rgba(255,255,255,.7)':'#4E4E4E',marginTop:10, marginLeft: 4, textAlign: "center"}}>
                            0 ofertas de subasta · 3h 27 min restantes
                        </Text>
                        <DividerIcon dashed={true} icon={<Image source={IMAGES.circle} />} style={{ width: "100%", backgroundColor: COLORS.primary, marginBottom: 10,  }}  />

                        <Text style={[styles.cardTitle,{color: colors.title, borderWidth: 0, borderColor: "transparent"}]}>Tu máxima oferta</Text>
                        <View style={{ marginTop:0 }}>
                            <Input
                                onFocus={() => setisFocused1(true)}
                                onBlur={() => setisFocused1(false)}
                                isFocused={isFocused1}
                                backround={colors.card}
                                value={inputValue}
                                onChangeText={(value) => handleChange(value)}
                                style={{borderRadius:48,paddingLeft:20, width:300,}}
                                keyboardType={'number-pad'}
                                placeholder='Ingresa un monto'
                            />
                            <Text style={{...FONTS.fontLight,fontSize:12,color:theme.dark ? 'rgba(255,255,255,.7)':'#4E4E4E',marginTop:10, marginLeft: 4, textAlign: "center"}}>
                                Ingresa USD4.99 o más.
                            </Text>

                        </View>

                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{}]}>
                <Text style={{...FONTS.fontLight,fontSize:12,color:theme.dark ? 'rgba(255,255,255,.7)':'#4E4E4E',marginBottom:10}}>
                    Al seleccionar <Text style={{ ...FONTS.fontBold }}>Ofertar</Text>, te comprometes a comprar este artículo si eres el postor ganador.
                </Text>
                <Button
                    title='Ofertar'
                    color={COLORS.primary}
                    text={COLORS.card}
                    onPress={() => navigation.navigate('Payment')}
                    style={{borderRadius:48}}
                />
            </View>
       </View>
    )
}

const styles = StyleSheet.create({
    backgroundData:{
        paddingBottom:0,
        flex:1,
    },
    cardTitle:{
        ...FONTS.fontRegular,
        fontSize: 14,
        color: COLORS.title,
        borderBottomWidth:1,
        borderBottomColor:COLORS.inputborder,
        borderStyle:'dashed',
        marginHorizontal:-15,
        paddingHorizontal:15,
        paddingBottom:15,
    },
    inputCard:{
        marginBottom: 15,
        marginTop: 15 
    },
    bottomBtn:{
        height:75,
        width:'100%',
        backgroundColor:COLORS.card,
        justifyContent:'center',
        paddingHorizontal:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
    }
})

export default AddBid